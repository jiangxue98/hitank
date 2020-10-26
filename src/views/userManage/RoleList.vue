<!--权限管理-->
<template>
  <div class="right-list">
<!--    <hitank-breadcrumb :nav="['工作台2','工作台3']">角色管理</hitank-breadcrumb>-->
    <a-row class="bgWhite">
      <a-col :span="5" class="left">
        <div class="f16 blackTitle lineh24 fw5 mar-d-20" style="padding-left: 32px">用户组</div>
        <ul>
          <li @click="roleClick(item)" :class="roleSelectId==item.id?'active':''" :key="item.id" v-for="item in roleList"><a-icon type="team" />{{item.name}}</li>
        </ul>
      </a-col>
      <a-col :span="19" class="right">
        <div class="table-box">
          <div class="title">{{rightTitle}}</div>
          <ul class="treeTitle clearfix">
            <li class="ta-l" style="width: 80%">页面名称</li>
            <li class="ta-r" style="width: 20%">页面是否可见</li>
          </ul>
          <a-tree
            checkable
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            v-model="checkedKeys"
            :treeData="treeData"
          />
          <div class="mar-t-20 ta-r">
            <a-button class="btn-theme" @click="save">保存</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
// import HitankBreadcrumb from '@comp/header/HitankBreadcrumb'
import {getRoleList, getRoleRight, setRoleRight} from '@api/userManage'
import {getMenuAllList} from '@api/workbench'
// import {TABLE} from '@util/tableUtil'
import util from '@util/util'
import ARow from 'ant-design-vue/es/grid/Row'
import eventBus from '@/store/eventBus'

export default {
  inject: ['reload'], // 注入App里的reload方法
  data () {
    return {
      // data: [],
      // pagination: util.TABLE.pagination,
      // loading: false,
      // selectedRowKeys: [],
      // columns,
      rightTitle: '',
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      roleSelectId: '',
      roleList: []
    }
  },
  components: {
    ARow
  },
  mounted () {
    this.getRoleList()
  },
  activated () {
  },
  methods: {
    getRoleList () {
      let _this = this
      let params = {}
      params.pageSize = 999
      params.pageNo = 1
      getRoleList(params).then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          _this.roleList = data.data
          _this.roleSelectId = data.data[0].id
          _this.rightTitle = data.data[0].name
          _this.fetch({roleId: _this.roleSelectId})
        }
      }).catch(function (error) {
        console.log(error)
        // _this.$message.error(error)
      })
    },
    getRoleRight () {
      let _this = this
      _this.checkedKeys = []
      getRoleRight({roleId: _this.roleSelectId}).then((data) => {
        if (data.data && data.data.length > 0) {
          for (let i = 0; i < data.data.length; i++) {
            _this.checkedKeys.push(data.data[i].menuId)
          }
        }
      }).catch(function (error) {
        console.log(error)
        _this.$message.error('菜单关系错误')
      })
    },
    roleClick (record) {
      this.roleSelectId = record.id
      this.rightTitle = record.name
      this.getRoleRight()
    },
    fetch (params = {}) {
      this.loading = true
      let _this = this
      params.pageSize = 999
      params.pageNo = 1
      getMenuAllList(params).then((data) => {
        if (data.success) {
          if (data.data.length > 0) {
            _this.treeData = util.convertTreeData(data.data, 'id', 'name')
          }
          _this.getRoleRight()
        }
      }).catch(function (error) {
        console.log(error)
        // _this.$message.error(error)
      })
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      this.checkedKeys = checkedKeys
    },
    save () {
      let _this = this
      setRoleRight({roleId: this.roleSelectId, resourceIds: this.checkedKeys.join(',')}).then((data) => {
        // _this.reload()
        eventBus.$emit('refreshMenu')
        _this.$message.success('保存成功')
      }).catch(function (error) {
        console.log(error)
        // _this.$message.error('保存失败')
      })
    }
  },
  watch: {
    checkedKeys (val) {
      console.log('checkedKeys', val)
    }
  }
}
</script>

<style scoped lang="less">
  @import "~@var";
  .left{
    background-color: @fff;
    padding: 24px 0;
    ul{
      padding: 0;
      li{
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 16px;
        padding: 8px 24px 8px 32px;
        cursor: pointer;
        .anticon{
          color: @blackText;
          font-size: 12px;
          padding-right: 7px;
        }
      }
      li.active{
        position: relative;
        background-color: @themeBg;
        color: @theme;
        .anticon{
          color: @theme;
        }
      }
      li.active:after {
        content: '';
        display: block;
        height: 38px;
        width: 2px;
        position: absolute;
        right: 0;
        top: 0;
        background-color: @theme;
      }
    }
  }
  .right{
    border-left: 1px solid #E8E8E8;
    .treeTitle{
      background-color: @bg;
      margin-bottom: 0;
      padding-left: 0;
      li{
        font-weight: 500;
        color: @blackTitle;
        float: left;
        line-height: 22px;
        padding: 13px 24px;
      }
    }
  }
</style>
<style lang="less">
  .right-list{
    .right{
      .ant-tree {
        li {
          border-top: 1px solid #E8E8E8;
          padding: 12px 24px;
          ul{
            padding: 9px 0 0 18px;
          }
          li {
            border-top: 0;
          }
          span.ant-tree-checkbox {
            float: right;
          }
        }
      }
    }
  }
</style>
