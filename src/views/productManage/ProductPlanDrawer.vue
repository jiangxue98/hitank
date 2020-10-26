<!-- 查看 -->
<template>
  <div>
    <a-drawer
      :title="'新增产品计划'"
      width="720"
      @close="onClose"
      :destroyOnClose = true
      :visible="showDrawer"
      v-if="showDrawer === true"
    >
      <div class="info-title">
        当前产品：{{params.titleName}}
      </div>
      <div class="info-content">
        计划名称：
        <span>{{params.item.name}}</span>
      </div>
      <div class="info-content">
        计划周期：
        <span>{{planCycle[params.item.step]}}</span>
      </div>
      <div class="info-content">
        计划时间：
        <span>{{params.item.startTime}}~{{params.item.endTime}} {{lastTime}}</span>
      </div>
      <div class="info-content">
        计划说明：
        <span>{{params.item.intro}}</span>
      </div>
      <div class="info-content">
        计划版本：
        <span>{{params.item.version}}</span>
      </div>
      <div class="feedback-title">反馈记录</div>
      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="feedbackList"
        @change="handleChange"
      >
        <template slot-scope="text" slot="content">
          <a-tooltip>
            <template slot="title">{{text}}</template>
            <div class="feedback-content">{{ text }}</div>
          </a-tooltip>
        </template>
      </a-table>
    </a-drawer>
  </div>
</template>
<script>
import {getPlanFeedback} from '@api/productManage'
import util from '@util/util'
const columns = [
  {
    title: '序号',
    dataIndex: 'number',
    width: 100,
    scopedSlots: { customRender: 'number' }
  }, {
    title: '反馈内容',
    dataIndex: 'content',
    scopedSlots: { customRender: 'content' }
  }, {
    title: '反馈时间',
    dataIndex: 'createDate',
    width: 150,
    scopedSlots: { customRender: 'createDate' }
  }
]
export default {
  components: {},
  props: {
    showDrawer: {
      type: Boolean,
      default () {
        return false
      }
    },
    params: Object
  },
  data () {
    return {
      columns,
      visible: false,
      addFormData: {},
      planCycle: {
        1: '立项',
        2: '开发测试',
        3: '上线迭代',
        4: '下架',
        5: '封存'
      },
      feedbackList: [],
      pagination: util.TABLE.pagination,
      lastTime: ''
    }
  },
  mounted () {
  },
  created () {
  },
  beforeCreate () {
  },
  methods: {
    // 翻页
    handleChange (pagination) {
      this.getPlanFeedback({
        productZhouqingId: this.feedbackData.id
      })
    },
    // 获取反馈表格列表
    getPlanFeedback (param) {
      getPlanFeedback(param).then((data) => {
        if (data.success) {
          data.data.forEach(item => {
            item.createDate = item.createDate.slice(0, 10)
          })
          this.feedbackList = data.data
          for (let i = 0; i < this.feedbackList.length; i++) {
            this.feedbackList[i].number = i + 1
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    onClose (refresh) {
      this.$emit('close', refresh)
    }
  },
  watch: {
    showDrawer (val, oldVal) {
      if (val === true) {
        this.params.item.startTime = this.params.item.startTime.slice(0, 10)
        this.params.item.endTime = this.params.item.endTime.slice(0, 10)
        if (this.params.item.version === null) {
          this.params.item.version = '无'
        }
        if (this.params.item.intro === null) {
          this.params.item.intro = '无'
        }
        let endtime = this.params.item.endTime + ' ' + '23:59:59'
        var date1 = new Date(endtime)
        var date2 = new Date()
        var s1 = date1.getTime()
        var s2 = date2.getTime()
        var total = (s1 - s2) / 1000
        var day = parseInt(total / (24 * 60 * 60))
        var afterDay = total - day * 24 * 60 * 60
        var hour = parseInt(afterDay / (60 * 60))
        if (day < 0) {
          this.lastTime = '已逾期'
        } else {
          this.lastTime = '当前剩余' + day + '天' + hour + '小时'
        }
        let param = {
          productZhouqingId: this.params.item.id
        }
        this.getPlanFeedback(param)
      }
    }
  }
}
</script>
<style scoped lang="less">
  @import "~@var";
  .info-title{
    font-size:20px;
    font-weight:500;
    color:#262626;
    line-height:28px;
    margin-bottom: 32px;
  }
  .info-content{
    font-size:14px;
    font-weight:400;
    color:#000000D8;
    line-height:22px;
    margin-bottom: 9px;
    span{
      color:#000000A5;
    }
  }
  .feedback-title{
    font-size:16px;
    font-weight:500;
    color:#262626;
    line-height:24px;
    margin: 28px 0 16px 0;
  }
  .feedback-content{
    width: 380px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
</style>
