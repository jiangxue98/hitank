<template>
  <div>
    <index-header :shadow="shadow"></index-header>
    <router-view  id="homeContent"></router-view>
  </div>
</template>
<script>
import IndexHeader from '@comp/home/IndexHeader'
export default {
  components: {IndexHeader},
  data () {
    return {
      shadow: false
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll, true) // 监听（绑定）滚轮滚动事件
  },
  methods: {
    handleScroll: function () {
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      // 设备/屏幕高度
      let scrollObj = document.getElementById('homeContent') // 滚动区域
      if (scrollObj) {
        let scrollTop = scrollObj.scrollTop // div 到头部的距离
        let scrollHeight = scrollObj.scrollHeight // 滚动条的总高度
        // 滚动条到底部的条件
        if (scrollTop + clientHeight === scrollHeight) {
          // div 到头部的距离 + 屏幕高度 = 可滚动的总高度
        }
        // console.log('scrollTop=' + scrollTop)
        // console.log('scrollHeight=' + scrollHeight)
        if (scrollTop > 80) {
          this.shadow = true
        } else {
          this.shadow = false
        }
      }
    }
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.handleScroll) //  离开页面清除（移除）滚轮滚动事件
  }
}
</script>
<style lang="less" scoped>
  #homeContent{
    margin-top: 80px;
    overflow: auto;
    height: 100vh;
  }
</style>
