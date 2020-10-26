<template>
  <a-modal
    width="640px"
    title="选择用户"
    :visible="showModal"
    :confirmLoading="confirmLoading"
    :destroyOnClose = true
    @cancel = "close"
    :params="params"
    class="form-modal"
    @ok="handleSubmit()">
    <a-form :form="form" class="form-box" hideRequiredMark>
      <a-form-item label="" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" style="padding-left: 70px;">
        <a-select
          showSearch
          placeholder="请输入或选择用户名"
          optionFilterProp="children"
          style="width: 100%"
          :filterOption="filterOption"
          v-decorator="['userId', { rules: [{ required: true, message: '请输入或选择用户名' }] }]"
        >
          <a-select-option  v-for="(item) in selectList" :key="item.id">{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import {getUserSelectList} from '@api/userManage'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
export default {
  components: {},
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
  data () {
    return {
      confirmLoading: false,
      selectList: [],
      formItemLayout,
      form: this.$form.createForm(this)
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
    // 关闭弹框
    close () {
      this.$emit('close')
    },
    // 弹框确认按钮
    handleSubmit (e) {
      let _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          let userName = ''
          let role = ''
          for (let i of _this.selectList) {
            if (i.id === values.userId) {
              userName = i.name
              role = i.roleMark
              break
            }
          }
          _this.$emit('close', {userName: userName, userId: values.userId, step: _this.params.step, role})
        }
      })
    }
  },
  watch: {
    showModal (newV, oldV) {
    }
  }
}
</script>

<style scoped lang="less">
</style>
