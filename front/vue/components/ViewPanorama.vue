<template>
  <custom-dialog
    :visible.sync="dialogVisible"
    :title="title"
    width="90%"
    :append-to-body="appendToBody"
    :show-footer="false"
    @closed="$emit('closed')"
  >
    <div class="content">
      <iframe v-if="url" class="panorama" :src="url"></iframe>
    </div>
  </custom-dialog>
</template>

<script>
export default {
  name: 'ViewPanorama',
  props: {
    // 控制显隐
    visible: {
      type: Boolean,
      default: false
    },
    // Dialog 自身是否插入至 body 元素上
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 全景图名称
    title: {
      type: String,
      default: '全景图详情'
    },
    // 全景图地址
    url: String
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.dialogVisible = val
      },
      immediate: true
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 30px;
  height: 800px;
}

.panorama {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
