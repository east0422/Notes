function throttle(func, delay) {
  let timer = null
  return function() {
    if (!timer) {
      func.apply(this, arguments)
      timer = setTimeout(() => {
        clearTimeout(timer)
        timer = null
      }, delay);
    }
  }
}

const fn1 = (args) => {
  console.log('------:', args, new Date().toLocaleString())
}
const test1 = throttle(fn1, 1000)
let timestamp1 = new Date().getTime()
let timer1 = setInterval(() => {
  if (timestamp1 + 5000 < new Date().getTime()) {
    clearInterval(timer1)
  }
  test1({name: 'east'})
}, 600);