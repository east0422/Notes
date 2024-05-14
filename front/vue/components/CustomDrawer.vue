<template>
  <el-drawer
    :visible.sync="drawerVisible"
    :title="title"
    :size="size"
    :show-close="showClose"
    :custom-class="customClass + ' drawer-demo'"
    @open="$emit('open')"
    @opened="$emit('opened')"
    @close="$emit('close')"
    @closed="$emit('closed')">
   <div class="main-demo">
      <div class="inside-scroll-box">
        <div v-if="showHeader" class="control-form-label">
          <span class="label">{{headerTitle}}</span>
        </div>
        <slot></slot>
      </div>
    </div>
    <div v-if="showFooter" class="footer-bar-demo">
      <el-button v-if="showCancel" class="large default-drawer-btn" plain @click="closeClick">{{cancelText}}</el-button>
      <el-button v-if="showConfirm" class="large default-drawer-btn" type="primary" @click="confirmClick">{{confirmText}}</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'CustomDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: [Number, String],
      default: '100%'
    },
    showClose: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    headerTitle: {
      type: String,
      default: ''
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: '提交'
    }
  },
  data() {
    return {
      drawerVisible: false
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.drawerVisible = val
      },
      immediate: true
    },
    drawerVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    closeClick() {
      this.drawerVisible = false
      this.$emit('close')
    },
    confirmClick() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="less" scoped></style>
