
export default(Vue)=> {
  Vue.directive("loadMore" , {
    bind(el, binding) {
      var p = 0;
      var t = 0;
      var down = true;
      var selectWrap = el.querySelector('.el-table__body-wrapper')
      selectWrap.addEventListener('scroll', function() {
        //判断是否向下滚动
        p = this.scrollTop;
        if(t < p){
            down = true;
        }else{
            down = false;
        }
        
        //判断是否到底
        const sign = 0;
        const scrollDistance = (this.scrollHeight - this.scrollTop).toFixed(0) - this.clientHeight
        if (scrollDistance <= sign && down) {
            t = p;
            down = false;
            binding.value();
            
        }
      })
    },
    unbind(el) {
        var selectWrap = el.querySelector('.el-table__body-wrapper');
        selectWrap.addEventListener("scroll",()=>{})
    }
  })
}
