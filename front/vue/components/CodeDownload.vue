<template>
  <custom-dialog
    title="二维码下载"
    :visible.sync="drawerVisible"
    width="30%"
    :append-to-body="appendToBody"
    :showFooter="false"
    @open="$emit('open')"
    @opened="$emit('opened')"
    @close="$emit('close')"
    @closed="$emit('closed')"
  >
    <div class="content-info">
      <!-- <QRcode v-if="value" ref="qrcode" :value="value" :options="{ size: 200 }"></QRcode> -->
      <vue-qr v-if="value" ref="qrcode" :text="value" :size="200" :margin="0" :logoSrc="logo"></vue-qr>
      <div v-else class="empty-img"></div>
      <div class="size">
        <div class="size-item">
          <span>尺寸：8cm × 8cm</span>
          <el-button type="primary" size="small" icon="el-icon-download" @click="downRQcode(200)"></el-button>
        </div>
        <div class="size-item">
          <span>尺寸：12cm × 12cm</span>
          <el-button type="primary" size="small" icon="el-icon-download" @click="downRQcode(300)"></el-button>
        </div>
        <div class="size-item">
          <span>尺寸：15cm × 15cm</span>
          <el-button type="primary" size="small" icon="el-icon-download" @click="downRQcode(375)"></el-button>
        </div>
        <div class="size-item">
          <span>尺寸：30cm × 30cm</span>
          <el-button type="primary" size="small" icon="el-icon-download" @click="downRQcode(750)"></el-button>
        </div>
        <div class="size-item">
          <span>尺寸：50cm × 50cm</span>
          <el-button type="primary" size="small" icon="el-icon-download" @click="downRQcode(1250)"></el-button>
        </div>
      </div>
    </div>
  </custom-dialog>
</template>

<script>
// import QRcode from '@xkeshi/vue-qrcode'
import VueQr from 'vue-qr'
import html2canvas from 'html2canvas'

export default {
  name: 'CodeDownload',
  components: {
    // QRcode,
    VueQr
  },
  props: {
    // 控制显隐
    visible: {
      type: Boolean,
      default: false
    },
    // 自身是否插入至 body 元素上
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 二维码内容
    value: String,
    // 二维码中心图片地址
    logo: String
  },
  watch: {
    visible: {
      handler(val) {
        this.drawerVisible = val
      },
      immediate: true
    },
    drawerVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  data() {
    return {
      // 弹出层显隐
      drawerVisible: false
    }
  },
  methods: {
    // 下载二维码
    downRQcode(val) {
      if (!this.value) {
        this.$message.closeAll()
        return this.$message.warning('暂无二维码图片')
      }
      const codeEl = this.$refs.qrcode.$el
      html2canvas(codeEl, {
        scale: val / codeEl.clientWidth, // 添加的scale 参数
        width: codeEl.clientWidth,
        height: codeEl.clientHeight,
        backgroundColor: '#0f3050',
        ignoreElements: element => {
          // 忽略不被绘制的dom元素
          return element.className === 'tool product-view-tool'
        }
      }).then(canvas => {
        const src = canvas.toDataURL('image/jpg', 1)
        const url = src.replace(/^data:image\/[^;]/, 'data:application/octet-stream')
        const a = document.createElement('a')
        a.download = '二维码.png' // 设置下载的文件名，默认是'下载'
        a.href = url
        document.body.appendChild(a)
        a.click()
        a.remove() // 下载之后把创建的元素删除
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content-info {
  padding: 24px 30px;
  display: flex;

  .size {
    flex: 1;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 20px;

    .size-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.empty-img {
  width: 200px;
  height: 200px;
  background: url('~@/assets/img/list-data-empty.png') no-repeat center;
  background-size: contain;
}
</style>
