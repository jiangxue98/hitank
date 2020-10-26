<!--产品管理-->
<template>
  <div>
    <query-select-box queryPlaceholder="请输入产品名称或编号" @onSearch="onSearch"></query-select-box>
    <ul class="card-list clearfix">
      <li class="card-item " v-for="(item,index) in cardList" :class="currentPlatId==item.platId?'active':''" :key="index" @click="handleCard(item)">
        <span class="name">{{item.platName}}</span>
        <span class="num">{{item.num}}</span>
        <img src="@img/product_card_bg.png">
      </li>
    </ul>
    <div class="reset-bar" v-show="currentPlatName">
      <a-icon theme="filled" type="info-circle" />
      已选择<span class="themeColor"> {{currentPlatName}} </span>项
      <span class="mar-l-10 btn-icon-theme" @click="handleCardReset">重置</span>
    </div>
    <div class="table-box">
      <div class="clearfix">
        <div class="title fl">产品列表</div>
        <a-button class="editable-add-btn btn-white right-btn" @click="handleExport">导出产品</a-button>
        <a-button class="editable-add-btn btn-theme right-btn" @click="handleToFile"><a-icon type="plus" />产品备案</a-button>
      </div>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               :scroll="{ x: 1350 }"
               @change="handleTableChange"
      >
        <template slot="id" slot-scope="text, record, index">
          <span class="a-btn-text" @click="seeDetail(record.id)">{{text}}</span>
        </template>
        <template slot="name" slot-scope="text, record, index">
          <span class="a-btn-text" @click="seeDetail(record.id)">{{text}}</span>
        </template>
        <template slot="type" slot-scope="text, record, index">
          {{convertObj(text)}}
          <!--<span v-if="text==1">PC</span>-->
          <!--<span v-else-if="text==2">APP</span>-->
          <!--<span v-else-if="text==3">H5</span>-->
          <!--<span v-else-if="text==4">小程序</span>-->
          <!--<span v-else-if="text==5">客户端</span>-->
          <!--<span v-else-if="text==6">其它</span>-->
        </template>
        <template slot="platIdName" slot-scope="text, record, index">
          <span>{{text}}<span v-if="record.smallIdName">/{{record.smallIdName}}</span></span>
        </template>
        <template slot="projPass" slot-scope="text, record, index">
          <span v-if="text==0">未立项</span>
          <span v-else-if="text==1">已立项</span>
        </template>
        <template slot="state" slot-scope="text, record, index">
          <span v-if="text==1">开发测试</span>
          <span v-else-if="text==2">上线迭代</span>
          <span v-else-if="text==3">下架</span>
          <span v-else-if="text==4">冻结</span>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a-tooltip placement="top">
            <template slot="title">
              <span>编辑</span>
            </template>
            <a-icon class="grey-btn" type="form" @click="() => handleEdit(text, record, index)"/>
          </a-tooltip>
          <i class="btn-sep"></i>
          <a-dropdown placement="bottomRight" :trigger="['click']">
            <a-icon class="grey-btn more-icon" type="ellipsis"/>
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="() => handleAssets(text, record)">互联网资产</a-menu-item>
              <a-menu-item key="5" @click="() => handleModify(text, record)">产品变更</a-menu-item>
              <a-menu-item key="4" @click="() => handlePublish(text, record)">产品发布</a-menu-item>
              <a-menu-item key="2" @click="() => handleRemove(text, record)">产品下架</a-menu-item>
              <a-menu-item key="3" @click="() => handleFreeze(text, record)">产品封存</a-menu-item>
              <a-menu-item key="6" @click="() => handlePlan(record)">产品计划维护</a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </a-table>
    </div>
    <product-add-drawer
      :showDrawer="showDrawer"
      :params="drawerParams"
      @close="closeDrawer"
      >
    </product-add-drawer>
    <product-assets-drawer
      :showDrawer="showAssetsDrawer"
      :params="drawerAssetsParams"
      @close="closeDrawer"
    >
    </product-assets-drawer>
    <product-publish-drawer
      :showDrawer="showPublishDrawer"
      :params="publishDrawerParams"
      @close="closeDrawer"
    >
    </product-publish-drawer>
    <product-modify-drawer
      :showDrawer="showModifyDrawer"
      :params="modifyDrawerParams"
      @close="closeDrawer"
    >
    </product-modify-drawer>
    <product-remove-drawer
      :showDrawer="showRemoveDrawer"
      :params="drawerRemoveParams"
      @close="closeDrawer"
    >
    </product-remove-drawer>
    <product-freeze-drawer
      :showDrawer="showFreezeDrawer"
      :params="drawerFreezeParams"
      @close="closeDrawer"
    >
    </product-freeze-drawer>
  </div>
</template>

<script>
import {getProductList, getProductStatistics} from '@api/productManage'
import QuerySelectBox from '@comp/QuerySelectBox'
import util from '@util/util'
import {getOrganizationListByName} from '@api/sysManage'
import ProductAddDrawer from './ProductAddDrawer'
import ProductAssetsDrawer from './ProductAssetsDrawer'
import global from '@util/global'
import ProductRemoveDrawer from './ProductRemoveDrawer'
import ProductFreezeDrawer from './ProductFreezeDrawer'
import ProductPublishDrawer from './ProductPublishDrawer'
import ProductModifyDrawer from './ProductModifyDrawer'

export default {
  data () {
    const columns = [{
      title: '产品编号',
      dataIndex: 'id',
      width: 100,
      scopedSlots: {customRender: 'id'}
    }, {
      title: '产品名称',
      dataIndex: 'name',
      width: 220,
      scopedSlots: {customRender: 'name'}
    }, {
      title: '产品类型',
      dataIndex: 'type',
      width: 120,
      scopedSlots: {customRender: 'type'}
    }, {
      title: '所属平台/小微',
      dataIndex: 'platIdName',
      width: 170,
      scopedSlots: {customRender: 'platIdName'}
    }, {
      title: '项目主人',
      width: 120,
      dataIndex: 'userIdName'
    }, {
      title: '是否立项',
      dataIndex: 'projPass',
      width: 100,
      scopedSlots: {customRender: 'projPass'}
    }, {
      title: '状态',
      dataIndex: 'state',
      width: 80,
      scopedSlots: {customRender: 'state'}
    }, {
      title: '创建者',
      width: 80,
      dataIndex: 'createByName'
    }, {
      title: '更新者',
      width: 80,
      dataIndex: 'updateByName'
    }, {
      title: '操作',
      align: 'right',
      fixed: 'right',
      width: 130,
      scopedSlots: { customRender: 'operation' }
    }]
    return {
      data: [],
      pagination: util.TABLE.pagination,
      selectedRowKeys: [],
      loading: false,
      columns,
      role: '',
      showDrawer: false,
      addType: '',
      searchValue: '',
      productTypeObj: global.PRODUCT_TYPE_OBJ,
      drawerParams: {},
      cardList: [],
      currentPlatId: '',
      currentPlatName: '',
      /* ProductRemoveDrawer start */
      showRemoveDrawer: false,
      drawerRemoveParams: {},
      /* ProductRemoveDrawer end */
      /* ProductFreezeDrawer start */
      showFreezeDrawer: false,
      drawerFreezeParams: {},
      /* ProductFreezeDrawer end */
      // /* ProductPlanDrawer start */
      // showPlanDrawer: false,
      // drawerPlanParams: {},
      // /* ProductPlanDrawer end */
      /* ProductPublishDrawer start */
      showPublishDrawer: false,
      publishDrawerParams: {},
      /* ProductPublishDrawer end */
      /* ProductModifyDrawer start */
      showModifyDrawer: false,
      modifyDrawerParams: {},
      /* ProductModifyDrawer end */
      /* ProductAssetsDrawer start */
      showAssetsDrawer: false,
      drawerAssetsParams: {}
      /* ProductAssetsDrawer end */
      // firstList: []
    }
  },
  components: {
    ProductModifyDrawer,
    ProductPublishDrawer,
    ProductFreezeDrawer,
    ProductRemoveDrawer,
    ProductAssetsDrawer,
    ProductAddDrawer,
    QuerySelectBox
  },
  mounted () {
    this.fetch()
    this.getCardList()
  },
  methods: {
    convertObj (key) {
      if (key.indexOf(',') > -1) {
        let arr = key.split(',')
        let str = ''
        for (let i of arr) {
          str += global.PRODUCT_TYPE_OBJ[i] + '，'
        }
        return str.substring(0, str.length - 1)
      } else {
        return global.PRODUCT_TYPE_OBJ[key]
      }
    },
    getCardList () {
      let _this = this
      getProductStatistics().then((data) => {
        if (data.success) {
          _this.cardList = data.data
        }
      }).catch(function (error) {
        console.log(error)
        // _this.$Message.error(error)
      })
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch()
    },
    fetch (params = {}) {
      this.loading = true
      let _this = this
      params.pageSize = this.pagination.pageSize
      params.pageNo = this.pagination.current
      if (this.currentPlatId) {
        params.platId = this.currentPlatId
      }
      if (this.searchValue) {
        params.id = this.searchValue
      }
      getProductList(params).then((data) => {
        _this.loading = false
        if (data.success) {
          const pagination = { ..._this.pagination }
          pagination.total = data.total
          _this.pagination = pagination
          _this.data = data.data
        }
      }).catch(function (error) {
        _this.loading = false
        console.log(error)
        // _this.$Message.error(error)
      })
    },
    // 前往处理
    seeDetail (val) {
      this.$router.push({path: '/productDetail', query: {id: val}})
    },
    handleCard (item) {
      this.currentPlatId = item.platId
      this.currentPlatName = item.platName
      this.refreshFetch()
    },
    handleCardReset () {
      this.currentPlatId = ''
      this.currentPlatName = ''
      this.refreshFetch()
    },
    // 导出按钮
    handleExport (key, name) {
      window.open('/api/product/downProductExcel', '_blank')
    },
    // 产品备案按钮
    handleToFile () {
      this.showDrawer = true
      this.drawerParams = {
        title: '添加产品'
      }
    },
    handleEdit (text, record, index) {
      this.showDrawer = true
      this.drawerParams = record
      this.drawerParams['title'] = '编辑产品'
    },
    // 互联网维护
    handleAssets (text, record) {
      this.showAssetsDrawer = true
      this.drawerAssetsParams = record
    },
    // 变更
    handleModify (text, record) {
      this.showModifyDrawer = true
      this.modifyDrawerParams = record
    },
    // 产品发布
    handlePublish (text, record) {
      this.showPublishDrawer = true
      this.publishDrawerParams = record
    },
    // 产品冻结
    handleRemove (text, record) {
      this.showRemoveDrawer = true
      this.drawerRemoveParams = record
    },
    // 产品封存
    handleFreeze (text, record) {
      this.showFreezeDrawer = true
      this.drawerFreezeParams = record
    },
    // 产品计划
    handlePlan (rec) {
      let query = { id: rec.id, name: rec.name, logo: rec.logo, projPass: rec.projPass, state: rec.state }
      this.$router.push({path: 'productPlanList', query: {params: encodeURI(JSON.stringify(query))}})
    },
    // onTableSelChange (selectedRowKeys) {
    //   this.selectedRowKeys = selectedRowKeys
    // },
    // 条件筛选
    refreshFetch (value) {
      this.pagination = util.TABLE.pagination
      this.fetch(value)
      // this.$refs.querySelect.lock = false
      // let { searchLevel, lastLevelValue, value } = this.$refs.querySelect.getAll()
      // this.fetch({
      //   searchLevel: searchLevel,
      //   lastLevelValue: lastLevelValue,
      //   userName: value
      // })
    },
    /* 查询框 start */
    getDeptList (cb, params) {
      let _this = this
      getOrganizationListByName(params).then((data) => {
        cb(data)
      }).catch(function (error) {
        if (_this.$refs && _this.$refs.querySelect) {
          _this.$refs.querySelect.lock = false
        }
        console.log(error)
        // _this.$Message.error(error)
      })
    },
    // 条件筛选
    onSearch (value) {
      this.searchValue = value
      this.refreshFetch({id: value})
    },
    // firstClick (record) {
    //   this.getDeptList((data) => {
    //     this.$refs.querySelect.lock = false
    //     this.refreshFetch()
    //   }, {parentId: record.id})
    // },
    /* 查询框 end */

    /* drawer start */
    // 关闭抽屉
    closeDrawer (refresh) {
      this.showDrawer = false
      this.showAssetsDrawer = false
      this.showRemoveDrawer = false
      this.showFreezeDrawer = false
      this.showPublishDrawer = false
      this.showModifyDrawer = false
      if (refresh === 'refresh') {
        this.refreshFetch()
      }
    }
    /* drawer end */
  }
}
</script>

<style scoped lang="less">
  @import "~@var";
  .card-list{
    margin-bottom: 1px;
    /*overflow-x: scroll;*/
    .card-item{
      width:266px;
      height:96px;
      border-radius:8px;
      padding: 12px 16px;
      color:@fff;
      position: relative;
      float: left;
      margin-right: 16px;
      margin-bottom: 16px;
      cursor: pointer;
      .name{
        font-size:16px;
        font-weight:500;
        line-height:22px;
      }
      .num{
        font-size:40px;
        font-weight:500;
        line-height:48px;
        position: absolute;
        right: 12px;
        bottom: 16px;
      }
      img{
        width: 122px;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
    .card-item.active{
      border: 2px solid @theme;
      box-shadow: 0px 0px 6px @themeTra;
    }
    .card-item:nth-child(n+1){
      background:linear-gradient(270deg,rgba(255,132,135,1) 0%,rgba(255,77,79,1) 100%);
    }
    .card-item:nth-child(2n+2){
      background:linear-gradient(270deg,rgba(116,212,255,1) 0%,rgba(64,169,255,1) 100%);
    }
    .card-item:nth-child(3n+3){
      background:linear-gradient(270deg,rgba(253,214,45,1) 0%,rgba(250,173,20,1) 100%);
    }
    .card-item:nth-child(4n+4){
      background:linear-gradient(270deg,rgba(148,183,252,1) 0%,rgba(91,128,247,1) 100%);
      /*margin-right: 0;*/
    }
  }
  .reset-bar{
    width:1136px;
    height:40px;
    line-height: 40px;
    border-radius: 4px;
    background:@themeLine;
    border:1px solid rgba(55,182,154,0.4);;
    color: @blackBody;
    padding: 0 16px;
    margin-bottom: 16px;
    .anticon-info-circle{
      color: @theme;
      margin-right: 4px;
    }
  }
</style>
