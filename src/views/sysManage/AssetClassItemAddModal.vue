<template>
  <div class="asset-class-item-add-modal">
    <a-modal
      width="640px"
      :title="type=='add'?'添加字段':'编辑字段'"
      :visible="showModal"
      :confirmLoading="confirmLoading"
      :destroyOnClose = true
      @cancel = "close"
      @ok="handleOk"
      :params="params"
      :maskClosable="false"
      class="form-modal"
    >
      <a-form :form="form" class="form-box add-user-modal-form" layout="horizontal" hideRequiredMark>
        <a-form-item label="名称：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input class="content" placeholder="请输入名称" :disabled="type=='see'" style="width: 396px"
                   v-decorator="['name', { rules: [{ required: true, message: '请输入名称' }], initialValue: params.field.name  }]"
          />
        </a-form-item>
        <a-form-item label="数据库字段：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input class="content" placeholder="请输入数据库字段" :disabled="type=='see'" style="width: 396px"
                   v-decorator="['field', { rules: [{ required: true, message: '请输入数据库字段' }], initialValue: params.field.field  }]"
          />
        </a-form-item>
        <a-form-item label="类型：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-select :disabled="type=='see'" style="width: 396px" @change="onTypeChange"
                    v-decorator="['type', { rules: [{ required: true, message: '请选择类型' }], initialValue: params.field.type  }]"
                    placeholder="请选择类型"  class="vertical-content">
            <a-select-option :value="1">文本框</a-select-option>
            <a-select-option :value="2">密码框</a-select-option>
            <a-select-option :value="3">下拉框</a-select-option>
            <a-select-option :value="4">日期框</a-select-option>
            <a-select-option :value="5">文本域</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="showSelectValue" label="下拉框数据：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-textarea class="content" placeholder="请输入下拉框数据(格式：“1:北京;2:上海”) 注：冒号左侧的值不能重复" :disabled="type=='see'" style="width: 396px"
                   v-decorator="['selectValue', { rules: [{ required: false, message: '请输入下拉框数据' }, {validator: this.checkSelectValue}],validateTrigger:'', initialValue: params.field.selectValue  }]"
          ></a-textarea>
        </a-form-item>
        <a-form-item label="是否必填：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-select :disabled="type=='see'" style="width: 396px"
                    v-decorator="['isMast', { rules: [{ required: true, message: '请选择是否必填' }], initialValue: params.field.isMast  }]"
                    placeholder="请选择是否必填"  class="vertical-content">
            <a-select-option :value="0">否</a-select-option>
            <a-select-option :value="1">是</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import global from '@util/global'
import {updateAssetsField} from '@api/digitalAssets'
import util from '@util/util'
import ATextarea from 'ant-design-vue/es/input/TextArea'

export default {
  props: {
    type: {
      type: String,
      required: true
    },
    showModal: {
      type: Boolean,
      required: true
    },
    params: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    }
  },
  components: {
    ATextarea
  },
  data () {
    return {
      okText: global.TEXT.OK,
      cancelText: global.TEXT.CANCEL,
      form: this.$form.createForm(this),
      confirmLoading: false,
      selectValueJson: '',
      roleList: [],
      deptList: [],
      showSelectValue: false
    }
  },
  mounted () {
  },
  methods: {
    handleOk: function (type) {
      let _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          let fields = _this.params.assetsFields
          if (_this.params.field.dynId) {
            // update
            let updateId = ''
            for (let i = 0; i < fields.length; i++) {
              if (fields[i].dynId === _this.params.field.dynId) {
                updateId = i
                fields.splice(i, 1)
                break
              }
            }
            if (util.isEmpty(updateId)) {
              _this.$message.error('更新字段有误，请联系管理员')
              updateId = util.random(3)
            }
            values.dynId = updateId
          } else {
            // add
            values.dynId = util.random(3)
          }
          if (values.type === 3) {
            values.selectValue = this.selectValueJson
          }
          fields.push(values)
          let par = {
            id: _this.params.id,
            typeId: _this.params.assetId,
            changeField: JSON.stringify(fields)
          }
          updateAssetsField(par).then((data) => {
            _this.confirmLoading = false
            _this.$message.success('提交成功')
            _this.$emit('close', 'refresh')
          }).catch((error) => {
            _this.confirmLoading = false
            console.log('保存编辑动态字段error:' + error)
          }
          )
        }
      })
    },
    close () {
      this.$emit('close')
    },
    checkSelectValue (rule, value, callback) {
      if (this.showSelectValue === false) {
        callback()
      } else {
        // 下拉框格式化及校验
        if ((this.showSelectValue && !util.isEmpty(value))) {
          let selectV = []
          let errFlag = false
          /* 方案一：书写格式为：(格式：“1:北京;2:上海”) 注：冒号左侧的值不能重复 */
          let selStr = value.replace(/：/g, ':').replace(/；/g, ';')
          let selArr = selStr.split(';')
          if (selArr && selArr.length > 0) {
            for (let i = 0; i < selArr.length; i++) {
              let arr = selArr[i].split(':')
              if (arr && (arr.length === 2 || (arr.length === 1 && arr[0] === ''))) {
                if (!(arr.length === 1 && arr[0] === '')) {
                  selectV.push({
                    name: arr[1],
                    value: arr[0]
                  })
                }
              } else {
                errFlag = true
                break
              }
            }
            if (errFlag) {
              callback(new Error('请按格式要求填写(格式：“1:北京;2:上海”) 注：冒号左侧的值不能重复'))
            } else {
              this.selectValueJson = JSON.stringify(selectV)
              callback()
            }
          } else {
            callback(new Error('请按格式要求填写(格式：“1:北京;2:上海”) 注：冒号左侧的值不能重复'))
          }
        } else {
          callback(new Error('请输入下拉框数据'))
        }
      }
    },
    onTypeChange (type) {
      if (type === 3) {
        this.showSelectValue = true
      } else {
        this.showSelectValue = false
      }
    }
  },
  watch: {
    showModal (newV, oldV) {
      if (newV) {
        this.showSelectValue = this.params.field.type === 3
        if (this.params.field.type === 3) {
          let sel = JSON.parse(this.params.field.selectValue)
          let str = ''
          for (let i = 0; i < sel.length; i++) {
            str += sel[i].value + ':' + sel[i].name + ';'
          }
          this.params.field.selectValue = str
        }
      }
    }
  }
}
</script>
<style lang="less">
  .add-user-modal-form{
    .ant-form-item-label{
      width: 115px;
    }
  }
</style>
