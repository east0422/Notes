<template>
  <div class="vcontainer annexpreview">
    <div v-if="showUpload" class="hcontainer vcenter">
      <el-upload
        :action="ossUploadUrl"
        :headers="ossUploadHeaders"
        :show-file-list="false"
        :file-list="uploadList"
        :accept="uploadAccept"
        :multiple="uploadMultiple"
        :limit="uploadLimit"
        :before-upload="beforeUploadFn"
        :on-exceed="onExceedFn"
        :on-success="onSuccessFn"
        :on-error="onErrorFn">
        <el-button icon="el-icon-upload2" size="small" type="primary">上传附件</el-button>
      </el-upload>
      <div class="upload-tip">{{uploadTip}}</div>
    </div>
    <div v-if="imgList.length > 0" class="hcontainer annex-container">
      <div
        v-for="(imgItem, imgIndex) in imgList"
        :key="imgIndex"
        class="annex-item img-item"
        @click="previewClick('img', imgItem)">
        <img :src="imgItem[urlKey]" />
        <i
          v-if="deletable"
          class="el-icon-circle-close del-icon"
          @click.stop="delClick('img', imgIndex, imgItem.index)">
        </i>
      </div>
    </div>
    <div v-if="videoList.length > 0" class="hcontainer annex-container">
      <div
        v-for="(videoItem, videoIndex) in videoList"
        :key="videoIndex"
        class="annex-item video-item"
        @click="previewClick('video', videoItem)">
        <video :src="videoItem[urlKey]"></video>
        <i
          v-if="deletable"
          class="el-icon-circle-close del-icon"
          @click.stop="delClick('video', videoIndex, videoItem.index)">
        </i>
        <i class="el-icon-video-play video-play-icon" style="font-size:30px;color:#ffffff;"></i>
      </div>
    </div>
    <div v-if="fileList.length > 0" class="hcontainer annex-container">
      <div
        v-for="(fileItem, fileIndex) in fileList"
        :key="fileIndex"
        class="hcontainer vcenter annex-item file-item"
        @click="fileDownloadClick(fileItem)">
        <div class="file-name">{{fileItem[nameKey] | fileNameLenEllipsisF(10)}}</div>
        <i
          v-if="deletable"
          class="el-icon-delete del-icon"
          @click.stop="delClick('file', fileIndex, fileItem.index)">
        </i>
      </div>
    </div>
    <div v-if="audioList.length > 0" class="hcontainer annex-container">
      <div
        v-for="(audioItem, audioIndex) in audioList"
        :key="audioIndex"
        class="hcontainer vcenter flex-between annex-item audio-item"
        @click="audioClick(audioItem, audioIndex)">
        <audio
          :ref="'audio' + audioIndex"
          :id="'audio' + audioIndex"
          :src="audioItem[urlKey]"
          :controls="false"
          @canplay="getDuration(audioIndex)">
          Your browser does not support the audio element
        </audio>
        <i :class="['audio-icon', (audioItem.playing ? 'el-icon-video-pause' : 'el-icon-video-play')]"></i>
        <span v-show="!audioItem.playing && audioItem.duration">{{audioItem.duration}}''</span>
        <i
          v-if="deletable"
          class="el-icon-delete del-icon"
          @click.stop="delClick('audio', audioIndex, audioItem.index)">
        </i>
      </div>
    </div>
    <component
      v-if="componentConfig.isRender"
      :is="componentConfig.component"
      :visible.sync="componentConfig.visible"
      v-bind="componentConfig.data"
      @closed="componentClosed"
      @confirm="componentConfirm">
    </component>
  </div>
</template>

<script>
const imgSuffixList = ['png', 'jpg', 'jpeg'] // 图片后缀
const videoSuffixList = ['mp4', 'avi', 'wmv'] // 视频后缀
const fileSuffixList = ['txt', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'xlsm'] // 文件(txt/word/pdf/excel)后缀
const audioSuffixList = ['mp3', 'wma', 'wav', 'ogg'] // 音频后缀

import { downloadUrl } from '@/utils/downloadFile'

export default {
  name: 'AnnexPreview',
  props: {
    deletable: { // 是否可删除(可删除图片/视频(右上角)，/文件/音频(右侧)显示删除图标)
      type: Boolean,
      default: false
    },
    annex: { // 拼接字符串或者对象数组(桶名文件名即fid非完整地址，字符串使用逗号,分隔，数组类型则元素对象中包含fid)
      type: [String, Array],
      default: () => {
        return []
      }
    },
    annexList: { // 附件数组(数组中包括附件url地址)
      type: Array,
      default: () => {
        return []
      }
    },
    isAnnexItemString: { // annex数组中元素是否为字符串(只有附件id即桶名)，默认为对象包含桶名及文件名
      type: Boolean,
      default: false
    },
    isAnnexListItemString: { // 附件数组中元素是否为字符串(只有图片附件url地址)，默认为对象包含附件url地址
      type: Boolean,
      default: false
    },
    urlKey: { // url资源路径对应key
      type: String,
      default: 'attachment'
    },
    nameKey: { // 附件资源名称key
      type: String,
      default: 'name'
    },
    showUpload: { // 是否显示上传
      type: Boolean,
      default: false
    },
    uploadAccept: { // 上传接受类型(默认所有)
      type: String,
      default: ''
    },
    uploadTip: {
      type: String,
      default: '支持JPG/PNG、DOC/XLS/TXT/PDF、MP3/WMA、AVI/MP4/WMV格式，单个文件小于15M，最多上传4个'
    },
    uploadMultiple: {
      type: Boolean,
      default: false
    },
    uploadLimit: { // 上传文件个数(0不限制)
      type: Number,
      default: 0
    },
    uploadSingleFileSize: { // 单附件大小限制(MB)
      type: Number,
      default: 2
    },
    uploadSingleFileType: { // 单附件类型(默认所有)
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadList: [], // 上传文件列表，上传附件数量限制会和上传文件列表长度做对比
      imgList: [],
      videoList: [],
      fileList: [],
      audioList: [],
      componentConfig: {
        isRender: false,
        visible: false,
        component: '',
        data: {}
      }
    }
  },
  watch: {
    annexList: {
      handler(newVal) {
        if (this.isAnnexListItemString) {
          this.uploadList = (newVal || []).map((item) => {
            return {url: item}
          })
        } else {
          this.uploadList = newVal || []
        }
        this.initData()
      },
      immediate: true
    }
  },
  methods: {
    // 动态组件打开关闭-start
    componentClosed() { // 动态组件关闭
      this.componentConfig.isRender = false
      this.componentConfig.data = {}
    },
    componentConfirm(val) {  // 动态组件 确认/保存 按钮回调
      const method = val && typeof val === 'object' ? val.confirmMethod : val
      this[method] && this[method](val.data)
    },
    openComponent(component, data) { // 弹出动态组件
      this.componentConfig.data = data
      this.componentConfig.component = component
      this.componentConfig.isRender = true
      this.$nextTick(() => (this.componentConfig.visible = true))
    },
    // 动态组件打开关闭-end

    // 附件上传-start
    onErrorFn() { // 上传失败
      this.$message.error('上传失败')
    },
    onExceedFn() { // 附件超出个数限制
      this.$message.warning(`附件最多上传${this.uploadLimit}个`)
    },
    beforeUploadFn(file) { // 附件上传前判断(false终止上传)
      const fileType = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase()
      if (this.uploadSingleFileType && !this.uploadSingleFileType.includes(fileType)) {
        this.$message.warning('请上传指定类型的附件')
        return false
      }
      if (file.size / 1024 / 1024 > this.uploadSingleFileSize) {
        this.$message.warning(`附件大小不能超过 ${this.uploadSingleFileSize}MB`)
        return false
      }
    },
    onSuccessFn(res, file) { // 附件上传成功
      if (res.code === 200 && res.data && res.data.objectName) {
        this.uploadAddAnnex(file.name, res.data.previewUrl, res.data.objectName)
      } else {
        this.$message.warning('上传失败')
      }
    },
    // 附件上传成功后更新数据(oldFileName上传文件原文件名，fileUrl上传成功后完整url地址，fid桶名)
    uploadAddAnnex(oldFileName, fileUrl, fid) {
      const annexSuffix = oldFileName.substr(oldFileName.lastIndexOf('.') + 1).toLowerCase()
      annexSuffix
      let annexItem = {}
      annexItem[this.urlKey] = fileUrl
      annexItem[this.nameKey] = oldFileName
      annexItem.index = this.annexList.length
      if (imgSuffixList.includes(annexSuffix)) {
        this.imgList.push(annexItem)
      } else if (videoSuffixList.includes(annexSuffix)) {
        this.videoList.push(annexItem)
      } else if (fileSuffixList.includes(annexSuffix)) {
        this.fileList.push(annexItem)
      } else if (audioSuffixList.includes(annexSuffix)) {
        this.audioList.push(annexItem)
      } else {
        this.$message.warning(`暂不支持${annexSuffix}格式附件`)
        return
      }
      
      if (this.isAnnexListItemString) {
        this.annexList.push(fileUrl)
      } else {
        this.annexList.push(annexItem)
      }
      if (Array.isArray(this.annex)) {
        if (this.isAnnexItemString) {
          this.annex.push(fid)
        } else {
          let item = {}
          item[this.urlKey] = fid
          item[this.nameKey] = oldFileName
          this.annex.push(item)
        }
        this.$emit('change', {annex: this.annex, annexList: this.annexList})
        return
      }
      let newAnnex = this.annex ? (this.annex + ',' + fid) : fid
      this.$emit('change', {annex: newAnnex, annexList: this.annexList})
    },
    // 附件上传-end

    previewClick(type, item) {
      switch (type) {
        case 'img': {
          this.openComponent('ViewPicture', {
            appendToBody: true,
            imgList: [{ fileUrl: item[this.urlKey] }]
          })
          break
        }
        case 'video': {
          this.openComponent('ViewVideo', {
            appendToBody: true,
            videoList: [{ fileUrl: item[this.urlKey] }]
          })
          break
        }
        default:
          break
      }
    },
    fileDownloadClick(item) {
      downloadUrl(item[this.urlKey], item[this.nameKey])
    },
    audioClick(audioItem, audioIndex) { // 音频点击播放/暂停
      let audio = this.$refs['audio' + audioIndex][0] // document.getElementById('audio' + audioIndex)
      if (audioItem.playing) { // 当前组件正在播放 则暂停播放
        this.$set(this.audioList[audioIndex], 'playing', false)
        audio.pause()
      } else { // 没有播放，则开始播放
        this.$set(this.audioList[audioIndex], 'playing', true)
        audio.play()
        audio.addEventListener('ended', () => { // 播放结束后重置播放状态为初始状态  
          this.$set(this.audioList[audioIndex], 'playing', false)
          audio.pause()
        })
      }
    },
    getDuration(audioIndex) { // 获取音频时长
      let audio = this.$refs['audio' + audioIndex][0] // document.getElementById('audio' + audioIndex)
      this.$set(this.audioList[audioIndex], 'duration', Math.round(audio.duration))
    },
    delClick(type, index, annexIndex) {
      switch (type) {
        case 'img': {
          this.imgList.splice(index, 1)
          break
        }
        case 'video': {
          this.videoList.splice(index, 1)
          break
        }
        case 'file': {
          this.fileList.splice(index, 1)
          break
        }
        case 'audio': {
          this.audioList.splice(index, 1)
          break
        }
        default:
          break
      }
      this.annexList.splice(annexIndex, 1)
      if (Array.isArray(this.annex)) {
        this.annex.splice(annexIndex, 1)
        this.$emit('change', {annex: this.annex, annexList: this.annexList})
        return
      }
      
      let annexArr = this.annex.split(',')
      annexArr.splice(annexIndex, 1)
      let newAnnex = annexArr.join(',')
      this.$emit('change', {annex: newAnnex, annexList: this.annexList})
    },
    initData() {
      this.imgList = []
      this.videoList = []
      this.fileList = []
      this.audioList = []
      if (Array.isArray(this.annexList) && this.annexList.length > 0) {
        let annexItem = {} // 附件
        let annexName = '' // 附件名称
        let annexSuffix = '' // 附件后缀
        this.annexList.forEach((item, index) => {
          annexItem = {}
          annexName = ''
          annexSuffix = ''
          if (item) {
            if (typeof item == 'object') { // 对象
              annexItem = {...item}
              annexName = annexItem[this.urlKey] || ''
            } else if (typeof item == 'string') {
              annexItem[this.urlKey] = item
              annexName = item
            }
            if (annexName.indexOf('?') != -1) { // 去掉url中参数
              annexName = annexName.substr(0, annexName.indexOf('?'))
            }
            annexName = annexName.substr(annexName.lastIndexOf('/') + 1) // 获取附件文件名
            if (!annexItem[this.nameKey]) {
              annexItem[this.nameKey] = annexName
            }

            // 增加索引，删除时便于更新annex
            annexItem.index = index

            if (annexName.lastIndexOf('.') != -1) {
              annexSuffix = annexName.substr(annexName.lastIndexOf('.') + 1).toLowerCase()
            }
            if (imgSuffixList.includes(annexSuffix)) {
              this.imgList.push(annexItem)
            } else if (videoSuffixList.includes(annexSuffix)) {
              this.videoList.push(annexItem)
            } else if (fileSuffixList.includes(annexSuffix)) {
              this.fileList.push(annexItem)
            } else if (audioSuffixList.includes(annexSuffix)) {
              this.audioList.push(annexItem)
            } else {
              console.log('not support annexSuffix:', annexSuffix)
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.annexpreview {
  .upload-tip {
    color: #666666;
    font-size: 12px;
    margin-left: 10px;
  }
  .annex-container {
    flex-wrap: wrap;
    margin-top: 20px;
    .annex-item {
      position: relative;
      width: 160px;
      height: 160px;
      margin: 0 20px 20px 0;
      image, img, video {
        width: 100%;
        height: 100%;
        object-fit: fill;
        border-radius: 10px;
      }
      audio {
        width: 100%;
        height: 100%;
        padding-right: 30px;
      }
    }
    .img-item, .video-item {
      border-radius: 10px;
      .del-icon {
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 26px;
        color: #000000;
      }
      .video-play-icon {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        color: #ffffff;
        font-size: 30px;
        margin: auto;
        width: 30px;
        height: 30px;
      }
    }
    .file-item {
      height: 40px;
      height: 4;
      .del-icon {
        font-size: 26px;
        color: #000000;
      }
      .file-name {
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .audio-item {
      background-color: #00bfbf;
      height: 40px;
      border-radius: 10px;
      padding: 0 10px;
      color: #ffffff;
      .audio-icon {
        font-size: 26px;
      }
      .del-icon {
        // position: absolute;
        // top: 5px;
        // right: 10px;
        font-size: 26px;
      }
    }
  }
}
</style>