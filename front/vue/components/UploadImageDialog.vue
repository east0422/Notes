<template>
  <custom-dialog
    :visible.sync="dialogVisible"
    title="图片裁切"
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
        <div v-show="!cropOptions.img">
          <el-upload
            ref="upload"
            class="upload"
            :action="`${uploadUrl}`"
            :headers="uploadHeaders"
            :on-change="fileChange"
            accept="image/png, image/jpeg, image/jpg"
            :show-file-list="false"
            :auto-upload="false"
          >
            <el-button slot="trigger" ref="uploadBtn" type="primary">上传图片</el-button>
          </el-upload>
          <p class="upload-tips">支持JPG、PNG格式的图片</p>
        </div>
        <div v-show="cropOptions.img" class="crop-box">
          <vue-cropper class="crop" ref="cropper" v-bind="cropOptions" @realTime="realTime"> </vue-cropper>
          <p class="crop-tips">鼠标滚轮缩放控制图片显示大小，鼠标拖拽调整显示位置</p>
        </div>
      </div>
      <div class="right">
        <div class="preview-list">
          <div
            class="preview-item"
            v-for="(item, index) in cropFixedNumberList"
            :key="index"
            @click="cropFixedNumberChange(index)"
          >
            <p class="preview-label">{{ item.label }}</p>
            <div
              class="preview-box"
              :class="{ active: currentCropFixedNumberIndex === index }"
              :style="{ width: item.width + 'px', height: item.height + 'px' }"
            >
              <template v-if="previewOptions.url">
                <div
                  v-if="currentCropFixedNumberIndex === index && previewOptions.w"
                  :style="{
                    ...previewOptions.div,
                    zoom: previewOptions.w ? item.width / previewOptions.w : 1
                  }"
                >
                  <img class="realTime-img" :src="previewOptions.url" :style="previewOptions.img" />
                </div>
                <img v-else class="preview-img" :src="cropImgData || previewOptions.url" />
              </template>
            </div>
          </div>
        </div>
        <div class="preview-tips">
          <span v-if="cropOptions.img" class="upload" @click="upload">重新上传</span>
          <span v-else>预览</span>
        </div>
      </div>
    </div>
  </custom-dialog>
</template>

<script>
const imageConversion = require('image-conversion')
import { VueCropper } from 'vue-cropper'
import axios from 'axios'
import { digitalVillageOssUrl } from '@/config'
import { showLoading, hideLoading } from '@/utils/loading'

export default {
  name: 'UploadImageDialog',
  components: {
    VueCropper
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
      //vueCropper组件配置
      cropOptions: {
        img: '', //原图文件地址
        outputType: undefined, // 裁剪生成图片的格式
        autoCrop: true, //默认生成截图框，默认false
        fixedBox: false, //固定截图框大小，默认不允许改变
        canMove: true, // 上传图片不可以移动
        canMoveBox: true, //截图框不能拖动，默认true
        autoCropWidth: Infinity, //截图框宽度，默认容器的80%
        autoCropHeight: Infinity, //截图框高度，默认容器的80%
        centerBox: true, //截图框被限制在图片里面，默认false
        fixed: true, // 是否开启截图框宽高固定比例，默认false
        fixedNumber: [16, 9], // 截图框的宽高比例，开启fixed生效，默认[1, 1]
        full: true, // 是否输出原图比例的截图，默认false
        original: false, // 上传图片按照原始比例渲染，默认false
        infoTrue: true, // true为展示真实输出图片宽高，false展示看到的截图框宽高，默认false
        maxImgSize: Infinity, // 限制图片最大宽度和高度，默认2000，取值0~max
      },
      // 实时预览
      previewOptions: {},
      // 截图框 base64 数据
      cropImgData: '',
      // 当前截图框宽高比类型index
      currentCropFixedNumberIndex: undefined,
      // 截图框宽高比类型
      cropFixedNumberList: [
        {
          label: '16：9',
          width: 160,
          height: 90,
          fixedNumber: [16, 9]
        },
        {
          label: '4：3',
          width: 120,
          height: 90,
          fixedNumber: [4, 3]
        },
        {
          label: '1：1',
          width: 90,
          height: 90,
          fixedNumber: [1, 1]
        }
      ],
      // 附件上传地址
      uploadUrl: `${digitalVillageOssUrl}/file/object/upload/object?bucketName=topeak-business`,
      // 附件上传请求头
      uploadHeaders: {
        'Content-Type': 'multipart/form-data;',
        token: sessionStorage.token,
        systemType: 'system_info'
      }
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
    this.cropFixedNumberChange(0)
  },
  methods: {
    // 关闭弹窗
    close() {
      this.dialogVisible = false
      this.$emit('close')
    },
    // 截图宽高比类型变化
    cropFixedNumberChange(index) {
      if (this.currentCropFixedNumberIndex === index) return
      this.currentCropFixedNumberIndex = index
      this.cropOptions.fixedNumber = this.cropFixedNumberList[this.currentCropFixedNumberIndex].fixedNumber
      if (this.cropOptions.img) {
        this.$refs.cropper.clearCrop()
        this.$nextTick(() => {
          this.$refs.cropper.goAutoCrop()
          setTimeout(() => {
            this.$refs.cropper.getCropData(data => {
              this.cropImgData = data
            })
          }, 0)
        })
      }
    },
    // 文件上传变化
    fileChange(file) {
      const suffix = file.name.split('.').pop()
      if (!/jpg|jpeg|png/i.test(suffix)) {
        this.$message.warning('图片只能是 JPG、PNG 格式')
        this.$refs.upload.clearFiles()
        return false
      }
      this.cropOptions.outputType = suffix === 'png' ? 'png' : 'jpeg'
      if (file.status === 'ready') {
        const reader = new FileReader()
        reader.readAsDataURL(file.raw)
        reader.onload = e => {
          this.cropImgData = ''
          this.cropOptions.img = e.target.result
        }
      }
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
      this.$message.closeAll()
      if (!this.cropOptions.img) return this.$message.warning('请先上传图片裁切再操作')
      const fileBlob = await this.compressImage()
      const uploadFile = this.$refs.upload.uploadFiles[0]
      const file = new File([fileBlob], uploadFile.name, { type: fileBlob.type })
      const formData = new FormData()
      formData.append('file', file)
      showLoading()
      const { status, data } = await axios.post(this.uploadUrl, formData, { headers: this.uploadHeaders }).catch(() => {})
      hideLoading()
      if (status !== 200 || !data || data.code !== 200) return this.$message.error('裁切图片上传失败')
      this.$emit('confirm', {
        confirmMethod: this.confirmMethod,
        data: { id: data.data.objectName, url: data.data.previewUrl }
      })
      this.close()
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
