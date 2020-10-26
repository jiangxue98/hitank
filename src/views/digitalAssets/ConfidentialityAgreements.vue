<template>
  <div>
    <div>
      <a-modal
        width="775px"
        title="保密协议签署"
        :visible="showModal"
        @cancel = "handleCancel"
        :destroyOnClose = true
        :footer="null"
        :closable= true
      >
        <div class="page">
          <div class="modal-content">
            <div class="sign-box">
              <span class="bold">签订日期：<span class="card-date">{{date}}</span></span>
              <p class="bold" style="display: inline-block;margin-left: 190px">
                电子签名：
                <img width="99px" height="45px" :src="src"></p>
            </div>
            <div class="agreementBody" ref="agreementContent">
              <span class="page-head">HC-MIS-04</span>
              <span class="page-no">第1页，共2页</span>
              <p class="page-title">保密协议</p>
              <p class="page-main">
                <span class="bold">保密协议的主体: </span>
                <span>
            一方为文化产业数字化重生平台hitank数字资产管理小微（以下简称“hitank小微”）；另一方为hitank小微授权的账号使用人（以下称“保密人”）。
            </span>
              </p>
              <span class="bold">保密协议范围: </span>
              <span>
            hitank小微所管理的所有图片视频网站资源的下载账号和密码及上述账号或存储介质内的一切数据资料、代码或文件等内容。
          </span>
              <p class="bold page-margin">协议内容：</p>
              <p class="bold page-margin">
                一、hitank小微已经提醒保密人仔细阅读以下条款，保密人明确同意以下条款并知悉各条款的真实意思，并自愿在以下会签处签署本保密协议。
              </p>
              <p class="bold content-title">
                二、保密义务
              </p>
              <p class="page-content content-title">
                1.保密人同意，任何保密信息的获取和披露的目的仅为按照项目计划达到项目目标，不能以任何方式用于其他任何目的。保密人同意，在相关账号密码使用过程中，无论保密人以口头、电子或书面形式在保密人之间，或经过许可后向必要的第三方沟通、传递相关信息时，均需要通过邮箱发送并抄送hitank小微。如保密人向必要的第三方传账号密码相关信息，而该第三方未签署本协议，则保密人有义务通过邮件内容向该第三方提出本条所述的保密要求。保密人获悉了hitank小微所提供的账号密码内容而没有在强调保密条款下向使用向第三方表述的，视为泄露本协议规定的保密范围中的内容。
              </p>
              <p class="page-content">
                2.保密人不得在任何时候，以任何形式透露、披露、沟通、泄漏、使用、抄袭、复制或者盗用全部或者部分的保密信息，不论为其自己，或者为任何其他人士或者实体。
              </p>
              <p class="bold content-title">
                三、赔偿责任
              </p>
              <p class="page-content content-title">
                保密人同意如因其违反以上约定披露、使用或使保密信息丧失保密性，负有泄密责任的保密义务人（下称责任人）应当按照下列顺序赔偿：
              </p>
              <p class="page-content content-title">
                1.按比例赔偿因此违规操作导致的损失；
              </p>
              <p class="page-content content-title">
                2.前项损失数额无法确认的，责任人应按照保密人或者相关第三方而获取的利益折算成货币数额向文化产业平台支付赔偿金。
              </p>
              <p class="page-content content-title">
                3.损失数额无法计算也无法折算第三方获利金额的，以不低于人民币10万元计算。
              </p>
              <p class="page-main">
                责任人造成的损失数额如达到犯罪标准的，公司将依法移交国家公安机关处理。
              </p>
              <p class="bold content-title">
                四、期限
              </p>
              <p class="page-content">
                属于本项目内容的保密义务有效期为hitank小微提供账号密码一年内；在hitank小微回收账号1年后保密人仍应保持审慎的义务。
              </p>
              <p class="bold content-title">
                五、管辖
              </p>
              <p class="page-content">
                如出现争议，或发生的其他财产权益纠纷，双方应协商解决；协商不成时，本协议也可作为法律允许范围内的辅助工具，支持双方通过法律途径解决相关纠纷。
              </p>
              <p class="bold content-title>">
                六、生效
              </p>
              <p class="page-content">
                本协议由各方签字后生效。与本协议相关的项目材料为本协议的附件。本协议及其附件（如果有的话）除填写必需的协议签约主体、签约人、签约时间或已有的空格外，任何涂改、删除、增添均无效。
              </p>
              <p class="bold content-title>">
                七、本协议中约束的账号密码范围
              </p>
              <p class="page-content">
                本协议所指的账号密码指保密人签订本协议时和以后通过hitank小微获得的所有账号密码。对于签订本协议以后参加的项目，如果hitank小微与保密人没有另行签订新的保密协议，则仍受本协议的约束。
              </p>
              <p class="bold content-title>">
                八、其他约束条款
              </p>
              <p class="page-content" ref="agree">
                其他约束条款及规定详见《文化平台共享账号使用说明和风险防范措施》
              </p>
              <p class="sign">签字：</p>
            </div>
          </div>
          <div class="footer">
            <a-checkbox style="margin-top: 5px" @change="onChange">已阅读并同意签署协议</a-checkbox>
            <a-button v-show="disbaledok" disabled class="ok">确认</a-button>
            <a-button v-show="clickok" class="ok clickOk" @click="handleOk">确认</a-button>
            <a-button class="cancel" @click="handleCancel">取消</a-button>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import {getUserstamp, saveAgreement} from '../../js/api/digitalAssets'
export default {
  // name: 'ConfidentialityAgreements'
  data () {
    return {
      disbaledok: true,
      clickok: false,
      date: '',
      dateStr: '',
      src: '',
      pramas: ''
    }
  },
  props: {
    showModal: {
      type: Boolean,
      required: false
    },
    params: {
      type: Object,
      required: false
    }
  },
  methods: {
    handleOk (e) {
      // this.showModal = false
      let _this = this
      this.clickok = false
      this.disbaledok = true
      let params = {}
      if (!_this.src) {
        _this.$message.error('请先在inoffice或iportal系统维护签名')
        _this.clickok = true
        _this.disbaledok = false
        return
      }
      params.assetsItemId = this.params.id
      params.assetsItemName = this.params.name
      params.userTimeDown = this.dateStr
      params.signStamp = this.src
      // params.signText = this.$refs.agreementContent.innerHTML
      saveAgreement(params).then(function (data) {
        _this.clickok = true
        _this.disbaledok = false
        if (data.success) {
          _this.$emit('close', 'openDetail&' + _this.params.id)
          console.log('ok')
        }
      }).catch(function (error) {
        _this.disbaledok = false
        console.log('签章报错：' + error)
      })
    },
    handleCancel (e) {
      this.visible = false
      this.clickok = false
      this.disbaledok = true
      this.$emit('close')
    },
    onChange (e) {
      let check = e.target.checked
      if (check === true) {
        this.clickok = true
        this.disbaledok = false
      } else {
        this.clickok = false
        this.disbaledok = true
      }
    }
  },
  watch: {
    showModal (newV, oldV) {
      var _this = this
      if (newV === true) {
        var d = new Date()
        let month = d.getMonth() + 1
        this.date = d.getFullYear() + '年' + month + '月' + d.getDate() + '日'
        this.dateStr = d.getFullYear() + '-' + month + '-' + d.getDate()
        getUserstamp().then(function (data) {
          if (data.success) {
            _this.src = data.data.signStamp
          }
        }).catch(function (error) {
          console.log('获取数据报错：' + error)
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../css/var.less";
  .footer{
    width:100%;
    border-top: 1px solid rgba(0,0,0,0.1);
    padding-top: 12px;
  }
  .ok{
    float: right;
  }
  .clickOk{
    color: @fff;
    background: @theme;
  }
  .cancel{
    float: right;
    margin-right: 8px;
  }
  .modal-content{
    padding: 0 125px;
    font-size: 11px;
    line-height: 22px;
    height:400px;
    overflow-y: scroll;
    margin: 0 -20px;
    position: relative;
  }
  .page-head{
    display: inline-block;
    width: 300px;
    font-size: 2px;
    font-weight: bold;
  }
  .page-title{
    text-align:center;
    border-top: @blackTitle 1px solid;
    font-weight: bold;
    font-size: 20px;
    padding-top: 80px;
  }
  .page-main{
    text-align: center
  }
  .page-no{
    font-size: 2px;
    font-weight: bold;
  }
  .bold{
    font-weight: bold;
  }
  .page-margin{
    margin: 20px 0;
  }
  .page-content{
    text-indent:2em
  }
  .content-title{
    margin: 0;
  }
  .sign{
    text-decoration: underline;
  }
  .page{
    position: relative;
  }
  .page-card{
    position: absolute;
    width: 274px;
    height: 96px;
    box-shadow:0px 0px 8px 0px rgba(0,0,0,0.1);
    background:@fff;
    border-radius:8px;
    top:365px;
    left:476px;
    padding: 17px;
    font-size:2px;
    line-height:27px;
  }
  .card-date{
    font-size:12px;
    font-weight:400;
    color: @blackBody;
  }
  .sign-box{
    position: absolute;
    top: 38px;
  }
</style>
