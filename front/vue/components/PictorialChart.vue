
<template>
  <div :id="id" :ref="id" :style="{ width: width, height: height }"></div>
</template>
 
<script>
export default {
  name: 'PictorialChart',
  props: {
    id: {
      type: String,
      default: 'pictorialChart'
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
    symbol: { // 图形类型('circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none')
      type: String,
      default: 'triangle'
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
      let series = []
      let valueArr = []
      let len = this.valueKeys.length
      let midIndex = Math.floor(len / 2)
      let symbolOffsetX = 0
      let isEven = (len % 2 == 0) // 偶数个
      this.valueKeys.map((valueKey, valueIndex) => {
        symbolOffsetX = (valueIndex - midIndex) * 20
        if (isEven) {
          symbolOffsetX += 10
        }
        valueArr = []
        this.seriesData.map((item) => {
          valueArr.push(item[valueKey])
        })
        series.push({
          type: 'pictorialBar', // pictorialBar(象形柱图)
          symbol: this.symbol,
          symbolOffset: [symbolOffsetX, 0],
          barWidth: 20,
          itemStyle: {
            color: this.colors[valueIndex]
          },
          data: valueArr
        })
      })
     
      let options = {
        tooltip: {
          show: this.showTooltip,
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          backgroundColor: 'rgba(32,45,61,0.85)',
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
          left: 15,
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