/** 组件常用方法 */
// 数字千分位格式化(reserveFloatLen保留小数位数，默认为2，小于0保留原小数位数不变)
export function thousandF (num, reserveFloatLen = 2) {
  if (num === 0 || num ==="0" || num) {
    let arr = num.toString().split(".");
    let iValue = arr[0].replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, "$&,");
    if (reserveFloatLen < 0) { // 原小数位数不变
      if (arr.length > 1) { // 有小数
        return iValue + "." + arr[1];
      } else {
        return iValue;
      }
    } else if (reserveFloatLen == 0) { // 不需要小数只保留整数
      return iValue;
    } else {
      if (arr.length > 1) { // 有小数
        if (arr[1].length >= reserveFloatLen) {
          return iValue + "." + arr[1].slice(0, reserveFloatLen);
        } else {
          return iValue + "." + arr[1] + "0".repeat(reserveFloatLen - arr[1].length);
        }
      } else {
        return iValue + "." + "0".repeat(reserveFloatLen)
      }
    }
  } else {
    return "";
  }
}

// el-table自定义合计行, arr为需要合计金额索引数组, reserveArr对应每个合计保留小数位数默认保留2位，其他列合计显示空
export function tableMoneySummaries(params, arr=[], reserveArr = []) {
  const { columns, data } = params
  const sums = []
  var reserveFloatLen = 2;
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    if (!arr || arr.indexOf(index) == -1) {
      sums[index] = ''
      return
    }
    if (reserveArr.length - 1 < arr.indexOf(index)) {
      reserveFloatLen = 2;
    } else {
      reserveFloatLen = reserveArr[arr.indexOf(index)];
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => isNaN(value))) {
      sums[index] = values.reduce((prev, cur) => {
        const value = Number(cur)
        if (!isNaN(value)) {
          var powVal = Math.pow(10, reserveFloatLen + 1)
          return (prev*powVal + cur*powVal)/powVal
        } else {
          return prev
        }
      }, 0)
      sums[index] = thousandF(sums[index], reserveFloatLen)
    } else {
      sums[index] = thousandF(sums[index], reserveFloatLen)
    }
  })
  return sums
}