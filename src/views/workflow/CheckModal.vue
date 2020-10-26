<template>
  <div >
      <a-modal
        width="640px"
        :title="params.title"
        :visible="showModal"
        :confirmLoading="confirmLoading"
        :destroyOnClose = true
        @cancel = "close"
        :params="params"
        class="form-modal"
      >
      <a-form :form="form" class="form-box" layout="inline" hideRequiredMark>
        <a-form-item label="审批意见：">
          <a-textarea style="width: 396px" :rows="4" class="content" placeholder="请输入审批意见"
                      v-decorator="['reason', { rules: [{ required: true, message: '请输入审批意见' }] }]"
          />
        </a-form-item>
      </a-form>
        <template slot="footer">
          <a-popconfirm class="btn-white" @confirm="handleOk(2)" :title="params.cancelTip" :okText="okText" :cancelText="cancelText">
            <a href="#">{{params.cancelBtn}}</a>
          </a-popconfirm>
          <a-popconfirm class="btn-theme" @confirm="handleOk(1)" :title="params.okTip" :okText="okText" :cancelText="cancelText">
            <a href="#">{{params.okBtn}}</a>
          </a-popconfirm>
        </template>
      </a-modal>
  </div>
</template>
<script>
import {checkWorkflow, checkWorkflowFlowB} from '@api/workflow'
import global from '@util/global'

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
      confirmLoading: false
    }
  },
  methods: {
    check (state) {
      let _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          values.ids = _this.params.id
          values.state = state
          if (this.flowB === false) {
            checkWorkflow(values).then((data) => {
              _this.confirmLoading = false
              _this.$emit('close', 'refresh')
            }).catch((error) => {
              _this.confirmLoading = false
              console.log('审批error:' + error)
            }
            )
          } else {
            checkWorkflowFlowB(values).then((data) => {
              _this.confirmLoading = false
              _this.$emit('close', 'refresh')
            }).catch((error) => {
              _this.confirmLoading = false
              console.log('审批error:' + error)
            }
            )
          }
        }
      })
    },
    handleOk: function (type) {
      this.check(type)
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
