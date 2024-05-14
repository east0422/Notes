function debounce(func, delay) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      func.apply(this, arguments)
      timer = null
    }, delay)
  }
}

function test1() {
  console.log('11:', new Date().toLocaleString())
}
const fn = debounce(test1, 600)
let timestamp = new Date().getTime()
let interval = setInterval(() => {
  console.log('-----:', new Date().toLocaleString())
  if (timestamp + 1000 < new Date().getTime()) {
    console.log('clearinterval:', new Date().toLocaleString())
    clearInterval(interval)
  }
  fn()
}, 500)


function test2() {
  console.log('22:', new Date().toLocaleString())
}
const fn2 = debounce(test2, 600)
let timestamp2 = new Date().getTime()
let interval2 = setInterval(() => {
  console.log('+++++:', new Date().toLocaleString())
  if (timestamp2 + 1500 < new Date().getTime()) {
    console.log('+++clearinterval:', new Date().toLocaleString())
    clearInterval(interval2)
  }
  // 只输出一次22：datetime。fn2为一个返回方法是同一个
  fn2()
  
  // 会输出多个22：datetime。每次debounce会返回一个新的方法，不是同一个
  // debounce(test2, 600)()
  // debounce(() => {
  //   console.log('22:', new Date().toLocaleString())
  // }, 600)()
}, 500)


