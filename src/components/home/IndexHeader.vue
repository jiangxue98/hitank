<template>
  <div>
    <div class="hitank-home-header" :class="shadow?'shadow':''">
      <div class="hitank-home-header-content">
        <ul class="clearfix left fl">
          <li class="header-item" @click="goToView('/index')"><img class="logo" src="@img/homeLogo.png"></li>
          <a-dropdown class="header-item">
            产品
            <div slot="overlay" class="hitank-header-down-content clearfix" style="left: -144px">
              <ul class="col fl" v-for="(item,index) in productList" :key="index">
                <li class="title"  @click="goTo(item)">
                  <a-icon :type="item.icon"></a-icon>{{item.title}}
                </li>
                <li class="col-content" :class="item.href || itemChild.href?'pointer':''" v-for="(itemChild,index) in item.children" :key="index" @click="goTo(itemChild,item)">
                  {{itemChild.title}}
                </li>
              </ul>
            </div>
          </a-dropdown>
          <li class="header-item none">解决方案</li>
          <li class="header-item" @click="goToView('/building')">服务支持</li>
        </ul>
        <ul class="clearfix right fr">
          <hitank-header-user v-show="isLogin" style="line-height: 39px" @getUserInfo="getUserInfo"></hitank-header-user>
          <a-button v-show="!isLogin" class="btn-theme" @click="goToView('/login')">使用工号登录</a-button>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import HitankHeaderUser from '@comp/header/HitankHeaderUser'
import util from '@util/util'
export default {
  components: {HitankHeaderUser},
  props: {
    shadow: Boolean,
    default () {
      return false
    }
  },
  data () {
    return {
      productList: [],
      isLogin: false
    }
  },
  mounted () {
    this.productList = [
      {title: '数字资产管理', icon: 'appstore', href: '/assetList_2', children: [{title: '自定义分类', href: ''}, {title: '有效期监测提醒', href: ''}, {title: '资产增删改查', href: ''}, {title: '操作动态标记', href: ''}, {title: '自定义字段', href: ''}]},
      {title: '组织管理', icon: 'cluster', href: '/deptManage', children: [{title: '小微管理', href: '/deptManage'}, {title: '用户管理', href: '/userList'}, {title: '角色权限管理', href: '/roleList'}, {title: '菜单管理', href: '/menuManage'}]},
      {title: 'BPM', icon: 'file-done', href: '/workflowList', children: [{title: '资产注册流', href: ''}, {title: '资产使用流', href: ''}, {title: '资产变更流', href: ''}, {title: '资产注销流', href: ''}, {title: '多元流程节点', href: ''}]},
      {title: '更多', icon: 'plus', children: [{title: '敬请期待', href: ''}]}
    ]
  },
  methods: {
    getUserInfo (user) {
      if (user && user.userName) {
        this.isLogin = true
      }
    },
    goToView (url) {
      this.$router.push({path: url})
    },
    goTo (item, parentItem) {
      if (item && !util.isEmpty(item.href)) {
        this.$router.push({path: item.href})
      } else if (parentItem && !util.isEmpty(parentItem.href)) {
        this.$router.push({path: parentItem.href})
      }
    }
  },
  watch: {
    shadow (newV, oldV) {
    }
  }
}
</script>
<style scoped lang="less">
  @import "~@var";
.hitank-home-header{
  position: fixed;
  top: 0;
  width: 100%;
  background-color: @fff;
  .hitank-home-header-content{
    width: 1130px;
    height: 80px;
    margin: 0 auto;
    background-color: @fff;
  }
  .left{
    margin: 0;
    padding: 20px 0 0 0 ;
    .header-item{
      float: left;
      margin-right: 28px;
      line-height: 20px;
      cursor: pointer;
      padding: 10px;
      a{
        color: initial;
      }
      .logo{
        width: 86px;
        margin-right: 10px;
      }
    }
  }
  .right {
    padding-top: 20px;
    .btn-theme {
      height: 40px;
    }
  }
}
  .hitank-home-header.shadow {
    box-shadow:0px 0px 16px 0px rgba(0,0,0,0.1);
  }
  .header-down-container {
    position: fixed;
    top: 80px;
    width: 100%;
  }
.hitank-header-down-content {
  width: 1638px;
  height: 222px;
  margin: 0 auto;
  position: relative;
  top: 16px;
  padding: 32px 300px;
  background-color: @fff;
  .col{
    margin-right: 130px;
    .title {
      color: @blackTitle;
      font-size: 14px;
      line-height: 22px;
      margin-bottom: 16px;
      .anticon{
        color: @theme;
        margin-right: 3px;
      }
    }
    .col-content{
      font-size: 12px;
      color: @blackBody;
      list-style: inside;
      margin-bottom: 8px;
      a {
        color: inherit;
      }
    }
  }
}
</style>
