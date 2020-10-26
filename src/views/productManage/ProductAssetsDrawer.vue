<template>
  <div>
    <a-drawer
      title="互联网维护"
      width="720"
      @close="onClose"
      :destroyOnClose = true
      :visible="showDrawer"
      wrapClassName="productAssetsDrawer"
      :drawerStyle="{'padding':0,'background':'red'}"
    >
      <div class="drawer-form-box asset-class-item-drawer-form" :class="isSee?'see-view':''">
        <a-tabs
          defaultActiveKey="activeKey"
          :tabPosition="mode"
          @change="tabChange"
          @prevClick="callback"
          @nextClick="callback"
          :style="{ minHeight: '200px'}"
        >
          <a-tab-pane v-for="item in tabsData" :tab="item.name" :key="item.id">
            <div class="modal-table">
              <div class="table-title-bar clearfix mar-l-24 mar-r-24">
                <div class="title fl">已添加至产品</div>
                <a-button class="editable-add-btn btn-white right-btn" @click="handleDel()">批量移除</a-button>
                <a-button class="editable-add-btn btn-theme right-btn" @click="handleAdd"><a-icon type="plus" />添加</a-button>
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
                  <span v-if="text==0">暂存</span>
                  <span v-if="text==1">申请</span>
                  <span v-if="text==2">运营</span>
                  <span v-if="text==3">停用</span>
                </template>
                <template slot="operation" slot-scope="text, record, index">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>移除</span>
                    </template>
                    <span class="btn-icon-theme" @click="() => handleDel(record.id)">移除</span>
                  </a-tooltip>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-drawer>
    <product-assets-add-modal
      :showModal="showModal"
      @close="closeModal"
      :params="modalParams"
    ></product-assets-add-modal>
  </div>
</template>
<script>
// import {getOrganizationList, getOrganizationPath} from '@api/sysManage'
// import {getUserSelectList} from '@api/userManage'
// import {getUserSelectList, findUserByOrgnizationId} from '@api/userManage'
import {getProductAssetsItemList, deleteBindAssetsItem} from '@api/productManage'
import util from '@util/util'
import ProductAssetsAddModal from './ProductAssetsAddModal'
// import {getAssetClassListById} from '@api/sysManage'

export default {
  components: {ProductAssetsAddModal},
  props: {
    showDrawer: {
      type: Boolean,
      default () {
        return false
      }
    },
    isSee: {
      type: Boolean,
      default () {
        return false
      }
    },
    params: Object
  },
  data () {
    const columns = [{
      title: '资产名称',
      dataIndex: 'name'
    }, {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      scopedSlots: {customRender: 'status'}
    }, {
      title: '备注',
      width: 120,
      dataIndex: 'others'
    }, {
      title: '操作',
      width: 80,
      align: 'right',
      scopedSlots: { customRender: 'operation' }
    }]
    const tabsData = [
      {'id': 1, 'name': '域名'},
      {'id': 2, 'name': '服务器'},
      {'id': 3, 'name': 'ICP备案'},
      {'id': 4, 'name': '应用平台'},
      {'id': 5, 'name': '云服务平台'},
      {'id': 6, 'name': '数据平台'},
      {'id': 7, 'name': '开发平台'},
      {'id': 8, 'name': '短信息平台'},
      {'id': 9, 'name': '统计平台'}
    ]
    return {
      data: [],
      pagination: util.TABLE.pagination,
      selectedRowKeys: [],
      loading: false,
      columns,
      tabsData,
      // defaultActiveKey: '',
      activeKey: '',
      mode: 'top',
      modalParams: {},
      showModal: false
    }
  },
  mounted () {
    this.getTabsData()
  },
  methods: {
    callback (val) {
      console.log(val)
    },
    onClose (refresh) {
      this.$emit('close', refresh)
    },
    tabChange (key) {
      this.activeKey = key
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch()
    },
    onTableSelChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    getTabsData () {
      this.activeKey = this.tabsData[0].id
      // getAssetClassListById({parentId: 2}).then((data) => {
      //   this.tabsData = data.data
      // }).catch(function (error) {
      //   console.log('获取头部资产列表数据报错：' + error)
      // })
    },
    fetch (params = {}) {
      this.loading = true
      let _this = this
      params.pageSize = this.pagination.pageSize
      params.pageNo = this.pagination.current
      params.productId = this.params.id
      params.type = this.activeKey
      getProductAssetsItemList(params).then((data) => {
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
    handleDel (params) {
      if (params) {
        this.del([params])
      } else {
        if (this.selectedRowKeys.length > 0) {
          this.del(this.selectedRowKeys)
        } else {
          this.$message.info('请勾选待移除项')
        }
      }
    },
    del (ids) {
      let _this = this
      deleteBindAssetsItem({ids}).then((data) => {
        if (data.success) {
          _this.$message.success('移除成功')
          this.selectedRowKeys = []
          this.fetch({'productId': this.params.id})
        }
      }).catch(function (error) {
        _this.loading = false
        console.log(error)
        // _this.$Message.error(error)
      })
    },
    handleAdd () {
      // let ids = this.selectedRowKeys
      this.showModal = true
      this.modalParams.productId = this.params.id
      this.modalParams.type = this.activeKey
    },
    /* 弹框 start */
    // 关闭弹框
    closeModal (param) {
      this.showModal = false
      if (param === 'refresh') {
        this.fetch()
      }
    }
    /* 弹框 end */
  },
  watch: {
    showDrawer (val, oldVal) {
      if (val === true) {
        this.fetch()
      }
    }
  }
}
</script>
<style scoped lang="less">
  @import "~@var";

</style>
<style lang="less">
  .productAssetsDrawer .ant-drawer-body {
    padding: 0;
  }
</style>
