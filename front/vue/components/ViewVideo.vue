<template>
  <custom-dialog :visible.sync="dialogVisible" title="视频详情" :append-to-body="appendToBody" @closed="$emit('closed')">
    <div class="cover-img-preview">
      <div class="btn" :class="{ hide: currentCoverImgPreviewIndex <= 0 }" @click="coverImgPreviewChange(-1)">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="img-box">
        <video
          :src="
            videoList && videoList.length > 0
              ? videoList[currentCoverImgPreviewIndex] && videoList[currentCoverImgPreviewIndex].fileUrl
              : defaultImg
          "
          autoplay
          controls
          muted
          disablePictureInPicture
          disableRemotePlayback
          controlslist="nodownload noremoteplayback noplaybackrate"
        >
          您的浏览器不支持视频播放
        </video>
      </div>
      <div class="btn" :class="{ hide: currentCoverImgPreviewIndex >= videoList.length - 1 }" @click="coverImgPreviewChange(1)">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
  </custom-dialog>
</template>

<script>
export default {
  name: 'ViewVideo',
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
    videoList: {
      type: Array,
      default: () => []
    },
    defaultImg: {
      type: String,
      default: require('@/assets/img/cover-picture-small.png')
    }
  },
  data() {
    return {
      // 弹窗显隐
      dialogVisible: false,
      currentCoverImgPreviewIndex: 0
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
    // 检测报告预览图切换
    coverImgPreviewChange(val) {
      let temp = this.currentCoverImgPreviewIndex + val
      if (temp > this.videoList.length - 1) temp = this.videoList.length - 1
      if (temp < 0) temp = 0
      this.currentCoverImgPreviewIndex = temp
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .cover-img-preview-dialog-demo {
  margin-top: 70px !important;
  width: 624px !important;
  border-radius: 10px;
  overflow: hidden;
}
.cover-img-preview {
  position: relative;
  padding: 0 30px;
  margin: 60px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 500px;
  .btn {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    line-height: 40px;
    color: #fff;
    background-color: rgba(112, 112, 112, 0.2);
    border-radius: 50%;
    cursor: pointer;

    &.hide {
      visibility: hidden;
    }
  }

  .img-box {
    display: flex;
    align-items: center;
    height: 100%;
    flex: 1;
    background-color: #000;
    border-radius: 5px;
    overflow: hidden;
    -webkit-user-drag: none;
    user-select: none;
    /deep/ video {
      width: 100%;
      height: 100%;
    }
  }
}
/deep/ .el-dialog__footer {
  display: none;
}
</style>
