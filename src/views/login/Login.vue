<template>
  <div class="container">
    <vue-particles
      color="#888"
      :particleOpacity="0.7"
      :particlesNumber="30"
      shapeType="circle"
      :particleSize="6"
      linesColor="#979797"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      class="lizi"
    >
    </vue-particles>
<!--    <img class="l1" src="@img/login/l1.png"/>-->
<!--    <img class="l2" src="@img/login/l2.png"/>-->
<!--    <img class="r1" src="@img/login/r1.png"/>-->
<!--    <img class="r2" src="@img/login/r2.png"/>-->
    <img class="left" src="@img/login/login_left.png"/>
    <img class="right" src="@img/login/login_right.png"/>
    <div class="login-form">
      <div class="pad-t-20" style="z-index: 1"><img class="logo" src="@img/login/loginLogo.png"/> </div>
      <div class="title">开启数字资产管理新模式</div>
      <a-form
        :form="form"
        @submit="handleSubmit"
      >
        <a-form-item>
          <a-input
            @change="nameChange"
            v-decorator="[
            'userName',
            { rules: [{ required: true, message: '请输入用户名' }] }
          ]"
            placeholder="请输入用户名"
          >
            <a-icon
              slot="prefix"
              type="user"
              style="color: rgba(0,0,0,.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item style="margin-bottom:0">
          <a-input
            @change="pwdChange"
            v-decorator="[
            'password',
            { rules: [{ required: true, message: '请输入密码' }] }
          ]"
            type="password"
            placeholder="请输入密码"
            autocomplete="autocomplete"
          >
            <a-icon
              slot="prefix"
              type="lock"
              style="color: rgba(0,0,0,.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <div class="clearfix">
            <a-checkbox
              class="fl"
              v-decorator="[
            'remember',
            {
              valuePropName: 'checked',
              initialValue: true,
            }
          ]"
            >
              自动登录
            </a-checkbox>
            <a
              class="login-form-forgot fr"
              @click="forgetClick"
            >
              忘记密码
            </a>
          </div>
          <div class="forgot-box" v-if="showForgot">
            <div class="fl"><a-icon class="icon themeColor" theme="filled" type="info-circle" />请到海尔信息门户系统进行修改</div>
            <a class="themeColor fr pointer" target="_blank" @click="editPwd" href = 'javascript:void(0)'>马上修改</a>
          </div>

          <a-button
            type="primary"
            html-type="submit"
            class="btn-theme"
            :class="btnTheme?'':'btn-grey'"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
      <div class="other-box">
        <div class="text">其他方式登录</div>
        <a-tooltip placement="top">
          <template slot="title">
            <span>hipass登录</span>
          </template>
          <a-button class="emptyBtnCss" @click="handleOtherBtn('hipass')">
            <img src="@img/login/hipass.png" />
          </a-button>
        </a-tooltip>
      </div>
    </div>
<!--    <hitank-footer></hitank-footer>-->
  </div>
</template>

<script>
import { login, getUserInfo, getHilookLoginUrl } from '@api/login'
import {getMenuList} from '@api/workbench'
import store from '@/store'
import HitankMenu from '@comp/menu/HitankMenu'
import HitankFooter from '@comp/footer/HitankFooter'
import util from '@util/util'

let hipassUrl
export default {
  components: {HitankMenu, HitankFooter},
  beforeCreate () {
    let _this = this
    let params = util.getUrlParam('state')
    if (params === '0') {
      // _this.$message.info('无此用户信息，请联系管理员注册')
      this.$router.push({path: '/reigterTip'})
    }
    this.form = this.$form.createForm(this, {onValuesChange: (props, values) => {
      _this.btnTheme = true
    }})
  },
  mounted () {
    this.getHilookLoginUrl()
  },
  data () {
    return {
      lock: false,
      btnTheme: false,
      showForgot: false
    }
  },
  methods: {
    nameChange (value) {
      // this.btnTheme = true
    },
    pwdChange (value) {
      // this.btnTheme = true
    },
    onValuesChange (value) {
    },
    getHilookLoginUrl () {
      getHilookLoginUrl().then((data) => {
        hipassUrl = data.data
      })
    },
    handleSubmit (e) {
      let _this = this
      e.preventDefault()
      if (this.lock === true) {
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.lock = true
          const { userName, password } = values
          login({userName, password}).then((data) => {
            _this.lock = false
            if (data.success) {
              let roleName = {roleName: data.data.role}
              store.commit('setRoleInfo', roleName)
              let {role} = data.data
              getUserInfo().then((user) => {
                let {userName, categoryRelation, name} = user.data
                let userInfo = {
                  userName,
                  name,
                  userId: user.data.id,
                  role,
                  categoryRelation
                }
                localStorage.setItem('userInfo', JSON.stringify(userInfo))
                // _this.saveMenu(() => {
                // 登录后跳转原页面
                let currentRouter = _this.$router.currentRoute
                if (currentRouter.name === 'login' && currentRouter.query && currentRouter.query.redirectUrl) {
                  // document.cookie = 'mame=123'
                  _this.$router.push({ path: decodeURI(currentRouter.query.redirectUrl) })
                } else {
                  // console.log('login view else')
                  _this.$router.push('/')
                }
                // })
              })
            }
          }).catch(function (error) {
            _this.lock = false
            console.log(error)
            // _this.$Message.error(error)
          })
        }
      })
    },
    forgetClick () {
      this.showForgot = true
    },
    editPwd () {
      let url = 'https://portal.haier.com/web/reSetPassWord.jsp?cn=' + this.form.getFieldValue('userName')
      window.open(url, '_blank')
    },
    handleOtherBtn (id) {
      let url
      if (id === 'hipass') {
        url = hipassUrl
      }
      window.open(url, '_self')
    },
    /* 暂废弃 */
    saveMenu (cb) {
      getMenuList().then(function (data) {
        if (data.success) {
          localStorage.setItem('menuInfo', JSON.stringify(data.data))
        }
        cb()
      }).catch(function (error) {
        console.log(error)
        // _this.$Message.error(error)
      })
    }
  }
}
</script>
<style scoped lang="less">
  @import "~@var";
  .container{
    background-color: #F9F9F9;
    position: relative;
    height: 100vh;
    width: 100vw;
    overflow: auto;
    .lizi {
      position: absolute;
      top: 0;
      width: 100%;
    }
    .left{
      position: fixed;
      left: 0;
      top:0;
      width: 336px;
    }
    .right{
      position: fixed;
      right: 0;
      bottom:0;
      height: 163px;
    }
    /*.l1{*/
    /*  position: absolute;*/
    /*  left: 174px;*/
    /*  top:71px;*/
    /*  width: 236px;*/
    /*}*/
    /*.l2{*/
    /*  position: absolute;*/
    /*  left: 5.27%;*/
    /*  bottom: 7.2%;*/
    /*  width: 151px;*/
    /*}*/
    /*.r1{*/
    /*  position: absolute;*/
    /*  right: 274px;*/
    /*  top: 71px;*/
    /*  width: 71px;*/
    /*}*/
    /*.r2{*/
    /*  position: absolute;*/
    /*  right: 1.71%;*/
    /*  bottom: 12.13%;*/
    /*  width: 319px;*/
    /*}*/
  }
  .login-form {
    min-height: 405px;
    /*height: calc(100vh - 80px);*/
    height: calc(100vh - 80px);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    .ant-form-item:last-of-type{
      margin-bottom: 20px;
    }
    .logo{
      width:230px;
      margin-bottom: 25px;
    }
    .title{
      width:389px;
      height:20px;
      font-size:12px;
      font-weight:400;
      color:@blackText;
      line-height:20px;
      letter-spacing:23px;
      margin-bottom: 24px;
      left: 11px;
      position: relative;
    }
    .ant-form {
      width: 368px;
      margin: 0 auto;
      .ant-input-affix-wrapper{
        height: 40px;
        font-size: 16px;
      }
    }
    .btn-theme{
      width: 368px;
      height: 40px;
      font-size: 16px;
      margin-top: 13px;
    }
    .btn-theme.btn-grey{
      background-color: @blackIcon;
      border-color: @blackIcon;
    }
    .ant-input-affix-wrapper .ant-input:not(:first-child) {
      padding-left: 35px;
    }
    .forgot-box{
      width:368px;
      height:60px;
      background:rgba(55,182,154,0.1);
      border-radius:4px;
      border: 1px solid #96D5C7;
      color: @blackBody;
      margin-bottom: 24px;
      padding: 0 16px;
      margin-top: 1px;
      .icon{
        margin-right: 8px;
      }
    }
  }
  .other-box {
    text-align: center;
    color: @blackText;
    font-size: 12px;
    img {
      width: 40px;
      cursor: pointer;
    }
    .text {
      margin: 10px 0 16px;
      position: relative;
      width: 368px;
    }
    .text:before {
      content: '';
      width: 135px;
      border-bottom: 1px solid @sep;
      display: block;
      position: absolute;
      left: 0;
      top: 5px;
    }
    .text:after {
      content: '';
      width: 135px;
      border-bottom: 1px solid @sep;
      display: block;
      position: absolute;
      right: 0;
      top: 5px;
    }
    .emptyBtnCss{
      border: 0;
      background: inherit;
      width: 40px;
      height: 40px;
      padding: 0;
    }
    .emptyBtnCss:not([disabled]):active {
      border: 0;
      background: inherit;
    }
  }
</style>
