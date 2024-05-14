<template>
  <div class="multiple-upload-image-container">
    <upload-image
      v-for="(item, index) in fileList"
      :key="index"
      class="img-upload"
      :readonly="readonly"
      :file-id.sync="item.id"
      :file-url.sync="item.url"
      :tips="tips"
      @change="imgChange(index, $event)"
    ></upload-image>
  </div>
</template>

<script>
export default {
  name: 'MultipleUploadImage',
  props: {
    // 只读，保留预览
    readonly: Boolean,
    // 图片 id 集合
    fileIds: String,
    // 图片地址
    fileUrl: {
      type: Array,
      default: () => []
    },
    // 提示语
    tips: [String, undefined],
    // 图片数量
    limit: {
      type: Number,
      default: 1
    }
  },
  watch: {
    fileUrl: {
      handler(val) {
        const ids = this.fileIds ? this.fileIds.split(',') : []
        this.fileList = (val || []).map((item, index) => ({ id: ids[index], url: item }))
        this.addUploadImg()
      },
      immediate: true
    }
  },
  data() {
    return {
      // 图片列表
      fileList: []
    }
  },
  methods: {
    // 添加图片组件
    addUploadImg() {
      if (this.readonly) return
      const fileLength = this.fileList.length
      if (fileLength === 0 || (this.limit > fileLength && this.fileList[fileLength - 1].url))
        this.fileList.push({ id: '', url: '' })
    },
    // 图片组件变化回调
    imgChange(index, val) {
      if (!val.url) this.fileList.splice(index, 1)
      this.$emit('update:file-ids', this.fileList.map(item => item.id).join(','))
      this.addUploadImg()
    }
  }
}
</script>

<style lang="less" scoped>
.multiple-upload-image-container {
  margin-left: -15px;
  margin-top: -30px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: calc(~'100% + 30px');
  overflow: hidden;
}

.img-upload {
  margin: 15px;
  transform: translateY(15px);
}
</style>
