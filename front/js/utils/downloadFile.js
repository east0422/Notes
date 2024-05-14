// 下载文件流
function downloadFile(flowData, fileName) {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(flowData, fileName)
  } else {
    const a = document.createElement('a')
    a.download = fileName || '附件'
    a.href = URL.createObjectURL(flowData)
    a.click()
    a.remove()
    setTimeout(() => {
      URL.revokeObjectURL(flowData)
    }, 100)
  }
}

// 下载文件地址
export const downloadUrl = (fileUrl, fileName) => {
  fetch(fileUrl)
    .then(res => res.blob())
    .then(res => {
      downloadFile(res, fileName || '附件')
    })
}

// 下载服务器文件流返回的数据
export const downloadFlow = (res, fileName) => {
  let downloadName = fileName
  if (res.headers.filename) {
    downloadName = decodeURI(res.headers.filename)
  } else if (res.headers['content-disposition'] && res.headers['content-disposition'].split('filename=')[1]) {
    downloadName = decodeURI(res.headers['content-disposition'].split('filename=')[1])
  }
  const blobStream = new Blob([res.data])
  const url = window.URL.createObjectURL(blobStream)

  // 兼容IE
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blobStream, downloadName)
  } else {
    let downloadElement = document.createElement('a')
    downloadElement.href = url
    downloadElement.target = '_blank'
    downloadElement.download = downloadName
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(url) // 释放掉blob对象
  }
}

export default downloadFile
