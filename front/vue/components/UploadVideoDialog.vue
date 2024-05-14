<template>
  <custom-dialog
    :visible.sync="dialogVisible"
    title="视频上传"
    :append-to-body="appendToBody"
    :show-footer="true"
    custom-class="upload-image-dialog"
    @open="$emit('open')"
    @opened="$emit('opened')"
    @close="$emit('close')"
    @closed="$emit('closed')"
    @confirm="confirm"
  >
    <div class="content-container">
      <div class="left">
        <div v-show="!fileData.videoUrl">
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
            <el-button slot="trigger" ref="uploadBtn" type="primary">上传视频</el-button>
          </el-upload>
          <p class="upload-tips">格式：mp4/rm/rmvb，大小：不超过50M</p>
        </div>
        <div v-show="fileData.videoUrl" class="crop-box">
          <video :src="fileData.videoUrl" 
            style="width: 100%;height: 100%; object-fit: contain"
            autoplay
            controls
            muted
            disablePictureInPicture
            disableRemotePlayback></video>
        </div>
      </div>
    </div>
  </custom-dialog>
</template>

<script>
const imageConversion = require('image-conversion')
import { digitalVillageOssUrl } from '@/config'

export default {
  name: 'UploadVideoDialog',
  components: {
  },
  props: {
    // 控制显隐
    visible: {
      type: Boolean,
      default: false
    },
    // 确认回调触发父组件事件名
    confirmMethod: String,
    // Dialog 自身是否插入至 body 元素上
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 弹窗显隐
      dialogVisible: false,
      // 实时预览
      previewOptions: {},
      // 截图框 base64 数据
      cropImgData: '',
      // 当前截图框宽高比类型index
      currentCropFixedNumberIndex: undefined,
      // 附件上传地址
      uploadUrl: `${digitalVillageOssUrl}/file/object/upload/object?bucketName=topeak-business`,
      // 附件上传请求头
      uploadHeaders: {
        token: sessionStorage.token,
        systemType: 'system_info'
      },
      fileData: {
        videoName: '',
        videoId: '',
        videoUrl: '',
      },
      fileList: [],
      message: '',
      fileBytes: '',
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
  created() {
  },
  methods: {
    // 关闭弹窗
    close() {
      this.dialogVisible = false
      this.$emit('close')
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
        this.fileData.videoId = res.data.objectName
        this.fileData.videoUrl = res.data.previewUrl
        this.$message.success(res.message)
      } else {
        this.fileData.videoName = ''
        fileList.pop()
        this.$message.warning('上传失败')
      }
    },
    // 删除附件
    removeFile() {
      this.fileData.videoId = ''
      this.fileData.videoUrl = ''
      this.fileData.videoName = ''
    },
    //实时预览数据
    realTime(data) {
      this.previewOptions = data
    },
    // 上传
    upload() {
      this.$refs.upload.clearFiles()
      this.$refs.uploadBtn.$el.click()
    },
    // 确认
    async confirm() {
      this.initFfmpeg(this.fileData.videoUrl)
    },
    // 压缩图片
    compressImage() {
      return new Promise(resolve => {
        this.$refs.cropper.getCropBlob(data => {
          if (data.size / 1024 / 1024 > 15) {
            imageConversion.compressAccurately(data, 1024 * 1024 * 15).then(res => {
              resolve(res)
            })
          } else {
            resolve(data)
          }
        })
      })
    }
  }
}
</script>

<style lang="less">
.upload-image-dialog {
  width: 680px !important;
}
</style>

<style lang="less" scoped>
.footer-bar-demo {
  justify-content: flex-end;
}

.content-container {
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;

  .left {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 400px;
    background-color: #f0f2f5;
  }

  .right {
    margin-left: 10px;
    width: 200px;
    height: 400px;
    background-color: #f0f2f5;
  }
}

.upload {
  text-align: center;
}

.upload-tips {
  margin-top: 10px;
}

.crop-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.crop-tips,
.preview-tips {
  text-align: center;
  line-height: 30px;

  .upload {
    cursor: pointer;

    &:hover {
      color: #36a98a;
    }
  }
}

.preview-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
}

.preview-item {
  &:not(:first-child) {
    margin-top: 10px;
  }

  .preview-label {
    text-align: center;
    font-weight: bold;
  }

  .preview-box {
    box-sizing: content-box;
    margin: 0 auto;
    border: 4px solid #b7b7b7;
    border-radius: 4px;
    transition: border-color 0.2s;
    overflow: hidden;

    &:hover,
    &.active {
      border-color: #36a98a;
    }
  }

  .preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
