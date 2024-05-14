### vue中keep-alive缓存与事件监听器一起使用导致后续有多个监听器触发多次

// beforeRouteEnter中添加键盘监听事件
window.addEventListener("keydown", vm.keycodeFn);
// beforeRouteLeave中移除事件
window.removeEventListener("keydown", this.keycodeFn);
// 某方法中使用不同参数切换路由
this.$router.replace({
  path: this.$route.query.path,
  query: {
    id: this.id
  }
})
// 原因解析：replace只重新触发了mounted钩子函数并未重新触发beforeRouteEnter和beforeRouteLeave，缓存中keyCodeFn绑定数据是对应缓存中的，替换新的id查询出来的数据替换并未能替换缓存中数据。
// 尝试方法：首先想到在replace前移除事件，在replace替换完成onComplete的then中重新添加事件但不起作用，调试发现这两个地方的this为同一个，但replace重新mounted后this和这两个不一致，相当于事件监听器还是添加进缓存中故不起作用。
// 解决方法：在replace前移除，在mounted中重新再添加。由此引出另一个问题，如果有其他路由页面切换到当前页面则会添加两次还会导致触发两次，所以在mounted中先移除然后再延迟2ms添加
window.removeEventListener("keydown", this.keycodeFn);
setTimeout(() => {
  window.addEventListener("keydown", this.keycodeFn);
}, 200);
  
