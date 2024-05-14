const vueClearIndex = {}
/*
* 解决tooltips，在弹框之后再次出现的问题，原因是由于tabindex导致
*/
vueClearIndex.install = Vue => {
  Vue.directive('delTabIndex', {
    bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
      el.__vueSetTimeoutIndex__ = setTimeout(() => {
        // 清除当前tabIndex
        el.removeAttribute('tabindex')
        clearTimeout(el.__vueSetTimeoutIndex__)
      }, 0)

    },
    unbind(el) {
      clearTimeout(el.__vueSetTimeoutIndex__)
    }
  })
}

export default vueClearIndex