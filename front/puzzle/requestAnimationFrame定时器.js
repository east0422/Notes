/** window.requestAnimationFrame(callback)
 * requestAnimationFrame告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。
 * 该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。
 * requestAnimationFrame是一次性的，若想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用requestAnimationFrame。
 * 为了提高性能和电池寿命，在大多数浏览器里，当requestAnimationFrame运行在后台标签页或者隐藏的<iframe>里时，requestAnimationFrame会被暂停调用以提升性能和电池寿命。
 * callback参数：当你的动画需要更新时，为下一次重绘所调用的函数。该回调函数会传入DOMHighResTimeStamp参数，该参数与performance.now()的返回值相同，它表示requestAnimationFrame()开始执行回调函数的时刻。
 * 返回值： 一个long整数，请求ID，是回调列表中唯一的标识。是个非零值，没有别的意义。可以传这个值给window.cancelAnimationFrame()以取消回调函数请求。
 */

// 打印信息加上当前时间
function logInfo(info) {
  console.log(info + new Date().toLocaleString())
}

// 延时方法
let timeoutFunc = (callback = () => {}, timeout) => {
  let start = new Date().getTime() 
  let animationFrameId = 0
  let func1 = () => {
    if (new Date().getTime() - start > timeout * 1000) {
      callback && callback()
      cancelAnimationFrame(animationFrameId)
    } else {
      animationFrameId = requestAnimationFrame(func1)
    }
  }
  animationFrameId = requestAnimationFrame(func1)
}

logInfo('start--')
timeoutFunc(() => {
  logInfo('end--')
}, 3)