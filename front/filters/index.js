import Vue from 'vue'

const filters = {
  // 超过万只统计千位数以上 自动带上 w 单位
  formatMyriabit: val => {
    let num = val / 1000
    if (!val) return 0
    return `${Math.floor(num) / 10}w`
  },
  // 文件名称长度超过len，中间显示省略号保持后缀后前面部分名称
  fileNameLenEllipsisF: (val, len = 15) => {
    if (val) {
      if (val.length > len) {
        let suffix = val.substr(val.lastIndexOf('.') + 1)
        return val.substring(0, (len - suffix.length)) + '...' + suffix
      } else {
        return val
      }
    } else {
      return ''
    }
  },
  // 数字单位转换为万(reserveFloatLen保留小数位数，默认为1)
  tenThousandF: (num, reserveFloatLen = 1, unit ='w') => {
    if (!num) { // 将null，空字符串转换为0
      return 0
    } else if (num < 10000) {
      return num
    } else {
      // toFixed参数为0到100，通常使用在该范围内所以未加reserveFloatLen判断
      return Number(num / 10000.0).toFixed(reserveFloatLen) + unit
    }
  },
}

Object.keys(filters).map(key => {
  Vue.filter(key, filters[key])
})
