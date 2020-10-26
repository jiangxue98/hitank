<template>
  <div>
    <a-drawer
      :title="params.title"
      width="720"
      @close="onClose"
      :destroyOnClose = true
      :visible="showDrawer"
    >
      <div class="drawer-form-box asset-class-item-drawer-form" :class="isSee?'see-view':''">
        <div class="clearfix">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            name="file"
            :showUploadList="false"
            action="/api/file/singleUpload"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传logo</div>
            </div>
          </a-upload>
          <div class="inputTitle">
            <a-input v-model="productName" class="content" placeholder="请输入产品名称" />
            <a-input v-model="productAbbrName" class="abbr" placeholder="点击输入产品简称（选填）" />
          </div>
        </div>
        <a-form :form="form" layout="vertical" hideRequiredMark>
          <div class="title-header">产品基本信息</div>
          <a-form-item label="产品类型">
            <a-select class="disabled-cover" :disabled="isSee" mode="multiple"
                      v-decorator="['productType', { rules: [{ required: true, message: '请选择' }], initialValue: params.productType }]"
                      placeholder="请选择"
            >
              <a-select-option :value="item.value" v-for="(item) in typeList" :key="item.value">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="战略描述与定位">
            <a-textarea class="disabled-cover" :disabled="isSee"
                      v-decorator="['zldw', { rules: [{ required: true, message: '请输入' }], initialValue: params.zldw }]"
                      placeholder="请输入"
            ></a-textarea>
          </a-form-item>
          <a-form-item label="目标用户及描述">
            <a-textarea class="disabled-cover" :disabled="isSee"
                        v-decorator="['mbyh', { rules: [{ required: true, message: '请输入' }], initialValue: params.mbyh }]"
                        placeholder="请输入"
            ></a-textarea>
          </a-form-item>
          <a-form-item label="功能描述">
            <a-textarea class="disabled-cover" :disabled="isSee"
                        v-decorator="['gnms', { rules: [{ required: true, message: '请输入' }], initialValue: params.gnms }]"
                        placeholder="请输入"
            ></a-textarea>
          </a-form-item>
          <a-form-item label="产品介绍">
            <a-textarea class="disabled-cover" :disabled="isSee"
                        v-decorator="['intro', { rules: [{ required: true, message: '请输入' }], initialValue: params.intro }]"
                        placeholder="请输入"
            ></a-textarea>
          </a-form-item>

          <div class="title-header">产品组织信息</div>
          <a-form-item label="项目主人">
            <a-select class="disabled-cover" :disabled="id?true:false" showSearch :filterOption="filterOption" optionFilterProp="children"
                      v-decorator="['userId', { rules: [{ required: true, message: '请输入' }], initialValue: params.userId }]"
                      placeholder="请输入"
            >
              <a-select-option :value="item.id" v-for="(item) in userList" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="产品经理">
            <a-select class="disabled-cover" showSearch :filterOption="filterOption" optionFilterProp="children"
                      v-decorator="['projectManage', { rules: [{ required: true, message: '请输入' }], initialValue: params.projectManage }]"
                      placeholder="请输入"
            >
              <a-select-option :value="item.id" v-for="(item) in userList" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="技术负责人">
            <a-select class="disabled-cover" showSearch :filterOption="filterOption" optionFilterProp="children"
                      v-decorator="['technicalManager', { rules: [{ required: true, message: '请输入' }], initialValue: params.technicalManager }]"
                      placeholder="请输入"
            >
              <a-select-option :value="item.id" v-for="(item) in userList" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <!--<a-form-item label="所属平台/小微：" :labelCol="{span: 5}" :wrapperCol="{span: 19}">-->
<!--          <a-row :gutter="16" class="box">-->
<!--            <a-col :span="12">-->
              <a-form-item label="所属平台/小微：">
<!--                <a-cascader :disabled="id?true:false"-->
                <a-cascader
                            changeOnSelect  @change="onDeptChange"
                            v-decorator="['deptId', { rules: [{ required: false, message: '请选择' }], initialValue: deptId  }]"
                            placeholder="请选择所属平台/小微"  class="vertical-content disabled-cover" :options="deptList">
                </a-cascader>
              </a-form-item>
<!--            </a-col>-->
<!--            <a-col :span="12">-->
              <a-form-item label="平台主/小微主" style="display: none">
<!--                <a-select :disabled="id?true:false"-->
                <a-select
                          v-decorator="['deptMaster', { initialValue: deptMaster  }]"
                          placeholder="根据平台/小微自动匹配"  class="vertical-content disabled-cover">
                  <a-select-option :value="item.key" v-for="(item) in deptMasterList" :key="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-item>
<!--            </a-col>-->
<!--          </a-row>-->

          <div class="title-header">产品立项信息</div>
          <a-form-item label="ALM应用编码（S码）">
            <a-input class="disabled-cover" :disabled="isSee"
                      v-decorator="['almId', { rules: [{ required: true, message: '请输入' }], initialValue: params.almId }]"
                      placeholder="请输入"
            ></a-input>
          </a-form-item>
          <a-form-item label="是否立项">
            <a-select class="disabled-cover" :disabled="isSee" @change="onPassChange"
                      v-decorator="['projPass', { rules: [{ required: true, message: '请选择' }], initialValue: params.projPass }]"
                      placeholder="点击输入是否立项"
            >
              <a-select-option :value="1" key="1">是</a-select-option>
              <a-select-option :value="0" key="0">否</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="项目编码" v-if="isPass">
            <a-input class="disabled-cover" :disabled="isSee"
                     v-decorator="['projId', { rules: [{ required: true, message: '请输入' }], initialValue: params.projId }]"
                     placeholder="请输入"
            ></a-input>
          </a-form-item>
          <a-form-item label="立项日期" v-if="isPass">
            <a-range-picker :placeholder="['开始时间', '结束时间']" style="width: 100%"
                            v-decorator="['applyDate', { rules: [{ required: true, message: '请选择' }], initialValue: convertPass(params.passUpTime, params.passDownTime) }]"
            ></a-range-picker>
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
import {getOrganizationList, getOrganizationPath} from '@api/sysManage'
// import {getUserSelectList} from '@api/userManage'
import {getUserSelectList} from '@api/userManage'
import {updateProduct} from '@api/productManage'
import util from '@util/util'
import global from '@util/global'

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
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }
    return {
      visible: false,
      form: this.$form.createForm(this),
      id: '',
      userList: [],
      deptList: [],
      assetList: [],
      assetsFields: [],
      showModal: false,
      drawerParams: {
        field: {}
      },
      deptId: [],
      deptMaster: '',
      deptMasterList: [],
      formItemLayout,
      typeList: global.PRODUCT_TYPE,
      productName: '',
      productAbbrName: '',
      addType: '',
      loading: false,
      uploadParams: '',
      imageUrl: '',
      logo: '',
      isPass: false
    }
  },
  mounted () {
    this.getDeptList()
    this.getUserSelectList()
  },
  methods: {
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
      /* findUserByOrgnizationId({id: record[record.length - 1]}).then((data) => {
      // let data = [{'key': 'platName', 'value': '测试平台主'}, {'key': 'platId', 'value': '201912301537400F0011'}, {'key': 'smallName', 'value': '测试小微主'}, {'key': 'smallId', 'value': '201912301538350F0013'}]
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
      }) */
    },
    handleEdit (field) {
      console.log(this.params)
      this.addType = 'edit'
      this.showModal = true
      this.drawerParams.field = field
      this.drawerParams.assetId = this.params.id
      this.drawerParams.id = this.id
      this.drawerParams.assetsFields = this.assetsFields
    },
    onAssetChange (record) {
      this.getAssetField(record[record.length - 1])
    },
    onPassChange (record) {
      if (record === 1) {
        this.isPass = true
      } else {
        this.isPass = false
        this.form.setFieldsValue({'projId': ''})
        this.form.setFieldsValue({'applyDate': []})
        // this.form.resetFields('projId')
        // this.form.resetFields('applyDate')
      }
    },
    onClose (refresh) {
      this.$emit('close', refresh)
    },
    onChange (e) {
      this.placement = e.target.value
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
    convertDate (date) {
      if (util.isEmpty(date)) {
        return null
      } else {
        return this.$moment(date)
      }
    },
    convertPass (begin, end) {
      if (begin && end) {
        return [this.convertDate(begin), this.convertDate(end)]
      } else {
        return []
      }
    },
    // 弹框确认按钮
    handleOk () {
      let _this = this
      if (util.isEmpty(this.productName)) {
        this.$message.error('点击输入产品名称')
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.deptId && values.deptId.length > 0) {
            if (values.deptId.length === 1) {
              values.platId = values.deptId[values.deptId.length - 1]
            } else {
              values.smallId = values.deptId[values.deptId.length - 1]
              values.platId = values.deptId[values.deptId.length - 2]
            }
          } else {
            values.smallId = ''
            values.platId = ''
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
          } else {
            values.smallUserId = ''
            values.platUserId = ''
          }
          delete values['deptId']
          delete values['deptMaster']
          if (values.applyDate && values.applyDate[0]) {
            values['passUpTime'] = util.formatDate(values.applyDate[0].valueOf())
            values['passDownTime'] = util.formatDate(values.applyDate[1].valueOf())
            delete values['applyDate']
          }
          values['name'] = _this.productName
          if (_this.productAbbrName) {
            values['abbreviation'] = _this.productAbbrName
          }
          if (_this.logo) {
            values['logo'] = _this.logo
          }
          if (this.isPass === false) {
            values.projId = ''
            values.passUpTime = null
            values.passDownTime = null
          }
          if (_this.id) {
            values['id'] = _this.id
          }
          if (values.productType && values.productType.length > 0) {
            values.type = values.productType.join(',')
            delete values['productType']
          }
          updateProduct(values).then((data) => {
            this.onClose('refresh')
            _this.$message.success('已提交')
          }).catch((err) => {
            console.log('提交错误：' + err)
          })
        }
      })
    },
    getBase64 (img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        if (info.file.response && info.file.response.data.url) {
          this.logo = info.file.response.data.url
        }
        // Get this url from response in real world.
        this.getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      if (!isJPG) {
        this.$message.error('请使用.jpeg、.jpg、.png格式的图片')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片不能超过2兆')
      }
      return isJPG && isLt2M
    }
  },
  watch: {
    showDrawer (val, oldVal) {
      if (val === true) {
        if (this.params && this.params.id) {
          this.id = this.params.id
          this.productName = this.params.name
          this.productAbbrName = this.params.abbreviation
          this.imageUrl = this.params.logo
          let deptId = ''
          if (this.params.smallId) {
            deptId = this.params.smallId
          } else if (this.params.platId) {
            deptId = this.params.platId
          }
          this.deptMaster = ''
          this.deptMasterList = []
          if (this.params.platUserId && this.params.platUserIdName) {
            this.deptMaster = this.params.platUserId
            this.deptMasterList = [{value: this.params.platUserIdName, key: this.deptMaster}]
            if (this.params.smallUserId && this.params.smallUserIdName) {
              this.deptMaster = this.params.platUserId + ',' + this.params.smallUserId
              this.deptMasterList = [{value: this.params.platUserIdName + '/' + this.params.smallUserIdName, key: this.deptMaster}]
            }
          }
          if (this.params.type) {
            this.params.productType = this.params.type.split(',')
          }
          this.getDeptDefault(deptId, (data) => {
            this.deptId = data
          })
          if (this.params.projPass === 1) {
            this.isPass = true
          } else {
            this.params.projId = ''
            this.params.passUpTime = null
            this.params.passDownTime = null
          }
        } else {
          this.isPass = false
          this.id = ''
          this.deptId = []
          this.productName = ''
          this.productAbbrName = ''
          this.imageUrl = ''
          this.deptMaster = ''
          this.deptMasterList = []
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
  @import "~@var";
  .box{
    .vertical-title{
      margin-bottom: 7px;
      line-height: 22px;
    }
    .vertical-content{
      width: 100%;
    }
  }
  .itemBtn{
    padding: 28px 0;
    height: 78px;
    line-height: 22px;
    margin-bottom: 16px;
    margin-top: 10px;
  }
  .itemBtn:hover{
    color: @blackText;
  }
  .asset-class-item-drawer-form {
    .ant-form-vertical .ant-form-item{
      padding: 8px 0 8px 16px;
      border-radius: 4px ;
      margin-bottom: 16px;
    }
    .right-btn-group {
      padding: 31px 13px 31px;
      position: absolute;
      top: -45px;
      right: -55px ;
      border-left: 1px solid @fff;
      height: 78px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .right-btn-group:hover {
      background-color: #C3E9E0;
      color: @fff;
    }
    .right-btn-group2:extend(.asset-class-item-drawer-form .right-btn-group all) {
      right: -97px ;
    }
  }
  .inputTitle {
    margin-bottom: 27px;
    float: left;
    padding-top: 7px;
    margin-left: 5px;
    input{
      font-size: 20px;
      line-height: 38px;
      color: @blackTitle;
      border: 0;
      width: 100%;
      font-weight: 500;
    }
    .abbr{
      font-size: 14px;
    }
  }
  .avatar-uploader{
    width: 76px;
    float: left;
    .anticon{
      color: #BFBFBF;
      font-size: 15px;
    }

  }
  .avatar-uploader > .ant-upload {
    width: 76px;
    height: 76px;
  }
</style>
<style lang="less">
  .asset-class-item-drawer-form{
    .ant-form-item-label label{
      color: #595959;
    }
  }
  .avatar-uploader > .ant-upload, .avatar-uploader > .ant-upload img {
    width: 76px;
    height: 76px;
    box-sizing: border-box;
    .ant-upload-text{
      font-size: 10px;
      margin-top: 4px;
    }
  }
  .ant-upload.ant-upload-select-picture-card > .ant-upload{
    padding: 0;
  }
</style>
