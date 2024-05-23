/**
 * 删除首尾指定特定字符，返回去掉首尾指定字符后的字符串(';;;;1;2;3;;' -> 1;2;3)
 * @param {*} str 原字符串
 * @param {*} char 指定特定字符
 */
function trimHeadAndTailChar(str, char) {
  if (str) {
    return str.replace(new RegExp(`^${char}+|${char}+$`, 'g'), '')
  } else {
    return str
  }
}