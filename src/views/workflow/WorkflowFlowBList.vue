<template>
  <div>
    <query-select-box queryPlaceholder="审核流程或发起人名称" select-title="流程类目"
                      :first-list="firstList"
                      ref="querySelect"
                      :queryStyle = queryStyle
                      @firstClick = "firstClick" @onSearch="onSearch"
    ></query-select-box>
    <div class="header-right" v-if="role!='admin'">
      <a-radio-group class="change-btn" :value="currentTab" @change="tabsChange">
        <a-radio-button :value="0">我发起的</a-radio-button>
        <a-radio-button :value="1">待我审核</a-radio-button>
      </a-radio-group>
    </div>
    <!--管理员列表-->
    <div class="table-box" v-if="role=='admin'">
      <div class="clearfix">
        <div class="title fl">工作流列表</div>
      </div>
      <a-table :columns="columnsAdmin"
               :rowKey="record => record.id"
               :dataSource="dataAdmin"
               :pagination="pagination"
               :loading="loading"
               @change="handleChange">
        <template slot="flowName" slot-scope="text, record">
          <span class="pointer" @click="handleDetail(record,'approved')">{{text}}</span>
        </template>
        <template slot="adminState" slot-scope="text, record, index">
          <span v-if="record.totalState == 0" class="tag-orange">待审核</span>
          <span v-else-if="(record.totalState == 1)" class="tag-green">小微主已通过</span>
          <span v-else-if="(record.totalState == 3)" class="tag-green">平台主已通过</span>
          <span v-else-if="(record.totalState == 2)" class="tag-red">小微主已驳回</span>
          <span v-else-if="(record.totalState == 4)" class="tag-red">平台主已驳回</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <span v-if="record.totalState==0 && (record.verifyId && record.verifyId.split(',')[0]==userId) ||
          (record.verifyLevel==2&&record.totalState==1&&(record.verifyId && record.verifyId.split(',')[1]==userId))"
                class="pointer btn-icon-theme" @click="handleDetail(record,'approving')">审核</span>
        </template>
      </a-table>
    </div>
    <!--创客-->
    <!--发起列表-->
    <div class="table-box" v-if="(role!='admin') && currentTab==0">
      <div class="clearfix">
        <div class="title fl">申请列表</div>
      </div>
      <a-table :columns="columnsLeft"
               :rowKey="record => record.id"
               :pagination="pagination"
               :dataSource="dataLeft"
               :loading="loading">
        <template slot="flowName" slot-scope="text, record">
          <span class="pointer" @click="handleDetail(record,'apply')">{{text}}</span>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <span class="status" :class = "text==0?'stop':''">{{record.statusEnum.name}}</span>
        </template>
        <template slot="leftState" slot-scope="text, record, index">
          <span v-if="record.totalState==0 || (record.verifyLevel==2&&record.totalState==1)" class="tag-orange">待审核</span>
          <span v-else-if="(record.verifyLevel==2&&record.totalState == 1)" class="tag-green">小微主已通过</span>
          <span v-else-if="(record.verifyLevel==2&&record.totalState == 3)||(record.verifyLevel==1&&record.totalState == 1)" class="tag-green">已通过</span>
          <span v-else-if="(record.totalState == 2)" class="tag-red">小微主已驳回</span>
          <span v-else-if="(record.totalState == 4)" class="tag-red">平台主已驳回</span>
        </template>
      </a-table>
    </div>
    <!--审核列表-->
    <div class="table-box" v-if="(role!='admin') && currentTab==1">
      <div class="clearfix">
        <div class="title fl">审核列表</div>
        <a-button class="editable-add-btn btn-theme right-btn" @click="handleHeaderDone"><a-icon type="file-done" />批量审核</a-button>
      </div>
      <a-table :columns="columnsRight"
               :rowKey="record => record.id"
               :pagination="pagination"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onTableSelChange}"
               :dataSource="dataRight"
               :loading="loading"
               @change="handleChange">
        <template slot="flowName" slot-scope="text, record">
<!--          <span class="pointer" v-if="record.totalState==0||(record.totalState==1 && record.verifyLevel==2 && record.verifyId.split(',').includes(userId))" @click="handleDetail(record,'approving')">{{text}}</span>-->
          <span class="pointer" @click="handleDetail(record,'approved')">{{text}}</span>
        </template>
        <template slot="rightState" slot-scope="text, record, index">
          <span v-if="record.totalState==0 || (record.verifyLevel==2&&record.totalState==1)" class="tag-orange">待审核</span>
          <span v-else-if="(record.verifyLevel==2&&record.totalState == 1)" class="tag-green">小微主已通过</span>
          <span v-else-if="(record.verifyLevel==2&&record.totalState == 3)||(record.verifyLevel==1&&record.totalState == 1)" class="tag-green">已通过</span>
          <span v-else-if="(record.totalState == 2)" class="tag-red">小微主已驳回</span>
          <span v-else-if="(record.totalState == 4)" class="tag-red">平台主已驳回</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <span v-if="record.totalState==0 && (record.verifyId && record.verifyId.split(',')[0]==userId) ||
          (record.verifyLevel==2&&record.totalState==1&&(record.verifyId && record.verifyId.split(',')[1]==userId))"
                class="pointer btn-icon-theme" @click="handleDetail(record,'approving')">审核</span>
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
import {getFlowListFlowB} from '@api/workflow'
import util from '@util/util'
import FormModal from '@comp/modal/FormModal'
import WorkflowDetailDrawer from './WorkflowDetailDrawer'
import CheckModal from './CheckModal'
import QuerySelectBox from '@comp/QuerySelectBox'
import store from '@/store'

const columnsLeft = [{
  title: '申请流程名称',
  scopedSlots: { customRender: 'flowName' },
  dataIndex: 'flowName'
}, {
  title: '申请人',
  dataIndex: 'createbyName'
}, {
  title: '申请时间',
  dataIndex: 'createTime'
}, {
  title: '状态',
  dataIndex: 'totalState',
  key: 'totalState',
  scopedSlots: { customRender: 'leftState' }
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
      currentTab: 0,
      role: '',
      userId: '',
      filteredInfo: null,
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
      columnsLeft,
      searchName: '',
      selectedRowKeys: [],
      /* 表格 end */
      selectDefault: [],
      /* modal start */
      showModal: false,
      modalParams: {
        title: '审核',
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
  created () {
    let first = [{id: '2', name: '资产新增'}, {id: '1', name: '申请使用'}, {id: '4', name: '资产注销'}]
    if (this.$refs.querySelect) {
      this.firstList = this.$refs.querySelect.initFirst(first)
    }
    store.dispatch('getUserInfo').then(userInfo => {
      this.role = userInfo.role
      this.userId = userInfo.userId
      let hash = this.$router.currentRoute.query.tab
      if (hash) {
        let obj = {'apply': 0, 'check': 1}
        this.currentTab = obj[hash]
        this.refreshFetch()
      } else {
        this.refreshFetch()
      }
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
    tabsChange (e) {
      this.currentTab = e.target.value
      this.refreshFetch()
    },
    // 申请列表
    getApplyList (searchName, type) {
      let _this = this
      this.fetch({verifyType: 1, searchName, type}, (data) => {
        _this.dataLeft = data
      })
    },
    // 审核列表
    getCheckList (searchName, type) {
      let _this = this
      this.fetch({verifyType: 2, searchName, type}, (data) => {
        _this.dataRight = data
      })
    },
    // 管理员审核列表
    getAdminApproveList (searchName, type) {
      let _this = this
      this.fetch({searchName, type}, (data) => {
        _this.dataAdmin = data
      })
    },
    // 获取表格数据
    fetch (params = {}, cb) {
      this.loading = true
      let _this = this
      params.pageSize = this.pagination.pageSize
      params.pageNo = this.pagination.current
      getFlowListFlowB(params).then((data) => {
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
      } else {
        this.queryStyle = 'right: 215px;'
        if (this.currentTab === 1) {
          this.getCheckList(searchName, lastLevelValue)
        } else {
          this.getApplyList(searchName, lastLevelValue)
        }
      }
    },
    onTableSelChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 点击详情
    handleDetail (record, type) {
      this.drawerParams = record
      let stateObj = {0: '- 待审核', 1: '- 已通过', 2: '- 已驳回', 3: '- 已通过', 4: '- 已驳回'}
      let checkTypeObj = {4: '资产注销', 1: '申请使用', 2: '资产新增', 3: '资产变更'}
      this.drawerParams.title = '【' + checkTypeObj[record.checkType] + '】' + stateObj[record.totalState]
      this.drawerParams.type = type
      this.drawerParams.checkType = record.checkType
      this.drawerParams.checkTypeText = checkTypeObj[record.checkType]
      this.drawerParams.role = this.role
      this.showDrawer = true
    },
    /* modal弹框 start */
    // 批量审核按钮
    handleHeaderDone (text, record, index) {
      if (this.selectedRowKeys.length > 0) {
        this.modalParams.title = '批量审核'
        this.modalParams.okBtn = '批量通过'
        this.modalParams.cancelBtn = '批量驳回'
        this.modalParams.okTip = '确定批量通过吗？'
        this.modalParams.cancelTip = '确定批量驳回吗？'
        this.modalParams.id = this.selectedRowKeys
        this.showModal = true
      } else {
        this.$message.info('请先勾选待审核项')
      }
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
      const columnsAdmin = [{
        title: '审核流程名称',
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
      }, {
        title: '操作',
        scopedSlots: {customRender: 'operation'},
        key: 'operation'
      }]
      return columnsAdmin
    },
    columnsRight () {
      const columnsRight = [{
        title: '审核流程名称',
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
      }, {
        title: '操作',
        scopedSlots: { customRender: 'operation' },
        key: 'operation'
      }]
      return columnsRight
    }
  }
}
</script>
