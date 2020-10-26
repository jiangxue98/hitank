<!--半成品 todo-->
<template>
  <div class="table-box">
    <div class="title">{{tableTitle}}</div>
    <a-table :columns="columns"
             :rowKey="record => record[rowKey]"
             :dataSource="dataSource"
             :pagination="pagination"
             :loading="loading"
             :locale = "locale"
             @change="change"
             @expandedRowsChange="expandedRowsChange"
             @expand="expand"
    >
      <slot name = "tableBody"></slot>
    </a-table>
  </div>
</template>

<!--父组件使用 todo-->
<base-table :columns="columns"
            tableTitle="用户列表"
            rowKey="id"
            :dataSource="data"
            :pagination="pagination"
            :loading="loading"
            :locale = "locale"
            :change="handleTableChange"
>
  <template slot="tableBody">
    mm
    <template slot="operation" slot-scope="text, record, index">
      <a-button @click="() => detailClick(text, record, index)">查看</a-button>
    </template>
  </template>
</base-table>

<script>
// import {getRoleList} from '@api/role'

export default {
  props: {
    tableTitle: String,
    columns: {
      type: Array,
      required: true
    },
    rowKey: String,
    dataSource: {
      type: Array
    },
    pagination: {
      total: 0
    },
    change: {
      type: Function,
      default: function () {},
      required: false
    },
    expandedRowsChange: {
      type: Function,
      default: function () {},
      required: false
    },
    expand: {
      type: Function,
      default: function () {},
      required: false
    }
  },
  // render(h){
  //   return h(ComponentC, {
  //     props: {
  //       ...
  //     },
  //     scopedSlots: self.$scopedSlots,
  //     on: {
  //       ...
  //     }
  //   })
  // },
  // render: function (createElement) {
  //   var header = this.$slots.header
  //   var body = this.$slots.default
  //   var footer = this.$slots.footer
  //   return createElement('div', [
  //     createElement('header', header),
  //     createElement('main', body),
  //     createElement('footer', footer)
  //   ])
  // },
  data () {
    return {
      // data: [],
      // pagination: {
      //   total: 0
      // },
      locale: {
        emptyText: '暂无数据'
      },
      loading: false
    }
  },
  components: {
  },
  mounted () {
    // this.fetch()
  },
  activated () {
  },
  methods: {
    // handleTableChange (pagination, filters, sorter) {
    //   console.log(pagination)
    //   const pager = { ...this.pagination }
    //   pager.current = pagination.current
    //   this.pagination = pager
    //   this.fetch({
    //     results: pagination.pageSize,
    //     page: pagination.current,
    //     sortField: sorter.field,
    //     sortOrder: sorter.order,
    //     ...filters
    //   })
    // },
    // fetch (params = {}) {
    //   console.log('params:', params)
    //   this.loading = true
    //   let _this = this
    //   getRoleList().then(function (data) {
    //     if (data.data && data.data.length > 0) {
    //       const pagination = { ..._this.pagination }
    //       pagination.total = data.total
    //       _this.pagination = pagination
    //       _this.loading = false
    //       _this.data = data.data
    //     }
    //   })
    //     .catch(function (error) {
    //       console.log(error)
    //       // _this.$Message.error(error)
    //     })
    // },
    // detailClick (text, record, index) {
    //   console.log(record)
    // }
  }
}
</script>

<style scoped lang="less">
</style>
