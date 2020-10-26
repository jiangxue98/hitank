<template>
  <div ref="main" style="margin:0 auto;overflow: hidden">
<!--    <index-header></index-header>-->
    <div ref="list" id="index">
      <div class="main">
        <div class="title">一站式企业数字资产管理平台</div>
        <div class="content">为企业用户提供全面便捷的数字资产管理解决方案</div>
        <img class="dialong" src="../../assets/images/index/dialong.png">
        <div style="margin-top: 79px">
          <button class="pointer font" ref="btn" @click="home">
            立即体验 <a-icon style="width: 7.44px;height: 11.84px;" type="right" />
          </button>
        </div>
        <div class="subhead">全方位服务解决企业数字资产管理问题</div>
        <div>
          <table class="images">
            <tr>
              <td><img id="img1" src="../../assets/images/index/board.png">
                <span>看板</span></td>
              <td><img id="img2" src="../../assets/images/index/remind.png">
                <span>到期提醒</span>
              </td>
              <td><img id="img3" src="../../assets/images/index/approval.png">
                <span>线上审批</span>
              </td>
              <td><img id="img4" src="../../assets/images/index/permissions.png">
                <span>分组权限</span>
              </td>
            </tr>
            <tr class=" describe">
              <td><span>快捷概览任务及资产数据</span></td>
              <td><span>及时续费，杜绝资产失效</span></td>
              <td><span>全线上高效率节点工作流</span></td>
              <td><span>自定义权限分配</span></td>
            </tr>
            <tr>
              <td><img id="img5" src="../../assets/images/index/data.png">
                <span>数据监测</span>
              </td>
              <td><img id="img6" src="../../assets/images/index/report.png">
                <span>工作报告</span>
              </td>
              <td><img id="img7" src="../../assets/images/index/maintenance.png">
                <span>数字资产维护</span>
              </td>
              <td><img id="img8" src="../../assets/images/index/organization.png">
                <span>用户组织管理</span>
              </td>
            </tr>
            <tr class="describe">
              <td><span>自定义数据指标实时监测</span></td>
              <td><span>自定义报告内容定时发送</span></td>
              <td><span>可配置动态字段信息，轻松管理查看</span></td>
              <td><span>组织架构一目了然</span></td>
            </tr>
            <tr>
              <td><img id="img9" src="../../assets/images/index/fast.png">
                <span>快捷入口</span>
              </td>
              <td><img id="img10" src="../../assets/images/index/statistics.png">
                <span>统计分析</span>
              </td>
              <td><img id="img11" src="../../assets/images/index/configuration.png">
                <span>灵活配置</span>
              </td>
              <td><img id="img12" src="../../assets/images/index/more.png">
                <span>更多</span>
              </td>
            </tr>
            <tr class="describe">
              <td><span>自定义入口，一键查看</span></td>
              <td><span>直观可视化图表，数字驱动增长</span></td>
              <td><span>多项自定义配置，灵活管理</span></td>
              <td><span>敬请期待</span></td>
            </tr>
          </table>
        </div>
        <div class="three">
          <div class="threeTitle">企业数字资产管理解决方案</div>
          <div class="Solutions">
            <div class="pointer titleIcon titleClick" ref="manTitle" @click="changeManage">
              <div>
                <img v-show="manClick" src="../../assets/images/index/manage.png">
                <img v-show="manUnclick" src="../../assets/images/index/mangrey.png">
              </div>
              <span ref="manTitleBorder" class="borderClick">数字资产管理体系</span>
            </div>
            <div class="pointer titleIcon" ref="proTitle" @click="changeProcess">
              <div>
                <img v-show="proUnclick" style="margin: 0 194px" src="../../assets/images/index/progrey.png">
                <img v-show="proClick" style="margin: 0 194px" src="../../assets/images/index/proce.png">
              </div>
              <span ref="proTitleBorder">工作流节点体系</span>
            </div>
            <div class="pointer titleIcon" ref="eumTitle" @click="changeEum">
              <div>
                <img v-show="eumUnclick" src="../../assets/images/index/eumgrey.png">
                <img v-show="eumClick" src="../../assets/images/index/eum.png">
              </div>
              <span ref="eumTitleBorder">企业用户管理体系</span>
            </div>
          </div>
          <div v-show="manClick" style="margin-top: 71px">
            <div class="left">
              <div class="list">
                <img src="../../assets/images/index/classification.png">
                <span class="titleLeft">自定义分类管理，方便资产增删改查</span>
                <span class="contLeft">
                  整合企业数字资产，可进行多级自定义分类管理，方便管理员管理及用户查看调用，数字资产不在丢失。
                </span>
              </div>
              <div class="list">
                <img src="../../assets/images/index/cloud.png">
                <span class="titleLeft">数字资产云共享，随用随申请</span>
                <span class="contLeft">
                  数字资产线上存储，数据实时更新，随用随申请，线上审批绿色高效，操作记录存档备份，告别传统线下繁琐流程。
                </span>
              </div>
              <div class="list">
                <img src="../../assets/images/index/remain.png">
                <span class="titleLeft">过期续费提醒，不再错过重要日期</span>
                <span class="contLeft">
                  自定义设置数字资产时效，过期前发送提醒，及时续费，防止数字资产失效。
                </span>
              </div>
            </div>
            <div class="right">
              <img src="../../assets/images/index/aside.png">
              <div class="rows">
                <img src="../../assets/images/index/rows1.png">
                <img src="../../assets/images/index/rows2.png">
                <img src="../../assets/images/index/rows3.png">
                <img src="../../assets/images/index/rows4.png">
                <img src="../../assets/images/index/rows5.png">
              </div>
            </div>
          </div>
          <div v-show="proClick" style="margin-top: 71px">
            <div class="left">
              <div class="list">
                <img src="../../assets/images/index/icon1.png">
                <span class="titleLeft">全线上BPM流程，无纸化高效办公</span>
                <span class="contLeft">
                  数字资产注册、使用、变更、注销等流程实现全面线上化，快捷反馈，告别传统线下流程，无纸化绿色环保。
                </span>
              </div>
              <div class="list">
                <img src="../../assets/images/index/icon2.png">
                <span class="titleLeft">资产增删改查动态备案，有据可查</span>
                <span class="contLeft">
                  用户提交申请，操作动态实时线上备案，随时回查每一条资产操作记录，精准追溯每一条变更动态。
                </span>
              </div>
              <div class="list">
                <img src="../../assets/images/index/icon3.png">
                <span class="titleLeft">全面的节点校验，保证数字资产安全</span>
                <span class="contLeft">
                  全面的流程节点校验机制，针对用户对数字资产的不同操作自动分分支判定规则，做到使用方便的同时，保证企业数字资产安全。
                </span>
              </div>
            </div>
            <div class="right">
              <img src="../../assets/images/index/backpro.png">
              <img class="move" style="margin: -278px 0 0 239px" src="../../assets/images/index/processbg.png">
              <img style="margin: -353px 0 0 55px" src="../../assets/images/index/shenpi.png">
            </div>
          </div>
          <div v-show="eumClick" style="margin-top: 71px">
            <div class="left">
              <div class="list">
                <img src="../../assets/images/index/key.png">
                <span class="titleLeft">用户角色化管理，权限自定义</span>
                <span class="contLeft">
                  用户角色权限自定义配置，不同角色拥有不同的页面访问权限以及资产操作权限，在BPM中承担相应节点任务。
                </span>
              </div>
              <div class="list">
                <img src="../../assets/images/index/line.png">
                <span class="titleLeft">企业组织架构分类，快速查询用户信息</span>
                <span class="contLeft">
                  查询平台、小微、用户信息，分级结构展示，可以输入用户名称进行模糊查询员工信息，可以修改员工电话、邮箱等信息。
                </span>
              </div>
              <div class="list">
                <img src="../../assets/images/index/person.png">
                <span class="titleLeft">用户库自定义导入，人员轻松管理</span>
                <span class="contLeft">
                  支持单条及库的用户组织数据导入，用户信息增删改查方便快捷，高效管理组织用户。
                </span>
              </div>
            </div>
            <div class="right">
              <img src="../../assets/images/index/back3.png">
              <img style="margin: -520px 0 0 35px " src="../../assets/images/index/premissbg.png">
              <img class="move" style="margin: -180px 0 0 -380px;width: 80px" src="../../assets/images/index/jiantou.png">
            </div>
          </div>
        </div>
        <div>
          <div class="titlefour">多角色分组配置，看你所想</div>
          <div class="contFour">
            <div>
              <div class="manClick" ref="titltManage" @click="changeManager">
                <div class="pointer">
                  <img v-show="manager" style="display: inline-block; width: 24px;height: 24px;margin:0 8px 6px 40px" src="../../assets/images/index/manIcon.png">
                  <img v-show="genesis" style="display: inline-block;width: 24px;height: 24px;margin:0 8px 6px 40px" src="../../assets/images/index/man.png">
                  我是管理者
                  <div ref="manline" class="lineClick"></div>
                </div>
              </div>
              <div class="genClick" ref="titleChuangke" @click="changeGenesis">
                <div class="pointer">
                  <img v-show="manager" style="display: inline-block; width: 24px;height: 24px;margin:0 8px 6px 40px"  src="../../assets/images/index/ck.png">
                  <img v-show="genesis" style="display:inline-block;width: 24px;height: 24px;margin:0 8px 6px 40px"  src="../../assets/images/index/ckicon.png">
                  我是创客
                  <div ref="ckline" class="lineUnclick"></div>
                </div>
              </div>
            </div>
            <div v-show="manager">
              <div class="manager">
                <img style="width: 565px;height: 421px;" src="../../assets/images/index/manager.png">
              </div>
              <div class="genesis">
                <ul style="padding:64px 0 0 16px">
                  <li class="disc">
                    <b class="lititle">全面的BPM流程，严格管理数字资产</b>
                  </li>
                  <li class="liCont">
                    数字资产生命周期流程管理，角色自定配置，承担节点校验任务，全流程监控数字资产的注册、使用、注销等动态。
                  </li>
                  <li class="disc">
                    <b class="lititle">自定义报告模板，订阅数字资产数据动态</b>
                  </li>
                  <li class="liCont">
                    创客可按管理者需求自定义报告模板，管理制可定时收到数字资产运营报告，也可以实时查看数字资产数据动态情况。
                  </li>
                  <li class="disc">
                    <b class="lititle">自定义用户角色组，按需分配角色权限</b>
                  </li>
                  <li class="liCont">
                    管理员可对用户进行角色自定义，赋予不同角色不同的页面查看权限与数字资产操作权限。
                  </li>
                </ul>
              </div>
            </div>
            <div v-show="genesis" >
              <div class="manager">
                <img style="width: 565px;height: 421px;" src="../../assets/images/index/chuangke.png">
              </div>
              <div class="genesis">
                <ul style="padding:64px 0 0 16px">
                  <li class="disc">
                    <b class="lititle">用户自助，数字资产云共享使用</b>
                  </li>
                  <li class="liCont">
                    数字资产云共享，用户可在线查看所有数字资产条目，只需提交使用申请，即可进行跨小微、跨平台使用，有效提高协作效率。
                  </li>
                  <li class="disc">
                    <b class="lititle">多级分类，数字资产查询方便快捷</b>
                  </li>
                  <li class="liCont">
                    可自定义添加多级分类，将数字资产进行科学多维度分类管理，不同类型的数字资产账号信息字段可自定义维护，满足各种数字资产类型需求。
                  </li>
                  <li class="disc">
                    <b class="lititle">通知提醒自定义，任务及时处理</b>
                  </li>
                  <li class="liCont">
                    多节点工作流提醒，相关人员知晓每一条数字资产操作动态及反馈，做到任务及时处理，高效办公。
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="foot">
          <img style="width: 88px;margin:-20px 0 0 155px" src="../../assets/images/index/bgcircle.png">
          <div class="fromnow">hitank，轻松管理企业数字资产，从现在开始</div>
          <button class="pointer footExerpise" ref="btn2" @click="home">立即体验</button>
          <img style="width: 184px;height: 120px;margin:-160px 0 0 1100px" src="../../assets/images/index/discbg2.png">
        </div>
        <div class="footer">
          <table>
            <tr>
              <td style="width: 30%;height: 46px">产品</td>
              <td style="width: 65%">服务支持</td>
              <td>
                <img style="width: 116px;height: 27px" src="../../assets/images/homeLogo.png">
              </td>
            </tr>
            <tr class="footFont">
              <td>数字资产管理</td>
              <td>帮助手册</td>
              <td>电话：17854295899</td>
            </tr>
            <tr class="footFont">
              <td>组织管理</td>
              <td>建议反馈</td>
              <td>邮箱：zhzc.wangxuanqi@haier.com</td>
            </tr>
            <tr class="footFont">
              <td>BPM</td>
            </tr>
          </table>
        </div>
        <div class="Company">Copyright © 2000-2019 青岛海尔文化产业发展有限公司 All Rights Reserved</div>
      </div>
    </div>
  </div>
</template>
<script>
import IndexHeader from '../../components/home/IndexHeader'
import store from '@/store'
export default {
  components: {IndexHeader},
  data () {
    return {
      name: '',
      role: '',
      categoryRelation: '',
      scroll: 0,
      genesis: false,
      manager: true,
      manClick: true,
      manUnclick: false,
      proClick: false,
      proUnclick: true,
      eumClick: false,
      eumUnclick: true,
      width: ''
    }
  },
  mounted () {
    document.getElementById('index').addEventListener('scroll', this.handleScroll, true)
    console.log(document.body.clientWidth)
    this.width = document.body.clientWidth + 'px'
    this.$refs.main.style.width = this.width
  },
  methods: {
    handleScroll () {
      this.scroll = document.getElementById('index').scrollTop
      for (let i = Math.floor(this.scroll / 50); i--;) {
        let img = 'img' + (i - 1).toString()
        if (i > 1 && i < 14) {
          document.getElementById(img).className = 'trans'
        }
      }
    },
    home () {
      store.dispatch('getUserInfo').then(userInfo => {
        this.role = userInfo.role
        this.name = userInfo.userName
        this.categoryRelation = userInfo.categoryRelation ? userInfo.categoryRelation.split(',').join('-') : ''
        if (JSON.stringify(userInfo) === '{}') {
          this.$router.push('/login')
        } else {
          this.$router.push('/manageHome')
        }
      }).catch((err) => {
        console.log('获取用户信息错误：' + err)
      })
    },
    changeManage () {
      this.manClick = true
      this.manUnclick = false
      this.proClick = false
      this.proUnclick = true
      this.eumClick = false
      this.eumUnclick = true
      this.$refs.manTitle.className = 'pointer titleIcon titleClick'
      this.$refs.proTitle.className = 'pointer titleIcon titleUnclick'
      this.$refs.eumTitle.className = 'pointer titleIcon titleUnclick'
      this.$refs.manTitleBorder.className = 'borderClick'
      this.$refs.proTitleBorder.className = 'borderUuclick'
      this.$refs.eumTitleBorder.className = 'borderUnclick'
    },
    changeProcess () {
      this.manClick = false
      this.manUnclick = true
      this.proClick = true
      this.proUnclick = false
      this.eumClick = false
      this.eumUnclick = true
      this.$refs.manTitleBorder.className = 'borderUnclick'
      this.$refs.proTitleBorder.className = 'borderClick'
      this.$refs.eumTitleBorder.className = 'borderUnclick'
      this.$refs.manTitle.className = 'pointer titleIcon titleUnclick'
      this.$refs.proTitle.className = 'pointer titleIcon titleClick'
      this.$refs.eumTitle.className = 'pointer titleIcon titleUnclick'
    },
    changeEum () {
      this.manClick = false
      this.manUnclick = true
      this.proClick = false
      this.proUnclick = true
      this.eumClick = true
      this.eumUnclick = false
      this.$refs.manTitleBorder.className = 'borderUnclick'
      this.$refs.proTitleBorder.className = 'borderUnclick'
      this.$refs.eumTitleBorder.className = 'borderClick'
      this.$refs.manTitle.className = 'pointer titleIcon titleUnclick'
      this.$refs.proTitle.className = 'pointer titleIcon titleUnclick'
      this.$refs.eumTitle.className = 'pointer titleIcon titleClick'
    },
    changeManager () {
      this.manager = true
      this.genesis = false
      this.$refs.titltManage.className = 'manClick roleClick'
      this.$refs.titleChuangke.className = 'genClick roleUnclick'
      this.$refs.manline.className = 'lineClick'
      this.$refs.ckline.className = 'lineUnclick'
    },
    changeGenesis () {
      this.manager = false
      this.genesis = true
      this.$refs.titltManage.className = 'manClick roleUnclick'
      this.$refs.titleChuangke.className = 'genClick roleClick'
      this.$refs.manline.className = 'lineUnclick'
      this.$refs.ckline.className = 'lineClick'
    }
  }
}
</script>
<style scoped lang="less">
  @import '../../css/var';
  #index{
    overflow-y: auto;
    overflow-x: hidden;
    height: 100vh;
    width: 1438px;
    margin-top: 80px;
  }
  .main {
    width:1130px;
    height:540px;
    margin-left: 156px;
    background-image: url("../../assets/images/index/homebackground.png");
  }
  .title{
    width:494px;
    height:46px;
    font-size:38px;
    font-weight:500;
    color: @blackTitle;
    line-height:46px;
    padding-top: 120px;
  }
  .content{
    width:385px;
    height:24px;
    font-size:16px;
    font-weight:400;
    color:@blackText;
    line-height:24px;
    letter-spacing:1px;
    padding-top: 69px;
  }
  .dialong{
    margin: -42px 0 0 605px;
    animation: listUpdown 1.5s infinite alternate;
    -webkit-animation: listUpdown 1.5s infinite alternate;
  }
  .move{
    animation: listUpdown 1.5s infinite alternate;
    -webkit-animation: listUpdown 1.5s infinite alternate;
  }
  .font{
    height:40px;
    width: 114px;
    background:@theme;
    font-size:16px;
    font-weight:400;
    color:@fff;
    border: none;
    line-height:24px;
    border-radius:4px;
  }
  .subhead{
    width:510px;
    height:38px;
    font-size:30px;
    font-weight:400;
    color:@blackTitle;
    line-height:38px;
    margin: 312px 0 0 309px;
  }
  .images{
    width: 940px;
    height: 520px;
    margin: 64px 0 80px 98px;
  }
  td img{
    height: 0;
    margin-right: 228px;
    transition: 1s 0s height ease;
  }
  .trans{
    height: 64px;
  }
  .describe span{
    font-size:14px;
    font-weight:400;
    color:@blackText;
    line-height:22px;
    margin: 8px 0 80px -88px;
    width: 240px;
  }
  td span{
    width: 96px;
    font-size:16px;
    font-weight:400;
    color:@blackBodyTra;
    line-height:24px;
    display: inline-block;
    text-align: center;
    margin: 16px 0 0 -16px;
  }
  .three{
    width:1434px;
    height:851px;
    margin-left: -156px;
    background:@bg;
  }
  .threeTitle{
    width:360px;
    height:38px;
    font-size:30px;
    font-weight:400;
    color:@blackTitle;
    line-height:38px;
    padding-top: 80px;
    margin-left: 540px;
  }
  .Solutions{
    margin-top: 104px;
    text-align: center;
  }
  .Solutions img{
    width:64px;
    height:64px;
  }
  .titleIcon{
    display: inline-block;
    font-size:16px;
    font-weight:400;
    line-height:24px;
    color:@blackText;
  }
  .titleIcon img{
    display: inline-block;
  }
  .left{
    height: 420px;
    width: 504px;
    margin-left: 155px;
    float: left;
  }
  .right{
    height: 420px;
    width: 584px;
    float: left;
  }
  .titleLeft{
    display: inline-block;
    width:420px;
    height:32px;
    font-size:24px;
    font-weight:500;
    color:@blackTitle;
    line-height:32px;
    padding-left: 4px;
    margin-top: 10px;
  }
  .contLeft{
    display: inline-block;
    width:408px;
    height:44px;
    font-size:14px;
    font-weight:400;
    color:@blackText;
    line-height:22px;
    margin-left: 40px;
  }
  .list{
    height: 124px;
    padding:20px 24px
  }
  .list:hover{
    width:504px;
    height:124px;
    background:@fff;
    box-shadow:0px 4px 8px 0px rgba(0, 0, 0, 0.1);
    border-radius:4px;

  }
  .list img{
    width: 32px;
    height: 32px;
    margin-top: -4px;
  }
  .list:hover :nth-child(2){
    color:@theme;
  }
  .rows{
    margin-top: -365px;
    margin-left: 113px;
    width: 246px;
  }
  .rows img{
    margin-top: 11px;
    animation: listUpdown 1.5s infinite alternate;
    -webkit-animation: listUpdown 1.5s infinite alternate;
  }
  @keyframes listUpdown {
    from{transform:translate(0,0)}
    to{transform:translate(0,-10px)}
  }
  @-webkit-keyframes listUpdown {
    from{transform:translate(0,0)}
    to{transform:translate(0,-10px)}
  }
  .titlefour{
    width:360px;
    height:38px;
    font-size:30px;
    font-weight:400;
    color:@blackTitle;
    line-height:38px;
    margin: 80px 0 64px 385px;
  }
  .manager{
    width: 565px;
    height: 421px;
    float: left;
  }
  .genesis{
    width: 565px;
    height: 420px;
    float: left;
  }
  .manClick{
    width: 565px;
    height: 64px;
    float: left;
    align-items: center;
    justify-content: center;
    display: flex;
    font-size:16px;
    font-weight:500;
    line-height:24px;
    color:@theme;
  }
  .genClick{
    width: 565px;
    height: 64px;
    float: left;
    align-items: center;
    justify-content: center;
    display: flex;
    background:@bg;
    font-size:16px;
    font-weight:400;
    color:@blackText;
    line-height:24px;
  }
  .contFour{
    background:@fff;
    box-shadow:0px 0px 16px 0px rgba(0, 0, 0, 0.1);
    border-radius:4px;
    margin-bottom: 80px;
    width: 1130px;
    height: 484px;
  }
  .disc{
    color: @theme;
    list-style-type: disc;
    margin-left: 16px;
  }
  .lititle{
    font-size:16px;
    font-weight:500;
    color:@blackTitle;
    line-height:24px;
  }
  .liCont{
    width:469px;
    height:44px;
    font-size:14px;
    font-weight:400;
    color:@blackText;
    line-height:22px;
    margin: 8px 0 40px 18px;
  }
  .lineUnclick{
    width: 208px;
    border:8px @bg solid;
    border-radius:4px;
    margin-top: -16px
  }
  .lineClick{
    width: 208px;
    border:8px @themeLine solid;
    border-radius:4px;
    margin-top: -16px
  }
  .foot{
    width:1434px;
    height:286px;
    margin-left: -156px;
    background:linear-gradient(90deg,@theme 0%,@themeTra 100%);
  }
  .fromnow{
    font-size:38px;
    font-weight:400;
    color:@fff;
    line-height:46px;
    display: flex;
    justify-content: center;
    padding-top: 4px;
  }
  .footExerpise{
    width:114px;
    border: none;
    height:40px;
    background:@bg;
    box-shadow:0px 8px 8px 0px @themeTra;
    border-radius:4px;
    font-size:16px;
    font-weight:400;
    color:@theme;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40px 663px 80px 663px;
  }
  .footer{
    height: 356px;
    padding-top: 80px;
  }
  .footer table{
    font-size:14px;
    font-weight:500;
    color:@blackTitle;
    line-height:22px;
  }
  .footFont{
    font-weight:400;
    color:@blackText;
    height: 30px;
  }
  .Company{
    height:38px;
    font-size:12px;
    font-weight:400;
    color:@blackText;
    line-height:20px;
    display: flex;
    justify-content: center;
  }
  .titleClick{
  color: @theme;
  }
  .titleUnclick{
    color: @blackText;
  }
  .borderClick{
    padding-bottom: 4px;
    border-bottom: @theme 3px solid;
  }
  .borderUnclick{
    padding-bottom: 4px;
    border-bottom: @bg 3px solid;
  }
  .roleClick{
    color: @theme;
    background: @fff;
  }
  .roleUnclick{
    color: @theme;
    background: @bg;
  }
</style>
