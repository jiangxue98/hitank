<!--账号授权管理-->
<template>
  <div>
    <div class="table-box">
      <div class="clearfix">
        <div class="title fl">账号列表</div>
        <!--<a-button class="editable-add-btn btn-white right-btn" @click="handleHeaderDel">批量删除</a-button>-->
        <a-button class="editable-add-btn btn-theme right-btn" @click="handleHeaderAdd"><a-icon type="plus" />新增账号</a-button>
      </div>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onTableSelChange}"
               @change="handleTableChange"
      >
        <template slot="type" slot-scope="text, record, index">
          <span v-if="text==1" class="">抖音</span>
          <span v-else-if="text==2" class="">微博</span>
        </template>
        <template slot="isOverdue" slot-scope="text, record, index">
          <span class="" v-if="text==0">未过期</span>
          <span class="" v-else-if="text==1">已过期</span>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a class="themeColor" @click="() => handleAuth(record.id,record.type)">去授权</a>
          <i class="btn-sep"></i>
          <a-tooltip placement="top">
            <template slot="title">
              <span>编辑</span>
            </template>
            <a-icon class="grey-btn" type="form" @click="() => handleEdit(text, record, index)"/>
          </a-tooltip>
          <!--<i class="btn-sep"></i>-->
          <!--<a-tooltip placement="top">-->
            <!--<template slot="title">-->
              <!--<span>删除</span>-->
            <!--</template>-->
            <!--<a-icon class="grey-btn" type="delete" @click="() => handleDelete(record.id, record.name)"/>-->
          <!--</a-tooltip>-->
        </template>
        <template slot="mark" slot-scope="text, record, index">
          <span :class="roleColorObj[text]" v-if="roleColorObj[text]">{{record.roleName}}</span>
          <span class="tag-blue-outline" v-else>{{record.roleName}}</span>
        </template>
      </a-table>
    </div>
    <add-authorize-modal
      :showModal="showModal"
      :type="addType"
      @close="closeModal"
      :params="modalParams"
    >
    </add-authorize-modal>
  </div>
</template>

<script>
import {delUser, batchDeleteUser} from '@api/userManage'
// import QuerySelectBox from '@comp/QuerySelectBox'
import util from '@util/util'
// import AddUserModal from './AddUserModal'
import {getAuthorizeAccountList, gotoAuthorizePage} from '@api/weixinManage'
import AddAuthorizeModal from './AddAuthorizeModal'

// import BaseTable from '@comp/table/BaseTable'

export default {
  data () {
    const columns = [{
      title: '账号名称',
      dataIndex: 'accountName'
    }, {
      title: '类型',
      dataIndex: 'type',
      scopedSlots: {customRender: 'type'}
    }, {
      title: '是否过期',
      dataIndex: 'isOverdue',
      scopedSlots: {customRender: 'isOverdue'}
    }, {
      title: '过期时间',
      dataIndex: 'overdueTime'
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
      showModal: false,
      addType: '',
      modalParams: {},
      firstList: [],
      secondList: [],
      roleColorObj: {'admin': 'tag-red-outline', 'plat': 'tag-theme-outline', 'small': 'tag-theme-outline', 'user': 'tag-blue-outline'}
    }
  },
  components: {
    // AddUserModal,
    AddAuthorizeModal
  },
  mounted () {
    this.fetch()
    // this.getDeptList((data) => {
    //   if (this.$refs.querySelect) {
    //     this.firstList = this.$refs.querySelect.initFirst(data.data)
    //   }
    // })
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
      getAuthorizeAccountList(params).then((data) => {
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
    // 去授权
    handleAuth (id, type) {
      let _this = this
      if (type === 2) {
        gotoAuthorizePage({id}).then((data) => {
          _this.loading = false
          if (data.success && data.data) {
            let id = util.getUrlParam('id', data.data)
            window.authorizeId = id
            localStorage.setItem('authorizeId', id)
            console.log('authList: authorizeId=' + localStorage.getItem('authorizeId'))
            window.open(data.data, '_self')
          }
        }).catch(function (error) {
          _this.loading = false
          console.log(error)
          // _this.$Message.error(error)
        })
      } else if (type === 1) {
        this.$message.info('抖音账号正在审核中，此功能等待对接，敬请期待')
      } else {
        this.$message.info('此功能正在开发中，敬请期待')
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
      this.fetch()
      // this.$refs.querySelect.lock = false
      // let { searchLevel, lastLevelValue, value } = this.$refs.querySelect.getAll()
      // this.fetch({
      //   searchLevel: searchLevel,
      //   lastLevelValue: lastLevelValue,
      //   name: value
      // })
    },
    /* 查询框 start */
    // getDeptList (cb, params) {
    //   let _this = this
    //   getAuthorizeAccountList(params).then((data) => {
    //     cb(data)
    //   }).catch(function (error) {
    //     if (_this.$refs && _this.$refs.querySelect) {
    //       _this.$refs.querySelect.lock = false
    //     }
    //     console.log(error)
    //     // _this.$Message.error(error)
    //   })
    // },
    // 条件筛选
    // onSearch (value) {
    //   this.refreshFetch(value)
    // },
    // firstClick (record) {
    //   this.getDeptList((data) => {
    //     this.$refs.querySelect.lock = false
    //     this.secondList = this.$refs.querySelect.refreshSecond(data.data)
    //     this.refreshFetch()
    //   }, {parentId: record.id})
    // },
    // secondClick (record) {
    //   this.refreshFetch()
    // },
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
