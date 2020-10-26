<template>
  <div>
    <a-drawer
      title="资产信息"
      width="720"
      @close="onClose"
      :destroyOnClose = true
      :visible="showDrawer"
    >
      <div class="drawer-form-box" :class="isSee?'see-view':''">
        <a-form :form="form" layout="vertical" hideRequiredMark>
          <div class="inputTitle">
            <a-form-item>
              <a-input :disabled="isSee"
                v-decorator="['hitank_project_name', { rules: [{ required: true, message: '请输入资产名称' }], initialValue: initName }]"
                placeholder="点击输入资产名称"
              ></a-input>
            </a-form-item>
          </div>
          <div class="title-header">基本信息</div>
          <a-row :gutter="16" class="box">
            <a-col :span="flowB?24:12">
              <a-form-item label="负责人">
              <a-select :disabled="isSee" @change="onOwnerChange" showSearch :filterOption="filterOption" optionFilterProp="children"
                v-decorator="['hitank_project_ownerId', { rules: [{ required: true, message: '请选择负责人' }], initialValue: initOwnerId  }]"
                placeholder="请选择负责人"  class="vertical-content">
                <a-select-option :value="item.id" v-for="(item) in userList" :key="item.id">{{item.name}}</a-select-option>
              </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12" v-if="flowB===false">
              <a-form-item label="所属小微">
              <a-cascader :disabled="true"
                v-decorator="['hitank_project_deptId', { rules: [{ required: true, message: '请维护该负责人所属小微' }], initialValue: initDeptId  }]"
                class="vertical-content" :options="deptList" placeholder="请维护该负责人所属小微">
              </a-cascader>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="box">
            <a-col>
              <a-form-item label="资产类目">
              <a-cascader :disabled="isSee"
                v-decorator="['hitank_project_assetsTypeId', { rules: [{ required: true, message: ' '}, {validator: this.checkAssetType }], initialValue: initAssetsId  }]"
                class="vertical-content" :options="assetList" @change="onAssetChange" placeholder="请选择资产类目">
              </a-cascader>
              </a-form-item>
            </a-col>
          </a-row>
          <div class="title-header">账号信息</div>
          <a-row class="box">
            <a-col v-if="assetsFields.length>0" v-for="(field,index) in assetsFields" :key="index">
              <a-form-item :label="field.name">
                <a-input :disabled="isSee" v-if="field.type == 2"
                  v-decorator="[field.field, { rules: [{ required: field.isMast==1, message: '请输入'+field.name }], initialValue: field.fieldValue  }]"
                  :placeholder="'请输入'+field.name" class="vertical-content" />
                <a-select :disabled="isSee" style="width: 100%" v-else-if="field.type==3"
                          v-decorator="[field.field, { rules: [{ required: field.isMast==1, message: '请选择'+field.name }], initialValue: field.fieldValue  }]"
                          :placeholder="'请选择'+field.name"   class="vertical-content">
                  <a-select-option :value="sel.value" v-for="(sel,index) in JSON.parse(field.selectValue)" :key="index">{{sel.name}}</a-select-option>
                </a-select>
                <a-date-picker style="width: 100%" v-else-if="field.type==4" :disabled="isSee"
                               :placeholder="'请选择'+field.name" format="YYYY-MM-DD"
                               v-decorator="[field.field, { rules: [{ required: field.isMast==1, message: '请选择'+field.name }], initialValue: convertDate(field.fieldValue) }]"
                />
                <a-textarea style="width: 100%" v-else-if="field.type==5" :disabled="isSee"
                            v-decorator="[field.field, { rules: [{ required: field.isMast==1, message: '请输入'+field.name }], initialValue: field.fieldValue  }]"
                            :placeholder="'请输入'+field.name" class="vertical-content"
                ></a-textarea>
                <a-input :disabled="isSee" v-else
                         v-decorator="[field.field, { rules: [{ required: field.isMast==1, message: '请输入'+field.name }], initialValue: field.fieldValue  }]"
                         :placeholder="'请输入'+field.name" class="vertical-content"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="box">
            <a-col v-if="zeroId==4">
              <a-form-item label="网站">
                <a-input :disabled="isSee"
                         v-decorator="['hitank_project_goUrl', { rules: [{ required: true, message: '请输入网站地址' }], initialValue: params.goUrl }]"
                         placeholder="请输入网站地址"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="到期时间">
                <div v-if="isSee && !convertDate(params.endDate)">长期</div>
                <a-date-picker :disabled="isSee" v-show="!isSee || convertDate(params.endDate)"
                v-decorator="['hitank_project_endDate', { rules: [{ required: false, message: '请选择到期时间' }], initialValue: convertDate(params.endDate) }]"
                class="vertical-content" placeholder="请选择到期时间" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div v-if="flowB && !this.id && this.params.role != 'admin'">
          <div class="title-header">工作流程</div>
          <div class="content timeline-container pad-l-15">
            <div>
              <div >
                <div class="timeline-item" v-for="(item,index) in timeLineList" :key="index">
                  <!--带名字-->
                  <div v-if="item.step == 1">
                    <div class="timeline-avatar" :class="params.role=='admin'?'admin':''">
                      <hitank-avatar class="" :size="32" :role="role" :name="userName"></hitank-avatar>
                    </div>
                    <div class="timeline-item-box">
                      <div class="timeline-item-content">
                        <div class="timeline-title">提交 资产新增 申请</div>
                        <div class="blackText" v-if="params.role=='admin'">
                          管理员
                        </div>
                        <div class="timeline-img" v-else>
                          <img :src="item.userSign"/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--带选择框-->
                  <div  v-if="item.step == 2 || item.step == 3">
                    <div  v-if="(item.step == 2 && item.userName) || (item.step == 3  && item.userName)">
                      <div class="timeline-avatar" :class="item.role=='admin'?'admin':''">
                        <hitank-avatar class="" :size="32" :role="item.role" :name="item.userName"></hitank-avatar>
                      </div>
                      <div class="timeline-item-box">
                        <div class="timeline-item-content">
                          <div class="choose-block">
                            <span class="choose-block-text">{{item.userName}}</span><!--
                            --><span class="choose-block-del" @click="chooseBlockDel(item)">x</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <div class="timeline-choose" @click="choose(item)"></div>
                      <div class="timeline-item-box">
                        <div class="timeline-item-content">
                          <span class="btn-icon-theme choose-text" @click="choose(item)" v-if="item.step == 2">请选择小微主</span>
                          <span class="btn-icon-theme choose-text" @click="choose(item)" v-if="item.step == 3">请选择平台主</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                  </div>
                  <!--总状态-->
                  <div v-if="item.step==4">
                    <div class="timeline-status">
                      <a-icon type="check-circle" theme="filled" />
                    </div>
                    <div class="timeline-item-box">
                      <div class="timeline-item-content blackText">
                        {{item.text}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer" :class="isSee === true?'none':''">
          <a-button :style="{marginRight: '8px'}" @click="onClose()">
            取消
          </a-button>
          <a-button @click="submit" type="primary">确认</a-button>
        </div>
      </div>
    </a-drawer>
    <select-user-modal
      :showModal="showModal"
      @close="closeModal"
      :params="modalParams"
    ></select-user-modal>
  </div>
</template>
<script>
import {getOrganizationList, getAssetClassListById, getOrganizationPath, getOrganizationPathByUserId} from '@api/sysManage'
import {getAssetsField, updateAssets, applyAssetsItemAdd, getAssetsTypePathList, getUserstamp, applyAssetsItemAddFlowB} from '@api/digitalAssets'
import {getUserSelectList} from '@api/userManage'
import util from '@util/util'
import store from '@/store'
import HitankAvatar from '../../components/manageHome/HitankAvatar'
import SelectUserModal from './SelectUserModal'
const timeLineInit = [{
  step: 2
}, {
  step: 3
}, {
  step: 4,
  text: '待获取新增资产权限'
}]
export default {
  components: {SelectUserModal, HitankAvatar},
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
        return true
      }
    },
    params: Object
  },
  data () {
    return {
      flowB: this.flowB,
      timeLineList: util.deepClone(timeLineInit),
      userName: '',
      role: '',
      userSign: '',
      visible: false,
      form: this.$form.createForm(this),
      userList: [],
      deptList: [],
      assetList: [],
      assetsFields: [],
      initName: '',
      initOwnerId: [],
      initDeptId: [],
      initAssetsId: [],
      initDate: this.$moment(),
      // initOthers: '',
      id: '',
      zeroId: '',
      /* selectUser start */
      showModal: false,
      modalParams: {}
      /* selectUser end */
    }
  },
  mounted () {
    let cur = this.$router.currentRoute
    this.zeroId = cur.name.split('_')[1]
    let _this = this
    store.dispatch('getUserInfo').then(userInfo => {
      let obj = {
        step: 1,
        userName: userInfo.name,
        role: userInfo.role
      }
      _this.userName = userInfo.name
      _this.role = userInfo.role
      getUserstamp().then((res) => {
        if (res.success) {
          obj.userSign = res.data.signStamp
          _this.userSign = res.data.signStamp
          _this.timeLineList.push(obj)
          _this.timeLineList = util.objArraySort(_this.timeLineList, 'step')
        }
      })
    }).catch((err) => {
      console.log('获取用户信息错误：' + err)
    })
    this.getUserSelectList()
    this.getDeptList()
    this.getAssetList()
  },
  methods: {
    chooseBlockDel (item) {
      util.objArrayRemove(this.timeLineList, 'step', item.step)
      this.timeLineList.push({
        step: item.step
      })
      this.timeLineList = util.objArraySort(this.timeLineList, 'step')
    },
    // 选择小微主
    choose (item) {
      this.showModal = true
      this.modalParams = item
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    getDeptPathByUserId (id, cb) {
      getOrganizationPathByUserId({userId: id}).then((data) => {
        if (data.total) {
          cb(data.data.split(','))
        } else {
          cb()
        }
      })
    },
    /* 暂废弃 */
    getDeptDefault (id, cb) {
      getOrganizationPath({id: id}).then((data) => {
        cb(data.data.split(','))
      })
    },
    getAssetDefault (id, cb) {
      getAssetsTypePathList({id: id}).then(function (rec) {
        let arr = rec.data.split(',')
        cb(arr.slice(1, arr.length - 1))
      })
    },
    getUserSelectList () {
      getUserSelectList().then((data) => {
        this.userList = data.data
      })
    },
    getDeptList () {
      getOrganizationList().then((data) => {
        this.deptList = util.convertCascaderData(data.data, 'id', 'name')
      })
    },
    getAssetList (id, cb) {
      let parentId = this.zeroId
      if (Number(this.zeroId) === 0) {
        parentId = id
      }
      getAssetClassListById({parentId}).then((data) => {
        this.assetList = util.convertCascaderData(data.data, 'id', 'name')
        if (typeof (cb) === 'function') {
          cb()
        }
      })
    },
    getAssetField (typeId) {
      getAssetsField({typeId: typeId}).then((data) => {
        if (data.data && data.data.dynamicFieldReqInfos && data.data.dynamicFieldReqInfos.length > 0) {
          this.assetsFields = data.data.dynamicFieldReqInfos
        } else {
          this.assetsFields = []
        }
      })
    },
    onOwnerChange (record) {
      let _this = this
      this.getDeptPathByUserId(record, (data) => {
        _this.form.setFields({
          hitank_project_deptId: {
            value: [],
            errors: null
          }
        })
        _this.form.setFieldsValue({
          hitank_project_deptId: data
        })
        this.initDeptId = data
      })
    },
    onAssetChange (record) {
      this.getAssetField(record[record.length - 1])
    },
    onClose (refresh) {
      this.$emit('cancel', refresh)
    },
    onChange (e) {
      this.placement = e.target.value
    },
    checkAssetType (rule, value, callback) {
      if (value.length === 2) {
        callback()
      } else {
        callback(new Error('请选择二级资产类目或先在资产类目管理中维护二级目录'))
      }
    },
    /* 暂废弃 */
    checkDept (rule, value, callback) {
      if (value.length === 2) {
        callback()
      } else {
        callback(new Error('请选择二级所属小微'))
      }
    },
    convertDate (date) {
      if (util.isEmpty(date)) {
        return null
      } else {
        return this.$moment(date)
      }
    },
    submit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.flowB && this.role !== 'admin' && !this.id) {
            if (util.isEmpty(this.timeLineList[1].userId)) {
              this.$message.error('请选择小微主')
              return
            }
            if (util.isEmpty(this.timeLineList[2].userId)) {
              this.$message.error('请选择平台主')
              return
            }
          }
          let _this = this
          let params = {}
          let fixFiled = ['hitank_project_name', 'hitank_project_assetsTypeId', 'hitank_project_deptId',
            'hitank_project_ownerId', 'hitank_project_endDate', 'hitank_project_goUrl']
          // let fixFiled = ['name', 'assetsTypeId', 'deptId', 'ownerId']
          let changeData = {}
          for (let i in values) {
            if (!fixFiled.includes(i)) {
              if (values[i] && values[i]._isAMomentObject) {
                changeData[i] = util.formatDate(values[i].valueOf())
              } else {
                changeData[i] = values[i]
              }
            }
          }
          if (values.hitank_project_assetsTypeId && values.hitank_project_assetsTypeId.length > 0) {
            params.assetsTypeId = values.hitank_project_assetsTypeId[values.hitank_project_assetsTypeId.length - 1]
          }
          if (this.flowB === false) {
            if (values.hitank_project_deptId && values.hitank_project_deptId.length > 0) {
              params.deptId = values.hitank_project_deptId[values.hitank_project_deptId.length - 1]
            }
          }
          if (!util.isEmpty(values.hitank_project_endDate)) {
            params.endDate = util.formatDate(values.hitank_project_endDate.valueOf())
          }
          if (!util.isEmpty(values.hitank_project_goUrl)) {
            params.goUrl = values.hitank_project_goUrl.valueOf()
          }
          params.name = values.hitank_project_name
          params.ownerId = values.hitank_project_ownerId
          params['changeData'] = JSON.stringify(changeData)
          if (this.id || this.params.role === 'admin') {
            // user update
            // admin add & update
            params['id'] = this.id
            updateAssets(params).then((data) => {
              this.onClose('refresh')
              _this.$message.success('保存成功')
            }).catch((err) => {
              console.log('提交错误：' + err)
            })
          } else {
            // user add
            params.status = 1
            if (!this.flowB) {
              applyAssetsItemAdd(params).then((data) => {
                this.onClose('refresh')
                _this.$message.success('已提交申请，请等待审批')
                _this.$router.push({path: '/workflowList'})
              }).catch((err) => {
                console.log('提交错误：' + err)
              })
            } else {
              params.firstVerifyId = this.timeLineList[1].userId
              params.secondVerifyId = this.timeLineList[2].userId
              applyAssetsItemAddFlowB(params).then((data) => {
                this.onClose('refresh')
                _this.$message.success('已提交申请，请等待审批')
                _this.$router.push({path: '/workflowList'})
              }).catch((err) => {
                console.log('提交错误：' + err)
              })
            }
          }
        }
      })
    },
    cb (e) {
      // console.log('*******cb')
    },
    /* select User modal start */
    closeModal (param) {
      this.showModal = false
      if (param && param.userName) {
        util.objArrayRemove(this.timeLineList, 'step', param.step)
        this.timeLineList.push(param)
        this.timeLineList = util.objArraySort(this.timeLineList, 'step')
      }
    }
    /* select User modal end */
  },
  watch: {
    showDrawer (val, oldVal) {
      if (val === true) {
        this.timeLineList = util.deepClone(timeLineInit)
        let first = {
          step: 1,
          userName: this.userName,
          role: this.role,
          userSign: this.userSign
        }
        this.timeLineList.push(first)
        this.timeLineList = util.objArraySort(this.timeLineList, 'step')

        this.initOwnerId = this.params.ownerId
        this.getDeptPathByUserId(this.params.ownerId, (data) => {
          this.initDeptId = data
        })
        if (this.params.id) {
          this.initName = this.params.name
          if (Number(this.zeroId) === 0) {
            this.getAssetList(this.params.assetsTypeFirstLevelId, () => {
              this.getAssetDefault(this.params.id, (data) => {
                this.initAssetsId = data
              })
            })
          } else {
            this.getAssetDefault(this.params.id, (data) => {
              this.initAssetsId = data
            })
          }

          /* this.getDeptPathByUserId(this.params.deptId, (data) => {
            this.initDeptId = data
          }) */
          this.id = this.params.id
          if (!util.isEmpty(this.params.dynamicFieldResInfos)) {
            this.assetsFields = this.params.dynamicFieldResInfos
          } else {
            this.assetsFields = []
          }
        } else {
          this.initName = ''
          this.initDeptId = []
          this.initAssetsId = []
          this.id = ''
          this.assetsFields = []
        }
      } else {
        // this.isSee = true
      }
    }
  }
}
</script>
<style scoped lang="less">
  @import "~@var";
  .inputTitle {
    input{
      font-size: 20px;
      line-height: 28px;
      color: @blackTitle;
      border: 0;
      width: 100%;
      font-weight: 500;
    }
  }
  .box{
    .vertical-title{
      margin-bottom: 7px;
      line-height: 22px;
    }
    .vertical-content{
      width: 100%;
    }
  }
  .timeline-container {
    color: @blackBody;
    .timeline-item {
      position: relative;
      height: 66px;
      margin-bottom: 16px;
      box-sizing: border-box;
      .timeline-avatar {
        width:32px;
        height:32px;
        color: @fff;
        font-size: 12px;
        background:@blue;
        border-radius: 32px;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: -15px;
        line-height: 32px;
        text-align: center;
        z-index: 2;
      }
      .timeline-avatar.admin {
        background:@red;
      }
      .timeline-choose {
        cursor: pointer;
        width:32px;
        height:32px;
        color: @fff;
        font-size: 12px;
        background:@fff;
        border:1px dashed @theme;
        border-radius: 32px;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: -15px;
        line-height: 32px;
        text-align: center;
        z-index: 9;
      }
      .timeline-choose:after {
        content: '+';
        display: block;
        color: @theme;
        line-height: 28px;
        height: 30px;
        font-size: 20px;
      }
      .timeline-status {
        width:12px;
        height:12px;
        color: @blackIcon;
        font-size: 12px;
        position: absolute;
        top: -4px;
        left: -5px;
        line-height: 32px;
        text-align: center;
        z-index: 9;
      }
      .timeline-item-box {
        padding-left: 32px;
        box-sizing: border-box;
        .timeline-item-content {
          line-height: 22px;
        }
      }
      .timeline-title {
        color: @blackBody;
        line-height: 24px;
        width: 700px;
        margin-bottom: 4px;
      }
      .timeline-img{
        img {
          width:84px;
          height:38px;
        }
        height:38px;
      }
      .choose-text{
        position: relative;
        top: 5px;
      }
      .choose-block{
        display: inline;
        .choose-block-text {
          background-color: @themeBg;
          color: @theme;
          padding:4px 8px;
          border-bottom-left-radius: 4px;
          border-top-left-radius: 4px;
          position: relative;
          top: 6px;
          display: inline-block;
        }
        .choose-block-del {
          background-color: @themeBg;
          color: @theme;
          cursor: pointer;
          padding:4px;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          display: inline-block;
          position: relative;
          top: 6px;
          margin-left: 1px;
        }
      }
    }
    .timeline-item:after {
      display: block;
      content: '';
      height: 40px;
      border-left: 2px solid #E8E8E8;
      position: absolute;
      top: 37px;
    }
    .timeline-item:last-of-type:after {
      border-left: 0;
    }
  }
</style>
