<template>
  <div>
    <a-drawer
      title="申请使用"
      width="720"
      @close="onClose"
      :destroyOnClose = true
      :visible="showDrawer"
    >
      <div class="drawer-form-box">
        <a-form :form="form" layout="vertical" hideRequiredMark>
          <div class="inputTitle">
              {{initName}}
          </div>
          <div class="title-header">使用信息</div>
          <a-form-item label="使用期限" >
            <a-range-picker :placeholder="['开始时间', '结束时间']" class="v-item"
                            v-decorator="['applyDate', { rules: [{ required: true, message: '请输入使用期限' }] }]"
            ></a-range-picker>
          </a-form-item>
          <a-form-item label="用途" >
            <a-textarea :rows="4" class="v-item" placeholder="请输入用途"
                        v-decorator="['applyReason', { rules: [{ required: true, message: '请输入用途' }] }]"
            />
          </a-form-item>
        </a-form>
        <div class="footer">
          <a-button :style="{marginRight: '8px'}" @click="onClose()">
            取消
          </a-button>
          <a-button @click="submit" type="primary">提交资产使用申请</a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import {applyAssetsFlowB} from '@api/digitalAssets'
import util from '@util/util'
export default {
  props: {
    showDrawer: {
      type: Boolean,
      default () {
        return false
      }
    },
    params: Object
  },
  data () {
    return {
      form: this.$form.createForm(this),
      initName: ''
    }
  },
  mounted () {
  },
  methods: {
    onClose (refresh) {
      this.$emit('close', refresh)
    },
    submit () {
      let _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          values['startTime'] = util.formatDate(values.applyDate[0].valueOf())
          values['endTime'] = util.formatDate(values.applyDate[1].valueOf())
          values['flowName'] = this.initName
          values['assetsItemId'] = this.params.id
          delete values['applyDate']
          applyAssetsFlowB(values).then((data) => {
            _this.$message.success('已提交申请，请等待审批')
            _this.$router.push({path: '/workflowList'})
          }).catch((error) => {
            console.log('申请error:' + error)
          }
          )
        }
      })
    },
    cb (e) {
      // console.log('*******cb')
    }
  },
  watch: {
    showDrawer (val, oldVal) {
      if (val === true) {
        this.initName = this.params.name
      }
    }
  }
}
</script>
<style scoped lang="less">
  @import "~@var";
  .inputTitle {
    font-size: 20px;
    line-height: 28px;
    color: @blackTitle;
    border: 0;
    width: 100%;
    font-weight: 500;
    margin-bottom: 32px;
  }
</style>
