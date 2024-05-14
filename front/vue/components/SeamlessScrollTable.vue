<template>
  <div :class="['seamlessscrolltable', customClass]">
    <!-- 表头 -->
    <div class="hcontainer vcenter sst-header" v-if="config.showHeader">
      <div
        v-for="(item, index) in (config.columns || [])"
        :key="index"
        class="fill"
        :style="{width: item.width || 'initial'}">
        {{item.label || ''}}
      </div>
    </div>
    <!-- 滚动部分 -->
    <div @click="itemClick">
      <vue-seamless-scroll
        :data="(config.data || [])"
        :class-option="seamlessScrollOption"
        :class="['sst-item-container']"
        :style="{height: seamlessScrollHeight}">
        <slot>
          <div
            v-for="(row, rowIndex) in (config.data || [])"
            :key="rowIndex"
            class="hcontainer vcenter sst-item"
            :data-index="rowIndex">
            <div
              v-for="(item, index) in (config.columns || [])"
              :key="index"
              :data-index="rowIndex"
              class="fill"
              :style="{width: item.width || 'initial', color: item.color || '#ffffff'}">
              <template v-if="item.slotName">
                <slot :name="item.slotName" :row="row" :index="rowIndex">
                </slot>
              </template>
              <span v-else>{{row[item.prop]}}{{item.unit || ''}}</span>
            </div>
          </div>
        </slot>
      </vue-seamless-scroll>
    </div>
  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'

export default {
  name: 'SeamlessScrollTable',
  components: {
    vueSeamlessScroll
  },
  props: {
    seamlessScrollHeight: {
      type: String,
      default: ''
    },
    config: { // 列表配置数据
      type: Object,
      default: () => {
        return {
          showHeader: false, // 是否显示头部
          data: [], // 数据
          columns: [] // 每列对应字段
        }
      }
    },
    seamlessScrollOption: { // 滚动设置参数
      type: Object,
      default: () => {
        return {
          step: 0.3, // 数值越大速度滚动越快
          limitMoveNum: 3, // 开始无缝滚动的数据量
          hoverStop: true, // 是否开启鼠标悬停stop
          direction: 1, // 0向下 1向上 2向左 3向右
          openWatch: true, // 开启数据实时监控刷新dom
          singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
          singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
          waitTime: 100 // 单步运动停止的时间(默认值1000ms)
        }
      }
    },
    customClass: { // 自定义样式
      type: String,
      default: ''
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    itemClick(e) {
      if (!e || !e.target || !e.target.dataset || e.target.dataset.index === undefined) {
        return
      }
      this.$emit('itemClick', {index: e.target.dataset.index, item: this.listData[e.target.dataset.index]})
    }
  }
}
</script>

<style lang="less" scoped>
.seamlessscrolltable {
  color: #ffffff;
  font-size: 14px;
  background-color: transparent;
  text-align: center;
  .sst-header {
    width: 100%;
    height: 40px;
    margin-top: 25px;
  }
  .sst-item-container {
    overflow: hidden;
    .sst-item {
      width: 100%;
      height: 40px;
      background: linear-gradient(90deg, rgba(65,149,253,0.05) 0%, rgba(65,145,253,0.05) 100%);
      margin-bottom: 13px;
    }
  }
}
</style>