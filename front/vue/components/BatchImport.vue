<template>
  <custom-dialog
    :visible.sync="dialogVisible"
    :title="title"
    :append-to-body="appendToBody"
    custom-class="confirm-dialog-demo"
    @open="$emit('open')"
    @opened="$emit('opened')"
    @close="$emit('close')"
    @closed="$emit('closed')"
    @confirm="confirm"
  >
    <div class="content">
      <p class="template-tips" @click="downloadtemplateFile">
        <span>点击下载导入模板</span>
        <i class="el-icon-download"></i>
      </p>
      <el-select v-if="viewType === 'org'" class="control" v-model="orgId" placeholder="导入党组织">
        <el-option
          :style="{ paddingLeft: `${0.6 * item.level + 0.4}rem` }"
          v-for="item in orgList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <div v-if="isSelectFile" class="disabled-btn drawer-btn">选择导入文件（已选择）</div>
      <el-upload
        ref="uploadRef"
        class="upload"
        :class="{
          'disabled-upload': isSelectFile
        }"
        :action="uploadUrl"
        :headers="uploadHeaders"
        :auto-upload="false"
        :on-change="changeFile"
        :on-success="successFile"
        :on-error="errorFile"
        :on-remove="removeFile"
        :name="uploadName"
        :limit="1"
      >
        <div class="drawer-btn">选择导入文件</div>
      </el-upload>
    </div>
  </custom-dialog>
</template>

<script>
import { downloadFlow, downloadUrl } from '@/utils/downloadFile'
import { showLoading, hideLoading } from '@/utils/loading'

export default {
  name: 'BatchImport',
  props: {
    // 控制显隐
    visible: {
      type: Boolean,
      default: false
    },
    // 弹窗标题
    title: {
      type: String,
      default: '批量导入'
    },
    // 面板视图类型
    viewType: String,
    // 模板下载 api
    templateApi: String,
    // 模板下载 api 参数
    templateApiParams: Object,
    // 模板返回类型  文件流-flow  地址-url
    templateResType: {
      type: String,
      default: 'url'
    },
    importServer: {
      type: String,
      default: 'topeakBusinessServer'
    },
    // 导入地址
    importUrl: {
      type: String,
      required: true
    },
    // Dialog 自身是否插入至 body 元素上
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 确认回调触发父组件事件名
    confirmMethod: {
      type: String,
      default: 'getList'
    },
    uploadName: {
      type: String,
      default: 'file'
    }
  },
  data() {
    return {
      // 弹窗显隐
      dialogVisible: false,
      // 附件上传地址
      uploadUrl: '',
      // 附件上传请求头
      uploadHeaders: {
        token: sessionStorage.token,
        systemType: 'system_info'
      },
      // 是否选择文件
      isSelectFile: false,
      // 党组织列表
      orgList: [],
      // 党组织 id
      orgId: ''
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
    this.uploadUrl = this.importUrl
    if (this.viewType === 'org') this.getOrgList()
  },
  methods: {
    // 下载模板文件
    async downloadtemplateFile() {
      this.$message.closeAll()
      const templateRequest = this.$api[this.importServer][this.templateApi]
      if (!templateRequest) return this.$message.warning('没有可以下载的导入模板')
      if (this.templateResType === 'flow') {
        templateRequest(this.templateApiParams)
          .then(res => {
            downloadFlow(res)
          })
          .catch(() => {
            this.$message.error('获取模板文件失败')
          })
      } else {
        const { code, data } = await templateRequest(this.templateApiParams).catch(err => err)
        if (code !== 200 || !data) return this.$message.error('获取模板文件失败')
        const name = data.replace(/.*\/(.*)(\.[^.]*)$/, '$1')
        const suffix = data.split('.').pop()
        downloadUrl(data, `${decodeURI(name)}.${suffix}`)
      }
    },
    // 上传失败
    errorFile(err, file, fileList) {
      hideLoading()
      file.percentage = 0
      file.status = 'ready'
      fileList.push(file)
      this.$message.error('导入失败')
    },
    // 附件变化
    changeFile(file) {
      if (file.status === 'ready') this.isSelectFile = true
    },
    // 附件上传成功
    successFile(res, file) {
      hideLoading()
      if (res.code === 200) {
        this.$message.success('导入成功')
        this.$emit('confirm', this.confirmMethod)
        this.$emit('closed')
      } else {
        // fileList.pop()
        file.percentage = 0
        file.status = 'ready'
        this.$message.warning(res.message || '导入失败')
      }
    },
    // 删除附件
    removeFile() {
      this.isSelectFile = false
    },
    // 确认
    async confirm() {
      this.$message.closeAll()
      if (this.viewType === 'org' && !this.orgId) return this.$message.warning('请先选择导入党组织再操作')
      if (!this.isSelectFile) return this.$message.warning('请先选择导入文件再操作')
      showLoading()
      if (this.viewType === 'org') this.uploadUrl = `${this.importUrl}?orgId=${this.orgId}`
      this.$nextTick(() => {
        this.$refs.uploadRef.submit()
      })
    },
    // 获取党组织列表
    async getOrgList() {
      const { code, data } = await this.$api.topeakBusinessServer.pbOrgTree().catch(err => err)
      if (code !== 200) return
      this.orgList = this.disposeOrgTree(data)
    },
    // 党组织树转换成列表
    disposeOrgTree(tree) {
      return (tree || []).reduce((acc, cur) => {
        acc.push({
          id: cur.id,
          name: cur.label,
          level: cur.level
        })
        acc = acc.concat(this.disposeOrgTree(cur.children))
        return acc
      }, [])
    }
  }
}
</script>

<style lang="less">
.confirm-dialog-demo {
  width: 597px !important;
}
</style>

<style lang="less" scoped>
.content {
  padding-top: 40px;
  padding-left: 80px;
  padding-right: 80px;
}

.template-tips {
  margin-top: 12px;
  margin-bottom: 32px;
  font-size: 16px;
  color: #a8aaac;
  cursor: pointer;

  i {
    margin-left: 4px;
  }
}

.control {
  width: 100%;
  margin-bottom: 20px;
}

.disabled-btn {
  cursor: not-allowed;
}

/deep/ .upload {
  &.disabled-upload {
    .el-upload {
      display: none;
    }
  }

  .el-upload {
    width: 100%;
  }
}
</style>
