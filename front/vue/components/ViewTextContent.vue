<template>
  <custom-dialog
    :visible.sync="dialogVisible"
    title="文本详情"
    :append-to-body="appendToBody"
    :show-footer="false"
    @closed="$emit('closed')"
  >
    <div class="content-box">
      <div class="text">{{ content }}</div>
      <p v-if="!content" class="empty">无数据</p>
    </div>
  </custom-dialog>
</template>

<script>
export default {
  name: 'ViewTextContent',
  components: {},
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
    // 文本内容
    content: String
  },
  data() {
    return {
      // 弹窗显隐
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
/deep/ .content-box {
  margin: 24px 12px 30px 30px;
  padding-right: 18px;
  max-height: 500px;
  font-size: 18px;
  overflow-y: auto;
}

.empty {
  padding: 50px 0;
  text-align: center;
  font-size: 18px;
}
</style>
