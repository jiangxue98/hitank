<template>
  <div>
    <query-select-box v-if="zeroId==0" queryTitle="名称查询" queryPlaceholder="资产名称" select-title="所属类目"
                      ref="querySelect" @onSearch="onSearch"
    ></query-select-box>
    <query-select-box v-else queryTitle="名称查询" queryPlaceholder="资产名称或负责人" select-title="所属类目"
                      :secondList="secondList" :first-list="firstList" :isLock="true" :zeroId="zeroId"
                      ref="querySelect"
                      @firstClick = "firstClick" @secondClick="secondClick" @onSearch="onSearch"
    ></query-select-box>
    <div class="table-box">
      <div class="clearfix">
        <div class="title fl">资产列表</div>
        <a-button class="editable-add-btn btn-theme right-btn"  v-if="(zeroId==4&&role=='admin')||(zeroId!=4&&zeroId!=0)" @click="handleHeaderAdd"><a-icon type="plus" />新增资产</a-button>
      </div>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :loading="loading"
               :pagination="pagination"
               @change="handleChange">
        <template slot="name" slot-scope="text, record">
          <span v-if="zeroId==4&&role!='admin'" class="a-btn-text" @click="SeeDetailAsset4(text, record)">{{text}}</span>
          <span v-else class="a-btn-text" @click="seeDetail(text, record)">{{text}}</span>
        </template>
        <template slot="endDate" slot-scope="text">
          <span class="a-btn-text" v-if="text">{{text.substr(0,10)}}</span>
          <span class="a-btn-text" v-else>长期</span>
        </template>
        <template slot="deptIdName" slot-scope="text">
          <span v-if="flowB === false">{{text}}</span>
          <span v-else></span>
        </template>
        <template slot="status" slot-scope="text">
          <span v-if="text=='0'" class="status stop">暂存</span>
          <span v-if="text=='1'" class="status stop">申请中</span>
          <span v-if="text=='3'" class="status stop">停用</span>
          <span v-if="text=='2'" class="status">运营中</span>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <span v-if="zeroId==0 || zeroId==1 || zeroId==2 || zeroId==3 || zeroId==4&&role=='admin'">
            <a class="themeColor" v-if="role != 'admin' && record.ownerId != userId && record.status == 2 && !record.participateId.split(',').includes(userId)" @click="handleAdd(text, record, index)">申请使用</a>
            <a-tooltip placement="top" v-if="role == 'admin' || record.ownerId == userId">
              <template slot="title">
                <span>编辑</span>
              </template>
              <a-icon class="grey-btn" type="form" @click="() => handleEdit(text, record, index)"/>
            </a-tooltip>
            <i class="btn-sep"  v-if="role == 'admin' || record.ownerId == userId"></i>
            <a-tooltip placement="top" v-if="role == 'admin' || record.ownerId == userId">
              <template slot="title">
                <span>更多</span>
              </template>
              <a-dropdown placement="bottomRight" :trigger="['click']">
                <a-icon class="grey-btn more-icon" type="ellipsis"/>
                <a-menu slot="overlay">
                  <a-menu-item key="1" v-if="record.ownerId == userId" @click="() => handleDown(record.id, record.name)">资产注销</a-menu-item>
                  <a-menu-item key="2" v-if="role == 'admin'" @click="() => handleDelete(record)">资产删除</a-menu-item>
                  <a-menu-item key="3" v-if="role == 'admin'" @click="() => handleCheckLog(record.id, record.name)">操作日志</a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-tooltip>
          </span>
          <span v-if="zeroId==4&&role!='admin'">
            <a class="btn-icon-theme" @click="SeeDetailAsset4(text, record)">查看账号</a>
            <i class="btn-sep"></i>
            <a class="btn-icon-theme" @click="handleGo(record)">前往网站>></a>
          </span>
        </template>
      </a-table>
    </div>
    <apply-asset-modal
      :showModal="showModal"
      @close="closeModal"
      :params="modalParams"
    ></apply-asset-modal>
    <asset-down-modal
      :showModal="showDownModal"
      @close="closeModal"
      :params="modalDownParams"
    ></asset-down-modal>
    <add-asset-drawer :showDrawer="showDrawer" :isSee="isSee" :params="drawerParams" @cancel="closeDrawer"></add-asset-drawer>
    <confidentiality-agreements
      :showModal="showAgreementModal"
      @close="closeModal"
      :params="modalAgreementParams"
    >
    </confidentiality-agreements>
    <apply-asset-flow-b-drawer
      :showDrawer="showApplyDrawer"
      @close="closeDrawer"
      :params="drawerApplyParams"
    >
    </apply-asset-flow-b-drawer>
  </div>
</template>

<script>
import {getAssetsList, deleteAssets, getAssets, findSignStateById, findPublicityAssetsItemById, getAssetsSearchList} from '@api/digitalAssets'
import {getAssetClassListById} from '@api/sysManage'
import FormModal from '@comp/modal/FormModal'
import AddAssetDrawer from './AddAssetDrawer'
import util from '@util/util'
import QuerySelectBox from '@comp/QuerySelectBox'
import store from '@/store'
import AssetDownModal from './AssetDownModal'
import ApplyAssetModal from './ApplyAssetModal'
import ConfidentialityAgreements from './ConfidentialityAgreements.vue'
import ApplyAssetFlowBDrawer from './ApplyAssetFlowBDrawer'

let id = '0'
export default {
  components: {
    ApplyAssetFlowBDrawer,
    ApplyAssetModal,
    AssetDownModal,
    QuerySelectBox,
    FormModal,
    ConfidentialityAgreements,
    AddAssetDrawer
  },
  data () {
    return {
      role: '',
      userId: '',
      /* 表格 begin */
      data: [],
      pagination: util.TABLE.pagination,
      // locale: TABLE.locale,
      loading: false,
      // columns,
      searchName: '',
      filteredInfo: null,
      sortedInfo: null,
      /* 表格 end */
      firstList: [],
      secondList: [],
      zeroId: id,
      // selectDefault: [],
      /* modal start */
      showModal: false,
      modalParams: {},
      /* drawer start */
      isSee: false,
      showDrawer: false,
      drawerParams: {},
      /* drawer end */
      /* down modal start */
      modalDownParams: {},
      showDownModal: false,
      /* down modal end */
      /* modal start */
      showAgreementModal: false,
      modalAgreementParams: {},
      /* drawer start */
      /* applyDrawer start */
      showApplyDrawer: false,
      drawerApplyParams: {}
      /* applyDrawer end */
    }
  },
  created () {
    let cur = this.$router.currentRoute
    id = cur.name.split('_')[1]
    this.zeroId = id
  },
  mounted () {
    // 搜索
    if (Number(id) === 0) {
      this.fetchSearch({searchLevel: 1, lastLevelValue: id})
    } else {
      this.fetch({searchLevel: 1, lastLevelValue: id})
    }
    this.getClassList({parentId: id}, (data) => {
      if (this.$refs.querySelect) {
        this.firstList = this.$refs.querySelect.initFirst(data.data)
      }
    })
    store.dispatch('getUserInfo').then(userInfo => {
      this.role = userInfo.role
      this.userId = userInfo.userId
    }).catch((err) => {
      console.log('获取用户信息错误：' + err)
    })
  },
  methods: {
    // 获取表格数据
    fetch (params = {}) {
      this.loading = true
      let _this = this
      params.pageSize = this.pagination.pageSize
      params.pageNo = this.pagination.current
      getAssetsList(params).then(function (data) {
        const pagination = { ..._this.pagination }
        _this.loading = false
        _this.$refs.querySelect.lock = false
        if (data.success && data.total > 0) {
          data.data = util.filterTableData(data.data)
          pagination.total = data.total
          _this.pagination = pagination
          _this.data = data.data
        } else {
          _this.data = []
          _this.pagination.total = 0
        }
      })
        .catch(function (error) {
          _this.loading = false
          console.log('获取资产列表数据报错：' + error)
        })
    },
    // 获取搜索表格数据
    fetchSearch (params = {}) {
      this.loading = true
      let _this = this
      params.pageSize = this.pagination.pageSize
      params.pageNo = this.pagination.current
      getAssetsSearchList(params).then(function (data) {
        const pagination = { ..._this.pagination }
        _this.loading = false
        if (data.success && data.total > 0) {
          data.data = util.filterTableData(data.data)
          pagination.total = data.total
          _this.pagination = pagination
          _this.data = data.data
        } else {
          _this.data = []
          _this.pagination.total = 0
        }
      })
        .catch(function (error) {
          _this.loading = false
          console.log('获取资产列表数据报错：' + error)
        })
    },
    refreshFetch () {
      if (id === '0') {
        let { value } = this.$refs.querySelect.getAll()
        this.fetchSearch({assetsItemName: value})
      } else {
        let { searchLevel, lastLevelValue, value } = this.$refs.querySelect.getAll()
        this.fetch({
          searchLevel: searchLevel,
          lastLevelValue: lastLevelValue,
          assetsItemName: value
        })
      }
    },
    // 条件筛选
    onSearch (value) {
      this.refreshFetch(value)
    },
    handleGo (record) {
      // this.$message.info('此功能正在开发，敬请期待！')
      if (record.goUrl) {
        window.open(record.goUrl, '_blank')
      } else {
        this.$message.info('此资产未维护网站地址')
      }
    },
    // 新增资产按钮
    handleHeaderAdd () {
      this.drawerParams = {}
      this.drawerParams.role = this.role
      this.drawerParams.ownerId = this.userId
      this.showDrawer = true
    },
    // 申请使用按钮
    handleAdd (text, record, index) {
      if (this.flowB) {
        this.drawerApplyParams = record
        this.showApplyDrawer = true
      } else {
        this.modalParams = record
        this.showModal = true
      }
    },
    SeeDetailAsset4 (text, record) {
      let assetsItemId = record.id
      findSignStateById({assetsItemId}).then((data) => {
        if (data.data === 0) {
          // 打开保密协议弹窗
          this.modalAgreementParams = record
          this.showAgreementModal = true
        } else {
          this.seeDetail(text, record)
        }
      }).catch((error) => {
        console.log('查询findSignStateById出错：' + error)
      })
    },
    seeDetail (text, record) {
      let assetsTypeFirstLevelId = record.assetsTypeFirstLevelId
      // 共享
      if (Number(this.zeroId) === 4 && this.role !== 'admin') {
        findPublicityAssetsItemById({id: record.id}).then((data) => {
          this.drawerParams = util.convertObjDataEmpty(data.data)
          this.drawerParams.role = this.role
          this.drawerParams.assetsTypeFirstLevelId = assetsTypeFirstLevelId
          this.showDrawer = true
          this.isSee = true
        })
      } else {
        getAssets({id: record.id}).then((data) => {
          this.drawerParams = util.convertObjDataEmpty(data.data)
          this.drawerParams.role = this.role
          this.drawerParams.assetsTypeFirstLevelId = assetsTypeFirstLevelId
          this.showDrawer = true
          this.isSee = true
        })
      }
    },
    // 编辑按钮
    handleEdit (text, record, index) {
      let assetsTypeFirstLevelId = record.assetsTypeFirstLevelId
      getAssets({id: record.id}).then((data) => {
        this.drawerParams = data.data
        this.drawerParams.assetsTypeFirstLevelId = assetsTypeFirstLevelId
        this.drawerParams.role = this.role

        this.showDrawer = true
      })
    },
    // 删除按钮
    handleDelete (record) {
      let _this = this
      if (record.status !== 3) {
        _this.$message.success('请资产注销后再删除！')
        return
      }
      let key = record.id
      let name = record.name
      util.delConfirm(name, () => {
        deleteAssets({id: key}).then((data) => {
          _this.$message.success('删除成功')
          _this.refreshFetch()
        }).catch((error) => {
          console.log('删除小微error:' + error)
        }
        )
      })
    },
    // 注销按钮
    handleDown (key, name) {
      let _this = this
      _this.showDownModal = true
      _this.modalDownParams = {id: key, name}
      // if (_this.role === 'admin') {
      //   _this.$message.success('正在建设中，敬请期待！')
      // } else {
      //   _this.showDownModal = true
      //   _this.modalDownParams = {id: key, name}
      // }
    },
    // 操作日志
    handleCheckLog (key, name) {
      this.$router.push({path: '/asset_log', query: {name: name, id: key}})
    },
    /* modal弹框 start */
    // 关闭弹框
    closeModal (param) {
      this.showModal = false
      this.showDownModal = false
      this.showAgreementModal = false
      if (param === 'refresh') {
        this.refreshFetch()
      }
      if (param && param.indexOf('openDetail') > -1) {
        let id = param.split('&')[1]
        this.seeDetail('', {id})
      }
    },
    /* modal弹框 end */

    /* drawer start */
    // 关闭抽屉
    closeDrawer (param) {
      this.isSee = false
      this.showDrawer = false
      this.showApplyDrawer = false
      if (param === 'refresh') {
        this.refreshFetch()
      }
    },
    /* drawer end */
    // 获取头部列表数据
    getClassList (params = {}, cb) {
      // let _this = this
      getAssetClassListById(params).then(function (data) {
        cb(data)
      })
        .catch(function (error) {
          console.log('获取头部资产列表数据报错：' + error)
        })
    },
    firstClick (record) {
      this.getClassList({parentId: record.id}, (data) => {
        this.secondList = this.$refs.querySelect.refreshSecond(data.data)
      })
      this.refreshFetch()
    },
    secondClick (record) {
      this.refreshFetch()
    },
    handleMoreClick (record) {
      this.$message.info('此功能正在开发中，敬请期待')
      this.refreshFetch()
    },
    handleChange (pagination, filters, sorter) {
      console.log(pagination)
      this.filteredInfo = filters
      this.sortedInfo = sorter
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      let { searchLevel, lastLevelValue, value } = this.$refs.querySelect.getAll()
      if (id === '0') {
        this.fetchSearch({assetsItemName: value})
      } else {
        this.fetch({
          searchLevel: searchLevel,
          lastLevelValue: lastLevelValue,
          assetsItemName: value,
          pageSize: pager.pageSize,
          pageNo: pager.current
        })
      }
    }
  },
  computed: {
    columns () {
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      // sortedInfo = sortedInfo || {}
      let columns = [{
        title: '资产名称',
        scopedSlots: { customRender: 'name' },
        width: '33%',
        dataIndex: 'name'
      }, /* {
        title: '所属小微',
        width: '10%',
        scopedSlots: { customRender: 'deptIdName' },
        dataIndex: 'deptIdName'
      }, */{
        title: '到期时间',
        scopedSlots: { customRender: 'endDate' },
        dataIndex: 'endDate'
        // key: 'endDate',
        // sorter: (a, b) => a.endDate > b.endDate,
        // sortOrder: sortedInfo.columnKey === 'endDate' && sortedInfo.order
      }, {
        title: '状态',
        dataIndex: 'status',
        width: '120',
        scopedSlots: { customRender: 'status' },
        filters: [{ text: '运营中', value: '运营中' }, { text: '停用', value: '停用' }, { text: '暂存', value: '暂存' }, { text: '申请中', value: '申请中' }],
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => {
          let stateObj = {'运营中': '2', '停用': '3', '暂存': '0', '申请中': '1'}
          if (record.status) {
            return record.status.toString().includes(stateObj[value])
          } else {
            return ''
          }
        }
      }, {
        title: '负责人',
        dataIndex: 'ownerIdName'
      }, {
        title: '操作',
        align: 'right',
        scopedSlots: { customRender: 'operation' }
      }]
      if (Number(id) === 0) {
        columns.splice(1, 0, {
          title: '资产类型',
          scopedSlots: { customRender: 'assetsTypeNameAll' },
          dataIndex: 'assetsTypeNameAll'
        })
      }
      return columns
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
