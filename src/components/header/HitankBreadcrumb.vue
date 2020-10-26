<template>
  <div class="hitank-breadcrumb relative" :style="!showTitle&&showTitleBg?'background-color: #fff':''">
<!--    <a-breadcrumb class="hitank-breadcrumb">-->
<!--      <a-breadcrumb-item><a-icon type="home"></a-icon></a-breadcrumb-item>-->
<!--      <a-breadcrumb-item v-for="(item,index) in nav " :key="index">{{item}}</a-breadcrumb-item>-->
<!--    </a-breadcrumb>-->
<!--    <div class="bc-title"><slot></slot></div>-->
    <router-link class="home-link" to="/"><a-icon class="btn-icon-grey" type="home" theme="filled"/> <span class="grey">/</span> </router-link>
    <a-breadcrumb :routes="routes" style="margin-left: 36px">
      <template slot="itemRender" slot-scope="{route, params, routes, paths}">
        <span v-if="routes.indexOf(route) === routes.length - 1">
          {{route.meta.title}}
      </span>
<!--        <router-link v-else :to="`${basePath}/${paths.join('/')}`">-->
        <router-link v-else :to="route.path">
          <template v-if="route.meta.title == '首页'"><a-icon type="home"></a-icon></template>
          <template v-else class="btn-icon-grey">{{route.meta.title}}</template>
        </router-link>
      </template>
    </a-breadcrumb>
    <div class="bc-title" v-if="showTitle">{{$route.meta.title}}</div>
  </div>
</template>

<script>
export default {
  props: {
    showTitle: {
      type: Boolean,
      default () {
        return true
      }
    },
    showTitleBg: {
      type: Boolean,
      default () {
        return false
      }
    }
    // nav: Array
  },
  components: {},
  data () {
    return {
    }
  },
  computed: {
    routes () {
      return this.$route.matched
    }
  },
  mounted () {
  },
  methods: {}
}
</script>

<style scoped lang="less">
  @import "~@var";
  .btn-icon-grey{
    color: @blackText;
  }
  .btn-icon-grey:hover{
    color: @blackTextTra;
  }
  .hitank-breadcrumb{
    padding: 16px 24px 0 24px;
    min-width: 1069px;
  }
  .hitank-breadcrumb .ant-breadcrumb a:extend(.btn-icon-grey){}
  .hitank-breadcrumb .ant-breadcrumb a:hover:extend(.btn-icon-grey:hover){}
  .home-link:extend(.btn-icon-grey){
    position: absolute;
    left: 24px;
    top: 16px;
    height: 21px;
    line-height: 21px;
    .grey{
      margin-right: 8px;
      color: @blackText;
    }
  }
  .bc-title{
    color: @blackTitle;
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    margin-top: 16px;
    margin-bottom: 24px;
  }
</style>
