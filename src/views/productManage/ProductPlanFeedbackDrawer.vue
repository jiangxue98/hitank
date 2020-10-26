<!--反馈产品计划-->
<template>
  <div>
    <div>
      <div class="bc-title">
        <img :src="projectInfo.logo" class="logo" />
        <span style="position: relative;top: 3px;">{{projectInfo.titleName}}</span>
        <span class="pro-label" v-if="projectInfo.projPass==0">未立项</span>
        <span class="pro-label green" v-else-if="projectInfo.projPass==1">已立项</span>
        <span class="state-label" v-if="projectInfo.state==1">开发测试</span>
        <span class="state-label" v-else-if="projectInfo.state==2">上线迭代</span>
        <span class="state-label" v-else-if="projectInfo.state==3">下架</span>
        <span class="state-label" v-else-if="projectInfo.state==4">冻结</span>
      </div>
    </div>
    <div class="content info-box">
      <a-row>
        <a-col :span="12" class="info-left">
          <div><span class="info-title">计划名称：</span>{{feedbackData.name}}</div>
          <div><span class="info-title">计划周期：</span>{{planCycle[feedbackData.step]}}</div>
          <div><span class="info-title">
            计划时间：</span>{{feedbackData.startTime}}～{{feedbackData.endTime}}  {{lastTime}}
          </div>
          <div v-if="feedbackData.intro">
            <span class="info-title">计划说明：
            </span>{{feedbackData.intro}}
            </div>
          <div><span class="info-title">计划版本：</span>{{feedbackData.version}}</div>
          <div style="margin:40px 0 20px 0">当前执行反馈</div>
          <div>
            <a-textarea
              placeholder="请及时反馈本计划当前执行进展；如果计划超过1周，请至少每周五前反馈一 次进展；如完成闭环，则反馈具体完成情况。"
              :rows="8"
              v-model="feedbackContent"
              allow-clear
            ></a-textarea>
          </div>
          <div class="btn-list">
            <a-button @click="clickCancel">取消</a-button>
            <a-button class="btn-theme" @click="submitFeedback">仅提交反馈</a-button>
            <a-button class="btn-theme" @click="clickComplatePlan">完成闭环</a-button>
          </div>
        </a-col>
        <a-col :span="12" class="info-right">
          <div class="info-title">反馈记录</div>
          <div>
            <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="feedbackList"
               :loading="loading"
               :pagination="pagination"
               @change="handleChange"
            >
              <template slot-scope="text" slot="content">
                <a-tooltip>
                  <template slot="title">{{text}}</template>
                  <div class="feedback-content">{{ text }}</div>
                </a-tooltip>
              </template>
            </a-table>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import {getPlanFeedback, addPlanFeedback, complateProductPlan} from '@api/productManage'
import util from '@util/util'
const columns = [
  {
    width: 60,
    title: '序号',
    dataIndex: 'number',
    scopedSlots: { customRender: 'number' }
  }, {
    title: '反馈内容',
    dataIndex: 'content',
    scopedSlots: { customRender: 'content' }
  }, {
    title: '反馈时间',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'createDate' }
  }
]
export default {
  data () {
    return {
      columns,
      loading: false,
      feedbackData: {},
      projectInfo: {},
      pagination: util.TABLE.pagination,
      planCycle: {
        1: '立项',
        2: '开发测试',
        3: '上线迭代',
        4: '下架',
        5: '封存'
      },
      feedbackList: [],
      feedbackContent: '',
      lastTime: ''
    }
  },
  mounted () {
    let projectInfo = decodeURI(this.$route.query.params)
    this.projectInfo = JSON.parse(projectInfo)
    this.feedbackData = this.projectInfo.item
    this.feedbackData.startTime = this.feedbackData.startTime.slice(0, 10)
    this.feedbackData.endTime = this.feedbackData.endTime.slice(0, 10)
    if (this.feedbackData.version === null) {
      this.feedbackData.version = '无'
    }
    if (this.feedbackData.intro === null) {
      this.feedbackData.intro = '无'
    }
    let endtime = this.feedbackData.endTime + ' ' + '23:59:59'
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
    let params = {
      productZhouqingId: this.feedbackData.id
    }
    // this.projectInfo = JSON.parse(localStorage.getItem('projectInfo'))
    this.getPlanFeedback(params)
  },
  methods: {
    // 获取反馈表格列表
    getPlanFeedback (param) {
      let _this = this
      this.pagination.pageSize = 7
      param.pageSize = this.pagination.pageSize
      param.pageNo = this.pagination.current
      getPlanFeedback(param).then((data) => {
        const pagination = { ..._this.pagination }
        if (data.success) {
          this.loading = false
          data.data.forEach(item => {
            item.createDate = item.createDate.slice(0, 10)
          })
          this.feedbackList = data.data
          pagination.total = data.total
          _this.pagination = pagination
          for (let i = 0; i < this.feedbackList.length; i++) {
            this.feedbackList[i].number = i + 1
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 翻页
    handleChange (pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.getPlanFeedback({
        pageSize: pager.pageSize,
        pageNo: pager.current,
        productZhouqingId: this.feedbackData.id
      })
    },
    // 提交反馈
    submitFeedback () {
      if (util.isEmpty(this.feedbackContent)) {
        this.$message.error('请填写反馈内容')
        return
      }
      let param = {
        productZhouqingId: this.feedbackData.id,
        content: this.feedbackContent
      }
      addPlanFeedback(param).then((data) => {
        if (data.success) {
          this.loading = true
          this.getPlanFeedback({productZhouqingId: this.feedbackData.id})
          this.feedbackContent = ''
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 完成闭环
    clickComplatePlan () {
      let param = {
        id: this.feedbackData.id
      }
      complateProductPlan(param).then((data) => {
        if (data.success) {
          window.history.go(-1)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 取消
    clickCancel () {
      window.history.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
  @import "~@var";
  .logo {
    width:28px;
    height:28px;
    border-radius: 2px;
    margin-right: 10px;
  }
  .pro-label{
    line-height: 20px;
    padding: 1px 9px;
    height:22px;
    border-radius:4px;
    background:rgba(190,190,190,1);
    color: #fff;
    font-size: 12px;
    font-weight: normal;
    margin-left: 8px;
  }
  .pro-label.green{
    background:rgba(82,196,26,1);
  }
  .state-label{
    margin-left: 8px;
    height:22px;
    line-height: 20px;
      padding: 1px 9px;
      background:rgba(245,245,245,1);
      border-radius:4px;
      color: @blackText;
      font-size: 12px;
      font-weight: normal;
      border:1px solid rgba(217,217,217,1);
    }
  .bc-title{
    color: @blackTitle;
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    margin-top: 16px;
    margin-bottom: 24px;
    span {
      display: inline-block;
      vertical-align: bottom;
    }
  }
  .content{
    background:white;
    border-radius:2px;
    padding: 32px;
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
    .info-left{
      padding-right: 32px;
      border-right: 1px solid @sep;
    }
    .info-right{
      padding-left: 32px;
      div:nth-child(2n+2) {
        padding-bottom: 16px;
      }
    }
    .btn-list{
      padding: 24px 0 34px 0;
      display: flex;
      justify-content: flex-end;
      button{
        margin-left: 8px;
      }
    }
  }
  .feedback-content{
    width: 250px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
</style>
