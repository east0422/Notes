
<template>
  <div :id="id" :ref="id" :style="{ width: width, height: height }"></div>
</template>
 
<script>
export default {
  name: 'LineChart',
  props: {
    id: {
      type: String,
      default: 'lineChart'
    },
    showTooltip: { // 是否显示提示框
      type: Boolean,
      default: true
    },
    formatter: {
      type: [String, Function],
      default: () => {
        return (params) => {
          return params[0].marker + ' ' + params[0].name + '：' + params[0].value
        }
      }
    },
    seriesData: {
      type: Array,
      default: () => {
        return []
      }
    },
    valueKey: { // x轴数字显示对应key字段
      type: String,
      default: 'value'
    },
    xAxisKey: { // x轴显示对应key字段
      type: String,
      default: 'name'
    },
    yAxisName: { // Y轴显示名称
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      myEchart: null
    }
  },
  watch: {
    seriesData: {
      handler() {
        this.drawChart()
      },
      deep: true
    }
  },
  methods: {
    drawChart() {
      if (this.myEchart) {
        this.myEchart.dispose()
      }
      if (!this.$refs[this.id]) return
      this.myEchart = this.$echarts.init(this.$refs[this.id])
      let options = {
        grid: {
          left: '0',
          right: '10',
          top: '40',
          bottom: '0',
          containLabel: true
        },
        tooltip: {
          show: this.showTooltip,
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: 'rgba(27, 255, 225, 0.3)',
              type: 'solid'
            }
          },
          backgroundColor: 'rgba(19,49,90,0.8)',
          borderWidth: 0,
          confine: true,
          formatter: this.formatter
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: 1,
            axisLine: {
              show: false
            },
            axisLabel: {
              color: '#A1A7B3',
              textStyle: {
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 1)'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },

            data: this.seriesData.map((item) => item[this.xAxisKey])
          }
        ],
        yAxis: [
          {
            name: this.yAxisName,
            nameTextStyle: {
              fontSize: '12px',
              color: 'rgba(43, 73, 102, 1)'
            },
            type: 'value',
            padding: 5,
            splitLine: {
              show: true,
              lineStyle: {
                color: ['rgba(199, 199, 200, 0.2)'],
                width: 1,
                type: 'dashed'
              }
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(43, 73, 102, 1)',
                fontSize: 12
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            type: 'line',
            smooth: true,
            data: this.seriesData.map(item => item[this.valueKey])
          }
        ]
      }
      this.myEchart.setOption(options)
    },
    chartResize() {
      if (this.myEchart) {
        this.myEchart.resize()
      }
    }
  },
  mounted() {
    this.drawChart()
    window.addEventListener('resize', this.chartResize)
  },
  destroyed() {
    window.removeEventListener('resize', this.chartResize)
  }
}
</script>
 
<style lang="scss" scoped>
</style>