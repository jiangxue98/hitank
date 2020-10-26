<template>
  <div>
    <div class="detail-container">
      <div class="logo">
        <img :src="src">
      </div>
      <div class="detail-box">
        <span class="title">{{data.name}}<span v-if="data.abbreviation">（{{data.abbreviation}}）</span></span>
        <a-icon type="edit" @click="handleEdit" class="editBtn">编辑</a-icon>
        <div class="detail">
          <span class="titleLeft">项目主人：{{data.userIdName}}</span>
          <span v-if="data.platUserIdName && data.smallUserIdName">平台主/小微主：{{data.platUserIdName}}/{{data.smallUserIdName}}</span>
          <span v-else-if="data.platUserIdName">平台主：{{data.platUserIdName}}</span>
        </div>
        <div class="detail">
          <span class="titleLeft">所属平台：{{data.platIdName}}</span>
          <span v-if="data.projPass==1">立项起止时间：{{data.passUpTime.substring(0, 10)}}~{{data.passDownTime.substring(0, 10)}}</span>
        </div>
        <div class="detail-right">
          <a-row class="detail-right-title ta-r">
            <a-col :span="12" >是否立项</a-col>
            <a-col :span="12" class="">状态</a-col>
          </a-row>
          <a-row class="ta-r">
            <a-col :span="12" >
              <span class="project" v-if="data.projPass==1" style="color:#52C41A">已立项</span>
              <span class="project" style="color:#F5222D" v-else>未立项</span>
            </a-col>
            <a-col :span="12">
              <span class="state" v-if="data.state==1">开发测试</span>
              <span class="state" v-else-if="data.state==2">上线迭代</span>
              <span class="state"  v-else-if="data.state==3">下架</span>
              <span class="state"  v-else-if="data.state==4">冻结</span>
            </a-col>
          </a-row>
        </div>
    </div>
      <div class="changeMenu">
        <span v-bind:class="currentTab==1?'clickMenu':''" @click="changeTab(1)" class="MenuLeft">基本信息</span>
        <span :class="currentTab==2?'clickMenu':''" @click="changeTab(2)" class="MenuLeft">产品变更记录</span>
        <span :class="currentTab==3?'clickMenu':''" @click="changeTab(3)" class="MenuLeft">产品发布记录</span>
        <span :class="currentTab==4?'clickMenu':''" @click="changeTab(4)" class="MenuLeft">产品下架记录</span>
        <span :class="currentTab==5?'clickMenu':''" @click="changeTab(5)" class="MenuLeft">产品封存记录</span>
      </div>
    </div>
    <!--基本信息-->
    <div v-show="currentTab==1" class="content info-box">
      <a-row>
        <a-col :span="8">
          <div><span class="info-title">产品编号：</span>{{data.id}}</div>
          <div><span class="info-title">ALM应用编码（S码）：</span>{{data.almId}}</div>
          <div><span class="info-title">应用类型：</span>{{productType}}</div>
          <div><span class="info-title" v-if="data.projPass==1">项目编码：</span>{{data.projId}}</div>
        </a-col>
        <a-col :span="16" class="info-right">
          <div class="info-title">战略描述与定位：</div>
          <div>{{data.zldw}}</div>
          <div class="info-title">目标用户及描述：</div>
          <div>{{data.mbyh}}</div>
          <div class="info-title">功能描述：</div>
          <div>{{data.gnms}}</div>
          <div class="info-title">产品介绍：</div>
          <div>{{data.intro}}</div>
        </a-col>
      </a-row>
    </div>

    <!--产品变更记录-->
    <div v-show="currentTab==2" class="content" >
      <div class="table-title-bar clearfix">
        <div class="title fl">变更内容</div>
        <a-button class="editable-add-btn btn-theme right-btn" @click="handleModify"><a-icon type="retweet"/>产品变更</a-button>
      </div>
      <a-table :columns="modifyColumns"
               :rowKey="record => record.id"
               :dataSource="modifyData"
               :pagination="modifyPagination"
               :loading="modifyLoading"
               :scroll="{ x: 1500 }"
               @change="handleModifyTableChange"
      >
        <template slot="changeTime" slot-scope="text, record">
          {{text.substr(0,10)}}
        </template>
        <template slot="platIdName" slot-scope="text, record">
          {{text}}/{{record.platUserIdName}}
        </template>
        <template slot="smallIdName" slot-scope="text, record">
          {{text}}/{{record.smallUserIdName}}
        </template>
        <template slot="operation" slot-scope="text, record">
          <div v-for="file in text.picJsonUtilses" :key="file.id" class="btn-icon-theme" @click="downFile(file.url)">
            {{file.name}}
          </div>
        </template>
      </a-table>
    </div>

    <!--产品发布记录-->
    <div v-show="currentTab==3" class="content publish-container">
      <div>
        <a-button class="editable-add-btn btn-theme publish-btn" @click="handlePublish"><i class="iconfont iconsend f14" style="padding-right: 8px"></i>产品发布</a-button>
        <a-timeline v-if="publishData && publishData.length>0">
          <a-timeline-item class="publish-item" v-for="(item,index) in publishData" :key="index">
            <div class="publish-item-box">
              <div class="publish-item-content">
                <div class="title">{{item.name}}</div>
                <div class="second-bar">
                  <span class="item">发布时间：{{item.publistTime.substr(0,10)}}</span>
                  <span class="item">操作人：{{item.createByName}}</span>
                  <span class="item">操作时间：{{item.createTime}}</span>
                </div>
                <div class="text">
                  <span>{{item.intro && item.intro.substr(0,145)}}</span><!--
                  --><span :ref="'publish_'+index" v-show="item.intro && item.intro.length>145">
                    <span class="dots" style="display: inline">... </span><!--
                  --><span class="moretext" style="display: none">{{item.intro.substring(145)}}</span><!--
                  --><span @click="handleExpand('publish_',index)" class="btn-icon-theme">展开全部</span>
                  </span>
                </div>
                <div v-for="file in item.picJsonUtilses" :key="file.id" class="btn-icon-theme" @click="downFile(file.url)">
                  <a-icon type="paper-clip" />{{file.name}}
                </div>
              </div>
            </div>
          </a-timeline-item>
        </a-timeline>
        <empty v-else class="pad-t-40 pad-d-30" type="empty"></empty>
      </div>
    </div>

    <!--产品下架记录-->
    <div v-show="currentTab==4" class="content publish-container">
      <div>
        <a-timeline v-if="removeData && removeData.length>0">
          <a-timeline-item class="publish-item" v-for="(item,index) in removeData" :key="index">
            <div class="publish-item-box">
              <div class="publish-item-content">
                <div class="title">{{data.name}} {{item.curVersion}}</div>
                <div class="second-bar">
                  <span class="item">下架时间：{{item.downTime.substr(0,10)}}</span>
                  <span class="item">操作人：{{item.createBy}}</span>
                  <span class="item">操作时间：{{item.createTime}}</span>
                </div>
                <div class="text">
                  <span>{{item.downReason && item.downReason.substr(0,145)}}</span><!--
                  --><span :ref="'remove_'+index" v-show="item.downReason && item.downReason.length>145">
                    <span class="dots" style="display: inline">... </span><!--
                  --><span class="moretext" style="display: none">{{item.downReason.substring(145)}}</span><!--
                  --><span @click="handleExpand('remove_',index)" class="btn-icon-theme">展开全部</span>
                  </span>
                </div>
                <div v-for="file in item.downApplyFileList" :key="file.id" class="btn-icon-theme" @click="downFile(file.url)">
                  <a-icon type="paper-clip" />{{file.name}}
                </div>
                <div v-for="file in item.downReportFileList" :key="file.id" class="btn-icon-theme" @click="downFile(file.url)">
                  <a-icon type="paper-clip" />{{file.name}}
                </div>
              </div>
            </div>
          </a-timeline-item>
        </a-timeline>
        <empty v-else class="pad-t-40 pad-d-30" type="empty"></empty>
      </div>
    </div>

    <!--产品封存记录-->
    <div v-show="currentTab==5" class="content publish-container">
      <div>
        <a-timeline v-if="freezeData && freezeData.length>0">
          <a-timeline-item class="publish-item" v-for="(item,index) in freezeData" :key="index">
            <div class="publish-item-box">
              <div class="publish-item-content">
                <div class="title">{{data.name}} {{item.curVersion}}</div>
                <div class="second-bar">
                  <span class="item">封存时间：{{item.freezeTime.substr(0,10)}}</span>
                  <span class="item">操作人：{{item.createBy}}</span>
                  <span class="item">操作时间：{{item.createTime}}</span>
                </div>
                <div class="text">
                  <span>{{item.freezeReason && item.freezeReason.substr(0,145)}}</span><!--
                  --><span :ref="'freeze_'+index" v-show="item.freezeReason && item.freezeReason.length>145">
                    <span class="dots" style="display: inline">... </span><!--
                  --><span class="moretext" style="display: none">{{item.freezeReason.substring(145)}}</span><!--
                  --><span @click="handleExpand('freeze_',index)" class="btn-icon-theme">展开全部</span>
                  </span>
                </div>
                <div v-for="file in item.freezeApplyFileList" :key="file.id" class="btn-icon-theme" @click="downFile(file.url)">
                  <a-icon type="paper-clip" />{{file.name}}
                </div>
                <div v-for="file in item.freezeReportFileList" :key="file.id" class="btn-icon-theme" @click="downFile(file.url)">
                  <a-icon type="paper-clip" />{{file.name}}
                </div>
              </div>
            </div>
          </a-timeline-item>
        </a-timeline>
        <empty v-else class="pad-t-40 pad-d-30" type="empty"></empty>
      </div>
    </div>

    <product-add-drawer
      :showDrawer="showDrawer"
      :params="drawerParams"
      @close="closeDrawer"
    >
    </product-add-drawer>
    <product-modify-drawer
      :showDrawer="showModifyDrawer"
      :params="modifyDrawerParams"
      @close="closeDrawer"
    >
    </product-modify-drawer>
    <product-publish-drawer
      :showDrawer="showPublishDrawer"
      :params="publishDrawerParams"
      @close="closeDrawer"
    >
    </product-publish-drawer>
  </div>
</template>

<script>
import {getProductById, getProductPublishList, getProductChangeList, getProductFreezeList, getProductDownList} from '@api/productManage'
// import '../../components/Empty'
import Empty from '../../components/Empty'
import Building from '../home/Building'
import ProductAddDrawer from './ProductAddDrawer'
import ProductPublishDrawer from './ProductPublishDrawer'
import global from '@util/global'
import util from '@util/util'
import ProductModifyDrawer from './ProductModifyDrawer'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'

var id
export default{
  data () {
    const modifyColumns = [
      {
        title: '序号',
        width: 110,
        dataIndex: 'id'
      }, {
        title: '变更人',
        width: 74,
        dataIndex: 'createByName'
      }, {
        title: '操作时间',
        width: 120,
        dataIndex: 'createTime'
      }, {
        title: '变更时间',
        width: 110,
        dataIndex: 'changeTime',
        scopedSlots: { customRender: 'changeTime' }
      }, {
        title: '变更原因',
        width: 150,
        dataIndex: 'changeReason'
      }, {
        title: '处理办法',
        width: 150,
        dataIndex: 'oldProjectMethod'
      }, {
        title: '项目主人',
        width: 90,
        dataIndex: 'userIdName'
      }, {
        title: '平台/平台主',
        width: 140,
        dataIndex: 'platIdName',
        scopedSlots: { customRender: 'platIdName' }
      }, {
        title: '小微/小微主',
        width: 140,
        dataIndex: 'smallIdName',
        scopedSlots: { customRender: 'smallIdName' }
      }, {
        title: '变更公议表',
        width: 130,
        fixed: 'right',
        scopedSlots: { customRender: 'operation' }
      }
    ]
    return {
      data: [],
      src: '',
      productType: '',
      currentTab: 1,
      showDrawer: false,
      drawerParams: {},
      /* publish start */
      publishData: [],
      showPublishDrawer: false,
      publishDrawerParams: {},
      /* publish end */
      /* Freeze start */
      freezeData: [],
      showFreezeDrawer: false,
      freezeDrawerParams: {},
      /* Freeze end */
      /* remove start */
      removeData: [],
      showRemoveDrawer: false,
      removeDrawerParams: {},
      /* remove end */
      /* modify start */
      showModifyDrawer: false,
      modifyDrawerParams: {},
      modifyPagination: util.TABLE.pagination,
      modifyData: [],
      modifyLoading: false,
      modifyColumns
      /* modify end */
    }
  },
  components: {
    ACol,
    ARow,
    ProductModifyDrawer,
    ProductAddDrawer,
    ProductPublishDrawer,
    Building,
    Empty
  },
  mounted () {
    id = this.$route.query.id
    if (util.isEmpty(id)) {
      this.$router.replace({path: '/productList'})
    } else {
      this.fetch()
    }
  },
  methods: {
    /* drawer start */
    handleEdit () {
      this.showDrawer = true
      this.drawerParams = this.data
      this.drawerParams['title'] = '编辑产品'
    },
    // 关闭抽屉
    closeDrawer (refresh) {
      this.showDrawer = false
      this.showPublishDrawer = false
      this.showModifyDrawer = false
      if (refresh === 'refresh') {
        this.fetch()
      }
    },
    /* drawer end */

    convertObj (key) {
      if (key.indexOf(',') > -1) {
        let arr = key.split(',')
        let str = ''
        for (let i of arr) {
          str += global.PRODUCT_TYPE_OBJ[i] + '，'
        }
        return str.substring(0, str.length - 1)
      } else {
        return global.PRODUCT_TYPE_OBJ[key]
      }
    },

    changeTab (index) {
      this.currentTab = index
      this.loadTab(index)
    },

    fetch () {
      this.getProduct()
      this.getModifyData()
      this.getPublishData()
    },

    loadTab (index) {
      switch (index) {
        case 1:
          this.getProduct()
          break
        case 2:
          this.getModifyData()
          break
        case 3:
          this.getPublishData()
          break
        case 4:
          this.getRemoveData()
          break
        case 5:
          this.getFreezeData()
          break
      }
    },

    // 展开收起
    handleExpand (name, index) {
      let node = this.$refs[name + index][0].childNodes
      // 展开全部
      if (node[2].textContent === '展开全部') {
        node[0].style.display = 'none'
        node[1].style.display = 'inline'
        node[2].textContent = '收起'
      } else {
        // 收起
        node[0].style.display = 'inline'
        node[1].style.display = 'none'
        node[2].textContent = '展开全部'
      }
    },

    // 下载附件
    downFile (url) {
      window.open(url, '_blank')
    },

    /* 基本信息 start */
    getProduct () {
      let params = {}
      params.id = id
      getProductById(params).then((data) => {
        this.data = data.data
        this.src = data.data.logo
        this.productType = this.convertObj(this.data.type)
      })
    },
    /* 基本信息 end */

    /* 产品变更 start */
    getModifyData () {
      let params = {}
      let _this = this
      params.productId = id
      params.pageSize = this.modifyPagination.pageSize
      params.pageNo = this.modifyPagination.current
      getProductChangeList(params).then((data) => {
        const pagination = { ..._this.modifyPagination }
        pagination.total = data.total
        _this.modifyPagination = pagination
        _this.modifyData = data.data
      })
    },
    handleModifyTableChange (pagination, filters, sorter) {
      const pager = { ...this.modifyPagination }
      pager.current = pagination.current
      this.modifyPagination = pager
      this.fetch()
    },
    handleModify () {
      this.showModifyDrawer = true
      this.modifyDrawerParams = {id, userId: this.data.userId}
    },
    /* 产品变更 end */

    /* 产品发布 start */
    getPublishData () {
      let params = {}
      let _this = this
      params.productId = id
      params.pageNo = 1
      params.pageSize = 999
      getProductPublishList(params).then((data) => {
        _this.publishData = data.data
      })
    },
    handlePublish () {
      this.showPublishDrawer = true
      this.publishDrawerParams = {id}
    },
    /* 产品发布 end */

    /* 产品下架 start */
    getRemoveData () {
      let params = {}
      let _this = this
      params.productId = id
      params.pageNo = 1
      params.pageSize = 999
      getProductDownList(params).then((data) => {
        _this.removeData = data.data
      })
    },
    handleRemove () {
      this.showRemoveDrawer = true
      this.removeDrawerParams = {id}
    },
    removeFile (record) {
      window.open(record.picJsonUtilses.url, '_blank')
    },
    /* 产品下架 end */

    /* 产品封存 start */
    getFreezeData () {
      let params = {}
      let _this = this
      params.productId = id
      params.pageNo = 1
      params.pageSize = 999
      getProductFreezeList(params).then((data) => {
        _this.freezeData = data.data
      })
    },
    handleFreeze () {
      this.showFreezeDrawer = true
      this.freezeDrawerParams = {id}
    },
    FreezeFile (record) {
      window.open(record.picJsonUtilses.url, '_blank')
    }
    /* 产品封存 end */
  }
}
</script>
<style scoped lang="less">
  @import "../../css/var.less";
  .detail-container{
    background-color: @fff;
    .logo{
      float: left;
      margin: 16px 16px 0 24px;
      img{
        width: 30px;
        height: 30px;
        display: block;
        border-radius: 4px;
      }
    }
    .title{
      max-width:700px;
      font-size:20px;
      font-weight:500;
      color:@blackTitle;
      line-height:28px;
      display: inline-block;
    }
    .detail-box{
      display: inline-block;
      margin:16px 0 0 0;
      width: 90%;
      position: relative;
      .detail-right{
        position: absolute;
        right: 0;
        top: 0;
        width: 174px;
        .detail-right-title{
          line-height: 22px;
          margin-bottom: 4px;
        }
        .project{
          font-size:20px;
          font-weight:400;
          line-height:28px;
        }
        .state{
          font-size:20px;
          font-weight:400;
          color:@blackTitle;
          line-height:28px;
        }
      }
    }
    .detail{
      font-size:14px;
      font-weight:400;
      color:@blackBody;
      line-height:22px;
      margin-top: 8px;
    }
  }
  .info-box{
    line-height:22px;
    color: @blackBody;
    .info-title{
      font-weight:500;
      color: @blackTitle;
      margin-bottom: 16px;
      display: inline-block;
    }
    .info-right{
      padding-left: 20px;
      border-left: 1px solid @sep;
      div:nth-child(2n+2) {
        padding-bottom: 16px;
      }
    }
  }
  .editBtn{
    color: #BFBFBF;
    font-size: 16px;
    cursor: pointer;
  }

  .changeMenu{
    margin-top: 32px;
    font-size:14px;
    font-weight:400;
    color:@blackBody;
    line-height:22px;
    margin-left: 40px;
  }
  .changeMenu span{
    cursor: pointer;
  }
  .clickMenu{
    color:@theme;
    border-bottom: @theme 3px solid;
  }
  .titleLeft{
    display:inline-block;
    width: 314px;
  }
  .MenuLeft{
    padding: 0 16px 10px 16px;
    display:inline-block;
    margin-right: 32px;
  }
  .content{
    margin: 24px 24px 0 24px;
    background-color: @bgfff;
    border-radius:2px;
    padding: 24px 32px;
  }
  .table{
    font-size:14px;
    font-weight:400;
    color:@blackTitleTra;
    line-height:39px;
    margin: 0 auto;
    width: 100%;
  }
  .publish-container{
    color: @blackBody;
    position: relative;
    .publish-btn{
      float: right;
      position: absolute;
      top: 20px;
      right: 32px;
      z-index: 9;
    }
    .publish-item{
      position: relative;
      .publish-item-box {
       /* border-left: 1px solid @sep;*/
        padding-left: 19px;
        box-sizing: border-box;
        .publish-item-content{
          padding-bottom: 16px;
          border-bottom: 1px solid @sep;
          line-height: 22px;
        }
      }
      .title{
        color: @blackTitle;
        font-size: 16px;
        line-height: 24px;
        width: 700px;
      }
      .second-bar{
        color: @blackIcon;
        margin: 8px 0 16px 0;
        line-height: 22px;
        width: 700px;
        .item {
          margin-right: 40px;
        }
      }
      .text{
        line-height: 26px;
        margin-bottom: 16px;
        width: 700px;
        position: relative;
        .btn-icon-theme{
          position: absolute;
          right: 0;
          bottom: -20px;
        }
      }
    }
    }
</style>
