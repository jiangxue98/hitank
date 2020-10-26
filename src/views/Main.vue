<template>
  <a-layout id="hitank-main-frame">
    <a-layout-sider class="hitank-menu-sider" width="256px"
      :trigger="null"
      collapsible
      v-model="collapsed"
    >
      <div class="main-frame-logo" @click="goToView('/index')">
        <img v-if="!collapsed" src="@img/logo.png" />
        <img v-else src="@img/smallLogo.png" />
      </div>
      <hitank-menu :selectedKeys="selectedKeys" ref="hitankMenu"></hitank-menu>
    </a-layout-sider>
    <a-layout class="ta-l">
      <hitank-header ref="header">
        <a-icon
          slot="collapseIcon"
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="handleCollapse"
        />
      </hitank-header>
      <a-layout-content class="main-frame-content">
        <hitank-breadcrumb :showTitle="isShowHeaderTitle" :showTitleBg="isShowHeaderBg"></hitank-breadcrumb>
        <!--        <keep-alive>-->
        <router-view class="relative" :key="$route.fullPath" :class="isShowHeaderTitle?'main-container':''" :collapsed="collapsed"></router-view>
<!--        </keep-alive>-->
        <!--尾部【根据现有需求暂去掉】-->
<!--        <hitank-footer></hitank-footer>-->
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import HitankMenu from '@comp/menu/HitankMenu'
import HitankHeader from '@comp/header/HitankHeader'
import HitankBreadcrumb from '@comp/header/HitankBreadcrumb'
import HitankFooter from '@comp/footer/HitankFooter'
import global from '@util/global'

export default {
  components: {
    HitankBreadcrumb,
    HitankMenu,
    HitankFooter,
    HitankHeader
  },
  mounted () {
  },
  data () {
    return {
      collapsed: false,
      isShowHeaderTitle: true,
      isShowHeaderBg: false,
      selectedKeys: []
    }
  },
  methods: {
    goToView (url) {
      this.$router.push({path: url})
    },
    handleCollapse () {
      let width = !this.collapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 256px)'
      this.$refs.header.width = {width}
      this.collapsed = !this.collapsed
    }
  },
  beforeRouteEnter (to, from, next) {
    let isShow = global.NO_TITLE_VIEWS.includes(to.name)
    let showBg = global.NO_TITLE_BG_VIEWS.includes(to.name)
    next(vm => {
      vm.isShowHeaderTitle = !isShow
      vm.isShowHeaderBg = showBg
    })
  },
  watch: {
    $route (to, from) {
      this.selectedKeys = [to.path]
      let isShow = global.NO_TITLE_VIEWS.includes(to.name)
      let showBg = global.NO_TITLE_BG_VIEWS.includes(to.name)
      this.isShowHeaderTitle = !isShow
      this.isShowHeaderBg = showBg
    }
  }
}
</script>

<style lang="less">
  @import "~@var";
  #hitank-main-frame .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
  }

  #hitank-main-frame .trigger:hover {
    color: @theme;
  }

  #hitank-main-frame {
    .main-frame-logo {
      height: 65px;
      margin: auto 0;
      padding: 22px 0;
      border-bottom: 1px solid #203145;
      cursor: pointer;
    }
    .main-frame-content{
      /*min-height: 500px;*/
      height: calc(100vh - 64px);
      /*padding: 16px 24px;*/
      margin-top: 64px;
      /*padding-bottom: 56px;*/
      padding-bottom: 16px;
      overflow-y: auto;
      scrollbar-color: transparent transparent;
      scrollbar-arrow-color: #f0f2f5;
      scrollbar-base-color: #f0f2f5;
      scrollbar-track-color: #f0f2f5;
      scrollbar-shadow-color: #f0f2f5;
      .main-container{
        padding: 0 24px 24px;
        position: relative;
      }
    }
    .hitank-menu-sider{
      text-align: center;
      .ant-layout-sider-children{
        background-color: #293F56;
      }
    }
  }
</style>
