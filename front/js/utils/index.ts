// 获取assets静态图片资源
const getAssetsImg = (url: string) => {
  // new URL中不能使用@，../为相对路径，不同位置可能不同
  return new URL(`../assets/img/${url}`, import.meta.url).href
}
// ElMessageBox.confirm弹框点击确认返回true，其他返回false
const msgConfirm = async (
  msg: string = '',
  title: string = '提示',
  confirmText: string = '确认',
  cancelText: string = '取消'
): Promise<boolean> => {
  try {
    await ElMessageBox.confirm(msg, title, {
      confirmButtonText: confirmText,
      cancelButtonText: cancelText
    })
    return true
  } catch {
    return false
  }
}

// 警告消息
const msgWarning = (msg: string) => {
  ElMessage.warning(msg)
}
// 成功消息
const msgSuccess = (msg: string) => {
  ElMessage.success(msg)
}
// 错误消息
const msgError = (msg: string) => {
  ElMessage.error(msg)
}

// 求两个数最大公因数(eg: 4和6返回2，4和7返回1)
const getGcd = (num1: number, num2: number): number => {
  let temp = num2
  while (num2 !== 0) {
    temp = num2
    num2 = num1 % num2
    num1 = temp
  }
  return num1
}
// 求两个数最简整数比(eg: 4和6返回2:3，4和7返回4:7)
export const getSimplestProportion = (num1: number, num2: number): string => {
  if (isNaN(num1) || !isFinite(num1) || num1 == 0 || isNaN(num2) || !isFinite(num2) || num2 == 0) {
    // 默认
    return '1:1'
  }
  const gcd = getGcd(num1, num2)
  if (gcd === 1) {
    return `${num1}:${num2}`
  }
  return Math.round(num1 / gcd) + ':' + Math.round(num2 / gcd)
}
// 获取字典枚举类型数据
const dictListPcodeOnFn = async (pcode: string, customErrMsg?: string, isAddAll = false) => {
  const reqData = {
    pcode: pcode,
    customErrMsg: customErrMsg || '获取字典数据失败'
  }
  const { code, data } = await $api.topeakPlatformServer
    .dictListPcodeOn(reqData)
    .catch((err: AxiosError) => err)
  let dictOptions = []
  if (code == 200 && Array.isArray(data)) {
    dictOptions = data
  }
  if (isAddAll) {
    dictOptions.unshift({ code: '', name: '全部' })
  }
  return dictOptions
}

// 获取自定义字典枚举类型数据
const ucDictFindListByDictTypeFn = async (
  type: string,
  customErrMsg?: string,
  isAddAll = false
) => {
  const reqData = {
    type: type,
    customErrMsg: customErrMsg || '获取字典数据失败'
  }
  const { code, data } = await $api.topeakPlatformServer
    .ucDictFindListByDictType(reqData)
    .catch((err: AxiosError) => err)
  let dictOptions = []
  if (code == 200 && Array.isArray(data)) {
    dictOptions = data
  }
  if (isAddAll) {
    dictOptions.unshift({ code: '', name: '全部' })
  }
  return dictOptions
}

// 数字千分位显示(value原始数值，reserved保留小数位-1则不处理小数)
const thousandFunc = (num: number | string, reserveFloatLen: number = 2) => {
  if (num === 0 || num === '0' || num) {
    const arr = num.toString().split('.')
    const iValue = arr[0].replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,')
    if (reserveFloatLen < 0) {
      // 原小数位数不变
      if (arr.length > 1) {
        // 有小数
        return iValue + '.' + arr[1]
      }
      return iValue
    } else if (reserveFloatLen == 0) {
      // 不需要小数只保留整数
      return iValue
    }
    if (arr.length > 1) {
      // 有小数
      if (arr[1].length >= reserveFloatLen) {
        return iValue + '.' + arr[1].slice(0, reserveFloatLen)
      }
      return iValue + '.' + arr[1] + '0'.repeat(reserveFloatLen - arr[1].length)
    }
    return iValue + '.' + '0'.repeat(reserveFloatLen)
  }
  return ''
}

// 数字金额转大小写
const digitUppercase = (n: number) => {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ]
  const head = n < 0 ? '负' : ''
  n = Math.abs(n)
  let s = ''

  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * 10 ** i) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)

  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '') + unit[0][i] + s
  }

  return head + s.replace(/零元/, '元').replace(/零+/g, '零').replace(/^整$/, '零元整')
}
// 生成32位的随机uuid
const uuidStr = () => {
  const len = 32 // 32长度
  const radix = 16 // 16进制
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid: string[] = []

  for (let i = 0; i < len; i++) {
    uuid[i] = chars[Math.floor(Math.random() * radix)]
  }

  return uuid.join('')
}

// 打印dom
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
const printDom = async (dom?: HTMLElement, printIframeId: string = 'print-iframe') => {
  if (!dom) {
    msgWarning('请稍后再试')
    return
  }
  const canvas = await html2canvas(dom, {
    useCORS: true,
    scrollX: 0,
    scrollY: 0,
    windowHeight: dom.scrollHeight,
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

  const oldIframe: any = document.getElementById(printIframeId)
  if (oldIframe) {
    document.body.removeChild(oldIframe)
  }
  const iframe: any = document.createElement('iframe')
  iframe.id = printIframeId
  iframe.style.display = 'none'
  iframe.src = pdf.output('bloburl')
  document.body.appendChild(iframe)
  iframe.contentWindow.print()
}

export default {
  msgConfirm,
  msgWarning,
  msgSuccess,
  msgError,
  getAssetsImg,
  dictListPcodeOnFn,
  ucDictFindListByDictTypeFn,
  thousandFunc,
  digitUppercase,
  printDom,
  uuidStr
}
