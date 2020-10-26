<!--资产类目管理-->
<template>
  <div class="relative asset-class-manage">
    <div class="header-right">
      <a-input-search
      placeholder="请输入资产类目名称"
      style="width: 240px"
      @search="onSearch"
    /></div>
    <div class="table-box">
      <div class="clearfix">
        <div class="title fl">资产类目列表</div>
        <!--<a-button class="editable-add-btn btn-white fr" @click="handleAdd">批量删除</a-button>
        <a-button class="editable-add-btn btn-theme fr mar-r-8" @click="handleAdd"><a-icon type="plus" />新增类目</a-button>-->
      </div>
      <a-table :columns="columns"
               :dataSource="data"
               :loading="loading">
        <template slot="operation" slot-scope="text, record, index">
          <span v-if = "record.type < 3">
            <a class="themeColor" @click="() => handleAdd(text, record, index)"><a-icon type="plus" />新增子类目</a>
            <i class="btn-sep" v-if="record.type>1" ></i>
          </span>
          <div v-else class="space"></div>
          <a-tooltip placement="top" v-if="record.type>1">
            <template slot="title">
              <span>编辑</span>
            </template>
            <a-icon class="grey-btn" type="form" @click="() => handleEdit(text, record, index)"/>
          </a-tooltip>
          <i class="btn-sep" v-if="record.type>1" ></i>
          <a-tooltip placement="top" v-if="record.type>1">
            <template slot="title">
              <span>删除</span>
            </template>
            <a-icon class="grey-btn" type="delete" @click="() => handleDelete(record.key, record.name)"/>
          </a-tooltip>
        </template>
      </a-table>
    </div>
    <form-modal :showModal="showModal" @cancel="closeModal()" :title="modalTitle" @ok="modalHandleOk()" :showTip="showTip">
      <ul class="form-box">
        <li>
          <span class="title">类目名称：</span>
          <a-input v-model="className" class="content" placeholder="请输入类目名称" />
        </li>
      </ul>
    </form-modal>
    <asset-class-item-drawer :showDrawer="showDrawer" :params="drawerParams" @cancel="closeDrawer"></asset-class-item-drawer>
  </div>
</template>

<script>
import {getAssetClassListById, addAssetClass, delAssetClass} from '@api/sysManage'
import AssetClassModal from './AssetClassModal'
import FormModal from '@comp/modal/FormModal'
import util from '@util/util'
import AssetClassItemDrawer from './AssetClassItemDrawer'

const columns = [{
  title: '类目名称',
  dataIndex: 'name',
  key: 'id',
  width: '70%',
  scopedSlots: { customRender: 'name' }
}, {
  title: '操作',
  align: 'right',
  scopedSlots: { customRender: 'operation' },
  width: '30%'
}]

export default {
  data () {
    return {
      data: [],
      pagination: util.TABLE.pagination,
      loading: false,
      firstClassList: [],
      firstSelectedId: 0,
      columns,
      searchName: '',
      showModal: false,
      modalTitle: '',
      modalParams: {},
      drawerParams: {},
      showDrawer: false,
      className: '',
      showTip: {error: false}
    }
  },
  components: {
    AssetClassItemDrawer,
    FormModal,
    AssetClassModal
  },
  mounted () {
    this.fetch()
  },
  methods: {
    // 获取表格数据
    fetch (params = {}) {
      this.loading = true
      let _this = this
      getAssetClassListById(params).then(function (data) {
        _this.loading = false
        if (data.success) {
          let arr = []
          if (data.data.length > 0) {
            arr = util.convertTableTreeData(data.data, 'id')
          }
          const pagination = { ..._this.pagination }
          pagination.total = data.total
          _this.pagination = pagination
          _this.data = arr
        } else {
          _this.data = []
          _this.pagination.total = 0
        }
      }).catch(function (error) {
        _this.loading = false
        console.log('获取资产类目列表数据报错：' + error)
      })
    },
    // 新增子类目按钮
    handleAdd (text, record, index) {
      this.className = ''
      this.showModal = true
      this.modalTitle = '新增类目'
      this.modalParams = record
    },
    // 新增动态字段按钮
    handleAddItem (text, record, index) {
      this.showDrawer = true
      this.drawerParams = record
    },
    // 编辑按钮
    handleEdit (text, record, index) {
      if (record.type === 3) {
        this.handleAddItem(text, record, index)
      } else {
        this.showModal = true
        this.modalTitle = '编辑类目'
        this.className = record.name
        this.modalParams = record
      }
    },
    // 删除按钮
    handleDelete (key, name) {
      let _this = this
      util.delConfirm(name, () => {
        delAssetClass({id: key}).then((data) => {
          _this.$message.success('删除成功')
          _this.fetch()
        }).catch((error) => {
          console.log('删除子类目error:' + error)
        }
        )
      })
    },
    // 条件筛选
    onSearch (value) {
      this.fetch({
        name: value
      })
    },
    // 关闭弹框
    closeModal () {
      this.showModal = false
    },
    // 关闭抽屉
    closeDrawer (param) {
      this.showDrawer = false
      if (param === 'refresh') {
        this.fetch()
      }
    },
    // 弹框确认按钮
    modalHandleOk (e) {
      let _this = this
      let params = {}
      if (util.isEmpty(this.className)) {
        this.showTip.error = '内容未完成'
        return
      }
      if (this.modalTitle.indexOf('编辑') > -1) {
        params = {id: this.modalParams.id, name: this.className}
      } else {
        params = {parentId: this.modalParams.id, name: this.className}
      }
      addAssetClass(params).then((data) => {
        _this.fetch()
      }).catch((error) => {
        console.log('新增子类目error:' + error)
      }
      )
      this.showModal = false
    }
  }
}
</script>

<style scoped lang="less">
  @import "~@var";
  .tag{
    margin-right: 32px;
    color: @blackBody;
    cursor: pointer;
    line-height: 22px;
    padding: 0 8px;
  }
  .tag:last-of-type{
    margin-right: 0;
  }
  .tag.active{
    background-color: @theme;
    color: @fff;
    border-radius: 4px;
  }
  .space{
    display: inline-block;
    width: 127px;
  }
</style>
