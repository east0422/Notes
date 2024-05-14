
<template>
  <div :id="id" :ref="id" :style="{ width: width, height: height }"></div>
</template>
 
<script>
import { getPie3D } from '@/utils/echarts3D'

export default {
  name: 'Pie3dChart',
  props: {
    id: {
      type: String,
      default: 'pie3dChart'
    },
    seriesData: {
      type: Array,
      default: () => {
        return []
      }
    },
    boxHeight: { // 3d高度
      type: Number,
      default: 10
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
    legendRight: {
      type: String,
      default: 'right'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
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
      let boxHeight = this.boxHeight
      if (boxHeight < 3) {
        boxHeight = 3
      } else if (boxHeight > 10) {
        boxHeight = 10
      }
      let options = {
        color: this.colors,
        tooltip: {
          show: this.showTooltip,
          trigger: 'item'
        },
        legend: {
          show: this.showLegend,
          right: this.legendRight,
          y: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 12
          }
        },
        xAxis3D: {
          min: -1,
          max: 1
        },
        yAxis3D: {
          min: -1,
          max: 1
        },
        zAxis3D: {
          min: -1,
          max: 1
        },
        grid3D: {
          show: false, // 是否显示三维笛卡尔坐标系。
          boxHeight: boxHeight, // 三维笛卡尔坐标系在三维场景中的高度
          width: this.width,
          height: this.height,
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          viewControl: {
            // 用于鼠标的旋转，缩放等视角控制
            alpha: 50, // 角度
            distance: 150, // 调整视角到主体的距离，类似调整zoom 重要
            rotateSensitivity: 0, // 设置为0无法旋转
            zoomSensitivity: 0, // 设置为0无法缩放
            panSensitivity: 0, // 设置为0无法平移
            autoRotate: false // 自动旋转
          }
        },
        series: getPie3D(this.seriesData, 1.35, boxHeight)
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