<template>
  <div class="add-user-modal">
    <a-modal
      width="640px"
      :title="type=='add'?'添加数据':'编辑数据'"
      :visible="showModal"
      :confirmLoading="confirmLoading"
      :destroyOnClose = true
      @cancel = "close"
      @ok="handleOk"
      :params="params"
      class="form-modal"
    >
      <a-form :form="form" class="form-box add-user-modal-form" layout="horizontal" hideRequiredMark>
        <a-form-item label="日期：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-date-picker :disabled="type=='see'"
                         :placeholder="'请选择日期'" format="YYYY-MM-DD" style="width: 396px"
                         v-decorator="['createTime', { rules: [{ required: true, message: '请选择日期' }], initialValue: convertDate(params.createTime) }]"
          />
        </a-form-item>
        <a-form-item label="进入次数：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input class="content" placeholder="请输入进入次数" :disabled="type=='see'" style="width: 396px"
                   v-decorator="['enterNum', { rules: [{ required: true, message: '请输入进入次数' }], initialValue: params.enterNum  }]"
          />
        </a-form-item>
        <a-form-item label="跳出率：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input style="width: 396px" :rows="4" class="content" placeholder="请输入跳出率" :disabled="type=='see'"
                   v-decorator="['outRate', { rules: [{ required: false, message: '请输入跳出率' }], initialValue: params.outRate  }]"
          />
        </a-form-item>
        <a-form-item label="平均访问深度：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input style="width: 396px" :rows="4" class="content" placeholder="请输入平均访问深度" :disabled="type=='see'"
                   v-decorator="['depthAverage', { rules: [{ required: false, message: '请输入平均访问深度' }], initialValue: params.depthAverage }]"
          />
        </a-form-item>
        <a-form-item label="平均访问时长：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input class="content" placeholder="请输入平均访问时长" :disabled="type=='see'" style="width: 396px"
                   v-decorator="['visitAverage', { rules: [{ required: true, message: '请输入平均访问时长' }], initialValue: params.visitAverage  }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import global from '@util/global'
import {updateHilook} from '@api/weixinManage'
import util from '@util/util'

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
  },
  data () {
    return {
      okText: global.TEXT.OK,
      cancelText: global.TEXT.CANCEL,
      form: this.$form.createForm(this),
      confirmLoading: false
    }
  },
  mounted () {
  },
  methods: {
    convertDate (date) {
      if (util.isEmpty(date)) {
        return null
      } else {
        return this.$moment(date)
      }
    },
    handleOk (isUpdatePwd) {
      let _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          if (_this.params && _this.params.id) {
            values.id = this.params.id
          }
          if (!util.isEmpty(values.createTime)) {
            values.createTime = util.formatDate(values.createTime.valueOf())
          }
          updateHilook(values).then((data) => {
            _this.confirmLoading = false
            _this.$message.success('提交成功')
            _this.$emit('close', 'refresh')
          }).catch((error) => {
            _this.confirmLoading = false
            console.log('updateHilook error:' + error)
          }
          )
        }
      })
    },
    close () {
      this.$emit('close')
    }
  },
  watch: {
    showModal (newV, oldV) {
      if (newV) {
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
<style scoped lang="less">
</style>
