<template>
  <div class="add-user-modal">
    <a-modal
      width="640px"
      :title="type=='add'?'添加账号':'编辑账号'"
      :visible="showModal"
      :confirmLoading="confirmLoading"
      :destroyOnClose = true
      @cancel = "close"
      @ok="handleOk"
      :params="params"
      class="form-modal"
    >
      <a-form :form="form" class="form-box add-user-modal-form" layout="horizontal" hideRequiredMark>
        <a-form-item label="账号名称：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input class="content" placeholder="请输入账号名称" :disabled="type=='see'" style="width: 396px"
                   v-decorator="['accountName', { rules: [{ required: true, message: '请输入账号名称' }], initialValue: params.accountName  }]"
          />
        </a-form-item>
        <a-form-item label="账号类型：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-select :disabled="type=='see'" style="width: 396px"
                    v-decorator="['type', { rules: [{ required: true, message: '请选择账号类型' }], initialValue: params.type  }]"
                    placeholder="请选择账号类型"  class="vertical-content">
            <a-select-option :value="item.key" v-for="(item) in roleList" :key="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否过期：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-select :disabled="type=='see'" style="width: 396px"
                    v-decorator="['isOverdue', { rules: [{ required: true, message: '请选择是否过期' }], initialValue: params.isOverdue  }]"
                    placeholder="请选择是否过期"  class="vertical-content">
            <a-select-option :value="item.key" v-for="(item) in overDueList" :key="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="注册手机号：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input style="width: 396px" :rows="4" class="content" placeholder="请输入注册手机号" :disabled="type=='see'"
                   v-decorator="['accountTel', { rules: [{ required: false, message: '请输入注册手机号' }], initialValue: params.accountTel  }]"
          />
        </a-form-item>
        <a-form-item label="注册邮箱：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input style="width: 396px" :rows="4" class="content" placeholder="请输入注册邮箱" :disabled="type=='see'"
                   v-decorator="['accountMail', { rules: [{ required: false, message: '请输入注册邮箱' }], initialValue: params.accountMail }]"
          />
        </a-form-item>
        <a-form-item label="账号密码：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input class="content" placeholder="请输入账号密码" :disabled="type=='see'" style="width: 396px"
                   v-decorator="['accountSecret', { rules: [{ required: true, message: '请输入账号密码' }], initialValue: params.accountSecret  }]"
          />
        </a-form-item>
        <a-form-item label="clientKey：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input style="width: 396px" :rows="4" class="content" placeholder="请输入clientKey" :disabled="type=='see'"
                   v-decorator="['clientKey', { rules: [{ required: false, message: '请输入clientKey' }], initialValue: params.clientKey  }]"
          />
        </a-form-item>
        <a-form-item label="clientSecret：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input class="content" placeholder="请输入clientSecret" :disabled="type=='see'" style="width: 396px"
                   v-decorator="['clientSecret', { rules: [{ required: true, message: '请输入clientSecret' }], initialValue: params.clientSecret  }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import global from '@util/global'
import {updateAuthorizeAccount} from '@api/weixinManage'
// import {getOrganizationList} from '@api/sysManage'
// import util from '@util/util'

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
      confirmLoading: false,
      roleList: [{
        key: 1,
        value: '抖音'
      }, {
        key: 2,
        value: '微博'
      }],
      overDueList: [{
        key: 0,
        value: '未过期'
      }, {
        key: 1,
        value: '已过期'
      }]
      // deptList: []
    }
  },
  mounted () {
    // this.getRoleList()
    // this.getDeptList()
  },
  methods: {
    handleOk: function (type) {
      let _this = this
      // if (this.params && this.params.id) {
      //   let confirm = this.$confirm({
      //     title: '重置密码确认',
      //     content: '是否重置了密码？',
      //     okText: '已重置',
      //     okType: 'danger',
      //     cancelText: '未重置',
      //     closable: true,
      //     onOk () {
      //       _this.submitForm(true)
      //     },
      //     onCancel (e) {
      //       if (e.triggerCancel) {
      //
      //       } else {
      //         _this.submitForm(false)
      //         confirm.destroy()
      //       }
      //     }
      //   })
      // } else {
      _this.submitForm(true)
      // }
    },
    submitForm (isUpdatePwd) {
      let _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          if (_this.params && _this.params.id) {
            values.id = this.params.id
          }
          updateAuthorizeAccount(values).then((data) => {
            _this.confirmLoading = false
            _this.$message.success('提交成功')
            _this.$emit('close', 'refresh')
          }).catch((error) => {
            _this.confirmLoading = false
            console.log('更新用户信息error:' + error)
          }
          )
        }
      })
    },
    close () {
      this.$emit('close')
    },
    // getRoleList () {
    //   let _this = this
    //   getRoleList().then((data = []) => {
    //     if (data.success) {
    //       _this.roleList = data.data
    //     }
    //   }).catch(function (error) {
    //     console.log(error)
    //     // _this.$Message.error(error)
    //   })
    // },
    // getDeptList () {
    //   getOrganizationList().then((data = []) => {
    //     if (data.success) {
    //       this.deptList = util.convertCascaderData(data.data, 'id', 'name')
    //     }
    //   })
    // },
    roleChange (rule, value, callback) {
      // let deptId = this.form.getFieldValue('deptId')
      this.form.setFieldsValue({'deptId': []})
      // if (!util.isEmpty(deptId)) {
      //   if (value === 'plat') {
      //     if (deptId.length === 1) {
      //       callback()
      //     } else {
      //       callback(new Error('请重新选择一级所属小微'))
      //     }
      //   } else if (value === 'admin') {
      //     callback()
      //   } else {
      //     if (deptId.length === 2) {
      //       callback()
      //     } else {
      //       callback(new Error('请重新选择二级所属小微'))
      //     }
      //   }
      // } else {
      //   if (util.isEmpty(value)) {
      //     callback(new Error('请选择用户角色'))
      //   } else {
      //     callback()
      //   }
      // }
    }
    // checkDept (rule, value, callback) {
    //   let role = this.form.getFieldValue('roleMark')
    //   if (!util.isEmpty(role)) {
    //     if (role === 'plat') {
    //       if (value.length === 1) {
    //         callback()
    //       } else {
    //         callback(new Error('请选择一级所属小微'))
    //       }
    //     } else if (role === 'admin') {
    //       callback()
    //     } else {
    //       if (value.length === 2) {
    //         callback()
    //       } else {
    //         callback(new Error('请选择二级所属小微'))
    //       }
    //     }
    //   } else {
    //     if (value.length > 0) {
    //       callback(new Error('请选择所属小微'))
    //     } else {
    //       callback()
    //     }
    //   }
    // }
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
  /*.add-user-modal .ant-modal-body{*/
  /*  padding-right: 49px;*/
  /*}*/
</style>
