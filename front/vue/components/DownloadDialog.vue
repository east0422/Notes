<template>
  <custom-dialog
    v-model:visible="visible"
    :title="props.title"
    :destroyOnClose="true"
    :appendToBody="true"
    :closeOnClickModal="false"
    :closeOnPressEscape="false"
    :showFooter="false"
    class="vcontainer hcenter downloaddialog">
    <div class="hcontainer hcenter vcenter flex-around">
      <div
        v-for="item in downloadOptions"
        :key="item.code"
        class="vcontainer vcenter hcenter download-item"
        @click="downloadClick(item)">
        <img :src="item.icon" class="download-icon" />
        <div class="download-name">{{ item.name }}</div>
      </div>
    </div>
  </custom-dialog>
</template>

<script lang="ts" setup name="DownloadDialog">
  import { downloadFile } from '@/utils/downloadFile'
  import docIcon from '@/assets/img/icons/icon_doc.png'
  import xlsIcon from '@/assets/img/icons/icon_xls.png'
  import pdfIcon from '@/assets/img/icons/icon_pdf.png'
  import pngIcon from '@/assets/img/icons/icon_png.png'
  import html2canvas from 'html2canvas'
  import jsPDF from 'jspdf'

  const props = withDefaults(
    defineProps<{
      title?: string
      fileName?: string
      dom?: HTMLElement
      xlsApiServer?: string
      xlsApi?: string
      xlsParams?: any
      docApiServer?: string
      docApi?: string
      docParams?: any
    }>(),
    {
      title: '选择下载格式',
      fileName: '',
      dom: undefined,
      xlsApiServer: 'topeakTCMServer',
      xlsApi: '',
      xlsParams: () => {},
      docApiServer: 'topeakTCMServer',
      docApi: '',
      docParams: () => {}
    }
  )
  const visible = defineModel('modelValue', { type: Boolean, default: false })

  const downloadOptions = [
    { code: 'doc', name: '下载', icon: docIcon },
    { code: 'xls', name: '下载', icon: xlsIcon },
    { code: 'pdf', name: '下载', icon: pdfIcon },
    { code: 'png', name: '下载', icon: pngIcon }
  ]
  const downloadFileName = computed(() => {
    const now = new Date()
    return (
      (props.fileName ? props.fileName + '-' : '') +
      now.getFullYear() +
      [now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()]
        .map((num) => {
          return num.toString().padStart(2, '0')
        })
        .join('')
    )
  })
  const downloadClick = (item: any) => {
    if (!props.dom) {
      $utils.msgWarning('暂无可下载数据')
      return
    }
    switch (item.code) {
      case 'doc':
        downloadDOC()
        break
      case 'xls':
        downloadXLS()
        break
      case 'pdf':
        downloadPDF()
        break
      case 'png':
        downloadPNG()
        break
      default:
        break
    }
  }

  const downloadFn = (apiServer?: string, api?: string, params?: any) => {
    if (!apiServer || !api) {
      $utils.msgWarning('请配置相关下载接口信息')
      return
    }
    let reqData: any = {}
    if (params) {
      reqData = {
        ...params,
        customErrMsg: '下载失败'
      }
    } else {
      reqData = {
        customErrMsg: '下载失败'
      }
    }

    // @ts-ignore
    $api[apiServer][api](reqData)
      .then((res: any) => {
        downloadFile(res, downloadFileName.value)
        visible.value = false
      })
      .catch((err: AxiosError) => {
        $utils.msgError(err.message || '下载失败')
      })
  }
  const downloadDOC = () => {
    downloadFn(props.docApiServer, props.docApi, props.docParams)
  }
  const downloadXLS = () => {
    downloadFn(props.xlsApiServer, props.xlsApi, props.xlsParams)
  }
  const downloadPDF = async () => {
    const canvas = await html2canvas(props.dom!, {
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowHeight: props.dom!.scrollHeight,
      onclone: (_, cloneElement: HTMLElement) => {
        // 解除高度限制并滚动到顶部
        cloneElement.style.overflow = 'visible'
        cloneElement.style.height = 'auto'
        cloneElement.scrollTop = 0
      }
    })
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210 - 20 // A4 宽度210mm，左右边距各10mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let curPosition = 0
    while (curPosition < imgHeight) {
      if (curPosition >= 297) {
        // 增加分页
        pdf.addPage()
      }
      if (curPosition == 0) {
        pdf.addImage(canvas, 'png', 10, 10, imgWidth, imgHeight - 10)
      } else {
        pdf.addImage(canvas, 'png', 10, -curPosition, imgWidth, imgHeight)
      }
      curPosition += 297 // A4高度297mm
    }
    pdf.save(downloadFileName.value + '.pdf')
    visible.value = false
  }
  const downloadPNG = async () => {
    // 下载图片
    try {
      const padding = 20
      const canvas = await html2canvas(props.dom!, {
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: props.dom!.scrollWidth + padding * 2,
        windowHeight: props.dom!.scrollHeight + padding * 2,
        onclone: (_, cloneElement: HTMLElement) => {
          // 解除高度限制并滚动到顶部
          cloneElement.style.overflow = 'visible'
          cloneElement.style.height = 'auto'
          cloneElement.scrollTop = 0
          cloneElement.style.padding = padding + 'px'
        }
      })
      const imgData = canvas.toDataURL('image/png')
      if (imgData) {
        const link = document.createElement('a')
        link.href = imgData
        link.download = downloadFileName.value + '.png'
        link.click()
        visible.value = false
      } else {
        $utils.msgError('下载导出图片失败')
      }
    } catch (error) {
      console.error('截图失败:', error)
      $utils.msgError('下载导出图片失败')
      return ''
    }
  }
</script>

<style lang="scss">
  .downloaddialog {
    width: 30%;
    .download-item {
      color: #333333;
      font-size: 16px;
      cursor: pointer;
      .download-icon {
        width: 50px;
        height: 50px;
        margin: 20px 0;
      }
      .download-name {
        font-size: 14px;
        color: #099d74;
        padding: 8px 16px;
        background-color: #fcfcfc;
        border-radius: 8px;
        border: 1px solid #36a98a;
      }
    }
  }
</style>
