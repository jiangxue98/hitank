<!--产品计划-->
<template>
  <div class="product-plan-list">
    <div class="header">
      <div class="bc-title">
        <img :src="logo" class="logo" />
        <span style="position: relative;top: 3px;">{{titleName}}</span>
        <span class="pro-label" v-if="projPass==0">未立项</span>
        <span class="pro-label green" v-else-if="projPass==1">已立项</span>
        <span class="state-label" v-if="state==1">开发测试</span>
        <span class="state-label" v-else-if="state==2">上线迭代</span>
        <span class="state-label" v-else-if="state==3">下架</span>
        <span class="state-label" v-else-if="state==4">冻结</span>
      </div>
      <query-select-box style="top:3px" queryPlaceholder="请输入产品计划名称或编号" @onSearch="onSearch"></query-select-box>
    </div>
    <div class="table-box">
      <div class="clearfix">
        <div class="title fl">产品计划列表</div>
        <a-button class="editable-add-btn btn-theme right-btn" @click="handleAdd"><a-icon type="plus" />新建计划</a-button>
      </div>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               :scroll="{ x: 1350 }"
               @change="handleTableChange"
      >
        <template slot="startTime" slot-scope="text, record, index">
          <span>{{text?text.substr(0, 10):''}}</span>
        </template>
        <template slot="endTime" slot-scope="text, record, index">
          <span>{{text?text.substr(0, 10):''}}</span>
        </template>
        <template slot="createDate" slot-scope="text, record, index">
          <span>{{text?text.substr(0, 10):''}}</span>
        </template>
        <template slot="step" slot-scope="text">
          <span v-if="text==1">立项</span>
          <span v-else-if="text==2">开发测试</span>
          <span v-else-if="text==3">上线迭代</span>
          <span v-else-if="text==4">下架</span>
          <span v-else-if="text==5">封存</span>
        </template>
        <template slot="state" slot-scope="text, record, index">
          <span v-if="text===1"><a-badge status="error" text="红区" /></span>
          <span v-else-if="text==2"><a-badge status="warning" text="黄区" /></span>
          <span v-else-if="text==4"><a-badge status="success" text="绿区" /></span>
          <span v-else-if="text==3"><a-badge status="Processing" text="蓝区" /></span>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a v-if="record.finishTime"  class="themeColor" @click="() => handleSee(text, record, index)">查看</a>
          <a v-else class="themeColor" @click="() => handleFeedback(text, record, index)">反馈</a>
        </template>
      </a-table>
    </div>
    <ProductPlanAddDrawe
      :showAddDrawer="showAddDrawer"
      @close="closeDrawer"
      :params="productId"
    ></ProductPlanAddDrawe>
    <ProductPlanDrawer
      :showDrawer="showDrawer"
      @close="closeDrawer"
      :params="projectInfo"
    ></ProductPlanDrawer>
  </div>
</template>

<script>
import {getProductPlanList} from '@api/productManage'
import QuerySelectBox from '@comp/QuerySelectBox'
import util from '@util/util'
import {getOrganizationListByName} from '@api/sysManage'
import ProductPlanAddDrawe from './ProductPlanAddDrawer'
import ProductPlanDrawer from './ProductPlanDrawer'
var id
export default {
  data () {
    const columns = [{
      title: '计划编号',
      dataIndex: 'id',
      width: 100
    }, {
      title: '计划名称',
      dataIndex: 'name',
      width: 220,
      scopedSlots: {customRender: 'name'}
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 120,
      scopedSlots: {customRender: 'startTime'}
    }, {
      title: '结束时间',
      width: 120,
      dataIndex: 'endTime',
      scopedSlots: {customRender: 'endTime'}
    }, {
      title: '创建时间',
      dataIndex: 'createDate',
      width: 100,
      scopedSlots: {customRender: 'createDate'}
    }, {
      title: '状态',
      dataIndex: 'step',
      width: 80,
      scopedSlots: {customRender: 'step'}
    }, {
      title: '显区',
      width: 80,
      dataIndex: 'state',
      scopedSlots: {customRender: 'state'}
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
      titleName: '',
      logo: '',
      projPass: '',
      state: '',
      role: '',
      addType: '',
      searchValue: '',
      drawerParams: {},
      showAddDrawer: false,
      showDrawer: false,
      projectInfo: {},
      productId: ''
    }
  },
  components: {
    QuerySelectBox,
    ProductPlanDrawer,
    ProductPlanAddDrawe
  },
  mounted () {
    let t = decodeURI(this.$route.query.params)
    if (util.isEmpty(t)) {
      this.$router.replace({path: '/productList'})
    } else {
      let params = JSON.parse(t)
      id = params.id
      this.titleName = params.name
      this.logo = params.logo
      this.projPass = params.projPass
      this.state = params.state
      this.fetch()
    }
  },
  methods: {
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
      params.productId = id
      params.name = this.searchValue
      getProductPlanList(params).then((data) => {
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
    // 反馈
    handleFeedback (item) {
      let projectInfo = {
        titleName: this.titleName,
        logo: this.logo,
        projPass: this.projPass,
        state: this.state,
        item: item
      }
      this.$router.push({path: '/feedback', query: {params: encodeURI(JSON.stringify(projectInfo))}})
    },
    // 查看
    handleSee (item) {
      this.projectInfo = {
        titleName: this.titleName,
        logo: this.logo,
        projPass: this.projPass,
        state: this.state,
        item: item
      }
      this.showDrawer = true
    },
    // 新建
    handleAdd (key) {
      this.productId = id
      this.showAddDrawer = true
      // this.drawerParams = {
      //   title: '添加产品'
      // }
    },
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
      this.showAddDrawer = false
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
  .product-plan-list {
    .logo {
      width:28px;
      height:28px;
      border-radius: 2px;
      margin-right: 10px;
    }
    .pro-label{
      line-height: 20px;
      padding: 1px 9px;
      height:22px;
      border-radius:4px;
      background:rgba(190,190,190,1);
      color: #fff;
      font-size: 12px;
      font-weight: normal;
      margin-left: 8px;
    }
    .pro-label.green{
      background:rgba(82,196,26,1);
    }
    .state-label{
      margin-left: 8px;
      height:22px;
      line-height: 20px;
      padding: 1px 9px;
      background:rgba(245,245,245,1);
      border-radius:4px;
      color: @blackText;
      font-size: 12px;
      font-weight: normal;
      border:1px solid rgba(217,217,217,1);
    }
    .header{
      padding: 0 24px;
      position: relative;
      .bc-title{
        color: @blackTitle;
        font-size: 20px;
        line-height: 28px;
        font-weight: 500;
        margin-top: 16px;
        margin-bottom: 24px;
        span {
          display: inline-block;
          vertical-align: bottom;
        }
      }
      .query-box {
        position: relative;
      }
      .header-right {
        top: 3px;
      }
    }
  }
</style>
