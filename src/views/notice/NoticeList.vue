<!--通知提醒管理-->
<template>
  <div>
    <query-select-box queryPlaceholder="通知提醒内容" @onSearch="onSearch"></query-select-box>
<!--    :first-list="firstList" :isLock="true"-->
<!--    ref="querySelect"-->
<!--    @firstClick = "firstClick" @onSearch="onSearch"-->
    <div class="table-box">
      <div class="clearfix">
        <div class="title fl" @click="queryClick()">通知提醒列表</div>
        <a-button class="editable-add-btn btn-white right-btn" @click="handleHeaderDel">批量删除</a-button>
        <a-button class="editable-add-btn btn-theme right-btn" @click="handleHeaderRead"><a-icon type="check" />批量已读</a-button>
      </div>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onTableSelChange}"
               @change="handleTableChange"
      >
        <template slot="msgText" slot-scope="text, record, index">
          <a-badge class="pointer" v-if="record.isRead == 0 && role!='admin'" status="error" @click="handleRead(record.id)" :text="record.msgText" />
          <span v-else>{{record.msgText}}</span>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a class="btn-icon-theme" @click="handleDone">前往处理</a>
          <i class="btn-sep"></i>
          <a-tooltip placement="top">
            <template slot="title">
              <span>删除</span>
            </template>
            <a-icon class="grey-btn" type="delete" @click="() => handleDelete(record.id, record.msgText)"/>
          </a-tooltip>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import {getMessageList, setMessageHasRead, batchSetMessageHasRead, deleteMessage, batchDeleteMessage} from '@api/notice'
import QuerySelectBox from '@comp/QuerySelectBox'
import util from '@util/util'
import store from '@/store'
import {getOrganizationListByName} from '@api/sysManage'

// import BaseTable from '@comp/table/BaseTable'

export default {
  data () {
    const columns = [{
      title: '消息提醒内容',
      dataIndex: 'title',
      scopedSlots: {customRender: 'msgText'}
    }, {
      title: '通知提醒类型',
      dataIndex: 'foreignTypeName'
    }, {
      title: '时间',
      dataIndex: 'createTime'
    }, {
      title: '操作',
      align: 'right',
      scopedSlots: { customRender: 'operation' }
    }]
    return {
      data: [],
      pagination: util.TABLE.pagination,
      selectedRowKeys: [],
      loading: false,
      columns,
      role: '',
      showModal: false,
      addType: '',
      modalParams: {},
      firstList: []
    }
  },
  components: {
    QuerySelectBox
  },
  mounted () {
    store.dispatch('getUserInfo').then(userInfo => {
      this.role = userInfo.role
      this.fetch()
    }).catch((err) => {
      console.log('获取用户信息错误：' + err)
    })
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
      getMessageList(params).then((data) => {
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
    // 已读
    handleRead (key, name) {
      setMessageHasRead({id: key}).then((data) => {
        this.refreshFetch()
      }).catch(function (error) {
        console.log(error)
        // _this.$Message.error(error)
      })
    },
    /* 批量已读 */
    handleHeaderRead () {
      if (this.selectedRowKeys.length > 0) {
        let ids = this.selectedRowKeys
        batchSetMessageHasRead({ids: ids}).then((data) => {
          this.refreshFetch()
          this.selectedRowKeys = []
        }).catch(function (error) {
          console.log(error)
          // _this.$Message.error(error)
        })
      } else {
        this.$message.info('请先勾选待勾选已读项')
      }
    },
    // 前往处理
    handleDone () {
      this.$router.push({path: '/workflowList'})
    },
    // 删除按钮
    handleDelete (key, name) {
      util.delConfirm(name, () => {
        deleteMessage({id: key}).then((data) => {
          this.$message.info('删除成功')
          this.refreshFetch()
        }).catch(function (error) {
          console.log(error)
          // _this.$Message.error(error)
        })
      })
    },
    // 批量删除按钮
    handleHeaderDel () {
      if (this.selectedRowKeys.length > 0) {
        let ids = this.selectedRowKeys
        util.delConfirm('以下勾选的消息', () => {
          batchDeleteMessage({ids: ids}).then((data) => {
            this.refreshFetch()
            this.selectedRowKeys = []
            this.$message.info('删除成功')
          }).catch(function (error) {
            console.log(error)
            // _this.$Message.error(error)
          })
        })
      } else {
        this.$message.info('请先勾选待删除项')
      }
    },
    onTableSelChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 条件筛选
    refreshFetch (value) {
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
      this.refreshFetch({msgText: value})
    },
    firstClick (record) {
      this.getDeptList((data) => {
        this.$refs.querySelect.lock = false
        this.refreshFetch()
      }, {parentId: record.id})
    },
    /* 查询框 end */

    /* 编辑弹框 start */
    // 关闭弹框
    closeModal (param) {
      this.showModal = false
      this.addType = ''
      if (param === 'refresh') {
        this.refreshFetch()
      }
    }
    /* 编辑弹框 end */
  }
}
</script>

<style scoped lang="less">
</style>
