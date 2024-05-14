<template>
  <div class="list-table-upload-container list-cover-demo">
    <div v-show="imgUrl" class="img">
      <div class="mask">
        <i class="el-icon-zoom-in" @click="openComponent('ViewPicture', { imgList: [{ fileUrl: imgUrl }] })"></i>
        <i class="el-icon-delete" @click="removeFile"></i>
      </div>
      <img :src="imgUrl" />
    </div>
    <template v-if="!showUploadOnly">
      <el-dropdown v-show="!imgUrl" trigger="click" @command="commandChange">
        <span class="el-dropdown-link" :class="{ required }">
          <i class="el-icon-plus el-icon--right"></i>
          <span v-if="!required">选填</span>
        </span>
        <el-dropdown-menu slot="dropdown" class="dropdown-menu-demo">
          <el-dropdown-item icon="el-icon-upload2" command="UploadImageDialog">本地上传</el-dropdown-item>
          <el-dropdown-item icon="el-icon-folder" command="ResourceLibraryDialog">素材库</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <span
      v-else
      class="el-dropdown-link"
      :class="{ required }"
      @click="openComponent('UploadImageDialog', { confirmMethod: 'fileConfirm' })">
      <i class="el-icon-plus el-icon--right"></i>
      <span v-if="!required">选填</span>
    </span>
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
  name: 'ListTableUploadImage',
  props: {
    // 是否必填
    required: {
      type: Boolean,
      default: true
    },
    showUploadOnly: { // 只显示上传图片，不显示资源库(无资源库及对应接口)
      type: Boolean,
      default: true
    },
    // 图片地址
    fileUrl: String,
    // 确认回调触发父组件事件名
    confirmMethod: String
  },
  data() {
    return {
      // 图片地址
      imgUrl: '',
      // 动态组件配置
      componentConfig: {
        isRender: false,
        visible: false,
        component: '',
        data: {}
      }
    }
  },
  watch: {
    fileUrl: {
      handler(val) {
        this.imgUrl = val
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
    // 删除图片
    removeFile() {
      this.imgUrl = ''
      this.$emit('update:file-id', '')
      this.$emit('update:file-url', '')
    },
    // 下拉菜单变化
    commandChange(val) {
      this.openComponent(val, { confirmMethod: 'fileConfirm' })
    },
    // 图片回调
    fileConfirm({ id, url }) {
      this.imgUrl = url
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
</style>
