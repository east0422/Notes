<template>
  <div class="list-table-upload-container list-cover-demo">
    <div v-show="videoUrl" class="img">
      <div class="mask">
        <i class="el-icon-zoom-in" @click="openComponent('view-video', { videoList: [{ fileUrl: videoUrl }] })"></i>
        <i class="el-icon-delete" @click="removeFile"></i>
      </div>
      <video :src="videoUrl" :controls="false"></video>
    </div>
    <el-dropdown v-show="!videoUrl" trigger="click" @command="commandChange">
      <span class="el-dropdown-link" :class="{ required }">
        <i class="el-icon-plus el-icon--right"></i>
        <span v-if="!required">选填</span>
      </span>
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
          :on-remove="removeFile"
        >
          <el-dropdown-item icon="el-icon-upload2" command="upload">
            <span>本地上传</span>
          </el-dropdown-item>
        </el-upload>
        <!-- <el-dropdown-item icon="el-icon-upload2" command="upload">本地上传</el-dropdown-item> -->
        <el-dropdown-item icon="el-icon-folder" command="resourceLibraryDialog">素材库</el-dropdown-item>
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
import { showLoading, hideLoading } from '@/utils/loading'

export default {
  name: 'ListTableUploadVideo',
  props: {
    // 是否必填
    required: {
      type: Boolean,
      default: true
    },
    // 附件地址
    fileUrl: String,
    // 确认回调触发父组件事件名
    confirmMethod: String
  },
  data() {
    return {
      // 附件地址
      videoUrl: '',
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
      // 附件回显列表
      fileList: []
    }
  },
  watch: {
    fileUrl: {
      handler(val) {
        this.videoUrl = val
        this.fileList = val ? [{ url: val }] : []
      },
      immediate: true
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
    // 删除附件
    removeFile() {
      this.fileConfirm({ id: '', url: '' })
    },
    // 上传失败
    errorFile() {
      hideLoading()
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
      showLoading()
    },
    // 附件上传成功
    successFile(res, file, fileList) {
      hideLoading()
      if (res.code === 200 && res.data && res.data.objectName) {
        this.fileConfirm({ id: res.data.objectName, url: res.data.previewUrl })
        this.$message.success('上传成功')
      } else {
        fileList.pop()
        this.$message.warning('上传失败')
      }
    },
    // 下拉菜单变化
    commandChange(method) {
      this[method] && this[method]()
    },
    // 素材库
    resourceLibraryDialog() {
      this.openComponent('ResourceLibraryDialog', { confirmMethod: 'fileConfirm', fileType: 'video' })
    },
    // 附件回调
    fileConfirm({ id, url }) {
      this.videoUrl = url
      this.$emit('update:file-id', id)
      this.$emit('update:file-url', url)
    }
  }
}
</script>

<style lang="less" scoped>
.list-table-upload-container {
  cursor: default;
}

.img {
  position: relative;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.2s;
    opacity: 0;
    z-index: 2;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 20px;
      color: #fff;
      cursor: pointer;

      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
}

.el-dropdown {
  display: block;
  height: 100%;
  cursor: pointer;
}

.el-dropdown-link {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #ebebeb;

  i {
    font-weight: bold;
    font-size: 24px;
  }

  span {
    margin-top: 2px;
    font-size: 14px;
    line-height: 18px;
    color: #7f7f7f;
  }

  &.required {
    i {
      font-size: 36px;
    }
  }
}

.el-icon--right {
  margin-left: 0;
}

.upload {
  height: 36px;
  overflow: hidden;
}
</style>
