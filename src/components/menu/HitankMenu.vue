<template>
  <div id="hitank-menu" class="ta-l">
    <a-menu
      mode="inline"
      theme="dark"
    >
      <!--:defaultSelectedKeys=defaultSelectedKeys
      :defaultOpenKeys=defaultOpenKeys-->
      <!--:selectedKeys="selectedKeys"-->
      <template v-for="item in list">
        <a-menu-item v-if="item.children.length == 0 && item.isShow == 1" :key="item.href" @click="handleMenuClick(item)">
          <a-icon :type="item.icon" />
          <span>{{item.name}}</span>
        </a-menu-item>
        <sub-menu v-else :menu-info="item" :key="item.href"/>
      </template>
    </a-menu>
  </div>
</template>

<script>
import SubMenu from './SubMenu'
import {getMenuList} from '@api/workbench'
import eventBus from '@/store/eventBus'

export default {
  props: {
    selectedKeys: {
      type: Array,
      default () {
        return [this.$route.path]
      }
    }
  },
  components: {
    'sub-menu': SubMenu
  },
  data () {
    return {
      defaultOpenKeys: [],
      defaultSelectedKeys: [],
      list: []
    }
  },
  created () {
    eventBus.$on('refreshMenu', args => {
      this.getMenuList()
    })
    /* 机制修改为href不可重复，用href作为key判断选中 */
    this.defaultSelectedKeys = [this.$route.path]
    // todo 菜单默认展开 要找父级href赋值给defaultOpenKeys
    this.defaultOpenKeys = [this.$route.path]
    /*    if (localStorage.getItem('menuInfo')) {
      let menuList = JSON.parse(localStorage.getItem('menuInfo'))
      for (let i of menuList) {
        if (this.$route.path === i.href) {
          this.defaultOpenKeys = [i.id]
          break
        }
      }
    } */
  },
  methods: {
    getMenuList () {
      let _this = this
      getMenuList().then(function (data) {
        _this.list = data.data
      }).catch(function (error) {
        console.log(error)
        // _this.$Message.error(error)
      })
    },
    handleMenuClick (item) {
      console.log('menu=' + item.title)
    }
  },
  mounted () {
    this.getMenuList()
  }
}
</script>
<style lang="less">
  @import "~@var";
  #hitank-menu {
    height: calc(100vh - 64px);
    overflow-y: auto;
    scrollbar-color: transparent transparent;
    scrollbar-arrow-color: #1F364B;
    scrollbar-base-color: #1F364B;
    scrollbar-track-color: #1F364B;
    scrollbar-shadow-color: #1F364B;
    .ant-menu-inline-collapsed .ant-menu-submenu-open{
      color: @theme;
    }
    .ant-menu-dark {
      background-color: #293F56;
      .ant-menu-submenu .ant-menu-submenu-title{
        height: 52px;
        line-height: 52px;
        box-sizing: border-box;
      }
      .ant-menu-sub{
        background-color: #1F364B;
        box-shadow: none;
        .ant-menu-item{
          height: 40px;
          line-height: 40px;
          box-sizing: border-box;
          margin: 0;
          cursor: default;
        }
        .ant-menu-item:hover{
          background-color: #1D3245;
        }
        .ant-menu-item:hover a{
          color: @fff;
        }
        a{
          display: block;
          color: #B4BBC4;
        }
        a:focus{
          text-decoration: none;
        }
        .ant-menu-item:after {
          display: block;
          height: 40px;
          width: 4px;
          top: 0;
          position: absolute;
          right: 0;
          background: -webkit-gradient(linear, left top, right top, from(@theme), to(@theme));
          background: linear-gradient(to right, @theme, @theme);
        }
      }
    }
    .ant-menu.ant-menu-dark .ant-menu-item-selected, .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected{
      background-color: #1D3245;
      a{
        color: #fff;
      }
    }
    .iconfont{
      vertical-align: bottom;
    }
    .ant-menu-submenu-vertical > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:after, .ant-menu-submenu-vertical-left > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:after, .ant-menu-submenu-vertical-right > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:after, .ant-menu-submenu-inline > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:after, .ant-menu-submenu-vertical > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:before, .ant-menu-submenu-vertical-left > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:before, .ant-menu-submenu-vertical-right > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:before, .ant-menu-submenu-inline > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:before{
      background: -webkit-gradient(linear, left top, right top, from(@theme), to(@theme));
      background: linear-gradient(to right, @theme, @theme);
    }
  }
  #hitank-menu::-webkit-scrollbar { /* 槽宽 */
    width: 6px;
    height: 4px;
  }
  #hitank-menu::-webkit-scrollbar-thumb { /* 拖动条 */
    background-color: rgba(1,1,1,.1);
    border-radius: 6px;
  }
  #hitank-menu::-webkit-scrollbar-track { /* 背景槽 */
    background-color: #1F364B;
    border-radius: 6px;
  }
</style>
