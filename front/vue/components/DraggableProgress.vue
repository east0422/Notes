<template>
  <div
    class="draggableprogress"
    @mousedown="dragStart"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseout="dragEnd"
    @mouseleave="dragEnd">
    <el-progress
      type="line"
      :percentage="curPercentage"
      :stroke-width="strokeWidth"
      :text-inside="textInside"
      :color="color"
      :show-text="showText"
      :format="format"
      :define-back-color="defineBackColor"
      :text-color="textColor">
    </el-progress>
  </div>
</template>

<script>
export default {
  name: 'DraggableProgress',
  props: {
    draggable: { // 是否可拖动
      type: Boolean,
      default: true
    },
    percentage: { // 百分比(必填)
      type: Number,
      required: true
    },
    strokeWidth: { // 进度条的宽度，单位 px
      type: Number,
      default: 20
    },
    textInside: { // 进度条显示文字内置在进度条内
      type: Boolean,
      default: false
    },
    color: { // 进度条背景色
      type: [String, Array, Function],
      default: ''
    },
    showText: { // 是否显示进度条文字内容
      type: Boolean,
      default: true
    },
    format: { // 指定进度条文字内容
      type: Function,
      default: null
    },
    defineBackColor: { // 指定进度条底色（支持 hex 格式）
      type: String,
      default: ''
    },
    textColor: { // 指定进度条字体颜色（支持 hex 格式）
      type: String,
      default: ''
    }
  },
  data() {
    return {
      curPercentage: 0,
      isDragStart: false // 是否开始拖动
    }
  },
  watch: {
    percentage: {
      handler(newVal) {
        this.curPercentage = newVal
      },
      immediate: true
    }
  },
  methods: {
    dragStart(e) {
      if (!this.draggable) {
        return
      }
      this.isDragStart = true
      this.changePercentage(e.clientX)
    },
    dragEnd() {
      this.isDragStart = false
    },
    dragMove(e) {
      if (!this.draggable || !this.isDragStart) {
        return
      }
      this.changePercentage(e.clientX)
    },
    changePercentage(clientX) {
      const rect = this.$el.getBoundingClientRect()
      let newPercentage = Math.round(((clientX - rect.left) / (rect.width - 50 - this.strokeWidth)) * 100)
      newPercentage = Math.max(0, Math.min(newPercentage, 100))
      this.curPercentage = newPercentage
      this.$emit('change', newPercentage)
    }
  }
}
</script>

<style lang="less" scoped>
.draggableprogress {
  height: 100%;
  width: 100%;
  user-select: none;
  :hover, :active {
    cursor: pointer;
  }
}
</style>

<style lang="less">
.draggableprogress {
  .el-progress {
    .el-progress-bar { // 高度调整
      width: calc(~'100% - 50px');
      margin-right: -50px;
      padding-right: 50px;
    }
  }
}
</style>