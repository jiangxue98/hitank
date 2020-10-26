<template>
  <div>
    <a-drawer
      title="编辑类目"
      width="720"
      @close="onClose"
      :destroyOnClose = true
      :visible="showDrawer"
    >
      <div class="drawer-form-box asset-class-item-drawer-form" :class="isSee?'see-view':''">
        <div class="inputTitle">
          <a-input v-model="className" class="content" placeholder="请输入类目名称" />
        </div>
        <a-form :form="form" layout="vertical" hideRequiredMark>
          <div class="title-header">账号信息动态字段</div>
          <a-button class="itemBtn" style="width: 100%;" type="dashed" block  @click="addItem"><a-icon class="blackText" type="plus" />&emsp;新增动态字段</a-button>
          <a-form-item style="color: #595959" :label="field.name+(field.isMast==1?'':'（选填）')" v-if="assetsFields.length>0" v-for="(field,index) in assetsFields" :key="index">
              <a-select class="disabled-cover" style="width: 85%" disabled v-if="field.type==3"></a-select>
              <a-date-picker class="disabled-cover" style="width: 85%" disabled v-else-if="field.type==4" />
              <a-textarea class="disabled-cover" style="width: 85%" disabled v-else-if="field.type==5" ></a-textarea>
              <a-input class="disabled-cover" style="width: 85%" disabled v-else
                       v-decorator="[field.field, { rules: [{ required: true, message: '请选择'+field.name }], initialValue: field.fieldValue  }]"
                       :placeholder="'请输入'+field.name"></a-input>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>编辑</span>
                </template>
                <a-icon class="btn-icon-grey right-btn-group" type="form" @click="() => handleEdit(field)"/>
              </a-tooltip>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>删除</span>
                </template>
                <a-icon class="btn-icon-grey right-btn-group2" type="delete" @click="() => handleDelete(field)"/>
              </a-tooltip>
            </a-form-item>
        </a-form>
        <div class="footer">
          <a-button :style="{marginRight: '8px'}" @click="onClose">
            取消
          </a-button>
          <a-button @click="modalHandleOk" type="primary">确认</a-button>
        </div>
      </div>
    </a-drawer>
    <asset-class-item-add-modal
      :showModal="showModal"
      :type="addType"
      @close="closeModal"
      :params="modalParams"
    ></asset-class-item-add-modal>
  </div>
</template>
<script>
import {getAssetsField, updateAssetsField} from '@api/digitalAssets'
import {addAssetClass} from '@api/sysManage'
import util from '@util/util'
import AssetClassItemAddModal from './AssetClassItemAddModal'
import ATextarea from 'ant-design-vue/es/input/TextArea'
export default {
  components: {ATextarea, AssetClassItemAddModal},
  props: {
    showDrawer: {
      type: Boolean,
      default () {
        return false
      }
    },
    isSee: {
      type: Boolean,
      default () {
        return false
      }
    },
    params: Object
  },
  data () {
    return {
      visible: false,
      form: this.$form.createForm(this),
      userList: [],
      deptList: [],
      assetList: [],
      assetsFields: [],
      showModal: false,
      modalParams: {
        field: {}
      },
      className: '',
      addType: ''
    }
  },
  mounted () {
  },
  methods: {
    addItem () {
      this.addType = 'add'
      this.showModal = true
      this.modalParams.field = {}
      this.modalParams.assetId = this.params.id
      this.modalParams.id = this.id
      this.modalParams.assetsFields = this.assetsFields
    },
    handleEdit (field) {
      this.addType = 'edit'
      this.showModal = true
      this.modalParams.field = field
      this.modalParams.assetId = this.params.id
      this.modalParams.id = this.id
      this.modalParams.assetsFields = this.assetsFields
    },
    handleDelete (field) {
      let _this = this
      util.delConfirm('动态字段“' + field.name + '”', () => {
        let fields = _this.assetsFields
        if (field.dynId) {
          // del
          for (let i = 0; i < fields.length; i++) {
            if (fields[i].dynId === field.dynId) {
              fields.splice(i, 1)
              break
            }
          }
        }
        let par = {
          id: this.id,
          typeId: this.params.id,
          changeField: JSON.stringify(fields)
        }
        updateAssetsField(par).then((data) => {
          _this.$message.success('删除成功')
          _this.fetch(this.params.id)
        }).catch((error) => {
          console.log('保存编辑动态字段error:' + error)
        }
        )
      })
    },
    fetch (typeId) {
      getAssetsField({typeId: typeId}).then((data) => {
        if (data && data.data) {
          this.id = data.data.id ? data.data.id : ''
        } else {
          this.id = ''
        }
        if (data.data && data.data.dynamicFieldReqInfos && data.data.dynamicFieldReqInfos.length > 0) {
          // this.typeId = data.data.typeId
          this.assetsFields = data.data.dynamicFieldReqInfos
        } else {
          this.assetsFields = []
        }
      })
    },
    onAssetChange (record) {
      this.getAssetField(record[record.length - 1])
    },
    onClose (refresh) {
      this.$emit('cancel', refresh)
    },
    onChange (e) {
      this.placement = e.target.value
    },
    // 弹框确认按钮
    modalHandleOk () {
      let _this = this
      let params = {}
      if (util.isEmpty(this.className)) {
        this.$message.error('请输入类目名称')
        return
      }
      params = {id: this.params.id, name: this.className}
      addAssetClass(params).then((data) => {
        _this.onClose('refresh')
      }).catch((error) => {
        console.log('新增子类目error:' + error)
      }
      )
    },
    // 关闭弹框
    closeModal (param) {
      this.showModal = false
      this.addType = ''
      if (param === 'refresh') {
        console.log('closeModal id=' + this.params.id)
        this.fetch(this.params.id)
      }
    }
  },
  watch: {
    showDrawer (val, oldVal) {
      if (val === true) {
        console.log('showDrawer id=' + this.params.id)
        this.className = this.params.name
        this.fetch(this.params.id)
      }
    }
  }
}
</script>
<style scoped lang="less">
  @import "~@var";
  .inputTitle {
    input{
      font-size: 20px;
      line-height: 28px;
      color: @blackTitle;
      border: 0;
      width: 100%;
      font-weight: 500;
    }
  }
  .box{
    .vertical-title{
      margin-bottom: 7px;
      line-height: 22px;
    }
    .vertical-content{
      width: 100%;
    }
  }
  .itemBtn{
    padding: 28px 0;
    height: 78px;
    line-height: 22px;
    margin-bottom: 16px;
    margin-top: 10px;
  }
  .itemBtn:hover{
    color: @blackText;
  }
  .asset-class-item-drawer-form {
    .ant-form-vertical .ant-form-item{
      padding: 8px 0 8px 16px;
      background: @themeBg;
      border-radius: 4px ;
      margin-bottom: 16px;
    }
    .right-btn-group {
      padding: 31px 13px 31px;
      position: absolute;
      top: -45px;
      right: -55px ;
      border-left: 1px solid @fff;
      height: 78px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .right-btn-group:hover {
      background-color: #C3E9E0;
      color: @fff;
    }
    .right-btn-group2:extend(.asset-class-item-drawer-form .right-btn-group all) {
      right: -97px ;
    }
  }
  .inputTitle {
    margin-bottom: 32px;
    input{
      font-size: 20px;
      line-height: 28px;
      color: @blackTitle;
      border: 0;
      width: 100%;
      font-weight: 500;
    }
  }
</style>
<style lang="less">
  .asset-class-item-drawer-form{
    .ant-form-item-label label{
      color: #595959;
    }
  }
</style>
