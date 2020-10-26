<template>
  <div class="add-user-modal">
    <a-modal
      width="640px"
      :title="type=='add'?'添加用户':'编辑用户'"
      :visible="showModal"
      :confirmLoading="confirmLoading"
      :destroyOnClose = true
      @cancel = "close"
      @ok="handleOk"
      :params="params"
      class="form-modal"
    >
      <a-form :form="form" class="form-box add-user-modal-form" layout="horizontal" hideRequiredMark>
        <a-form-item label="用户名称：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input class="content" placeholder="请输入用户名称" :disabled="type=='see'" style="width: 396px"
                   v-decorator="['name', { rules: [{ required: true, message: '请输入用户名称' }], initialValue: params.name  }]"
          />
        </a-form-item>
        <a-form-item label="登录名称：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input class="content" placeholder="请输入登录名称（推荐使用电话）" :disabled="type=='see'" style="width: 396px"
                      v-decorator="['userName', { rules: [{ required: true, message: '请输入登录名称' }], initialValue: params.userName  }]"
          />
        </a-form-item>
        <a-form-item label="密码：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input class="content" placeholder="请输入密码" :disabled="type=='see'" style="width: 396px"
                   v-decorator="['password', { rules: [{ required: false, message: '请输入密码' }], initialValue: params.password?'******':''  }]"
          />
        </a-form-item>
        <a-form-item label="用户角色：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-select :disabled="type=='see'" style="width: 396px" @change="roleChange"
                    v-decorator="['roleMark', { rules: [{ required: true, message: '请选择用户角色' }], initialValue: params.roleMark  }]"
                    placeholder="请选择用户角色"  class="vertical-content">
            <!--暂删除只能选择管理员和创客角色功能-->
<!--            <template v-if="flowB!==false" v-for="(item) in roleList">-->
<!--              <a-select-option v-if="item.mark=='admin'||item.mark=='user'" :key="item.id" :value="item.mark">{{item.name}}</a-select-option>-->
<!--              <a-select-option v-else disabled :value="item.mark" :key="item.id">{{item.name}}</a-select-option>-->
<!--            </template>-->
<!--            <template v-else v-for="(item) in roleList">-->
<!--              <a-select-option :key="item.id" :value="item.mark">{{item.name}}</a-select-option>-->
<!--            </template>-->
            <a-select-option v-for="(item) in roleList" :key="item.id" :value="item.mark">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="所属平台/小微：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-cascader :disabled="type=='see'" style="width: 396px" changeOnSelect
                    v-decorator="['deptId', { rules: [{ required: false, message: '请选择所属平台/小微' }, {validator: this.checkDept}], initialValue: params.categoryRelationIds?params.categoryRelationIds.split(','):[]  }]"
                    placeholder="请选择所属平台/小微"  class="vertical-content" :options="deptList">
          </a-cascader>
        </a-form-item>
        <a-form-item label="电话（选填）：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
          <a-input style="width: 396px" :rows="4" class="content" placeholder="请输入电话" :disabled="type=='see'"
                      v-decorator="['tel', { rules: [{ required: false, message: '请输入电话' }], initialValue: params.tel  }]"
          />
        </a-form-item>
        <a-form-item label="邮箱（选填）：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
        <a-input style="width: 396px" :rows="4" class="content" placeholder="请输入邮箱" :disabled="type=='see'"
                    v-decorator="['email', { rules: [{ required: false, message: '请输入邮箱' }], initialValue: params.email }]"
        />
      </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import global from '@util/global'
import {getRoleList, updateUserInfo} from '@api/userManage'
import {getOrganizationList} from '@api/sysManage'
import util from '@util/util'
var roleListAll = []
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
      roleList: [],
      deptList: []
    }
  },
  mounted () {
    this.getRoleList()
    this.getDeptList()
  },
  methods: {
    handleOk: function (type) {
      let _this = this
      if (this.params && this.params.id) {
        let confirm = this.$confirm({
          title: '重置密码确认',
          content: '是否重置了密码？',
          okText: '已重置',
          okType: 'danger',
          cancelText: '未重置',
          closable: true,
          onOk () {
            _this.submitForm(true)
          },
          onCancel (e) {
            if (e.triggerCancel) {

            } else {
              _this.submitForm(false)
              confirm.destroy()
            }
          }
        })
      } else {
        _this.submitForm(true)
      }
    },
    submitForm (isUpdatePwd) {
      let _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          if (values.deptId && values.deptId.length > 0) {
            values.orgnizationId = values.deptId[values.deptId.length - 1]
          }
          delete values['deptId']
          if (_this.params && _this.params.id) {
            values.id = this.params.id
          }
          if (!isUpdatePwd) {
            delete values['password']
          } else {
            if (!values['password']) {
              _this.$message.error('请输入密码')
              _this.confirmLoading = false
              return
            }
          }
          updateUserInfo(values).then((data) => {
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
    getRoleList () {
      let _this = this
      getRoleList().then((data = []) => {
        if (data.success) {
          _this.roleList = data.data
          roleListAll = data.data
        }
      }).catch(function (error) {
        console.log(error)
        // _this.$Message.error(error)
      })
    },
    getDeptList () {
      getOrganizationList().then((data = []) => {
        if (data.success) {
          this.deptList = util.convertCascaderData(data.data, 'id', 'name')
        }
      })
    },
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
    },
    checkDept (rule, value, callback) {
      let role = this.form.getFieldValue('roleMark')
      if (!util.isEmpty(role)) {
        if (role === 'plat') {
          if (value.length === 1) {
            callback()
          } else {
            callback(new Error('请选择一级所属小微'))
          }
        } else if (role === 'admin') {
          callback()
        } else {
          if (value.length === 2) {
            callback()
          } else {
            callback(new Error('请选择二级所属小微'))
          }
        }
      } else {
        if (value.length > 0) {
          callback(new Error('请选择所属小微'))
        } else {
          callback()
        }
      }
    }
  },
  watch: {
    showModal (newV, oldV) {
      if (newV) {
        // 暂删除只能选择管理员和创客角色功能
        // if (this.flowB && util.isEmpty(this.params.id)) {
        //   this.roleList = [
        //     {'mark': 'admin', 'name': '管理员'},
        //     {'mark': 'user', 'name': '创客'}
        //   ]
        // } else {
        //   this.roleList = roleListAll
        // }
        this.roleList = roleListAll
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
