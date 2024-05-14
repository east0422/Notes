vue-seamless-scroll无缝滚动部分点击事件失效
在父节点上添加绑定事件，在内部通过:data-index形式绑定index，在父节点响应事件中通过e.target.dataset.index获取具体点击位置

```
<div @click="itemClick"> // 点击事件绑定到父节点上
  <vue-seamless-scroll :data="list">
    <ul> // 设置样式，方便定位
      <li v-for="(item, index) in list"
        :key="item.id"
        :data-index="index"> // 绑定index(或者直接放数据,JSON.stringify(item))
      </li>
    </ul>
  </vue-seamless-scroll>
</div>

itemClick(e) {
  if (!e || !e.target) {
    return
  }
  let targetE = e.target
  while(targetE) { // 添加:data-index元素中需添加seamlessscrollrow样式
    if (targetE.className && targetE.className.includes('seamlessscrollrow')) {
      break
    } else {
      targetE = targetE.parentElement
    }
  }
  
  if (targetE && targetE.dataset && targetE.dataset.index !== null && targetE.dataset.index !== undefined) {
    this.$emit('itemClick', {index: targetE.dataset.index, item: this.list[targetE.dataset.index]})
  }
}
```