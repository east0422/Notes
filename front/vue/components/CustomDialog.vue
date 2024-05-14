<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="title"
    :width="width"
    :show-close="showClose"
    :append-to-body="appendToBody"
    :custom-class="customClass + ' custom-dialog'"
    @open="$emit('open')"
    @opened="$emit('opened')"
    @close="$emit('close')"
    @closed="$emit('closed')"
  >
    <template #title>
      <slot name="title">
        <span v-show="title" class="title-text">{{ title }}</span>
      </slot>
    </template>
    <slot name="header-btn"></slot>
    <slot></slot>
    <template v-if="showFooter" #footer>
      <slot name="footer">
        <div class="footer">
          <div class="left">
            <span v-if="showRemoveBtn" class="remove" @click="$emit('confirm', removeMethod)">删除数据</span>
          </div>
          <div class="right">
            <el-button plain @click="close">取消</el-button>
            <el-button type="primary" @click="$emit('confirm', confirmMethod)">{{ confirmText }}</el-button>
          </div>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'customDialog',
  props: {
    // 控制显隐
    visible: {
      type: Boolean,
      default: false
    },
    // 标题
    title: String,
    // 宽度
    width: {
      type: String,
      default: '50%'
    },
    showClose: {
      type: Boolean,
      default: true
    },
    // Dialog 自身是否插入至 body 元素上
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 是否显示底部插槽
    showFooter: {
      type: Boolean,
      default: true
    },
    // 是否显示底部左侧删除按钮
    showRemoveBtn: {
      type: Boolean,
      default: false
    },
    // 底部确定按钮文本
    confirmText: {
      type: String,
      default: '确定'
    },
    // 自定义类名
    customClass: String,
    // 确认回调触发父组件事件名
    confirmMethod: String,
    // 删除回调触发父组件事件名
    removeMethod: String
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
  },
  methods: {
    // 关闭弹窗
    close() {
      this.dialogVisible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .remove {
    color: #f44c31;
    cursor: pointer;
  }
}
</style>
