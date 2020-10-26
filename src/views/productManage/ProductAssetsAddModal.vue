<template>
  <div>
    <a-modal
      width="880px"
      title="添加至产品"
      :visible="showModal"
      :destroyOnClose = true
      @cancel = "close"
      @ok="handleOk"
      :params="params"
      :maskClosable="false"
      class="form-modal"
      :footer="null"
    >
      <div class="table-title-bar">
        <a-input-search
          placeholder="请输入资产名称"
          @search="onSearch"
          enterButton="搜索"
          class="searchBox"
        />
        <a-button class="editable-add-btn btn-white right-btn" @click="handleAdd()">批量添加至产品</a-button>
      </div>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onTableSelChange}"
               @change="handleTableChange"
      >
        <template slot="status" slot-scope="text,record,index">
          <span v-if="text=='0'" class="status stop">暂存</span>
          <span v-if="text=='1'" class="status stop">申请中</span>
          <span v-if="text=='3'" class="status stop">停用</span>
          <span v-if="text=='2'" class="status">运营中</span>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a class="btn-icon-theme" @click="handleAdd(text)">添加至产品</a>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import util from '@util/util'
import {bindAssetsItem, getAssetsItemUnSelectlist} from '@api/productManage'

export default {
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    params: {
      type: Object,
      required: false,
      default () {
        return {
        }
      }
    }
  },
  data () {
    const columns = [{
      title: '资产名称',
      dataIndex: 'name',
      width: 250,
      scopedSlots: {customRender: 'name'}
    }, {
      title: '状态',
      dataIndex: 'status',
      width: 130,
      scopedSlots: {customRender: 'status'}
    }, {
      title: '备注',
      dataIndex: 'others'
    }, {
      title: '操作',
      align: 'right',
      width: 130,
      scopedSlots: { customRender: 'operation' }
    }]
    return {
      data: [],
      searchValue: '',
      pagination: util.TABLE_S.pagination,
      selectedRowKeys: [],
      loading: false,
      columns
    }
  },
  mounted () {
  },
  methods: {
    handleOk: function () {
    },
    onSearch (value) {
      this.pagination = util.TABLE_S.pagination
      this.searchValue = value
      this.fetch({assetsItemName: value})
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
      params.searchLevel = 2
      params.assetsItemName = this.searchValue
      // params.lastLevelValue = 2
      params.productId = this.params.productId
      params.productType = this.params.type
      getAssetsItemUnSelectlist(params).then((data) => {
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
    handleAdd (params) {
      if (params) {
        this.addProduct([params.id])
      } else {
        if (this.selectedRowKeys.length > 0) {
          this.addProduct(this.selectedRowKeys)
        } else {
          this.$message.info('请勾选待添加资产')
        }
      }
    },
    addProduct (id) {
      let params = {}
      params.productId = this.params.productId
      params.type = this.params.type
      params.assetsItemIds = id
      bindAssetsItem(params).then(() => {
        this.fetch()
        this.selectedRowKeys = []
        this.$message.success('添加成功')
      }).catch((error) => {
        console.log(error)
      })
    },
    onTableSelChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    close () {
      this.$emit('close', 'refresh')
    }
  },
  watch: {
    showModal (val, oldVal) {
      if (val === true) {
        this.selectedRowKeys = []
        this.searchValue = ''
        this.pagination = util.TABLE_S.pagination
        this.fetch()
      }
    }
  }
}
</script>
<style scoped lang="less">
  @import '~@var';
  .status{
    padding: 1px 11px;
    border-radius:16px;
    background-color: @themeBg;
    color: @theme;
    line-height: 22px;
    display: inline-block;
    padding-left: 23px;
    position: relative;
  }
  .status:before{
    display: block;
    border-radius: 6px;
    content: '';
    font-size: 40px;
    position: absolute;
    top: 9px;
    left: 11px;
    width: 5px;
    height: 5px;
    background: @theme;
  }
  .status.stop{
    background-color: @bg;
    color: @blackText;
  }
  .status.stop:before{
    background: @blackText;
  }
</style>
