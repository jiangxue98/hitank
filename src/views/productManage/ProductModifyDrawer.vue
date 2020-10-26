<template>
  <div>
    <a-drawer
      :title="'产品变更'"
      width="720"
      @close="onClose"
      :destroyOnClose = true
      :visible="showDrawer"
    >
      <div class="drawer-form-box asset-class-item-drawer-form" :class="isSee?'see-view':''">
        <a-form :form="form" layout="vertical" hideRequiredMark>
          <a-form-item label="原项目主人">
            <a-select class="disabled-cover" :disabled="true"
                      v-decorator="['originalUserId', { rules: [{ required: true, message: '请输入' }], initialValue: params.userId }]"
                      placeholder="请输入"
            >
              <a-select-option :value="item.id" v-for="(item) in userList" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="新项目主人">
            <a-select class="disabled-cover" :disabled="isSee" showSearch :filterOption="filterOption" optionFilterProp="children"
                      v-decorator="['newUserId', { rules: [{ required: true, message: '请输入' }], initialValue: params.newUserId }]"
                      placeholder="请输入"
            >
              <a-select-option :value="item.id" v-for="(item) in userList" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-row :gutter="16" class="box">
            <a-col :span="12">
              <a-form-item label="所属平台/小微：">
                <a-cascader :disabled="isSee" changeOnSelect  @change="onDeptChange"
                            v-decorator="['deptId', { rules: [{ required: false, message: '请选择' }], initialValue: deptId  }]"
                            placeholder="请选择所属平台/小微"  class="vertical-content" :options="deptList">
                </a-cascader>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="平台主/小微主">
                <a-select :disabled="true"
                          v-decorator="['deptMaster', { initialValue: deptMaster  }]"
                          placeholder="根据平台/小微自动匹配"  class="vertical-content disabled-cover">
                  <a-select-option :value="item.key" v-for="(item) in deptMasterList" :key="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="变更时间">
            <a-date-picker :disabled="isSee" style="width: 100%" class="disabled-cover"
                           v-decorator="['changeTime', { rules: [{ required: true, message: '请输入' }], initialValue: params.changeTime }]"
                           placeholder="请选择时间"/>
          </a-form-item>
          <a-form-item label="项目变更原因">
            <a-textarea class="disabled-cover" :disabled="isSee"
                        v-decorator="['changeReason', { rules: [{ required: true, message: '请输入' }], initialValue: params.changeReason }]"
                        placeholder="请输入"
            ></a-textarea>
          </a-form-item>
          <a-form-item label="原项目处理办法">
            <a-textarea class="disabled-cover" :disabled="isSee"
                        v-decorator="['oldProjectMethod', { rules: [{ required: true, message: '请输入' }], initialValue: params.oldProjectMethod }]"
                        placeholder="请输入"
            ></a-textarea>
          </a-form-item>
          <a-form-item label="附件">
            <a-upload-dragger
              name="file"
              action="/api/file/singleUpload"
              @change="handleChange"
              :beforeUpload="beforeUpload"
              v-decorator="['changeFile', { rules: [{ required: false, message: '请上传' }], initialValue: params.changeFile }]"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">上传变更公议表</p>
              <p class="ant-upload-hint">
                点击或将文件拖拽到这里上传
              </p>
            </a-upload-dragger>
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
import {productChange} from '@api/productManage'
import {getUserSelectList, findUserByOrgnizationId} from '@api/userManage'
import {getOrganizationList, getOrganizationPath} from '@api/sysManage'
import util from '@util/util'

export default {
  components: {},
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
      fileList: [],
      userList: [],
      deptId: [],
      deptMaster: [],
      deptMasterList: [],
      deptList: []
    }
  },
  mounted () {
    this.getDeptList()
    this.getUserSelectList()
  },
  methods: {
    onClose (refresh) {
      this.$emit('close', refresh)
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    getUserSelectList () {
      getUserSelectList().then((data) => {
        this.userList = data.data
      })
    },
    onDeptChange (record) {
      findUserByOrgnizationId({id: record[record.length - 1]}).then((data) => {
        let arr = {
          key: '',
          value: ''
        }
        let smallName = ''
        let smallId = ''
        for (let i of data.data) {
          if (i.key === 'smallUserId') {
            smallId = i.value
          }
          if (i.key === 'smallUserName') {
            smallName = i.value
          }
          if (i.key === 'platUserId') {
            arr.key = i.value
          }
          if (i.key === 'platUserName') {
            arr.value = i.value
          }
        }
        if (smallId) {
          arr.key += ',' + smallId
        }
        if (smallName) {
          arr.value += '/' + smallName
        }
        this.deptMasterList = [arr]
        this.deptMaster = arr.key
      }).catch((err) => {
        this.deptMasterList = []
        this.deptMaster = ''
        console.log('错误：' + err)
      })
    },
    getDeptList () {
      getOrganizationList().then((data) => {
        this.deptList = util.convertCascaderData(data.data, 'id', 'name')
      })
    },
    getDeptDefault (id, cb) {
      getOrganizationPath({id: id}).then((data) => {
        cb(data.data.split(','))
      })
    },
    // 弹框确认按钮
    handleOk () {
      let _this = this
      this.form.validateFields((err, values) => {
        // if (values.changeFile && values.changeFile.fileList && values.changeFile.fileList.length === 0) {
        //   _this.$message.error('请上传变更公议表')
        //   return
        // }
        if (!err) {
          if (values.deptId && values.deptId.length > 0) {
            if (values.deptId.length === 1) {
              values.platId = values.deptId[values.deptId.length - 1]
            } else {
              values.smallId = values.deptId[values.deptId.length - 1]
              values.platId = values.deptId[values.deptId.length - 2]
            }
          }
          let deptMaster = values.deptMaster.split(',')
          if (deptMaster && deptMaster.length > 0) {
            if (deptMaster.length === 1) {
              values.platUserId = deptMaster[deptMaster.length - 1]
              values.smallUserId = ''
            } else {
              values.smallUserId = deptMaster[deptMaster.length - 1]
              values.platUserId = deptMaster[deptMaster.length - 2]
            }
          }
          delete values['deptId']
          delete values['deptMaster']
          if (values.changeFile) {
            values.changeFile = util.convertFile(values.changeFile.fileList, 'pm')
          }
          values.changeTime = util.formatDate(values.changeTime.valueOf())
          values.productId = _this.params.id
          productChange(values).then((data) => {
            this.onClose('refresh')
            _this.$message.success('已提交')
          }).catch((err) => {
            console.log('提交错误：' + err)
          })
        }
      })
    },
    beforeUpload (file) {
      // return Promise.resolve
      // if (this.fileList && this.fileList.length >= 1) {
      //   this.$message.error('请先删除当前的文件，重新删除')
      // }
    },
    handleChange (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success('上传成功')
      } else if (status === 'error') {
        this.$message.error('上传失败')
      }
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
