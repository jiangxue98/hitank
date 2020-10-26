<!--小微管理-->
<template>
  <div class="relative">
    <query-select-box queryPlaceholder="平台或小微名称" @onSearch="onSearch"></query-select-box>
    <div class="table-box">
      <div class="clearfix">
        <div class="title fl">小微列表</div>
        <a-button class="editable-add-btn btn-theme right-btn" @click="handleHeaderAdd"><a-icon type="plus" />新增平台</a-button>
      </div>
      <a-table :columns="columns"
               :dataSource="data"
               :loading="loading">
        <template slot="operation" slot-scope="text, record, index">
          <a class="themeColor" v-if="record.children || record.parentId == 0" @click="() => handleAdd(text, record, index)"><a-icon type="plus" />新增子小微</a>
          <i class="btn-sep" v-if="record.children || record.parentId == 0"></i>
          <div v-else class="space"></div>
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
            <a-icon class="grey-btn" type="delete" @click="() => handleDelete(record.key, record.name)"/>
          </a-tooltip>
        </template>
      </a-table>
    </div>
    <form-modal :showModal="showModal" @cancel="closeModal()" :title="modalTitle" @ok="modalHandleOk()" :showTip="showTip">
      <ul class="form-box">
        <li>
          <span class="title">{{modalType}}名称：</span>
          <a-input v-model="deptName" class="content" :placeholder="'请输入'+modalType+'名称'" />
        </li>
        <li>
          <span class="title">{{modalType}}编号：</span>
          <a-input v-model="deptCode" class="content" :placeholder="'请输入'+modalType+'编号'"  />
        </li>
      </ul>
    </form-modal>
  </div>
</template>

<script>
import {getOrganizationListByName, addOrganizationClass, delOrganizationClass} from '@api/sysManage'
import QuerySelectBox from '@comp/QuerySelectBox'
import AssetClassModal from './AssetClassModal'
import FormModal from '@comp/modal/FormModal'
import util from '@util/util'

const columns = [{
  title: '平台/小微名称',
  dataIndex: 'name',
  key: 'id',
  width: '35%',
  scopedSlots: { customRender: 'name' }
}, {
  title: '平台/小微编码',
  width: '25%',
  dataIndex: 'code'
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
      // locale: TABLE.locale,
      loading: false,
      firstClassList: [],
      firstSelectedId: 0,
      columns,
      searchName: '',
      showModal: false,
      modalTitle: '',
      modalParams: {},
      deptName: '',
      deptCode: '',
      showTip: {error: false},
      modalType: '小微'
    }
  },
  components: {
    FormModal,
    QuerySelectBox,
    AssetClassModal
  },
  mounted () {
    this.fetch({name: this.searchName})
  },
  methods: {
    // 获取表格数据
    fetch (params = {}) {
      this.loading = true
      let _this = this
      getOrganizationListByName(params).then(function (data = []) {
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
        }
      })
        .catch(function (error) {
          console.log('获取小微管理列表数据报错：' + error)
        })
    },
    // 新增平台按钮
    handleHeaderAdd () {
      this.deptName = ''
      this.deptCode = ''
      this.showModal = true
      this.modalTitle = '新增平台'
      this.modalType = '平台'
      this.modalParams = {}
    },
    // 新增小微按钮
    handleAdd (text, record, index) {
      this.deptName = ''
      this.deptCode = ''
      this.showModal = true
      this.modalTitle = '新增小微'
      this.modalType = '小微'
      this.modalParams = record
    },
    // 编辑按钮
    handleEdit (text, record, index) {
      this.showModal = true
      if (record.hasCompareParent) {
        this.modalTitle = '编辑小微'
      } else {
        this.modalTitle = '编辑平台'
      }
      this.deptName = record.name
      this.deptCode = record.code
      this.modalParams = record
    },
    // 删除按钮
    handleDelete (key, name) {
      let _this = this
      util.delConfirm(name, () => {
        delOrganizationClass({id: key}).then((data) => {
          if (data.success) {
            _this.$message.success('删除成功')
            _this.fetch()
          }
        }).catch((error) => {
          console.log('删除小微error:' + error)
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
    // 弹框确认按钮
    modalHandleOk (e) {
      let _this = this
      let params = {}
      if (util.isEmpty(this.deptName) || util.isEmpty(this.deptCode)) {
        this.showTip.error = '内容未完成'
        return
      }
      if (this.modalTitle.indexOf('编辑') > -1) {
        params = {id: this.modalParams.id, name: this.deptName, code: this.deptCode}
      } else {
        let pid = this.modalParams && this.modalParams.id ? this.modalParams.id : 0
        params = {parentId: pid, name: this.deptName, code: this.deptCode}
      }
      if (this.modalTitle.indexOf('平台') > -1) {
        params['type'] = 1
      }
      addOrganizationClass(params).then((data) => {
        _this.fetch()
      }).catch((error) => {
        console.log('新增小微error:' + error)
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
