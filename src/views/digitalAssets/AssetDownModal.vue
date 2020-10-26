<template>
  <div >
      <a-modal
        width="500px"
        title="资产注销"
        :visible="showModal"
        :confirmLoading="confirmLoading"
        :destroyOnClose = true
        @cancel = "close"
        @ok = "handleOk"
        :params="params"
        class="form-modal"
      >
      <a-form :form="form" class="form-box" layout="vertical" hideRequiredMark >
        <a-form-item label="审核人：" v-if="flowB!==false">
            <a-select
              showSearch
              placeholder="请输入或选择用户名"
              optionFilterProp="children"
              style="width: 396px"
              :filterOption="filterOption"
              v-decorator="['firstVerifyId', { rules: [{ required: true, message: '请输入或选择用户名' }] }]"
            >
              <a-select-option  v-for="(item) in selectList" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="注销原因：">
          <a-textarea style="width: 396px" :rows="4" class="content" placeholder="请输入注销原因"
                      v-decorator="['applyReason', { rules: [{ required: true, message: '请输入注销原因' }] }]"
          />
        </a-form-item>
      </a-form>
      </a-modal>
  </div>
</template>
<script>
import {applyAssetsDown, applyAssetsDownFlowB} from '@api/digitalAssets'
import global from '@util/global'
import {getUserSelectList} from '@api/userManage'

export default {
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    params: {
      type: Object,
      required: false
    }
  },
  components: {
  },
  data () {
    return {
      okText: global.TEXT.OK,
      cancelText: global.TEXT.CANCEL,
      form: this.$form.createForm(this),
      selectList: [],
      confirmLoading: false
    }
  },
  mounted () {
    let _this = this
    getUserSelectList().then(function (data) {
      _this.selectList = data.data
    }).catch(function (error) {
      console.log('获取资产下拉选择数据报错：' + error)
    })
  },
  methods: {
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    handleOk (state) {
      let _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          values.assetsItemId = _this.params.id
          values.flowName = _this.params.name
          if (_this.flowB === false) {
            applyAssetsDown(values).then((data) => {
              _this.confirmLoading = false
              _this.$message.success('已提交申请，请等待审批')
              _this.$router.push({path: '/workflowList'})
              // _this.$emit('close', 'refresh')
            }).catch((error) => {
              _this.confirmLoading = false
              console.log('审批error:' + error)
            }
            )
          } else {
            applyAssetsDownFlowB(values).then((data) => {
              _this.confirmLoading = false
              _this.$message.success('已提交申请，请等待审批')
              _this.$router.push({path: '/workflowList'})
              // _this.$emit('close', 'refresh')
            }).catch((error) => {
              _this.confirmLoading = false
              console.log('审批error:' + error)
            }
            )
          }
        }
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
