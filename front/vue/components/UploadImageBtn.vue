<template>
  <div class="upload-image-btn-container">
    <el-dropdown trigger="click" @command="commandChange">
      <el-button class="large" type="primary" icon="el-icon-plus">上传照片</el-button>
      <el-dropdown-menu slot="dropdown" class="dropdown-menu-demo">
        <el-dropdown-item icon="el-icon-upload2" command="local">本地上传</el-dropdown-item>
        <el-dropdown-item icon="el-icon-folder" command="library">素材库</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <component
      v-if="componentConfig.isRender"
      :is="componentConfig.component"
      :append-to-body="true"
      :visible.sync="componentConfig.visible"
      v-bind="componentConfig.data"
      @closed="componentClosed"
      @confirm="componentConfirm"
    ></component>
  </div>
</template>

<script>
export default {
  name: 'UploadImageBtn',
  props: {
    // 资源库是否多选
    multiple: Boolean,
    // 默认已有数量
    selectedNum: Number,
    // 资源库选项数量限制
    limit: Number,
    // 确认回调触发父组件事件名
    confirmMethod: String
  },
  data() {
    return {
      // 图片来源
      source: '',
      // 动态组件配置
      componentConfig: {
        isRender: false,
        visible: false,
        component: '',
        data: {}
      }
    }
  },
  methods: {
    // 动态组件关闭动画结束回调
    componentClosed() {
      this.componentConfig.isRender = false
      this.componentConfig.data = {}
    },
    // 动态组件 确认/保存 按钮回调
    componentConfirm(val) {
      const method = val && typeof val === 'object' ? val.confirmMethod : val
      this[method] && this[method](val.data)
    },
    // 弹出动态组件
    openComponent(component, data) {
      this.componentConfig.data = data
      this.componentConfig.component = component
      this.componentConfig.isRender = true
      this.$nextTick(() => (this.componentConfig.visible = true))
    },
    // 本地上传
    local() {
      if (this.selectedNum >= this.limit) {
        this.$message.closeAll()
        this.$message.warning(`最多上传 ${this.limit} 个附件，请先删除已有附件再操作`)
        return
      }
      this.source = 'local'
      this.openComponent('UploadImageDialog', { confirmMethod: 'fileConfirm' })
    },
    // 资源库选择
    library() {
      if (this.selectedNum >= this.limit) {
        this.$message.closeAll()
        this.$message.warning(`最多上传 ${this.limit} 个附件，请先删除已有附件再操作`)
        return
      }
      this.source = 'library'
      this.openComponent('ResourceLibraryDialog', {
        confirmMethod: 'fileConfirm',
        multiple: this.multiple,
        limit: this.limit,
        selectedNum: this.selectedNum
      })
    },
    // 下拉菜单变化
    commandChange(method) {
      this[method] && this[method]()
    },
    // 图片回调
    fileConfirm(data) {
      this.$emit('upload', { source: this.source, data })
    }
  }
}
</script>

<style lang="less" scoped>
// .el-dropdown {
//   display: block;
//   height: 100%;
//   cursor: pointer;
// }

// .el-dropdown-link {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100%;
//   font-weight: bold;
//   font-size: 36px;
//   color: #ebebeb;
// }

// .el-icon--right {
//   margin-left: 0;
// }
</style>
