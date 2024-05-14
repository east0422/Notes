
<template>
  <div :id="id" :ref="id" :style="{ width: width, height: height }"></div>
</template>
 
<script>
export default {
  name: 'Pictorial3dbarChart',
  props: {
    id: {
      type: String,
      default: 'pictorial3dbarChart'
    },
    showTooltip: { // 是否显示提示框
      type: Boolean,
      default: true
    },
    // legend
    showLegend: {
      type: Boolean,
      default: false
    },
    legendTop: {
      type: String,
      default: 'auto'
    },
    legendLeft: {
      type: String,
      default: 'auto'
    },
    formatter: {
      type: [String, Function],
      default: '{b0}: {c0}<br />{b1}: {c1}'
    },
    seriesData: {
      type: Array,
      default: () => {
        return []
      }
    },
    valueKeys: { // 有多组数据时对应每组数据值key
      type: Array,
      default: () => {
        return ['value']
      }
    },
    colors: {
      type: [Array, Object, String],
      default: () => {
        return ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
      }
    },
    yAxisName: {
      type: String,
      default: ''
    },
    nameKey: { // x轴名称对应字段
      type: String,
      default: 'name'
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
    initValueSeries(valueArr, valueIndex) {
      let len = this.valueKeys.length
      let midIndex = Math.floor(len / 2)
      let symbolOffsetX = (valueIndex - midIndex) * 30 // (宽度20加一个间隔10)
      if (len % 2 == 0) { // 偶数个
        symbolOffsetX += 15
      }
      let series = [
        {
          type: 'pictorialBar', // pictorialBar(象形柱图)
          barWidth: 20,
          symbol: (value) => {
            if (value) {
              return 'circle'
            } else {
              return 'none'
            }
          },
          symbolSize: [20, 5], // 图形的大小用数组分别比表示宽和高,也乐意设置成10相当于[10,10]
          symbolOffset: [symbolOffsetX, 2], // 图形相对于原本位置的偏移
          z: 12, // 象形柱状图组件的所有图形的 z 值.控制图形的前后顺序.z 值小的图形会被 z 值大的图形覆盖.
          itemStyle: {
            // 4个参数用于配置渐变色的起止位置,这4个参数依次对应右 下 左 上
            color: (val) => {
              if (len == 1) {
                return this.colors[val.dataIndex] && this.colors[val.dataIndex].bottomColor
              } else {
                return this.colors[valueIndex] && this.colors[valueIndex].bottomColor
              }
            }
          },
          data: valueArr
        },
        {
          type: 'bar', // 中间的长方形柱状图(柱状图)
          barWidth: 20, // 柱条的宽度,不设时自适应
          barGap: '50%', // 柱子与柱子之间的距离
          itemStyle: {
            color: (val) => {
              if (len == 1) {
                return this.colors[val.dataIndex] && this.colors[val.dataIndex].barColor
              } else {
                return this.colors[valueIndex] && this.colors[valueIndex].barColor
              }
            }
          },
          data: valueArr
        },
        {
          type: 'pictorialBar', // 顶部的椭圆形(象形柱图):pictorialBar
          barWidth: 20,
          symbolSize: [20, 5],
          symbolOffset: [symbolOffsetX, -2],
          z: 12,
          symbol: (value) => {
            if (value) {
              return 'circle'
            } else {
              return 'none'
            }
          },
          symbolPosition: 'end',
          itemStyle: {
            color: (val) => {
              if (len == 1) {
                return this.colors[val.dataIndex] && this.colors[val.dataIndex].topColor
              } else {
                return this.colors[valueIndex] && this.colors[valueIndex].topColor
              }
            }
          },
          data: valueArr
        }
      ]
      return series
    },
    drawChart() {
      if (this.myEchart) {
        this.myEchart.dispose()
      }
      if (!this.$refs[this.id]) return
      this.myEchart = this.$echarts.init(this.$refs[this.id])
      let series = []
      let valueArr = []
      this.valueKeys.map((valueKey, valueIndex) => {
        valueArr = []
        this.seriesData.map((item) => {
          valueArr.push(item[valueKey])
        })
        series = series.concat(this.initValueSeries(valueArr, valueIndex))
      })
     
      let options = {
        tooltip: {
          show: this.showTooltip,
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          backgroundColor: 'rgba(19,49,90,0.8)',
          borderWidth: 0,
          confine: true,
          formatter: this.formatter
        },
        legend: {
          show: this.showLegend,
          top: this.legendTop,
          left: this.legendLeft
        },
        grid: {
          top: 50,
          bottom: 10,
          left: 5,
          right: 0,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisLine: {
            lineStyle: {
              color: '#2B4966'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            margin: 12,
            color: '#fff',
            fontSize: 12
          },
          data: this.seriesData.map((item) => item[this.nameKey])
        },
        yAxis: {
          name: this.yAxisName,
          type: 'value',
          axisLabel: {
            color: '#2B4966',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              color: '#2B4966'
            }
          }
        },
        series: series
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