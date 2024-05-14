<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    width="600px"
  >
    <div style="display: flex" class="avatar">
      <div class="avatar-left">
        <div v-show="!options.img">
          <el-upload
            ref="upload"
            action=""
            style="text-align: center; margin-bottom: 24px"
            :on-change="uploads"
            accept="image/png, image/jpeg, image/jpg"
            :show-file-list="false"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary" ref="uploadBtn">选择图片</el-button>
          </el-upload>
          <div>支持jpg、png格式的图片，大小不超过10M</div>
        </div>
        <div v-show="options.img" class="avatar-left-crop">
          <vueCropper
            class="crop-box"
            ref="cropper"
            :img="options.img"
            :autoCrop="options.autoCrop"
            :fixedBox="options.fixedBox"
            :canMove="options.canMove"
            :canMoveBox="options.canMoveBox"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :centerBox="options.centerBox"
            :fixed="options.fixed"
            :fixedNumber="options.fixedNumber"
            :full="options.full"
            :original="options.original"
            :infoTrue="options.infoTrue"
            :maxImgSize="options.maxImgSize"
            :mode="options.mode"
            @realTime="realTime">
          </vueCropper>
          <p class="avatar-left-p">鼠标滚轮缩放控制图片显示大小，鼠标拖拽调整显示位置</p>
        </div>
      </div>
      <div class="avatar-right">
        <div
          v-for="(item, index) in previewsDiv"
          :key="index"
          :style="item.style"
          class="avatar-right-div">
          <div v-show="options.img" :class="['avatar-right-previews', previews.div]" :style="item.zoomStyle">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </div>
        <div class="avatar-right-text">
          <el-button v-if="options.img" type="text" @click="uploadPreviews">重新上传</el-button>
          <span v-else>预览</span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="getCrop">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { VueCropper } from 'vue-cropper'
const imageConversion = require('image-conversion')

export default {
  components: {
    VueCropper
  },
  name: 'ImageCropper',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 生成图片限制大小 单位 kb
    imgSize: {
      type: Number,
      default: 5000
    },
    title: {
      type: String,
      default: '编辑图片'
    }
  },
  data() {
    return {
      //vueCropper组件 裁剪配置信息
      options: {
        img: '', //原图文件地址
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
        mode: 'contain', // 图片默认渲染方式
      },
      //实时预览图数据
      previews: {},
      //实时预览图样式
      previewsDiv: [
        //108px 预览样式
        {
          style: {
            width: '108px',
            height: '108px',
            margin: '0 auto'
          },
          zoomStyle: {
            zoom: 0.54
          },
          fixedNumber: [16, 9]
        },
        //68px 预览样式
        {
          style: {
            width: '68px',
            height: '68px',
            margin: '27px auto'
          },
          zoomStyle: {
            zoom: 0.34
          },
          fixedNumber: [4, 3]
        },
        //48px 预览样式
        {
          style: {
            width: '48px',
            height: '48px',
            margin: '0 auto'
          },
          zoomStyle: {
            zoom: 0.24
          },
          fixedNumber: [1, 1]
        }
      ]
    }
  },

  methods: {
    //读取原图
    uploads(file) {
      const isIMAGE = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
      const isLt10M = file.raw.size / 1024 / 1024 < 10
      if (!isIMAGE) {
        this.$message({
          showClose: true,
          message: '请选择 jpg、png 格式的图片！',
          type: 'error' //提示类型
        })
        return false
      }
      if (!isLt10M) {
        this.$message({
          showClose: true,
          message: '上传图片大小不能超过 10MB',
          type: 'error' //提示类型
        })
        return false
      }
      let reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = e => {
        this.options.img = e.target.result //base64
      }
    },
    //实时预览数据
    realTime(data) {
      this.previews = data
    },
    //重新上传
    uploadPreviews() {
      this.$refs.uploadBtn.$el.click()
    },
    //获取截图信息
    getCrop() {
      let result = {}
      const _that = this
      // 获取截图的 base64 数据
      // this.$refs.cropper.getCropData((base64Data) => {
      //   console.log(base64Data)
      // })
      // 获取截图的 blob 数据
      this.$refs.cropper.getCropBlob(data => {
        var r = new FileReader()
        const isLt5M = data.size / 1024 < this.imgSize
        if (!isLt5M) {
          // _that.$message.error("上传头像图片大小不能超过 5MB!");
          imageConversion
            .compressAccurately(data, {
              size: 30
            })
            .then(res => {
              result.blob = res
              r.readAsDataURL(res)
            })
        } else {
          result.blob = data
          r.readAsDataURL(data)
        }
        r.onload = function (e) {
          var fileBase64 = e.target.result // base64格式
          result.base64Data = fileBase64 // 为im
          _that.$emit('confirm-callback', result)
          _that.closeDialog()
        }
      })
    },
    //关闭弹框
    closeDialog() {
      this.$emit('update:visible', false)
      //重置 data 数据。(Object.assign是对象深复制  this.$data是组件内的数据对象 this.$options.data()是原始的数据)
      Object.assign(this.$data, this.$options.data())
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog__header {
  padding: 24px 0 11px 28px;
}

/deep/ .el-dialog__title {
  color: #333333;
}

/deep/ .el-dialog__body {
  padding: 0 28px;
}

/deep/ .el-dialog__footer {
  padding: 20px 28px;

  .el-button {
    width: 145px;
  }
}

.avatar {
  display: flex;

  .avatar-left {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 400px;
    background-color: #f0f2f5;
    margin-right: 10px;
    border-radius: 4px;

    .avatar-left-crop {
      width: 400px;
      height: 400px;
      position: relative;

      .crop-box {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        overflow: hidden;
      }
    }

    .avatar-left-p {
      text-align: center;
      width: 100%;
      position: absolute;
      bottom: 20px;
      color: #ffffff;
      font-size: 14px;
    }
  }

  .avatar-right {
    width: 150px;
    height: 400px;
    background-color: #f0f2f5;
    border-radius: 4px;
    padding: 16px 0;
    box-sizing: border-box;

    .avatar-right-div {
      border: 3px solid #ffffff;
      border-radius: 50%;
    }

    .avatar-right-previews {
      width: 200px;
      height: 200px;
      overflow: hidden;
      border-radius: 50%;
    }

    .avatar-right-text {
      text-align: center;
      margin-top: 50px;
      font-size: 14px;

      /deep/ .el-button {
        padding: 0;
      }

      span {
        color: #666666;
      }
    }
  }
}
</style>
