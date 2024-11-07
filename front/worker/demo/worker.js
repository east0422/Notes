/** js 主线程 */

// 创建定时器线程
const tWorker = new Worker('./timerworker.js')
function startTimer() {
  // 获取dom对象
  const domMinute = document.getElementById('minute')
  const domSecond = document.getElementById('second')
  // 给定时器worker发送倒计时秒数
  tWorker.postMessage(90)

  // 接收倒计时返回秒数更新dom
  tWorker.onmessage = function(event) {
    const totalSecond = event.data
    // 计算分钟数
    domMinute.innerText = parseInt(totalSecond / 60).toString().padStart(2, '0')
    // 计算秒数
    domSecond.innerText = parseInt(totalSecond % 60).toString().padStart(2, '0')
    // 销毁
    if (totalSecond == 0) {
      tWorker.terminate()
    }
  }
}
function stopTimer() {
  if (tWorker) {
    tWorker.terminate()
  }
}

const bWorker = new Worker('./businessworker.js')
function startBusiness() {
  bWorker.postMessage(10)
  bWorker.onmessage = function(e) {
    console.log('business finish:', e.data)
    if(e.data == 111) {
      bWorker.terminate()
    }
  }
}
function stopBusiness() {
  if (bWorker) {
    bWorker.terminate()
  }
}

window.onbeforeunload = () => {
  stopTimer()
  stopBusiness()
}