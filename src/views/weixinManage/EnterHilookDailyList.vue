<!--人单合一日报管理-->
<template>
  <div>
    <div class="table-box">
      <div class="clearfix">
        <div class="title fl">人单合一日报列表</div>
        <!--<a-button class="editable-add-btn btn-white right-btn" @click="handleHeaderDel">批量删除</a-button>-->
        <a-button class="editable-add-btn btn-theme right-btn" @click="handleHeaderAdd"><a-icon type="plus" />新增数据</a-button>
      </div>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onTableSelChange}"
               @change="handleTableChange"
      >
        <template slot="createTime" slot-scope="text, record, index">
          <span>{{text.substring(0,10)}}</span>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a-tooltip placement="top">
            <template slot="title">
              <span>编辑</span>
            </template>
            <a-icon class="grey-btn" type="form" @click="() => handleEdit(text, record, index)"/>
          </a-tooltip>
<!--          <i class="btn-sep"></i>-->
<!--          <a-tooltip placement="top">-->
<!--            <template slot="title">-->
<!--              <span>删除</span>-->
<!--            </template>-->
<!--            <a-icon class="grey-btn" type="delete" @click="() => handleDelete(record.id, record.name)"/>-->
<!--          </a-tooltip>-->
        </template>
      </a-table>
    </div>
    <add-enter-hilook-daily-modal
      :showModal="showModal"
      :type="addType"
      @close="closeModal"
      :params="modalParams"
    >
    </add-enter-hilook-daily-modal>
  </div>
</template>

<script>
import util from '@util/util'
import {getHilookList} from '@api/weixinManage'
import AddEnterHilookDailyModal from './AddEnterHilookDailyModal'

export default {
  data () {
    const columns = [{
      title: '日期',
      dataIndex: 'createTime',
      scopedSlots: { customRender: 'createTime' }
    }, {
      title: '进入次数',
      dataIndex: 'enterNum'
    }, {
      title: '跳出率',
      dataIndex: 'outRate'
    }, {
      title: '平均访问深度',
      dataIndex: 'depthAverage'
    }, {
      title: '平均访问时长',
      dataIndex: 'visitAverage'
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
      secondList: []
    }
  },
  components: {
    AddEnterHilookDailyModal
  },
  mounted () {
    this.fetch()
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
      getHilookList(params).then((data) => {
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
      // if (this.selectedRowKeys.length > 0) {
      //   let ids = this.selectedRowKeys
      //   util.delConfirm('以下勾选的消息', () => {
      //     batchDeleteUser({ids: ids}).then((data) => {
      //       this.refreshFetch()
      //       this.$message.info('删除成功')
      //     }).catch(function (error) {
      //       console.log(error)
      //       // _this.$Message.error(error)
      //     })
      //   })
      // } else {
      //   this.$message.info('请先勾选待删除项')
      // }
    },
    // 编辑按钮
    handleEdit (text, record, index) {
      this.showModal = true
      this.addType = 'edit'
      this.modalParams = record
    },
    // 删除按钮
    handleDelete (key, name) {
      // util.delConfirm(name, () => {
      //   delUser({id: key}).then((data) => {
      //     this.$message.info('删除成功')
      //     this.refreshFetch()
      //   }).catch(function (error) {
      //     console.log(error)
      //     // _this.$Message.error(error)
      //   })
      // })
    },
    onTableSelChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 条件筛选
    refreshFetch () {
      this.fetch()
    },

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
