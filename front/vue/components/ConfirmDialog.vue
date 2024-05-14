<template>
  <custom-dialog
    :visible.sync="dialogVisible"
    :title="title"
    :width="width"
    :append-to-body="appendToBody"
    :custom-class="`${defaultClass} ${customClass}`"
    :show-footer="true"
    @open="$emit('open')"
    @opened="$emit('opened')"
    @close="$emit('close')"
    @closed="$emit('closed')"
    @confirm="$emit('confirm', confirmMethod)"
  >
    <div class="content">
      <p class="confirm-text">{{ confirmText }}</p>
      <p class="confirm-tips">{{ confirmTips }}</p>
    </div>
  </custom-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    // 控制显隐
    visible: {
      type: Boolean,
      default: false
    },
    // 弹窗标题
    title: {
      type: String,
      default: '提示'
    },
    // 弹窗宽度
    width: {
      type: String,
      default: '50%'
    },
    // 确认文本
    confirmText: {
      type: String,
      default: '确认删除此数据？'
    },
    // 确认提示
    confirmTips: {
      type: String,
      default: '删除后，数据不可恢复'
    },
    // 确认回调触发父组件事件名
    confirmMethod: String,
    // Dialog 自身是否插入至 body 元素上
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 默认类名
    defaultClass: {
      type: String,
      default: 'confirm-dialog-demo'
    },
    // 自定义类名
    customClass: {
      type: String,
      default: ''
    }
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

<style lang="less">
.confirm-dialog-demo {
  width: 597px !important;
}
</style>

<style lang="less" scoped>
.content {
  margin-right: 10px;
  padding-top: 107px;
  padding-left: 30px;
  padding-right: 20px;
  height: 227px;
  text-align: center;
}

.confirm-text {
  font-size: 20px;
  color: #171717;
}

.confirm-tips {
  margin-top: 12px;
  font-size: 16px;
  color: #a8aaac;
}
</style>
