
<template>
  <div :id="id" :ref="id" :style="{ width: width, height: height }"></div>
</template>
 
<script>
export default {
  name: 'PieChart',
  props: {
    id: {
      type: String,
      default: 'pieChart'
    },
    radius: {
      type: Array,
      default: () => {
        return ['70%', '90%']
      }
    },
    center: {
      type: Array,
      default: () => {
        return ['50%', '50%']
      }
    },
    colors: {
      type: [Array, Object, String],
      default: () => {
        return ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
      }
    },
    showTooltip: { // 是否显示提示框
      type: Boolean,
      default: false
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
    // series
    silent: { // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件
      type: Boolean,
      default: false
    },
    avoidLabelOverlap: { // 是否启用防止标签重叠策略
      type: Boolean,
      default: false
    },
    hoverAnimation: { // 是否开启 hover 在图形上的提示动画效果
      type: Boolean,
      default: false
    },
    seriesData: {
      type: Array,
      default: () => {
        return []
      }
    },
    showSeriesLabel: {
      type: Boolean,
      default: true,
    },
    seriesLabelPosition: {
      type: String,
      default: 'center'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    isHighlightFirst: { // 是否默认选中第一个
      type: Boolean,
      default: false
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
        color: this.colors,
        tooltip: {
          show: this.showTooltip,
          trigger: 'item'
        },
        legend: {
          show: this.showLegend,
          top: this.legendTop,
          left: this.legendLeft
        },
        series: [
          {
            type: 'pie',
            radius: this.radius,
            center: this.center,
            silent: this.silent,
            avoidLabelOverlap: this.avoidLabelOverlap,
            hoverAnimation: this.hoverAnimation,
            label: {
              show: this.showSeriesLabel,
              position: this.seriesLabelPosition
            },
            data: this.seriesData
          }
        ]
      }
      this.myEchart.setOption(options)
      if (this.isHighlightFirst) {
        this.myEchart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0
        })
      }
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