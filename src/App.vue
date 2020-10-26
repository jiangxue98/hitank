<template>
  <a-locale-provider :locale="locale">
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  name: 'App',
  provide () { // 父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      locale: zhCN,
      isRouterAlive: true // 控制视图是否显示的变量
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false // 先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true // 再打开
      })
    }
  }
}
</script>

<style lang="less">
@import 'ant-design-vue/dist/antd.css';
@import '~@style/base.less';
@import '~@style/common.less';
body{
  overflow: hidden;
}
</style>
