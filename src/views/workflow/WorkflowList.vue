<template>
  <div>
    <query-select-box queryPlaceholder="审批流程或发起人名称" select-title="流程类目"
                      :first-list="firstList"
                      ref="querySelect"
                      :queryStyle = queryStyle
                      @firstClick = "firstClick" @onSearch="onSearch"
    ></query-select-box>
    <div class="header-right" v-if="(role=='plat' || role=='small')">
      <a-radio-group class="change-btn" :value="approveStatus" @change="approveStatusChange">
        <a-radio-button value="approving">待我处理</a-radio-button>
        <a-radio-button value="approved">我已处理</a-radio-button>
      </a-radio-group>
    </div>
<!--    <div class="query-box">-->
<!--      <div><span class="title-4">名称查询：</span>&lt;!&ndash;-->
<!--      &ndash;&gt;<a-input-search class="content-4"-->
<!--        placeholder="请输入审批流程或发起人名称"-->
<!--        style="width: 240px"-->
<!--        @search="onSearch"-->
<!--      /></div>-->
<!--    </div>-->

    <!--管理员列表-->
    <div class="table-box" v-if="role=='admin'">
      <div class="clearfix">
        <div class="title fl">工作流列表</div>
      </div>
      <a-table :columns="columnsAdmin"
               :rowKey="record => record.id"
               :dataSource="dataAdmin"
               :loading="loading"
               :pagination="pagination"
               @change="handleChange">
        <template slot="flowName" slot-scope="text, record">
          <span class="pointer" @click="handleDetail(record,'approved')">{{text}}</span>
        </template>
        <template slot="adminState" slot-scope="text, record, index">
          <span v-if="record.totalState == 0" class="tag-orange">待审批</span>
          <span v-else-if="(record.totalState == 1)" class="tag-green">小微主已通过</span>
          <span v-else-if="(record.totalState == 3)" class="tag-green">平台主已通过</span>
          <span v-else-if="(record.totalState == 2)" class="tag-red">小微主已驳回</span>
          <span v-else-if="(record.totalState == 4)" class="tag-red">平台主已驳回</span>
        </template>
<!--        <template slot="operation" slot-scope="text, record, index">-->
<!--          <a class="themeColor" @click="() => handleDetail(record,'approving')">审批</a>-->
<!--        </template>-->
      </a-table>
    </div>
    <!--小微主&平台主-待审核列表-->
    <div class="table-box" v-if="(role=='plat' || role=='small') && approveStatus=='approving'">
      <div class="clearfix">
        <div class="title fl">待审批列表</div>
        <a-button class="editable-add-btn btn-theme right-btn" @click="handleHeaderDone"><a-icon type="file-done" />批量审批</a-button>
      </div>
      <a-table :columns="columnsLeft"
               :pagination="pagination"
               :rowKey="record => record.id"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onTableSelChange}"
               :dataSource="dataLeft"
               :loading="loading">
        <template slot="flowName" slot-scope="text, record">
          <span class="pointer" @click="handleDetail(record,'approving')">{{text}}</span>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <span class="status" :class = "text==0?'stop':''">{{record.statusEnum.name}}</span>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a class="themeColor" @click="() => handleDetail(record,'approving')">审批</a>
        </template>
      </a-table>
    </div>
    <!--小微主&平台主-已审核列表-->
    <div class="table-box" v-if="(role=='plat' || role=='small') && approveStatus=='approved'">
      <div class="clearfix">
        <div class="title fl">已审核列表</div>
      </div>
      <a-table :columns="columnsRight"
               :pagination="pagination"
               :rowKey="record => record.id"
               :dataSource="dataRight"
               :loading="loading"
               @change="handleChange">
        <template slot="flowName" slot-scope="text, record">
          <span class="pointer" @click="handleDetail(record,'approved')">{{text}}</span>
        </template>
        <template slot="rightState" slot-scope="text, record, index">
          <span v-if="record.totalState == 0" class="tag-orange">待审批</span>
          <span v-else-if="(record.totalState == 1)" class="tag-green">小微主已通过</span>
          <span v-else-if="(record.totalState == 3)" class="tag-green">平台主已通过</span>
          <span v-else-if="(record.totalState == 2)" class="tag-red">小微主已驳回</span>
          <span v-else-if="(record.totalState == 4)" class="tag-red">平台主已驳回</span>
<!--          <span v-if="(record.totalState == 1 && record.verifyLevel == 1) || record.totalState == 3" class="tag-green">通过</span>-->
<!--          <span v-else-if="record.totalState == 2 || record.totalState == 4" class="tag-red">驳回</span>-->
        </template>
      </a-table>
    </div>
    <!--创客列表-->
    <div class="table-box" v-if="role=='user'">
      <div class="clearfix">
        <div class="title fl">我发起的审批</div>
      </div>
      <a-table :columns="columns"
               :pagination="pagination"
               :rowKey="record => record.id"
               :dataSource="data"
               :loading="loading"
               @change="handleChange"
      >
        <template slot="flowName" slot-scope="text, record">
          <span class="pointer" @click="handleDetail(record,'approve')">{{text}}</span>
        </template>
        <template slot="userState" slot-scope="text, record, index">
          <span v-if="record.totalState == 0" class="tag-orange">待审批</span>
          <span v-else-if="(record.totalState == 1)" class="tag-green">小微主已通过</span>
          <span v-else-if="(record.totalState == 3)" class="tag-green">平台主已通过</span>
          <span v-else-if="(record.totalState == 2)" class="tag-red">小微主已驳回</span>
          <span v-else-if="(record.totalState == 4)" class="tag-red">平台主已驳回</span>
<!--          <span v-if="record.totalState == 0" class="tag-orange">待审批</span>-->
<!--          <span v-if="record.totalState == 1 && record.verifyLevel > 1" class="tag-orange">审批中</span>-->
<!--          <span v-else-if="(record.totalState == 1 && record.verifyLevel == 1) || record.totalState == 3" class="tag-green">通过</span>-->
<!--          <span v-else-if="record.totalState == 2 || record.totalState == 4" class="tag-red">驳回</span>-->
        </template>
      </a-table>
    </div>

    <check-modal :showModal="showModal"
                 @close="closeModal"
                 :params="modalParams"
    ></check-modal>
    <workflow-detail-drawer :showDrawer="showDrawer"
                            :params="drawerParams"
                            @close="closeDrawer"
    ></workflow-detail-drawer>
  </div>
</template>

<script>
import {getList} from '@api/workflow'
import util from '@util/util'
// import {TABLE} from '@util/tableUtil'
import FormModal from '@comp/modal/FormModal'
import WorkflowDetailDrawer from './WorkflowDetailDrawer'
// import util from '@util/util'
import CheckModal from './CheckModal'
import QuerySelectBox from '@comp/QuerySelectBox'
import store from '@/store'

const columnsLeft = [{
  title: '审批流程名称',
  scopedSlots: { customRender: 'flowName' },
  dataIndex: 'flowName'
}, {
  title: '发起人',
  dataIndex: 'createbyName'
}, {
  title: '发起时间',
  dataIndex: 'createTime'
}, {
  title: '操作',
  align: 'right',
  scopedSlots: { customRender: 'operation' },
  width: '30%'
}]

export default {
  components: {
    CheckModal,
    FormModal,
    QuerySelectBox,
    WorkflowDetailDrawer
  },
  data () {
    return {
      role: '',
      filteredInfo: null,
      approveStatus: 'approving',
      /* 查询框 start */
      queryStyle: '',
      secondList: [],
      firstList: [],
      /* 查询框 end */
      /* 表格 begin */
      data: [],
      dataLeft: [],
      dataRight: [],
      dataAdmin: [],
      pagination: util.TABLE.pagination,
      loading: false,
      // columns,
      columnsLeft,
      // columnsRight,
      searchName: '',
      selectedRowKeys: [],
      /* 表格 end */
      selectDefault: [],
      /* modal start */
      showModal: false,
      modalParams: {
        title: '审批',
        okBtn: '通过',
        cancelBtn: '驳回'
      },
      showTip: {error: false},
      /* modal end */
      /* drawer start */
      showDrawer: false,
      drawerParams: {}
      /* drawer end */
    }
  },
  beforeCreate () {
    if (this.flowB !== false) {
      let params = this.$router.currentRoute.query.tab
      this.$router.replace({path: '/workflowFlowB', query: {tab: params}})
    }
  },
  beforeMount () {
    console.log('beforeMount' + this.$route.query.id)
  },
  created () {
    console.log('created' + this.$route.query.id)
  },
  mounted () {
    let first = [{id: '2', name: '资产新增'}, {id: '1', name: '申请使用'}, {id: '4', name: '资产注销'}]
    if (this.$refs.querySelect) {
      this.firstList = this.$refs.querySelect.initFirst(first)
    }
    store.dispatch('getUserInfo').then(userInfo => {
      this.role = userInfo.role
      this.refreshFetch()
    }).catch((err) => {
      console.log('获取用户信息错误：' + err)
    })
  },
  methods: {
    handleChange (pagination, filters, sorter) {
      this.filteredInfo = filters
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.refreshFetch()
    },
    approveStatusChange (e) {
      this.approveStatus = e.target.value
      this.refreshFetch()
    },
    // 待审批-小微主&平台主
    getApprovingList (searchName, type) {
      let _this = this
      this.fetch({verifyType: 1, searchName, type}, (data) => {
        _this.dataLeft = data
      })
    },
    // 已审批-小微主&平台主
    getApprovedList (searchName, type) {
      let _this = this
      this.fetch({verifyType: 2, searchName, type}, (data) => {
        _this.dataRight = data
      })
    },
    // 管理员审批列表
    getAdminApproveList (searchName, type) {
      let _this = this
      this.fetch({searchName, type}, (data) => {
        _this.dataAdmin = data
      })
    },
    // 用户审批列表
    getUserApproveList (searchName, type) {
      let _this = this
      this.fetch({searchName, type}, (data) => {
        _this.data = data
      })
    },
    // 获取表格数据
    fetch (params = {}, cb) {
      this.loading = true
      let _this = this
      params.pageSize = this.pagination.pageSize
      params.pageNo = this.pagination.current
      getList(params).then((data) => {
        _this.loading = false
        if (data.success) {
          const pagination = { ..._this.pagination }
          pagination.total = data.total
          _this.pagination = pagination
          for (let o of data.data) {
            o.checkType = o.type
          }
          cb(data.data)
        }
      }).catch(function (error) {
        _this.loading = false
        console.log('获取工作列表数据报错：' + error)
      })
    },
    refreshFetch (searchName) {
      let { lastLevelValue, value } = this.$refs.querySelect.getAll()
      if (util.isEmpty(searchName)) {
        searchName = value
      }
      if (this.role === 'admin') {
        this.getAdminApproveList(searchName, lastLevelValue)
      } else if (this.role === 'plat' || this.role === 'small') {
        if (this.approveStatus === 'approving') {
          this.getApprovingList(searchName, lastLevelValue)
        } else {
          this.getApprovedList(searchName, lastLevelValue)
        }
        this.queryStyle = 'right: 215px;'
      } else {
        this.getUserApproveList(searchName, lastLevelValue)
      }
    },
    onTableSelChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 点击详情
    handleDetail (record, type) {
      this.drawerParams = record
      let stateObj = {0: '- 待审批', 1: '- 已通过', 2: '- 已驳回', 3: '- 已通过', 4: '- 已驳回'}
      let checkTypeObj = {4: '【资产注销】', 1: '【申请使用】', 2: '【资产新增】', 3: '【资产修改】'}
      this.drawerParams.title = checkTypeObj[record.checkType] + stateObj[record.totalState]
      this.drawerParams.type = type
      this.drawerParams.checkType = record.checkType
      this.drawerParams.role = this.role
      // 已审批
      if (type === 'approved') {
      }
      this.showDrawer = true
    },
    /* modal弹框 start */
    // 批量审批按钮
    handleHeaderDone (text, record, index) {
      if (this.selectedRowKeys.length > 0) {
        this.modalParams.title = '批量审批'
        this.modalParams.okBtn = '批量通过'
        this.modalParams.cancelBtn = '批量驳回'
        this.modalParams.okTip = '确定批量通过吗？'
        this.modalParams.cancelTip = '确定批量驳回吗？'
        this.modalParams.id = this.selectedRowKeys
        this.showModal = true
      } else {
        this.$message.info('请先勾选待审批项')
      }
    },
    // 审批按钮
    /* 暂废弃 */
    handleCheck (text, record, index) {
      this.modalParams.id = [record.id]
      this.modalParams.checkType = [record.checkType]
      this.modalParams.verifyLevel = [record.verifyLevel]
      this.modalParams.title = '审批'
      this.modalParams.okBtn = '通过'
      this.modalParams.cancelBtn = '驳回'
      this.modalParams.okTip = '确定通过吗？'
      this.modalParams.cancelTip = '确定驳回吗？'
      this.showModal = true
    },
    // 关闭弹框
    closeModal (param) {
      this.showModal = false
      this.selectedRowKeys = []
      if (param === 'refresh') {
        this.refreshFetch()
      }
    },
    /* modal弹框 end */

    /* drawer start */
    // 关闭抽屉
    closeDrawer (refresh) {
      this.showDrawer = false
      if (refresh === 'refresh') {
        this.refreshFetch()
      }
    },
    /* drawer end */

    /* 查询框 start */
    // 条件筛选
    onSearch (value) {
      this.refreshFetch(value)
    },
    firstClick (record) {
      this.refreshFetch()
    }
    /* 查询框 end */
  },
  computed: {
    columnsAdmin () {
      // let { filteredInfo } = this
      // filteredInfo = filteredInfo || {}
      const columnsAdmin = [{
        title: '审批流程名称',
        scopedSlots: { customRender: 'flowName' },
        dataIndex: 'flowName',
        key: 'flowName'
      }, {
        title: '发起人',
        dataIndex: 'createbyName',
        key: 'createbyName'
      }, {
        title: '发起时间',
        dataIndex: 'createTime',
        key: 'createTime'
      }, {
        title: '状态',
        dataIndex: 'totalState',
        key: 'totalState',
        scopedSlots: { customRender: 'adminState' }
        // width: '30%',
        // filters: [{ text: '通过', value: '通过' }, { text: '驳回', value: '驳回' }],
        // filteredValue: filteredInfo.totalState || null,
        // onFilter: (value, record) => {
        //   let stateObj = {'通过': '1', '驳回': '2'}
        //   return record.totalState.toString().includes(stateObj[value])
        // }
      }]
      return columnsAdmin
    },
    columnsRight () {
      // let { filteredInfo } = this
      // filteredInfo = filteredInfo || {}
      const columnsRight = [{
        title: '审批流程名称',
        scopedSlots: { customRender: 'flowName' },
        dataIndex: 'flowName',
        key: 'flowName'
      }, {
        title: '发起人',
        dataIndex: 'createbyName',
        key: 'createbyName'
      }, {
        title: '发起时间',
        dataIndex: 'createTime',
        key: 'createTime'
      }, {
        title: '状态',
        dataIndex: 'totalState',
        key: 'totalState',
        scopedSlots: { customRender: 'rightState' }
        // width: '30%'
        // filters: [{ text: '通过', value: '通过' }, { text: '驳回', value: '驳回' }],
        // filteredValue: filteredInfo.totalState || null,
        // onFilter: (value, record) => {
        //   let stateObj = {'通过': '1', '驳回': '2'}
        //   return record.totalState.toString().includes(stateObj[value])
        // }
      }]
      return columnsRight
    },
    columns () {
      // let { filteredInfo } = this
      // filteredInfo = filteredInfo || {}
      const columns = [{
        title: '审批流程名称',
        scopedSlots: { customRender: 'flowName' },
        dataIndex: 'flowName'
      }, {
        title: '发起时间',
        dataIndex: 'createTime'
      }, {
        title: '状态',
        dataIndex: 'totalState',
        scopedSlots: { customRender: 'userState' }
        // width: '30%',
        // filters: [{ text: '待审批', value: '待审批' }, { text: '通过', value: '通过' }, { text: '驳回', value: '驳回' }],
        // filteredValue: filteredInfo.totalState || null,
        // onFilter: (value, record) => {
        //   let stateObj = {'待审批': '0', '通过': '1', '驳回': '2'}
        //   return record.totalState.toString().includes(stateObj[value])
        // }
      }]
      return columns
    }
  }
}
</script>

<style scoped lang="less">
  @import '~@var';
</style>
