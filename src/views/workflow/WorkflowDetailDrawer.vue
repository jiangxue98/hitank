<template>
  <div>
    <a-drawer
      :title="params.title"
      width="720"
      @close="onClose"
      :destroyOnClose = true
      :visible="showDrawer"
    >
      <div class="drawer-form-box">
        <div>
          <div class="flowName">{{params.flowName}}</div>
          <a-row class="info-box">
            <a-col :span="12">
              <a-row><span class="tit">发起时间：</span><span class="cont">{{params.createTime}}</span></a-row>
              <a-row><span class="tit">发起人：</span><span class="cont">{{params.createbyName}}</span></a-row>
              <a-row><span class="tit" v-if="params.reason">审批意见：</span><span class="cont">{{params.reason}}</span></a-row>
              <a-row><span class="tit">所属小微：</span><span class="cont">{{params.createbyOrgnizationname}}</span></a-row>
            </a-col>
            <a-col :span="12" v-if="params.checkType==1">
              <a-row><span class="tit">使用期限：</span><span class="cont">{{params.startTime.substr(0,10)}} 至 {{params.endTime.substr(0,10)}}</span></a-row>
              <a-row><span class="tit">原因：</span><span class="cont-line2">{{params.applyReason}}</span></a-row>
            </a-col>
          </a-row>
          <div class="asset-info">
            <div class="asset-info-header">资产信息</div>
            <a-row class="info-box">
              <div class="info-box-title">基本信息</div>
              <a-col :span="12">
                <a-row><span class="tit">负责人：</span><span class="cont">{{assetsInfo.ownerIdName}}</span></a-row>
                <a-row><span class="tit">所属小微：</span><span class="cont">{{assetsInfo.deptIdName}}</span></a-row>
              </a-col>
              <a-col :span="12">
                <a-row><span class="tit">资产类目：</span><span class="cont">{{assetsInfo.assetsTypeIdName}}</span></a-row>
              </a-col>
            </a-row>
            <div class="line" v-if="assetsInfo.dynamicFieldResInfos && assetsInfo.dynamicFieldResInfos.length > 0"></div>
            <a-row class="info-box" v-if="assetsInfo.dynamicFieldResInfos && assetsInfo.dynamicFieldResInfos.length > 0">
              <div class="info-box-title">账号信息</div>
              <a-row><a-col :span="12"><span class="tit">到期时间：</span><span class="cont">{{assetsInfo.endDate?assetsInfo.endDate.substr(0,10):'长期'}}</span></a-col></a-row>
              <a-row>
                <a-col style="margin-bottom: 8px" :span="12" v-for="(item,index) in assetsInfo.dynamicFieldResInfos" :key="index">
                  <span v-if="item.fieldValue">
                    <span class="tit">{{item.name}}：</span>
                    <span class="cont">{{convertFieldSelect(item)}}</span>
                  </span>
                </a-col>
<!--                <a-col :span="12"><span class="tit line-clamp2">备注：</span><span class="cont-line2">{{assetsInfo.others}}</span></a-col>-->
              </a-row>
            </a-row>
          </div>
<!--          <ul class="info-box clearfix mar-d-30 pad-l-0">-->
<!--            <li class="tit">附件：</li>-->
<!--            <li class="cont">-->
<!--              <div class="file-list" v-for="(item,index) in params.assetsItemFlowAppendices" :key="index">-->
<!--                <a-icon type="paper-clip" />-->
<!--                <a :href="item.url">{{item.name}}</a>-->
<!--              </div>-->
<!--            </li>-->
<!--          </ul>-->
          <a-form :form="form" class="form-box" layout="vertical" hideRequiredMark  v-if="(params.role == 'plat' && params.totalState == 1)||(params.role == 'small' && params.totalState == 0)">
            <a-form-item label="审批意见">
              <a-textarea :rows="6" class="content" placeholder="请输入审批意见"
                          v-decorator="['reason', { rules: [{ required: true, message: '请输入审批意见' }] }]"
              />
            </a-form-item>
          </a-form>
          <div v-if="flowB && timeLineList && timeLineList.length>0">
            <div class="title-header">资产{{workTitle}}流程</div>
            <div class="content timeline-container pad-l-15">
              <div>
                <div >
                  <div class="timeline-item" v-for="(item,index) in timeLineList" :key="index">
                    <div v-if="item.step <= 3">
                      <div class="timeline-avatar">
                        <hitank-avatar class="" :size="32" :name="item.userName"></hitank-avatar>
                      </div>
                      <div class="timeline-item-box">
                        <div class="timeline-item-content">
                          <div class="timeline-title">{{item.text}}</div>
                          <div class="timeline-img" v-if="item.userSign">
                            <img :src="item.userSign"/>
                          </div>
                          <div class="timeline-img blackText f12" v-else>
                            {{item.tip}}
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--总状态-->
                    <div v-if="item.step==4">
                      <div class="timeline-status">
                        <a-icon type="check-circle" theme="filled" :class="step4State==1?'green':''"/>
                      </div>
                      <div class="timeline-item-box">
                        <div class="timeline-item-content blackText" >
                          {{item.text}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer" v-if="(flowB==false&&params.type == 'approving' && (params.role == 'plat' || params.role == 'small'))||(flowB!=false&&params.type == 'approving') ">
          <a-popconfirm style="margin-right: 8px" class="btn-white" @confirm="handleOk(2)" title="确定驳回吗？" :okText="okText" :cancelText="cancelText">
            <a href="#">驳回</a>
          </a-popconfirm>
          <a-popconfirm class="btn-theme" placement="topRight" @confirm="handleOk(1)" title="确定通过吗？" :okText="okText" :cancelText="cancelText">
            <a href="#">通过</a>
          </a-popconfirm>
        </div>
        <div class="footer" v-else-if="params.type == 'approve'">
          <a-button type="primary" disabled>{{params.title.replace('审批-','')}}</a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import {getAssets} from '@api/digitalAssets'
import {checkTwoWorkflow, checkOneWorkflow, checkWorkflowFlowB} from '@api/workflow'
import global from '@util/global'
import util from '@util/util'
import HitankAvatar from '../../components/manageHome/HitankAvatar'
export default {
  components: {HitankAvatar},
  props: {
    showDrawer: false,
    params: Object
  },
  data () {
    return {
      visible: false,
      okText: global.TEXT.OK,
      cancelText: global.TEXT.CANCEL,
      form: this.$form.createForm(this),
      assetsInfo: [],
      workTitle: '',
      step4State: 0,
      timeLineList: []
    }
  },
  mounted () {
  },
  methods: {
    convertFieldSelect (value) {
      let result
      if (util.isEmpty(value.selectValue)) {
        result = value.fieldValue
      } else {
        let sel = JSON.parse(value.selectValue)
        for (let o of sel) {
          if (o.value === value.fieldValue) {
            result = o.name
            break
          }
        }
      }
      return result
    },
    getAssetInfo () {
      getAssets({id: this.params.assetsItemId}).then((data) => {
        if (data.data) {
          this.assetsInfo = data.data
        }
      })
    },
    onClose () {
      this.$emit('close')
    },
    onChange (e) {
      this.placement = e.target.value
    },
    checkFlowB (values) {
      let _this = this
      values.ids = [values.id]
      checkWorkflowFlowB(values).then((data) => {
        _this.confirmLoading = false
        _this.$emit('close', 'refresh')
        _this.$message.success('审批成功')
      }).catch((error) => {
        _this.confirmLoading = false
        console.log('审批error:' + error)
      })
    },
    check (state) {
      let _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          values.id = _this.params.id
          values.state = state
          if (_this.flowB === false) {
            if (this.params.verifyLevel === 2) {
              values.flowType = 1
              checkTwoWorkflow(values).then((data) => {
                _this.confirmLoading = false
                _this.$emit('close', 'refresh')
                _this.$message.success('审批成功')
              }).catch((error) => {
                _this.confirmLoading = false
                console.log('审批error:' + error)
              }
              )
            } else {
              values.type = this.params.checkType
              if (this.params.checkType === 3) {
                values.type = 2
              }
              checkOneWorkflow(values).then((data) => {
                _this.confirmLoading = false
                _this.$message.success('审批成功')
                _this.$emit('close', 'refresh')
              }).catch((error) => {
                _this.confirmLoading = false
                console.log('审批error:' + error)
              }
              )
            }
          } else {
            _this.checkFlowB(values)
          }
        }
      })
    },
    handleOk: function (type) {
      this.check(type)
    }
  },
  watch: {
    showDrawer (val, oldVal) {
      if (val === true) {
        this.getAssetInfo()
        let params = this.params
        if (params.createbyName) {
          let checkTypeObj = {4: '注销', 1: '申请', 2: '新增', 3: '变更'}
          let stateObj = {0: '待审核', 1: '已通过', 2: '已驳回', 3: '已通过', 4: '已驳回'}
          let step4Text = ''
          let checkType = params.checkType
          let state = params.totalState
          let level = params.verifyLevel
          this.workTitle = checkTypeObj[checkType]
          step4Text = '资产' + checkTypeObj[checkType] + stateObj[state]
          if (level === 2 && state === 1) {
            step4Text = '资产' + checkTypeObj[checkType] + '待审核'
          }
          if (checkType === 1) {
            if (state === 0 || (level === 2 && state === 1)) {
              step4Text = '待获得注册资产权限'
            } else if ((state === 1 && level === 1) || state === 3) {
              step4Text = '已获得注册资产权限，注册后请及时维护资产账号信息'
              this.step4State = 1 // 1:绿色 ； 0：灰色
            } else if (state === 2 || state === 4) {
              step4Text = '获得注册资产权限已驳回'
            }
          }
          this.timeLineList = [{
            step: 1,
            userName: params.createbyName,
            userSign: params.createbyStamp,
            text: '提交' + params.checkTypeText + '申请'
          }, {
            step: 4,
            text: step4Text
          }
          ]
          if (params.verifyData) {
            let verifyData = params.assetsVerifyDBData
            for (let i = 0; i < verifyData.length; i++) {
              let verf = verifyData[i]
              let obj = {}
              if (verf) {
                obj.userName = verf.verifyByName
                obj.step = i + 2
                let name = obj.userName
                if (i === 0 && util.isEmpty(obj.userName)) {
                  name = '小微主'
                } else if (i === 1 && util.isEmpty(obj.userName)) {
                  name = '平台主'
                }
                if (verf.state === 0) {
                  obj.tip = name + '（待处理）'
                } else if (verf.state === 1) {
                  obj.tip = name + ' 处理'
                  obj.userSign = verf.verifyByStamp
                } else if (verf.state === 2) {
                  if (obj.userName) {
                    obj.tip = name + '（已驳回）'
                  }
                }
                obj.text = name + ' 处理'
                this.timeLineList.push(obj)
              }
            }
            this.timeLineList = util.objArraySort(this.timeLineList, 'step')
          }
        } else {
          this.timeLineList = []
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
  @import "~@var";
  .flowName{
    font-size: 20px;
    line-height: 26px;
    color: @blackTitle;
    border: 0;
    width: 100%;
    font-weight: 500;
    padding: 0 0 24px;
  }
  .asset-info{
    border: 1px solid @sep;
    border-radius:4px;
    width: 672px;
    margin: 24px 0;
    .asset-info-header{
      background-color: @bg;
      color: @blackTitle;
      font-weight: 500;
      padding: 11px 24px;
      line-height: 22px;
      border-bottom: 1px solid @sep;
    }
    .info-box{
      padding: 16px 24px;
      .cont,.cont-line2{
        max-width: 250px;
      }
    }
  }
  .info-box{
    .info-box-title{
      margin-bottom: 12px;
    }
    .cont,.cont-line2{
      max-width: 270px;
    }
  }
  .line{
    width: 624px;
    background-color: @sep;
    height: 1px;
    margin: 0 auto;
  }
  .file-list{
    padding-left: 0;
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
/*      <!--.timeline-avatar.admin {-->
      <!--  background:@red;-->
      <!--}-->*/
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
