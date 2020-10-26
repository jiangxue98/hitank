<template>
  <div>
    <a-drawer
      :title="'新增产品计划'"
      width="720"
      @close="onClose"
      :destroyOnClose = true
      :visible="showAddDrawer"
    >
      <div class="drawer-form-box asset-class-item-drawer-form">
        <a-form layout="vertical" hideRequiredMark>
          <a-form-item label="计划名称">
            <a-input
              placeholder="请输入计划名称"
              v-model="addFormData.planName"
              v-decorator="[{ rules: [{ required: true, message: '请输入' }]}]"
            ></a-input>
          </a-form-item>
          <a-form-item label="计划周期">
            <a-select
              class="disabled-cover"
              v-model="addFormData.planCycle"
              v-decorator="[{ rules: [{ required: true, message: '请选择' }]}]"
              placeholder="请选择计划周期"
            >
              <a-select-option value=1>立项</a-select-option>
              <a-select-option value=2>开发测试</a-select-option>
              <a-select-option value=3>上线迭代</a-select-option>
              <a-select-option value=4>下架</a-select-option>
              <a-select-option value=5>封存</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="计划时间">
            <a-range-picker
              :placeholder="['开始时间', '截止时间']" style="width: 100%"
              v-model="addFormData.planDate"
              v-decorator="[{ rules: [{ required: true, message: '请选择' }] }]"
              format-value='YYYY-MM-DD'
            ></a-range-picker>
          </a-form-item>
          <a-form-item label="计划说明（选填）">
            <a-textarea
              placeholder="开发测试、上线迭代状态，则此处为产品迭代功能说明；否则为其他具体工作；"
              v-model="addFormData.planInstr"
            ></a-textarea>
          </a-form-item>
          <a-form-item label="计划版本（选填）">
            <a-textarea
              placeholder="如果有，请输入本计划对应版本号 V."
              v-model="addFormData.planVersion"
            ></a-textarea>
          </a-form-item>
        </a-form>
        <div class="footer">
          <a-button :style="{marginRight: '8px'}" @click="onClose">
            取消
          </a-button>
          <a-button @click="handleOk" type="primary">提交</a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import {addProductPlan} from '@api/productManage'
import util from '@util/util'

export default {
  components: {},
  props: {
    showAddDrawer: {
      type: Boolean,
      default () {
        return false
      }
    },
    params: String
  },
  data () {
    return {
      visible: false,
      addFormData: {}
    }
  },
  mounted () {
  },
  methods: {
    onClose (refresh) {
      this.addFormData = {}
      this.$emit('close', refresh)
    },
    // 弹框确认按钮
    handleOk () {
      if (util.isEmpty(this.addFormData.planName) || util.isEmpty(this.addFormData.planCycle) || util.isEmpty(this.addFormData.planDate)) {
        this.$message.error('请填写完整')
        return
      }
      let startTime = util.formatDate(this.addFormData.planDate[0].valueOf())
      let endTime = util.formatDate(this.addFormData.planDate[1].valueOf())
      let param = {}
      param.productId = this.params
      param.name = this.addFormData.planName
      param.step = this.addFormData.planCycle
      param.startTime = startTime
      param.endTime = endTime
      if (this.addFormData.planVersion !== undefined) {
        param.version = this.addFormData.planVersion
      }
      if (this.addFormData.planInstr !== undefined) {
        param.intro = this.addFormData.planInstr
      }
      addProductPlan(param).then((data) => {
        if (data.success) {
          this.onClose('refresh')
        }
      }).catch(function (error) {
        console.log(error)
      })
    }
  },
  watch: {
    showDrawer (val, oldVal) {
      if (val === true) {
      }
    }
  }
}
</script>
<style scoped lang="less">
  @import "~@var";
</style>
