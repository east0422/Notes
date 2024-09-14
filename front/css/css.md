# css

### scss->less->css

### css
  - css仅仅是一个标记语言，不可以自定义变量，不可以引用
  - 无法嵌套书写，导致模块化开发中需要书写很多重复的选择器
  - 没有变量和合理的样式复用机制，使得逻辑上相关的属性值必须以字面量的形式重复输出，导致难以维护

### less
  - less是一种动态样式语言，为css增加了变量、嵌套、运算、混入(Mixin)、函数等功能。在现有css语法的基础上为css加入动态语言的特性
  - 变量定义与使用@开头(@imgUrl: '@/assets/img/';)，使用@{imgUrl}
  - 运算所有操作数被转换成相同的单位(乘法和除法不作转换)，calc并不对数学表达式进行计算，但是在嵌套函数中会计算变量和数学公式的值。可使用转义字符~（width: calc(~'100% + 10px'))

### sass/scss
  - scss是一种动态样式语言，比css多出变量、嵌套、运算、混入(Mixin)、继承、颜色处理、函数等功能
  - 变量定义与使用$开头($imgUrl: '@/assets/img/';)，使用#井号插值 #{$imgUrl} 
  - 支持条件语句，可以使用if...else.../for...while...each循环等，less不支持
  - 使用&符号表示父选择器，但是scss的&符号只能出现在一个组合选择器的开始位置，less无此限制
  - sass不使用花括号和分号使用严格的缩进式风格。sass从第三代开始放弃了缩进式风格，并且完全向下兼容普通的css代码，这一代的sass也被称为scss

### less和sass/scss相同之处
  - 都可以通过自带的插件，转成相对应的css文件
  - 都是css的预处理器，可以拥有变量，运算，继承，嵌套的功能，使用两者可以使代码更加的便于阅读和维护。语法上有些共性，比如下面这些：
    * 混入(Mixins)——class中的class
    * 参数混入——可以传递参数的class，就像函数一样
    * 嵌套规则——class中嵌套class，从而减少重复的代码
    * 运算——CSS中用上数学
    * 颜色功能——可以编辑颜色
    * 名字空间(namespace)——分组样式，从而可以被调用
    * 作用域——局部修改样式
    * JavaScript赋值——在CSS中使用JavaScript表达式赋值

### less和sass/scss不同之处
  - 变量符号不同。less是@，scss是$
  - 输出设置。less没有输出设置，sass提供4种输出选项：nested(嵌套缩进的css代码)，compact(简洁格式的css代码)，compressed(压缩后的css代码)和expanded(展开的多行css代码)
  - sass支持条件语句，可使用if{} else{}，for{}循环等。less不支持
  - 引用外部css文件。less引用外部文件和css中的@import没什么差别。scss引用的外部文件名若是下划线_开头的话，sass会认为该文件是一个引用文件不会将其编译为css文件
  - less和scss都可以使用&符号表示父选择器，但是scss的&符号只能出现在一个组合选择器的开始位置(css1&:hover编译不通过只能&:hover)，less则没有这个限制(可使用css1&:hover)

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

### DOM
  - 当浏览器加载html页面时首先就是DOM结构的计算，计算出来的DOM结构就是DOM树(把页面中html标签像树状结构一样分析出之间的层级关系)。DOM树描述了标签间的关系(节点间的关系)，只要知道任何一个标签都可以依据DOM中提供的属性和方法获取到页面中任意一个标签或节点。

### 浏览器渲染机制
  - 浏览器采用流式布局模型(Flow Based Layout)，浏览器会把HTML解析成DOM，把CSS解析成CSSOM，DOM和CSSOM合并就产生了渲染树(Render Tree)。有了Render Tree我们就知道了所有节点的样式，然后计算他们在页面上的大小和位置，最后把节点绘制到页面上。由于浏览器使用流式布局，对Render Tree的计算通常只需要遍历一次就可以完成，但table及其内部元素除外，他们可能需要多次计算，通常要花3倍于同等元素的时间，这也是为什么要避免使用table布局的原因之一。

### 重绘
  - 当一个元素的外观发生改变(color、background、box-shadow、outline、visibility等属性)，但没有改变布局，重新把元素外观绘制出来的过程叫做重绘。
  - 常用会导致重绘的属性：color,background,background-image,backgroud-position,background-repeat,background-size,outline,outline-color,outline-style,outline-width,border-style,border-radius,visibility,text-decoration,box-shadow。

### 回流(重排)
  - 回流也称为重排。当DOM变化影响了元素的几何信息(DOM对象的位置和尺寸大小)，浏览器需要重新计算元素的几何属性，将其安放在界面中的正确位置，这个过程叫做回流。
  - 引发回流发生的一些因素有：页面首次渲染、浏览器窗口大小发生变化、添加或删除可见的DOM元素、元素尺寸或位置变化(边距、填充、边框、宽度和高度)、元素字体大小变化、内容变化(eg:用户在input框中输入文字, CSS3动画，文字数量或者图片大小改变等)。
  - 常用且会导致回流的属性和方法：width,height,margin,padding,border,clientWidth,clientHeight,clientTop,clientLeft,offsetWidth,offsetHeight,offsetTop,offsetLeft,scrollWidth,scrollHeight,scrollTop,scrollLeft,scrollIntoView(),getComputedStyle(),getBoundingClientRect()。

### 减少重绘与回流
  - 使用transform替代top。
  - 使用visibility替代display: none，因为前者只会引起重绘，后者会引发回流(改变了布局)。
  - 避免使用table布局，可能很小的一个小改动会造成整个table的重新布局。
  - 避免使用CSS表达式(如：calc())。
  - 尽可能在DOM树的最末端改变class，回流是不可避免的，但可以减少其影响，限制了回流的范围使其影响尽可能少的节点。
  - 避免设置多层内联样式，CSS选择符从右往左匹配查找，避免节点层级过多。
  - 将动画效果应用到position属性为absolute或fixed的元素上，避免影响其他元素的布局，这样只是一个重绘，而不是回流。同时控制动画速度可以选择requestAnimationFrame避免使用CSS表达式，可能会引发回流。
  - 避免频繁操作样式，最好一次性重写style属性，或者将样式列表定义为class并一次性更改class属性。
  - 把DOM离线后修改，可以先设置display: none，操作结束后再把它显示出来。因为在display属性为none的元素上进行的DOM操作不会引发回流和重绘。
  - 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。
  - 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流。

### 重绘与回流优化
  - 回流必定会发生重绘，重绘不一定会引发回流。回流比重绘的代价要更高。
  - 样式表越简单，重排和重绘就越快。尽量用class，少用style一条条改变样式。
  - 重排和重绘的DOM元素层级越高，成本就越高。如果可以灵活用display，absolute，flex等重排开销会比较小，或不会影响其他元素的重排。
  - 使用虚拟DOM的脚本库。
  - 浏览器会维护一个队列,把所有引起回流和重绘的操作放入到队列中,如果队列中的任务数量或者时间间隔达到一个阈值,浏览器会将队列清空,进行一次批处理,这样可以把多次回流和重绘变成一次。

### 水平垂直居中
  - 子元素在父元素中水平垂直居中显示
    ```
    <div class="parent1 parent"><div class="child1 child"></div></div>
    .parent1 {
      width: 400px;
      height: 300px;
      background-color: #f0f8ff;
      .child1 {
        width: 50px;
        height: 80px;
        background-color: #00ffff;
      }
    }
    // 方法1 flex布局
    // 1.1
    .parent {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    // 方法2 absolute布局
    // 2.1
    .parent {
      position: relative;
      .child {
        position: absolute;
        top: 50%; // top,left,bottom,right等百分比相对于父元素大小
        left: 50%;
        transform: translate(-50%, -50%); // translate百分比相对于自身大小
      }
    }
    // 2.2
    .parent {
      position: relative;
      .child {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
    // 2.3
    .parent {
      position: relative;
      .child {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -25px;
        margin-top: -40px;
      }
    }
    // 方法3 grid网格
    // 3.1
    .parent {
      display: grid;
      justify-content: center;
      align-content: center;
    }
    // 3.2
    .parent {
      display: grid;
      .child {
        justify-self: center;
        align-self: center;
      }
    }
    // 方法4 伪元素
    .parent {
      text-align: center;
      &::before {
        content: "";
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
      }
      .child {
        display: inline-block;
        vertical-align: middle;
      }
    }
    ``` 

### opacity: 0与visibility: hidden及display:none对比
  - opacity设置透明度，值为0元素不可见，占据页面空间。父元素0，自身1不可见。值为0可触发自身绑定事件。若遮挡住其他元素，则其他元素绑定事件不可触发。不会产生回流，不一定会产生重绘。
  - visibility设置元素是否可见，值为hidden元素不可见，占据页面空间。父元素hidden，自身值设置为visible自身可见。值为hidden不可触发自身绑定事件。不会产生回流，会产生重绘。
  - display定义元素显示类型，值为none元素不可见，不占据页面空间。父元素none，自身block不可见。值为hidden不可触发自身绑定事件。会产生回流，会产生重绘。

### BFC(Block Formatting Context)
  - 定义：块级格式化上下文，就是页面上的一个渲染区域，容器内的子元素不会对外面的元素布局产生影响，反之亦然。
  - 布局规则：
    * 内部的盒子会在垂直方向，一个接一个地放置
    * 盒子垂直方向的距离由margin决定，属于同一个BFC的两个相邻Box的上下margin会发生重叠，即以外边距大的为准，不会发生margin穿透问题
    * 每个元素的左边，与包含的盒子的左边相接触(对于从左往右的格式化，否则相反)，即使存在浮动也是如此
    * BFC的区域不会与float重叠。float元素固定宽度，BFC元素不设置宽度，BFC元素宽度会自适应
    * BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之也如此
    * 计算BFC的高度时，浮动元素也参与计算
  - 触发条件：
    * 根元素(即html元素)或其它包含它的元素
    * 浮动float的值不为none，为left,right中任一个
    * 绝对定位position的值不为relative、static、sticky，为absolute或fixed
    * 溢出元素overflow的值不为visible，为hidden,auto,scroll中任一个
    * display的值为table-cell(表格单元格),table-caption(表格标题)和inline-block(行内块)，flex，inline-flex(弹性盒子)中任一个 

### IFC(Inline Formatting Context)
  - 定义：内联格式化上下文，IFC中盒子依次水平放置，从包含块的顶部开始
  - 布局规则：
    * 在一个IFC内，子元素是水平方向横向排列的，并且垂直方向起点为元素顶部
    * 子元素只会计算横向样式空间(padding、border、margin)，垂直方向样式空间不会被计算
    * 在垂直方向上，子元素会以不同形式来对齐（vertical-align）
    * 能把在一行上的框都完全包含进去的一个矩形区域，被称为该行的行框(line box)。行框的宽度是由包含块(containing box)和与其中的浮动来决定
    * IFC中的​​line box​​一般左右边贴紧其包含块，但float元素会优先排列
    * IFC中的​​line box​​​高度由CSS行高计算规则来确定，同个​​IFC​​​下的多个​​line box​​高度可能会不同
    * 当​​inline boxes​​​的总宽度少于包含它们的​​line box​​​时，其水平渲染规则由​​text-align​​属性值来决定
    * 当一个​​inline box​​​超过父元素的宽度时，它会被分割成多个​​boxes​​​，这些​​boxes​​​分布在多个​​line box​​​中。如果子元素未设置强制换行的情况下，​​inline box​​将不可被分割，将会溢出父元素
  - 触发条件：
    * 块级元素中仅包含内联级别元素。形成条件非常简单，需要注意的是当IFC中有块级元素插入时，会产生两个匿名块将父元素分割开来，产生两个IFC

### GFC(GridLayout Formatting Context)
  - 定义：网格布局格式化上下文，当一个元素设置为display:grid的时候，此元素将获得一个独立的渲染区域，可以在网格容器上定义网格行和列，为每一个网格定义位置和空间。GFC和table的区别在于Grid Layout会有更加丰富的属性来控制行列，控制对齐以及更为精细的渲染
  - 布局规则：
    * 通过在​​网格容器(grid container)​​上定义​​网格定义行(grid definition rows)​​​和​​网格定义列(grid definition columns)​​属性各在网格项目(grid item)上定义网格行(grid row)和网格列(grid column)为每一个网格项目(grid item)定义位置和空间
  - 触发条件：
    * 当为一个元素设置​​display​​​值为​​grid​​​或者​​inline-grid​​的时候，此元素将会获得一个独立的渲染区域

### FFC(Flex Formatting Context)
  - 定义：自适应格式化上下文，display值为flex或者inline-flex的元素将会生成自适应容器。flex box由伸缩容器和伸缩子元素组成。通过设置元素display:flex/inline-flex可以得到伸缩容器，前者为块级元素，后者为行内元素。伸缩容器外元素不受影响
  - 布局规则：
    * 设置为​​flex​​的容器被渲染为一个块级元素
    * 设置为​​inline-flex​​的容器被渲染为一个行内元素
    * 弹性容器中的每一个子元素都是一个弹性项目，弹性项目可以是任意数量的，弹性容器外和弹性项目内的一切元素都不受影响
  - 触发条件：
    * 当​​display​​​值为​​flex​​​或​​inline-flex​​时，将生成弹性容器(Flex Container), 一个弹性容器为其内容建立了一个新的弹性格式化上下文环境(FFC) 
  - 注意：
    * FFC布局中，float、clear、vertical-align属性不会生效  
