<template>
  <div class="upload-image-container">
    <div v-show="fileUrl" class="img">
      <div class="mask" :class="{ 'is-disabled': disabled }">
        <i class="el-icon-zoom-in" @click="previewClick"></i>
        <i v-if="!disabled && !readonly" class="el-icon-delete" @click="removeFile"></i>
      </div>
      <video v-if="fileUrl.includes('.mp3') || fileUrl.includes('.mp4')" :src="fileUrl"></video>
      <img v-else :src="fileUrl" />
    </div>
    <div v-show="!fileUrl && !disabled && !readonly" class="upload">
      <!-- <div class="empty" :class="{ 'is-upload': !disabled && !readonly }" @click="showUploadPanel"> -->
      <div class="empty is-upload" @click="openComponent('UploadImageDialog', { confirmMethod: 'fileConfirm' })">
        <img src="@/assets/img/icon-upload-file.png" />
        <span class="tips">{{ tips }}</span>
      </div>
      <!-- <transition name="el-zoom-in-bottom">
        <div v-show="showUpload" class="upload-panel">
          <el-button
            class="btn"
            type="text"
            icon="el-icon-upload2"
            @click="openComponent('UploadImageDialog', { confirmMethod: 'fileConfirm' })"
            >本 地 上 传</el-button
          >
          <el-button
            class="btn"
            type="text"
            icon="el-icon-folder"
            @click="openComponent('ResourceLibraryDialog', { confirmMethod: 'fileConfirm' })"
            >素 材 库</el-button
          >
          <el-button class="btn" type="text" @click="showUpload = false">取 消</el-button>
        </div>
      </transition> -->
    </div>

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
  name: 'UploadImage',
  props: {
    // 只读，保留预览
    readonly: Boolean,
    // 禁止功能
    disabled: Boolean,
    // 图片地址
    fileUrl: String,
    // 提示语
    tips: {
      type: String,
      default: '图 片'
    },
    // 确认回调触发父组件事件名
    confirmMethod: String
  },
  data() {
    return {
      // 展示上传面板
      showUpload: false,
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
    previewClick() {
      if (this.fileUrl.includes('.mp3') || this.fileUrl.includes('.mp4')) {
        this.openComponent('ViewVideo', { videoList: [{ fileUrl: this.fileUrl }] })
      } else {
        this.openComponent('ViewPicture', { imgList: [{ fileUrl: this.fileUrl }] })
      }
    },
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
    // 弹出上传图片面板
    showUploadPanel() {
      if (this.disabled || this.readonly) return
      this.showUpload = true
    },
    // 删除图片
    removeFile() {
      this.$emit('update:file-id', '')
      this.$emit('update:file-url', '')
      this.$emit('change', { id: '', url: '' })
    },
    // 图片回调
    fileConfirm({ id, url }) {
      this.showUpload = false
      this.$emit('update:file-id', id)
      this.$emit('update:file-url', url)
      this.$emit('change', { id, url })
    }
  }
}
</script>

<style lang="less" scoped>
.upload-image-container {
  width: 258px;
  height: 258px;
  background-color: #fcfcfc;
  border: 1px solid #f2f2f3;
  border-radius: 10px;
  overflow: hidden;
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
    z-index: 100;

    &:hover {
      opacity: 1;
    }

    &.is-disabled {
      display: none;
    }

    i {
      font-size: 24px;
      color: #fff;
      cursor: pointer;

      &:not(:first-child) {
        margin-left: 16px;
      }
    }
  }
}

.upload {
  position: relative;
  height: 100%;

  .empty {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;

    &.is-upload {
      cursor: pointer;
    }

    .icon {
      width: 101px;
      height: 86px;
    }

    .tips {
      margin-top: 19px;
      font-size: 18px;
      color: #ccced3;
    }
  }

  .upload-panel {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    .btn {
      padding: 0;
      color: #fff;
    }
  }
}

.el-dropdown {
  display: block;
  height: 100%;
}

.el-dropdown-link {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-weight: bold;
  font-size: 36px;
  color: #ebebeb;
}

.el-icon--right {
  margin-left: 0;
}
</style>
