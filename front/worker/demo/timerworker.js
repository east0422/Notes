/** timerworker.js 倒计时线程 */

// 默认倒计时60秒
let totalSecond = 60
// 接收主线程发送的数据
onmessage = (e) => {
  totalSecond = e.data
  setInterval(() => {
    totalSecond--
    if (totalSecond <= 0) {
      close()
    }
    postMessage(totalSecond)
  }, 1000)
}
