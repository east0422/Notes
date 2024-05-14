/** 全局过滤器, key已后缀F结尾 */
/** 使用
  1. 在main.js中引入import filters from 'filters路径'
  2. 全局注册
    Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key])
    })
  3. 直接使用
  注意：先注册过滤器再创建vue实例，否则可能会报Failed to resolve filter: xxx的错误
 */

// 默认显示值
let defaultValue = '--'

// 性别(0:男；1:女)
let sexF = (sex) => {
  if (sex === 0 || sex === "0") {
    return "男";
  } else if (sex == 1) {
    return "女";
  } else {
    return sex;
  }
}

// 获取金额数据index所在位数值(index为0取元，小数点后的数值为负值)
let moneyIndexF = (money, index = 0) => {
  if (isNaN(money)) {
    return "";
  }
  let moneyArr = (money + "").split(".");
  if (index < 0) { // 获取小数位
    if(moneyArr.length < 2) { // 无小数
      return "";
    } else {
      return moneyArr[1][-index - 1];
    }
  } else {
    let iLen = moneyArr[0].length;
    if (index >= iLen) {
      return "";
    } else {
      return moneyArr[0][iLen - 1 - index];
    }
  }
}

// 金额单位(金额后面加单位，默认单位为元)
let moneyUnitF = (money, unit = "元") => {
  if (money === "" || money === defaultValue) {
    return defaultValue;
  }
  return (money === 0 || money === "0" || money) ? (money + unit) : defaultValue;
}

// 数字千分位格式化(reserveFloatLen保留小数位数，默认为2，小于0保留原小数位数不变)
let thousandF = (num, reserveFloatLen = 2) => {
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
    return defaultValue;
  }
}

// 获取数组arrs对应key组成新的数组
let arrsF = (arrs, key) => {
  if (key && arrs && Array.isArray(arrs) && arrs.length > 0) {
    let newArrs = arrs.map((item) => {
      return item[key];
    })
    return newArrs;
  } else {
    return [];
  }
}

// arr数组每size个元素组成一个新的数组，返回新数组索引组成的数组eg:[0, 1, 2]
let subArrIndexF = (arr, size) => {
  if (!Array.isArray(arr) || arr.length < 1) {
    // 空数组
    return []
  } else if (size < 2 || arr.length < size) {
    // 1个元素数组
    return [0]
  } else {
    let len = Math.ceil(arr.length / size)
    let lenArr = []
    for (let i = 0; i < len; i++) {
      lenArr.push(i)
    }
    return lenArr
  }
}

// 获取arr数组从start开始长度为len的元素组成新的数组
let subArrF = (arr, start, len) => {
  if (!Array.isArray(arr) || arr.length < 1) {
    return []
  } else {
    return arr.slice(start, start + len)
  }
}

// 转换为百分号形式0.06 => 6%
let percentF = (percent) => {
  if (percent === 0 || percent === "0" || percent === "0.00") {
    return defaultValue;
  }
  if (isFinite(percent) && percent != 0) { // "" != 0返回false
    return percent * 100 + "%";
  } else {
    return defaultValue
  }
}
 
export default {
  sexF,
  moneyIndexF,
  moneyUnitF,
  thousandF,
  arrsF,
  subArrIndexF,
  subArrF,
  percentF
}