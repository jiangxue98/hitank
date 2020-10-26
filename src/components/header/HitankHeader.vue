<template>
  <div class="hitank-header">
    <a-layout-header class="ta-l" :style="width">
      <slot name="collapseIcon"></slot>
      <hitank-header-user></hitank-header-user>
    </a-layout-header>
  </div>
</template>

<script>
import HitankHeaderUser from './HitankHeaderUser'
export default {
  components: {HitankHeaderUser},
  data () {
    return {
      width: {width: 'calc(100vw - 256px)'}
    }
  }
}
</script>

<style scoped lang="less">
  .hitank-header .ant-layout-header{
    padding-right: 24px;
    padding-left: 0;
    background-color: #fff;
    box-shadow:0px 1px 4px 0px rgba(0,21,41,0.12);
    position: fixed;
    top: 0;
    /*width: calc(100vw - 256px);*/
    z-index: 99;
  }
</style>
