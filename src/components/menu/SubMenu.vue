<template functional>
  <a-sub-menu class="hitank-menu-sub" :key="props.menuInfo.href">
    <span slot="title">
      <a-icon :type="props.menuInfo.icon" />
      <span>{{ props.menuInfo.name }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
<!--      <a-menu-item v-if="!item.children" :key="item.key" @click = "handleMenuClick(item.children)">-->
      <a-menu-item class="menuItem" @click="titleClick" v-if="item.children.length == 0 && item.isShow == 1" :key="item.href" >
        <span class="menu-item-text"><router-link class="sub-a" :to="item.href">{{ item.name }}</router-link></span>
<!--        <span :trigger="['titleClick']">{{ item.name }}</span>-->
      </a-menu-item>
      <sub-menu v-else :key="item.href" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: ['menuInfo'],
  methods: {
    titleClick (item) {
      console.log('submenu=' + item.name)
    }
  },
  render: function (createElement, context) {
    function clic (item) {
      console.log('submenu=' + item.name)
    }
    return createElement(
      clic(),
      {
        props: {
          data: context.props.data
        }
      },
      context.children
    )
  }
}
</script>
<style lang="less">
  @import '~@var';
  .ant-menu.ant-menu-dark .ant-menu-submenu-popup, .ant-menu-submenu-popup.ant-menu-dark{
    .ant-menu-sub{
      background: #1F364B;
      padding: 8px 0;
    }
    .ant-menu-item{
      padding: 0;
      margin: 0;
    }
    .ant-menu-item:active {
      background: #1A2E3F;
      .menu-item-text a {
        color: @theme;
      }
    }
    .ant-menu-item:hover {
      background: #1A2E3F;
      .menu-item-text a {
        color: @fff;
      }
    }
    .ant-menu-item:focus {
      outline: none;
    }
    .ant-menu-item-selected{
      background: #1A2E3F;
      .menu-item-text a {
        color: @theme;
      }
    }
    .menu-item-text a{
      display: block;
      width: 100%;
      padding: 8px 16px;
      line-height: 22px;
      color: #B4BBC4;
    }
  }
</style>
