<template>
  <div>
    <ul class="clearfix home-top">
<!--      <li class="fl" style="margin-right: 24px"><hitank-avatar :size="72" :role="role" :name="name"></hitank-avatar></li>-->
      <li class="fl">
        <div class="title"><strong>您好，{{name}}，祝你开心每一天！</strong></div>
        <div>
          <span class="tag-red-outline">
            <span v-if="role=='admin'">管理员</span>
            <span v-else-if="role=='plat'">平台主</span>
            <span v-else-if="role=='small'">小微主</span>
            <span v-else>创客</span>
          </span>
          <span class="pad-l-15 pad-r-15" v-if="categoryRelation">|</span>
          <span>{{categoryRelation}}</span>
        </div>
      </li>
      <li class="fr" v-if="flowB === false">
        <div class="right-group-box clearfix"  v-if="role == 'plat' || role == 'small'">
          <div class="right-box">待我处理<p class="f30 blackTitle">{{flowData.noVerify}}</p></div>
          <div class="right-box">我已处理<p class="f30 blackTitle">{{flowData.hasVerify}}</p></div>
        </div>
        <div class="right-group-box clearfix" v-else-if="role != 'admin'">
          <div class="right-box">已被通过<p class="f30 blackTitle">{{flowData.pass}}</p></div>
          <div class="right-box">已被驳回<p class="f30 blackTitle">{{flowData.noPass}}</p></div>
          <div class="right-box">我发起的<p class="f30 blackTitle">{{flowData.all}}</p></div>
        </div>
      </li>
      <li class="fr" v-else>
        <div class="right-group-box clearfix" v-if="role != 'admin'">
          <div class="right-box" @click="handleRightBtn('apply')">我发起的<p class="f30 blackTitle">{{flowData.mycreate}}</p></div>
          <div class="right-box" @click="handleRightBtn('check')">我审核的<p class="f30 blackTitle">{{flowData.myVerify}}</p></div>
        </div>
      </li>
    </ul>
    <div class="clearfix  main-container" style="overflow-x: auto;min-width: 1069px">
      <div class="left">
        <div class="box common-functions" style="height: 198px">
          <div class="box-header">常用功能</div>
          <div class="box-content clearfix pad-l-10">
            <a class="li" href="/assetList_1">
              <img src="@img/menu/addassets.png" class="circle" />
              <p>新增资产</p>
            </a>
            <a class="li" href="/noticeList">
              <img src="@img/menu/notice.png" class="circle" />
              <p>通知提醒</p>
            </a>
            <a class="li" href="/deptManage" v-if="role=='admin'">
              <img src="@img/menu/deptmanage.png" class="circle" />
              <p>小微管理</p>
            </a>
          </div>
        </div>
        <div class="box chart-box">
          <div class="box-header" style="padding:12px 24px 11px">操作指南</div>
          <div class="img-contant"><img src="@img/home1.png"></div>
          <div class="img-contant" style="margin-top:-11px"><img src="@img/home2.png"></div>
          <!-- <div class="box-header">
            统计信息 -->
            <!-- <a-select class="fr" defaultValue="all" placeholder="请选择资产" style="width: 300px" @change="chartChange">
              <a-select-option value="all">全部</a-select-option>
              <a-select-option value="a">基础公共资产</a-select-option>
              <a-select-option value="b">传播交互资产</a-select-option>
              <a-select-option value="c">IT技术资产</a-select-option>
            </a-select> -->
          <!-- </div> -->
          <!-- <ul class="box-content">
            <li class="cards">
              <div class="clearfix">
                <manage-home-pie-card class="fl piecard" title="海尔" name="homepiecard1" :tmp="1" :data="cardData1"></manage-home-pie-card>
                <manage-home-pie-card class="fl piecard" title="海尔兄弟" name="homepiecard2" :tmp="1" :data="cardData2"></manage-home-pie-card>
                <manage-home-pie-card class="fl piecard" title="海尔社群生态" name="homepiecard3" :tmp="1" :data="cardData3"></manage-home-pie-card>
                <manage-home-pie-card class="fl piecard" title="海尔集团" name="homepiecard4" :tmp="1" :data="cardData4"></manage-home-pie-card>
              </div>
            </li>
            <li class="chart">
              <div id="dataCenterDemoDaningOrder" class="chart" style="height: 340px"></div>
            </li>
          </ul> -->
        </div>
        <div class="box history-box relative" style="height: 520px">
          <div class="box-header">
            最新动态
<!--            <a-select class="fr" defaultValue="all" style="width: 300px" @change="chartChange">-->
<!--              <a-select-option value="all">全部</a-select-option>-->
<!--              <a-select-option value="last">与我相关</a-select-option>-->
<!--            </a-select>-->
          </div>
          <div class="box-content">
            <div class="li clearfix" v-for="(item) in historyData" :key="item.ID">
              <hitank-avatar class="fl mar-r-15" :size="32" :role="item.roleMark" :name="item.userName"></hitank-avatar>
              <div class="fl">
                <div class="">{{item.intro}}</div>
                <div class="date">{{item.createTime}}</div>
              </div>
            </div>
            <template>
              <a-pagination class="pg" @change="onHistoryChange" simple :defaultCurrent="1" :pageSize="5" :total="historyTotal" />
            </template>
          </div>
        </div>
      </div>
      <!-- <div class="right">
        <div class="box expired-box" style="height: 772px" :style="rightWidth">
          <div class="box-header">到期提醒<span class="themeColor fw5 none">(124)</span></div>
          <ul class="box-content"> -->
<!--            <li class="clearfix" v-for="(item,index) in expireTipData.data" :key="item.ID">-->
<!--              <div v-if="index<17">-->
<!--                <div class="title fl text-nowrap" style="width: 70%">{{item.objectName}}{{item.msg}}</div>-->
<!--                <div class="fr text-nowrap" style="max-width: 30%" :class="item.msgStatus==0?'tag-red-outline':'tag-theme-outline'">{{item.noticeType}}</div>-->
<!--              </div>-->
<!--            </li>-->
<!--            <li class="more">查看全部>></li>-->
            <!-- <empty style="height: 670px" type="building"></empty>
          </ul>
        </div>
        <div class="box report" style="height: 520px" :style="rightWidth">
          <div class="box-header">我的报告</div>
          <div class="box-content">
            <empty style="height: 416px" type="building"></empty>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
// import ManageHomePieCard from '../../components/manageHome/ManageHomePieCard'
import {getPlatUserFlow, getPlatAdminFlow} from '@api/workbench'
import {getnnouncementAList} from '@api/sysManage'
import store from '@/store'
import Empty from '@comp/Empty'
import HitankAvatar from '../../components/manageHome/HitankAvatar'
export default {
  props: {
    collapsed: Boolean
  },
  components: {
    HitankAvatar,
    // ManageHomePieCard,
    Empty
  },
  data () {
    return {
      name: '',
      role: '',
      categoryRelation: '',
      flowData: {},
      rightWidth: '',
      menuList: [],
      cardData1: [
        {value: '62', name: '目标完成率'},
        {value: '38', name: '未完成'}
      ],
      cardData2: [
        {value: '80', name: '目标完成率'},
        {value: '20', name: '未完成'}
      ],
      cardData3: [
        {value: '45', name: '目标完成率'},
        {value: '55', name: '未完成'}
      ],
      cardData4: [
        {value: '90', name: '目标完成率'},
        {value: '10', name: '未完成'}
      ],
      expireTipData: {'data': [{'id': 1, 'assetsId': '181', 'objectId': '20', 'createDate': '2017-02-11 08:00:05', 'msg': '将于2017-02-21到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 0, 'noticeType': '已到期', 'objectName': 'clife.me', 'endTime': '2017-02-21', 'assetsName': '域名', 'isWarn': 1}, {'id': 2, 'assetsId': '181', 'objectId': '22', 'createDate': '2017-02-22 08:00:05', 'msg': '将于2017-03-24到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 0, 'noticeType': '已到期', 'objectName': 'highna.com', 'endTime': '2017-03-24', 'assetsName': '域名', 'isWarn': 0}, {'id': 4, 'assetsId': '181', 'objectId': '22', 'createDate': '2017-03-14 08:00:07', 'msg': '将于2017-03-24到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 0, 'noticeType': '已到期', 'objectName': 'highna.com', 'endTime': '2017-03-24', 'assetsName': '域名', 'isWarn': 0}, {'id': 3, 'assetsId': '138', 'objectId': '232', 'createDate': '2017-03-04 08:00:06', 'msg': '将于2017-05-03到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 0, 'noticeType': '已到期', 'objectName': '创客之星', 'endTime': '2017-05-03', 'assetsName': '微信公众平台', 'isWarn': 0}, {'id': 23, 'assetsId': '138', 'objectId': '232', 'createDate': '2017-04-03 08:00:25', 'msg': '将于2017-05-03到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 0, 'noticeType': '已到期', 'objectName': '创客之星', 'endTime': '2017-05-03', 'assetsName': '微信公众平台', 'isWarn': 0}, {'id': 40, 'assetsId': '138', 'objectId': '232', 'createDate': '2017-04-23 08:00:31', 'msg': '将于2017-05-03到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 0, 'noticeType': '已到期', 'objectName': '创客之星', 'endTime': '2017-05-03', 'assetsName': '微信公众平台', 'isWarn': 0}, {'id': 5, 'assetsId': '181', 'objectId': '23', 'createDate': '2017-03-14 08:00:07', 'msg': '将于2017-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 0, 'noticeType': '已到期', 'objectName': 'haierren.net', 'endTime': '2017-05-13', 'assetsName': '域名', 'isWarn': 0}, {'id': 24, 'assetsId': '181', 'objectId': '23', 'createDate': '2017-04-13 08:00:28', 'msg': '将于2017-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 0, 'noticeType': '已到期', 'objectName': 'haierren.net', 'endTime': '2017-05-13', 'assetsName': '域名', 'isWarn': 0}, {'id': 79, 'assetsId': '181', 'objectId': '23', 'createDate': '2017-05-03 08:00:35', 'msg': '将于2017-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 0, 'noticeType': '已到期', 'objectName': 'haierren.net', 'endTime': '2017-05-13', 'assetsName': '域名', 'isWarn': 0}, {'id': 6, 'assetsId': '181', 'objectId': '24', 'createDate': '2017-03-14 08:00:07', 'msg': '将于2017-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 0, 'noticeType': '已到期', 'objectName': 'haierrenren.com', 'endTime': '2017-05-13', 'assetsName': '域名', 'isWarn': 0}, {'id': 25, 'assetsId': '181', 'objectId': '24', 'createDate': '2020-04-13 08:00:28', 'msg': '将于2020-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 1, 'noticeType': '即将到期', 'objectName': 'haierrenren.com', 'endTime': '2020-05-13', 'assetsName': '域名', 'isWarn': 0}, {'id': 80, 'assetsId': '181', 'objectId': '24', 'createDate': '2020-05-03 08:00:35', 'msg': '将于2020-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 1, 'noticeType': '即将到期', 'objectName': 'haierrenren.com', 'endTime': '2020-05-13', 'assetsName': '域名', 'isWarn': 0}, {'id': 7, 'assetsId': '181', 'objectId': '25', 'createDate': '2020-03-14 08:00:07', 'msg': '将于2020-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 1, 'noticeType': '即将到期', 'objectName': 'haierren.com', 'endTime': '2020-05-13', 'assetsName': '域名', 'isWarn': 0}, {'id': 26, 'assetsId': '181', 'objectId': '25', 'createDate': '2020-04-13 08:00:28', 'msg': '将于2020-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 1, 'noticeType': '即将到期', 'objectName': 'haierren.com', 'endTime': '2020-05-13', 'assetsName': '域名', 'isWarn': 0}, {'id': 81, 'assetsId': '181', 'objectId': '25', 'createDate': '2020-05-03 08:00:35', 'msg': '将于2020-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 1, 'noticeType': '即将到期', 'objectName': 'haierren.com', 'endTime': '2020-05-13', 'assetsName': '域名', 'isWarn': 0}, {'id': 8, 'assetsId': '181', 'objectId': '26', 'createDate': '2020-03-14 08:00:07', 'msg': '将于2020-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 1, 'noticeType': '即将到期', 'objectName': '海尔人.net', 'endTime': '2020-05-13', 'assetsName': '域名', 'isWarn': 0}, {'id': 27, 'assetsId': '181', 'objectId': '26', 'createDate': '2020-04-13 08:00:28', 'msg': '将于2020-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 1, 'noticeType': '即将到期', 'objectName': '海尔人.net', 'endTime': '2020-05-13', 'assetsName': '域名', 'isWarn': 0}, {'id': 82, 'assetsId': '181', 'objectId': '26', 'createDate': '2020-05-03 08:00:35', 'msg': '将于2020-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 1, 'noticeType': '即将到期', 'objectName': '海尔人.net', 'endTime': '2020-05-13', 'assetsName': '域名', 'isWarn': 0}, {'id': 9, 'assetsId': '181', 'objectId': '27', 'createDate': '2020-03-14 08:00:07', 'msg': '将于2020-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 1, 'noticeType': '即将到期', 'objectName': '海尔人.com', 'endTime': '2020-05-13', 'assetsName': '域名', 'isWarn': 0}, {'id': 28, 'assetsId': '181', 'objectId': '27', 'createDate': '2020-04-13 08:00:28', 'msg': '将于2020-05-13到期', 'mailMsg': 0, 'smsMsg': 0, 'noticeMsg': 0, 'msgStatus': 1, 'noticeType': '即将到期', 'objectName': '海尔人.com', 'endTime': '2020-05-13', 'assetsName': '域名', 'isWarn': 0}]},
      historyData: [],
      historyTotal: 0
    }
  },
  mounted () {
    // this.setChartLine()
    // this.getMenu()
    this.getHistory(1, 1)
    store.dispatch('getUserInfo').then(userInfo => {
      this.role = userInfo.role
      this.name = userInfo.name ? userInfo.name : userInfo.userName
      this.categoryRelation = userInfo.categoryRelation ? userInfo.categoryRelation.split(',').join('-') : ''
      let _this = this
      if (_this.flowB === false) {
        if (this.role === 'plat' || this.role === 'small') {
          this.getPlatAdminFlow()
        } else {
          this.getPlatUserFlow()
        }
      } else {
        if (this.role !== 'admin') {
          this.getPlatUserFlow()
        }
      }
    }).catch((err) => {
      console.log('获取用户信息错误：' + err)
    })
  },
  methods: {
    handleRightBtn (type) {
      if (type) {
        this.$router.push({path: '/workflowList', query: {tab: type}})
      } else {
        this.$router.push({path: '/workflowList'})
      }
    },
    // getMenu () {
    //   let _this = this
    //   getMenuList().then(function (data) {
    //     for (let arr of data.data) {
    //       _this.menuList.push(arr.href)
    //     }
    //   }).catch(function (error) {
    //     console.log(error)
    //     // _this.$Message.error(error)
    //   })
    // },
    getPlatUserFlow () {
      let _this = this
      getPlatUserFlow().then((data) => {
        if (data.success) {
          _this.flowData = data.data
        }
      }).catch((error) => {
        console.log('新增子类目error:' + error)
      }
      )
    },
    getPlatAdminFlow () {
      let _this = this
      getPlatAdminFlow().then((data) => {
        _this.flowData = data.data
      }).catch((error) => {
        console.log('新增子类目error:' + error)
      }
      )
    },
    getHistory (pageNo, pageSize) {
      let _this = this
      getnnouncementAList({pageNo: pageNo, pageSize: 5}).then((data) => {
        _this.historyData = data.data
        _this.historyTotal = data.total
      }).catch((error) => {
        console.log('新增子类目error:' + error)
      }
      )
    },
    onHistoryChange (page, pageSize) {
      this.getHistory(page, pageSize)
    },
    setChartLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('dataCenterDemoDaningOrder'))

      let option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          icon: 'circle',
          top: 25,
          textStyle: {

          },
          right: '20px',
          data: ['日活跃用户量', '累计注册用户']
        },
        grid: {
          left: '0',
          right: '4%',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#e9e9e9'
            }
          },
          axisLabel: {
            color: '#8C8C8C'
          },
          data: ['11-01', '11-02', '11-03', '11-04', '11-05', '11-06', '11-07', '11-08']
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLine: {
            show: false// 坐标轴线隐藏
          },
          axisLabel: {
            color: '#8C8C8C'
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: '累计注册用户',
            type: 'line',
            stack: '总量',
            color: '#37B69A',
            data: [120, 132, 101, 134, 90, 230, 210, 400]
          },
          {
            name: '日活跃用户量',
            type: 'line',
            stack: '总量',
            color: '#FFC53D',
            data: [220, 182, 191, 234, 290, 330, 310, 200]
          }
        ]
      }

      // 绘制图表
      myChart.setOption(option)
    },
    chartChange () {
      this.$message.success('正在建设中，敬请期待！')
    }
  },
  watch: {
    collapsed (val) {
      this.rightWidth = !val ? 'width: calc(100vw - 1135px)' : 'width: calc(100vw - 959px)'
    }
  }
}
</script>

<style scoped lang="less">
  @import "~@var";
  .chart{
    width: 100%;
    height: 100%;
  }
  .home-top{
    background-color: @fff;
    position: relative;
    padding: 20px 24px;
    margin-bottom: 24px;
    color: @blackText;
    min-width: 1069px;
    .title{
      font-size: 20px;
      color: @blackTitle;
      line-height: 28px;
      margin-bottom: 12px;
    }
    ul{
      padding-left: 0;
    }
    .right-group-box{
      .right-box{
        float: left;
        height: 65px;
        position: relative;
        margin-left: 32px;
        padding-right: 32px;
        text-align: right;
        cursor: pointer;
        .f30{
          line-height: 38px;
          padding-top: 8px;
        }
      }
      .right-box:after{
        content: '';
        width: 1px;
        height: 40px;
        background-color: @sep;
        display: block;
        position: absolute;
        right: 0;
        top: 9px;
      }
      .right-box:last-of-type{
        padding-right: 9px;
      }
      .right-box:last-of-type:after{
        display: none;
      }
    }
  }
  .box-header{
    padding: 12px 24px 11px;
    border-bottom: 1px solid @sep;
    font-size: 16px;
    line-height: 32px;
    font-weight: 500;
    .right-btn{
      color: @blackText;
    }
    .right-sel{
      font-size: 14px;
    }
  }
  .left {
    float: left;
    margin-right: 24px;
    /*padding-left: 24px;*/
    .box{
      // width: 797px;
      width: calc(100vw - 310px);
      /*margin: 0 24px 24px 24px;*/
    }
  }
  .right {
    float: left;
    .box{
      /*width: calc(100vw - 1125px);*/
      width: calc(100vw - 1135px);
      min-width: 200px;
    }
  }
  .box{
    border-radius:2px;
    background-color: @fff;
    margin-bottom: 24px;
    .box-content{
      box-sizing: border-box;
      padding: 24px;
    }
  }
  .common-functions{
    .box-content{
      padding-left: 40px;
    }
    .li{
      float: left;
      cursor: pointer;
      margin-right: 64px;
      .circle{
        width: 56px;
        height: 56px;
        border-radius: 56px;
        margin-bottom: 19px;
      }
      p{
        color: @blackBody;
      }
    }
    .li:hover{
      p{
        color: @theme;
      }
    }
  }
  .expired-box{
    li{
      .tag-red-outline{
        background-color: #FFF1F0;
      }
      .tag-theme-outline{
        background-color: @themeBg;
      }
      .title{
        width: 70%;
        line-height: 22px;
        margin-bottom: 16px;
      }
    }
    .more{
      background-color: @bg;
      color: @theme;
      line-height: 24px;
      text-align: center;
      cursor: pointer;
    }
  }
  .history-box{
    .li{
      padding: 16px 5px 15px;
      line-height: 22px;
      border-bottom: 1px solid @sep;
      color: @blackBody;
      .date{
        color: @blackText;
      }
    }
    .li:first-child{
      padding-top: 0;
    }
  }
  .chart-box{
    .piecard{
      margin-right: 64px;
    }
    .piecard:last-child{
      margin-right: 0;
    }
    .cards{
      padding-left: 26px;
      padding-top: 4px;
    }
    div{
      padding: 26px 40px;
    }
  }
  .pg{
    position: absolute;
    bottom: 16px;
    right: 12px;
  }
  .img-contant{
    img{
      width: 100%;
    }
  }
</style>
