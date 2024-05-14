<template>
  <virtual-list
    ref="virtualList"
    :style="{overflowY: 'auto', maxHeight: maxHeight}"
    :data-sources="listData"
    :data-key="optionKey"
    :data-component="optionItemComponent"
    :extra-props="extraProps"
    :keeps="keeps"
    :estimate-size="estimateSize">
  </virtual-list>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'
import VirtualListOptionItem from './VirtualListOptionItem'

export default {
  name: 'VirtualListOptions',
  components: {
    VirtualList
  },
  props: {
    maxHeight: { // 总高度
      type: [String, Number],
      default: '360px'
    },
    estimateSize: { // 每一个选项高度
      type: Number,
      default: 50
    },
    keeps: { // 渲染最大dom数量
      type: Number,
      default: 30
    },
    extraProps: {
      type: Object,
      default: () => {
        return {
          labelKey: 'label',
          valueKey: 'value'
        }
      }
    },
    listData: { // 数据列表
      type: Array,
      default: () => {
        return []
      }
    },
    optionKey: { // 列表key对应字段
      type: String,
      default: 'value'
    },
  },
  data() {
    return {
      optionItemComponent: VirtualListOptionItem
    }
  },
  methods: {
    reset() {
      this.$refs.virtualList && this.$refs.virtualList.reset()
    }
  }
}
</script>

<style lang="less" scoped>

</style>

<style lang="less">
.virtuallistselect { // 外部select容器设置最大高度
  .el-select-dropdown__wrap {
    max-height: 360px;
  }
  .el-scrollbar .el-scrollbar__bar.is-vertical { // 避免两个滚动条
    width: 0;
  }
}
</style>