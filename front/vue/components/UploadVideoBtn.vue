<template>
  <div class="upload-image-btn-container">
    <el-dropdown trigger="click" @command="commandChange">
      <el-button class="large" type="primary" icon="el-icon-plus">上传视频</el-button>
      <el-dropdown-menu slot="dropdown" class="dropdown-menu-demo">
        <el-upload
            ref="uploadRef"
            class="upload"
            :action="`${uploadUrl}`"
            :headers="uploadHeaders"
            :file-list="fileList"
            :before-upload="beforeUploadFile"
            :on-success="successFile"
            :on-error="errorFile"
          >
          <el-dropdown-item icon="el-icon-upload2" command="local">
            <span>本地上传</span>
          </el-dropdown-item>
        </el-upload>
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
import { digitalVillageOssUrl } from '@/config'

export default {
  name: 'UploadVideoBtn',
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
      },
      // 附件上传地址
      uploadUrl: `${digitalVillageOssUrl}/file/object/upload/object?bucketName=topeak-business`,
      // 附件上传请求头
      uploadHeaders: {
        token: sessionStorage.token,
        systemType: 'system_info'
      },
      fileData: {
        videoName: '',
        id: '',
        videoUrl: '',
      },
      fileList: [],
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
    // 上传失败
    errorFile() {
      this.fileData.videoName = ''
      this.$message.error('上传失败')
    },
    // 附件上传之前
    beforeUploadFile(file) {
      const suffix = file.name.split('.').pop()
      if (!/mp4|rm|rmvb/i.test(suffix)) {
        this.$message.warning('附件只能是 MP4/RM/RMVB 格式')
        return false
      }
      if (file.size / 1024 / 1024 > 50) {
        this.$message.warning('附件大小不能超过 50MB')
        return false
      }
      this.fileData.videoName = file.name
    },
    // 附件上传成功
    successFile(res, file, fileList) {
      if (res.code === 200 && res.data && res.data.objectName) {
        this.source = 'local'
        this.fileData.id = res.data.objectName
        this.fileData.videoUrl = res.data.previewUrl
        // this.$message.success(res.message)
        this.fileConfirm(this.fileData)
      } else {
        this.fileData.videoName = ''
        fileList.pop()
        this.$message.warning('上传失败')
      }
    },
    // 本地上传
    // local() {
    //   if (this.selectedNum >= this.limit) {
    //     this.$message.closeAll()
    //     this.$message.warning(`最多上传 ${this.limit} 个附件，请先删除已有附件再操作`)
    //     return
    //   }
    //   this.source = 'local'
    //   this.openComponent('UploadVideoDialog', { confirmMethod: 'fileConfirm' })
    // },
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
.el-dropdown-menu {
  width: 120px;
}

/deep/.el-upload-list {
  display: none !important;
}
</style>
