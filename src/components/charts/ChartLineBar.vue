<!-- 折线柱状图 -->
<template>
    <div :id="name" :style="{'width':this.width,'height':this.height}" :alt="tmp"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'ChartLineOne',
  props: {
    name: {
      type: String,
      required: true
    },
    width: {
      type: String,
      required: false
    },
    height: {
      type: String,
      required: false
    },
    xName: { // x轴单位
      type: Array || undefined,
      required: false,
      default: function () {
        return []
      }
    },
    yName: { // y轴单位
      type: Array || undefined,
      required: false,
      default: function () {
        return []
      }
    },
    legendName: {// 图例名称；若为空，不显示图例
      type: Array || undefined,
      required: false,
      default: function () {
        return []
      }
    },
    // 图例的形状
    legendIcon: {
      type: String,
      required: false,
      default: 'rect'
    },
    legendPosition: { // 图例位置；right-右上(默认)；left-左上；center-底部居中
      type: String,
      required: false,
      default: 'right'
    },
    theme: { // 主题色
      type: String,
      required: false,
      default: 'white'// 白色背景(默认)；black-黑色背景
    },
    yBarData: { // 柱状图数据
      type: Array || undefined,
      required: false,
      default: function () {
        return []
      }
    },
    yLineData: { // 折线图数据
      type: Array || undefined,
      required: false,
      default: function () {
        return []
      }
    },
    tmp: {
      type: Number,
      required: true
    }
  },

  data () {
    return {

    }
  },
  computed: {
    getOption () {
      let yAxis = []
      let yAxisColor = this.theme === 'black' ? '#fff' : '#909399'
      for (let i = 0; i < this.yName.length; i++) {
        yAxis.push({
          type: 'value',
          name: i % 2 === 0 ? this.yName[i] : '',
          axisTick: {
            show: i % 2 === 0
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 0, // 坐标轴线隐藏
              color: yAxisColor // 坐标轴文字颜色
            }
          }

        })
      }

      let legend = {
        data: this.legendName,
        icon: this.legendIcon,
        textStyle: {color: yAxisColor}
      }
      if (this.legendPosition === 'right') {
        legend.right = '1%'
      } else if (this.legendPosition === 'center') {
        legend.bottom = 0
      } else if (this.legendPosition === 'left') {
        legend.left = '6%'
      }

      let series = []
      let b = this.yBarData
      let l = this.yLineData
      let seriesBar = []
      for (let i = 0; i < b.length; i++) {
        let obj = b[i]
        seriesBar.push({
          name: obj.name,
          color: obj.color,
          type: 'bar',
          barMaxWidth: '10%', // 最大宽度
          data: obj.data
        })
      }
      let seriesLine = []
      // let lineColor = this.theme === 'black'? '['']' : [] todo封装颜色
      for (let i = 0; i < l.length; i++) {
        let obj = l[i]
        seriesLine.push({
          name: obj.name,
          color: obj.color,
          type: 'line',
          data: obj.data
        })
      }
      console.log('seriesBar:', seriesBar)
      series = [...seriesBar, ...seriesLine]

      let option = {
        grid: {
          top: '20%',
          left: '3%',
          right: '1%',
          bottom: '6%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: legend,
        xAxis: [
          {
            type: 'category',
            data: this.xName,
            axisPointer: {
              type: 'shadow'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: yAxisColor // 坐标轴文字颜色
              }
            }
          }
        ],
        yAxis: yAxis,
        series: series
      }
      console.log('yAxis:', option.yAxis)
      console.log('series:', series)
      return option
    }
  },
  updated () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(this.name))
    // 绘制图表
    myChart.setOption(this.getOption)
  }
}

</script>
<style scoped>

</style>
