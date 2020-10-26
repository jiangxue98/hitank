<template>
  <div class="home-pie-card">
    <div class="title">{{title}}</div>
    <ul class="clearfix">
      <li class="fl">
        <p class="blackText f12">目标完成率</p>
        <p class="num">{{data[0].value}}%</p>
      </li>
      <li class="fl">
        <div :id="name" style="width: 48px;height: 48px" :alt="tmp"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  components: {},
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    tmp: {
      type: Number,
      required: true
    },
    data: {
      type: Array || undefined,
      required: false,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    let myChart = echarts.init(document.getElementById(this.name))
    // 绘制图表
    myChart.setOption(this.getOption)
  },
  computed: {
    getOption () {
      // 基于准备好的dom，初始化echarts实例
      let option = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '统计信息',
            type: 'pie',
            radius: ['45%', '70%'],
            avoidLabelOverlap: false,
            hoverOffset: 3,
            color: ['#37B69A', '#F0F2F5'],
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            emphasis: {
              itemStyle: {
                opacity: 0.2
              }
            },
            data: this.data
          }
        ]
      }
      return option
    }
  },
  updated () {
    // 基于准备好的dom，初始化echarts实例
    // var myChart = echarts.init(document.getElementById(this.name))
  }
}
</script>

<style scoped lang="less">
  @import "~@var";
  .home-pie-card{
    color: @blackBody;
    cursor: pointer;
    ul{
      width:124px ;
      padding-left: 0;
    }
    .title{
      margin-bottom: 12px;
    }
    .num{
      font-size: 20px;
    }
  }
  .home-pie-card:hover{
    .title{
      color: @theme;
    }
    .num{
      color: @blackTitle;
    }
  }
</style>
