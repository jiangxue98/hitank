<template>
<div>
  <div class="log-title">资产名称：{{assetName}}</div>
  <div class="table-box">
    <div class="title fl">日志列表</div>
    <a-table :columns="columns" :dataSource="data" :rowKey="record => record.id" @change="handleChange">
      <template slot-scope="text" slot="operation">
        <a-tooltip>
          <template slot="title">{{text}}</template>
          <div class="log-content pointer">{{ text }}</div>
        </a-tooltip>
      </template>
      <template slot-scope="text" slot="type">
        {{type[text]}}
      </template>
    </a-table>
  </div>
</div>
</template>

<script>
import {getLogHistore} from '@api/digitalAssets'
import util from '@util/util'
const columns = [
  {
    width: 80,
    title: '序号',
    dataIndex: 'number',
    scopedSlots: { customRender: 'number' }
  }, {
    width: 100,
    title: '操作类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  }, {
    title: '操作时间',
    dataIndex: 'createTime',
    width: 200,
    scopedSlots: { customRender: 'createTime' }
  }, {
    title: '操作人',
    dataIndex: 'createUserName',
    // width: 42
    scopedSlots: { customRender: 'createUserName' }
  }, {
    // width: 462,
    title: '操作详情',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  data () {
    return {
      columns,
      assetName: '',
      data: [],
      assetId: '',
      type: {
        1: '数字资产',
        2: '数字资产类型',
        3: '用户'
      },
      pagination: util.TABLE.pagination
    }
  },
  beforeMount () {
    this.assetName = this.$router.currentRoute.query.name
    this.assetId = this.$router.currentRoute.query.id
    this.getLogHistore({foreignkeyId: this.assetId, type: 1})
    // this.getLogHistore({type: 1})
  },
  methods: {
    // 翻页
    handleChange (pagination) {
      this.getPlanFeedback({
        productZhouqingId: this.feedbackData.id
      })
    },
    // 获取日志
    getLogHistore (param) {
      // param.pageSize = this.pagination.pageSize
      // param.pageNo = this.pagination.current
      getLogHistore(param).then((data) => {
        const pagination = { ...this.pagination }
        data.data.forEach(item => {
          item.createTime = item.createTime.slice(0, item.createTime.length - 3)
        })
        this.data = data.data
        for (let i = 0; i < this.data.length; i++) {
          this.data[i].number = i + 1
        }
        pagination.total = data.total
        this.pagination = pagination
      }).catch((error) => {
        console.log('获取操作日志error:' + error)
      }
      )
    }
  }
}
</script>

<style scoped lang="less">
 @import '~@var';
.log-title{
  margin-bottom: 24px;
  /*height:28px;*/
  font-size:20px;
  font-weight:500;
  color:#262626;
  line-height:28px;
}
.log-content{
  width: 462px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
