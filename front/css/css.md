# css

### less->scss->css

### css
  - css仅仅是一个标记语言，不可以自定义变量，不可以引用
  - 无法嵌套书写，导致模块化开发中需要书写很多重复的选择器
  - 没有变量和合理的样式复用机制，使得逻辑上相关的属性值必须以字面量的形式重复输出，导致难以维护

### less
  - less是一种动态样式语言，为css增加了变量、嵌套、运算、混入(Mixin)、函数等功能。在现有css语法的基础上为css加入动态语言的特性
  - 变量定义与使用@开头(@imgUrl: '@/assets/img/';)
  - 运算所有操作数被转换成相同的单位(乘法和除法不作转换)，calc并不对数学表达式进行计算，但是在嵌套函数中会计算变量和数学公式的值。可使用转义字符~（width: calc(~'100% + 10px'))

### scss
  - scss是一种动态样式语言，比css多出变量、嵌套、运算、混入(Mixin)、继承、颜色处理、函数等功能
  - 变量定义与使用$开头($imgUrl: '@/assets/img/';)
  - 支持条件语句，可以使用if...else.../for...while...each循环等，less不支持
  - 使用&符号表示父选择器，但是scss的&符号只能出现在一个组合选择器的开始位置，less无此限制

### 伪元素巧用
  - 顶部或底部下划线
    ```
    .border {
      position: relative;
    }
    .border:before {
      content: " ";
      position: absolute;
      top: 0;
      width: 100%;
      height: 1px;
      border-top: 1rpx solid #D8D8D8;
      color: #D8D8D8;
    }
    .border:first-child:before {
      display: none;
    }
    ```
  - 三角箭头
    ```
    .arrow:after {
      content: " ";
      display: inline-block;
      height: 18rpx;
      width: 18rpx;
      border-width: 2rpx 2rpx 0 0;
      border-color: #888888;
      border-style: solid;
      transform: rotate(45deg);
    }
    ```
    
### 盒子模型box-sizing
  - content-box(默认)，标准盒子模型(宽度=设置宽度(content)+border+padding+margin)width与height只包括内容的宽和高，不包括边框(border)、内边距(padding)、外边距(margin)。注意：内边距、边框和外边距都在这个盒子的外部。比如 .box {width: 350px; border: 10px solid black; padding: 15px; margin: 18px;}在渲染的实际宽度将是400px(350 + 10*2 + 15*2)
  - border-box怪异盒子/IE盒子模型(宽度=设置宽度(content+border+padding)+margin)width和heigh属性包括内容、内边距和边框，但不包括外边距。比如.box {width: 350px; border: 10px solid black; padding: 15px; margin: 18px;}在渲染的实际宽度将是300px(350 - 10*2 - 15*2)

### 重绘与回流(重排)
  - 当渲染树中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建，称为回流(reflow)。每个页面至少需要一次回流(第一次加载时)。在回流的时候，浏览器会使渲染树中受到影响的部分失效，并重新构造这部分渲染树。完成回流后浏览器会重新绘制受影响的部分到屏幕中，该过程称为重绘(redraw)。
  - 重排也称为回流。当DOM的变化影响了元素的几何信息(DOM对象的位置和尺寸大小)，浏览器需要重新计算元素的几何属性，将其安放在界面中的正确位置，这个过程叫做重排。触发：添加或者删除可见的DOM元素、元素尺寸改变——边距、填充、边框、宽度和高度。
  - 当一个元素的外观发生改变，但没有改变布局，重新把元素外观绘制出来的过程叫做重绘。触发：改变元素的color、background、box-shadow等属性。
  - 重排重绘优化建议：
    - 样式表越简单，重排和重绘就越快。尽量用class，少用style一条条改变样式。
    - 重排和重绘的DOM元素层级越高，成本就越高。如果可以灵活用display，absolute，flex等重排开销会比较小，或不会影响其他元素的重排。
    - 使用虚拟DOM的脚本库。

### 
