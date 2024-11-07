/** businessworker.js 新线程 */

// 模拟耗时操作
onmessage = (e) => {
  setTimeout(() => {
    postMessage(111)
  }, (e.data || 5) * 1000)
}