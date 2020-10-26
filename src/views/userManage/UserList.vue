<!--用户管理-->
<template>
  <div>
    <query-select-box queryPlaceholder="用户名称" select-title="所属组织"
                      :secondList="secondList" :first-list="firstList" :isLock="true"
                      ref="querySelect"
                      @firstClick = "firstClick" @secondClick="secondClick" @onSearch="onSearch"
    ></query-select-box>
    <div class="table-box">
      <div class="clearfix">
        <div class="title fl" @click="queryClick()">用户列表</div>
        <a-button class="editable-add-btn btn-white right-btn" @click="handleHeaderDel">批量删除</a-button>
        <a-button class="editable-add-btn btn-theme right-btn" @click="handleHeaderAdd"><a-icon type="plus" />添加用户</a-button>
      </div>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onTableSelChange}"
               @change="handleTableChange"
      >
        <template slot="operation" slot-scope="text, record, index">
<!--          <span class="a-btn-theme" @click="setRole(record)">权限设置</span>-->
<!--          <i class="btn-sep"></i>-->
          <a-tooltip placement="top">
            <template slot="title">
              <span>编辑</span>
            </template>
            <a-icon class="grey-btn" type="form" @click="() => handleEdit(text, record, index)"/>
          </a-tooltip>
          <i class="btn-sep"></i>
          <a-tooltip placement="top">
            <template slot="title">
              <span>删除</span>
            </template>
            <a-icon class="grey-btn" type="delete" @click="() => handleDelete(record.id, record.name)"/>
          </a-tooltip>
        </template>
        <template slot="mark" slot-scope="text, record, index">
          <span :class="roleColorObj[text]" v-if="roleColorObj[text]">{{record.roleName}}</span>
          <span class="tag-blue-outline" v-else>{{record.roleName}}</span>
        </template>
      </a-table>
    </div>
    <add-user-modal
      :showModal="showModal"
      :type="addType"
      @close="closeModal"
      :params="modalParams"
    ></add-user-modal>
  </div>
</template>

<script>
import {getUserList, delUser, batchDeleteUser} from '@api/userManage'
import QuerySelectBox from '@comp/QuerySelectBox'
import util from '@util/util'
import AddUserModal from './AddUserModal'
import {getOrganizationListByName} from '@api/sysManage'

// import BaseTable from '@comp/table/BaseTable'

export default {
  data () {
    const columns = [{
      title: '用户名称',
      dataIndex: 'name'
    }, {
      title: '登录名称',
      dataIndex: 'userName'
    }, {
      title: '用户角色',
      dataIndex: 'mark',
      width: 120,
      scopedSlots: {customRender: 'mark'}
    }, {
      title: '所属平台/小微',
      dataIndex: 'categoryRelation'
    }, {
      title: '电话',
      dataIndex: 'tel'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    }, {
      title: '操作',
      align: 'right',
      width: 120,
      scopedSlots: { customRender: 'operation' }
    }]
    return {
      data: [],
      pagination: util.TABLE.pagination,
      selectedRowKeys: [],
      loading: false,
      columns,
      showModal: false,
      addType: '',
      modalParams: {},
      firstList: [],
      secondList: [],
      searchLevel: '',
      lastLevelValue: '',
      searchName: '',
      roleColorObj: {'admin': 'tag-red-outline', 'plat': 'tag-theme-outline', 'small': 'tag-theme-outline', 'user': 'tag-blue-outline'}
    }
  },
  components: {
    AddUserModal,
    QuerySelectBox
  },
  mounted () {
    this.fetch()
    this.getDeptList((data) => {
      if (this.$refs.querySelect) {
        this.firstList = this.$refs.querySelect.initFirst(data.data)
      }
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
      params.searchLevel = this.searchLevel
      params.lastLevelValue = this.lastLevelValue
      params.name = this.searchName
      getUserList(params).then((data) => {
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
    handleHeaderAdd () {
      this.showModal = true
      this.addType = 'add'
      this.modalParams = {}
    },
    handleHeaderDel () {
      if (this.selectedRowKeys.length > 0) {
        let ids = this.selectedRowKeys
        util.delConfirm('以下勾选的消息', () => {
          batchDeleteUser({ids: ids}).then((data) => {
            this.refreshFetch()
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
    // 编辑按钮
    handleEdit (text, record, index) {
      this.showModal = true
      this.addType = 'edit'
      this.modalParams = record
    },
    // 删除按钮
    handleDelete (key, name) {
      util.delConfirm(name, () => {
        delUser({id: key}).then((data) => {
          this.$message.info('删除成功')
          this.refreshFetch()
        }).catch(function (error) {
          console.log(error)
          // _this.$Message.error(error)
        })
      })
    },
    onTableSelChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 条件筛选
    refreshFetch () {
      this.$refs.querySelect.lock = false
      let { searchLevel, lastLevelValue, value } = this.$refs.querySelect.getAll()
      this.searchLevel = searchLevel
      this.lastLevelValue = lastLevelValue
      this.searchName = value
      this.fetch({
        searchLevel: searchLevel,
        lastLevelValue: lastLevelValue,
        name: value
      })
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
      this.refreshFetch(value)
    },
    firstClick (record) {
      this.getDeptList((data) => {
        this.$refs.querySelect.lock = false
        this.secondList = this.$refs.querySelect.refreshSecond(data.data)
        this.pagination.current = 1
        this.refreshFetch()
      }, {parentId: record.id})
    },
    secondClick (record) {
      this.pagination.current = 1
      this.refreshFetch()
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
