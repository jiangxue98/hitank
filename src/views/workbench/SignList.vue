<!--签署存档-->
<template>
  <div>
    <query-select-box queryPlaceholder="签章内容"
                      ref="querySelect" @onSearch="onSearch"
    ></query-select-box>
    <div class="table-box">
      <div class="clearfix">
        <div class="title fl">签署存档</div>
      </div>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               @change="handleTableChange"
      >
        <template slot="userTimeDown" slot-scope="text, record, index">
          {{text.substr(0,10)}}
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import QuerySelectBox from '@comp/QuerySelectBox'
import util from '@util/util'
import {getSignList} from '@api/workbench'

export default {
  data () {
    const columns = [{
      title: '签署内容',
      dataIndex: 'assetsItemName'
    }, {
      title: '账号使用期限',
      dataIndex: 'userTimeDown',
      scopedSlots: {customRender: 'userTimeDown'}
    }, {
      title: '签署时间',
      dataIndex: 'signTime'
    }, {
      title: '签署人',
      dataIndex: 'userIdName'
    }]
    return {
      data: [],
      pagination: util.TABLE.pagination,
      selectedRowKeys: [],
      loading: false,
      columns
    }
  },
  components: {
    QuerySelectBox
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
      getSignList(params).then((data) => {
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
    onTableSelChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 条件筛选
    refreshFetch () {
      // this.$refs.querySelect.lock = false
      let { value } = this.$refs.querySelect.getAll()
      this.fetch({
        name: value
      })
    },
    // 条件筛选
    onSearch (value) {
      this.refreshFetch(value)
    }
    /* 查询框 end */
  }
}
</script>

<style scoped lang="less">
</style>
