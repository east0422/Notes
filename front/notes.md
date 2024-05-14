# note

### new底层原理
  1. 创建一个空对象，作为将要返回的对象实例
  2. 将这个空对象的原型，指向构造函数的prototype属性
  3. 将这个空对象赋值给this，开始执行构造函数内部的代码
  4. 返回这个新的对象。判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。

### this
  1. 普通函数中的this
    * this总是代表它的直接调用者(js的this是执行上下文), 例如obj.func，那么func中的this就是obj。
    * 在默认情况(非严格模式下，未使用 'use strict')，没找到直接调用者，则this指的是window(约定俗成)。
    * 在严格模式下，没有直接调用者的函数中的this是undefined。
    * 使用call、apply、bind(ES5新增)绑定的this指的是绑定的对象。
  2. 箭头函数中的this
    * 箭头函数中没有this绑定，this的值由外层最近的非箭头函数的作用域决定。
    * 箭头函数没有自己的this, 它的this是继承而来; 默认指向在定义它时所处的对象(宿主对象)，而不是执行时的对象, 定义它的时候,可能环境是window; 箭头函数可以让我们在setTimeout，setInterval中方便的使用this。
    * 箭头函数中，this指向的固定化，并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。因此，箭头函数没有自己的this，它的this是继承而来，默认指向在定义它时所处的对象(宿主对象)。
      ```
      function Person() {
          this.name = 'east'
          this.age = 33
          setTimeout(() => {
            // 此时的箭头函数所处的宿主对象是Person，所以this指向的是Person对象
            console.log(this)
            console.log('name:', this.name, ',age:', this.age)
          }, 1000)
      }
      let p = new Person()
      ```
  3. 构造函数中的this，以下为通过new调用构造函数(构造函数中的this根据构造函数返回值的不同指向也不同)
    * 构造函数显式return一个对象类型(数组、函数等)，this指向返回的对象
    * 构造函数显式return一个非对象类型(基础类型)，this指向实例对象
    * 未显式指定return，构造函数会默认返回实例对象，而且this指向这个实例对象
      ```
      // this指向返回的对象
      function Person(name) {
        this.name = name
        return {name: 'other'}
      }
      const p = new Person('east')
      console.log(p.name) // other
      // this指向实例对象
      function Person1(name) {
        this.name = name
        return 3
      }
      const p1 = new Person1('east1')
      console.log(p1.name) // east1
      // this指向实例对象
      function Person2(name) {
        this.name = name
      }
      const p2 = new Person2('east2')
      console.log(p2.name) // east2
      ```
  4. 直接调用构造函数，当做普通函数，this指向全局对象window
    ```
    // this指向全局对象window
    function Person(name) {
      this.name = name
    }
    const p = Person('east')
    console.log('p:', p, ',name:', name, ',winname:', window.name) // p:undefined,name:east,winname:east
    ```
  5. 对象方法中的this，当以对象方法调用函数时this指向调用当前函数的对象
    ```
    // this指向调用当前函数的对象
    function hello() {
      console.log(this.name)
    }
    const person = {
      name: 'east',
      say: hello
    }
    person.say() // east
    ```
  6. getter与setter中的this，this指向调用getter、setter的对象
    ```
    // this指向调用getter、setter的对象
    class Person {
      constructor() {
        this.name = 'east'
      }
      get alias() {
        return this.name
      }
      set alias(alias) {
        this.name = alias
      }
    }
    const p = new Person()
    console.log('name:', p.alias) // name:east
    p.alias = 'west'
    console.log('name:', p.alias) // name:west
    const temp = {name: 'temp'}
    temp.alias = p.alias
    console.log('tempname:', temp.alias) // tempname: west
    temp.alias = 'alias'
    console.log('tempname:', temp.alias, ',pname:', p.alias) // tempname: alias ,pname: west
    ```
  7. 原型链中的this，this指向调用函数的对象
    ```
    // child实例对象的say方法是通过原型链在Parent的原型上找到的，但调用say方法的是child实例对象，所以this指向child输出child
    function Parent() {
      this.name = 'father'
    }
    function Child() {
      this.name = 'child'
    }
    Parent.prototype.say = function() {
      console.log(this.name)
    }
    Child.prototype = new Parent()
    const child = new Child()
    child.say() // child
    ```
  8. 回调函数中的this
  9. bind、call、apply改变this指向
    * bind返回的是一个新的函数，并未立即执行原函数
    * call参数需要一个个列举出来(thisValue, arg1, arg2, ...)，会立即执行原函数
    * apply参数是一个数组(thisValue, [arg1, arg2, ...])，会立即执行原函数
  10. this优先级
    * new绑定优先级比bind绑定高。调用bind返回的新绑定函数，若被当做构造函数，使用new关键字调用，bind对this的绑定会被忽略
    * 箭头函数的优先级比call、apply高
    * 显示绑定：call、apply、bind、new
    * 隐式绑定：根据调用关系确定this指向
    ```
    // let和const声明的变量不会挂载到window全局对象上
    var a = 10
    const say = () => {
      // this 原始指向 window
      console.log(this.a)
    }
    const obj = {
      a: 3
    }
    // 试图用call改变this指向
    say.call(obj) // 10
    // 试图用bind改变thi 的指向
    const bindSay = say.bind(obj)
    bindSay() // 10
    ```
  11. 总结: this的指向是在调用函数时根据执行上下文所动态确定的
    
### 浏览器本地存储
  1. 浏览器的本地存储主要分为Cookie、WebStorage, 其中WebStorage又可以分为localStorage和sessionStorage。
  2. cookie
    * 优点：可配置过期时间(在设置的cookie过期时间之前有效，即使窗口关闭或浏览器关闭)、可跨域共享（具有相同祖先域名时）、与服务器数据交互等。
    * 缺点：
      - 客户端发送请求时，cookie始终在同源的http请求中携带，会作为头部将无用数据一起发送给服务器。
      - 请求被拦截后，cookie数据有泄漏和被篡改的安全风险。
      - cookie存储数据的大小被限制在4K(IE8、Firefox、opera每个域对cookie的数量也有限制，上限是50个，Safari/WebKit没有限制)。
  3. localStorage和sessionStorage
    * sessionStorage仅在当前浏览器窗口关闭之前有效；localstorage数据始终有效，窗口或浏览器关闭也一直保存，除非删除数据。 
    * 优点：
      - 每个域名下可提供5M的存储容量（不同浏览器可能有差异，比如IE是10M）。
      - 以key/value键值对的方式存储字符串，方便数据存取操作。
      - 只存储在客户端本地，不会随请求发送给服务端。
    * 缺点：
      - 只能存入字符串，无法直接存储对象，每次存入和取出都要重新json处理一下，而JSON.stringify()对undefined、function等一些类型无法正常处理并且不能转换循环引用的对象,因此使用时需要注意。
    
### 伪元素巧用
  1. 顶部或底部下划线
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
  2. 三角箭头
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
    
### 微信小程序label组件for属性
  1. label组件使用for属性找到对应的id，或者将控件放在该标签下，当点击时就会触发对应的控件。for优先级高于内部控件，内部有多个控件的时候默认触发第一个控件。目前可以绑定的控件有：button, checkbox, radio, switch, input。
    ```
    <button bindtap="handleTapShareButton" open-type="share" class="button-share" id="share-button"></button>
    <label for="share-button"><image style="width: 27px; height: 27px" src="/image/share.png" /></label>
    ```

### 盒子模型box-sizing
  1. content-box(默认)，标准盒子模型(宽度=设置宽度(content)+border+padding+margin)
    width与height只包括内容的宽和高，不包括边框(border)、内边距(padding)、外边距(margin)。注意：内边距、边框和外边距都在这个盒子的外部。比如 .box {width: 350px; border: 10px solid black; padding: 15px; margin: 18px;}在渲染的实际宽度将是400px(350 + 10*2 + 15*2)
  2. border-box怪异盒子/IE盒子模型(宽度=设置宽度(content+border+padding)+margin)
  width和heigh属性包括内容、内边距和边框，但不包括外边距。比如.box {width: 350px; border: 10px solid black; padding: 15px; margin: 18px;}在渲染的实际宽度将是300px(350 - 10*2 - 15*2)

### 帧渲染过程
  1. 浏览器渲染页面的Renderer进程里，涉及了两个线程，二者之间通过名为Commit的消息保持同步：
      * Main线程：浏览器渲染的主要执行步骤，包含从JS执行到Composite合成的一序列操作。
      * Compositor线程：接受用户的一些交互操作(比如滚动) -> 唤起Main线程进行操作 -> 接收Main线程的操作结果 -> commit给真正把页面draw到屏幕上的GPU进程。  
  2. 浏览器主要执行步骤JavaScript -> Style -> Layout -> Paint -> Composite:
      * JavaScript: 包含与视觉变化效果相关的js操作。包括并不限于：dom更新、元素样式动态改变、jQuery的animate函数等。
      * Style：样式计算。这个过程，浏览器根据css选择器计算哪些元素应该应用哪些规则，然后将样式规则落实到每个元素上去，确定每个元素具体的样式。
      * Layout：布局。在知道对一个元素应用哪些规则之后，浏览器即可开始计算它要占据的空间大小及其在屏幕的位置。
      * Painting：绘制。绘制是填充像素的过程。它涉及绘出文本、颜色、图像、边框和阴影，基本上包括元素的每个可视部分。绘制一般是在多个表面（通常称为层）上完成的。(paint和draw的区别：paint是把内容填充到页面，而draw是把页面反映到屏幕上)。
      * Composite：合成。由于页面的各部分可能被绘制到多层，由此它们需要按正确顺序绘制到屏幕上，以便正确渲染页面。对于与另一元素重叠的元素来说，这点特别重要，因为一个错误可能使一个元素错误地出现在另一个元素的上层。

### 节流与防抖
  1. 节流(throttle): 让函数在指定的时间段内周期性地间断执行。适用于多次提交的场景(如点击按钮提交发送请求)。
  2. 防抖(debounce): 让函数只有在过完一段时间后并且该段时间内不被调用才会被执行。适用于resize，search搜索联想(用户在不断输入值时用防抖来节约请求资源)等场景。
  4. 节流和防抖都是防止某一事件频繁触发。防抖是将多次执行变为只执行一次，节流是将多次执行变为每隔一段时间执行。
     ```
      // 防抖
      const debounce = (fn, wait, immediate) => {
        let timer = null
        return function (...args) { 
          if (timer) clearTimeout(timer)
          if (immediate && !timer) {
            fn.call(this, args)
          }
          timer = setTimeout(() => {fn.call(this, args)}, wait)
        };
      }
      const betterFn = debounce(() => console.log('fn 防抖执行了'), 1000, true)
      document.addEventListener('scroll', betterFn)

      // 节流
      const throttle = (fn, wait) => {
        let pre = 0
        return function(...args) {
          let now = Date.now()
          if(now - pre >= wait) {
            fn.apply(this, args)
            pre = now
          }
        }
      }
      const handle = () => {
        console.log(Math.random())
      }
      window.addEventListener('mousemove', throttle(handle, 1000))
     ```

### 重绘与回流(重排)
  1. 重排也称为回流。当DOM的变化影响了元素的几何信息(DOM对象的位置和尺寸大小)，浏览器需要重新计算元素的几何属性，将其安放在界面中的正确位置，这个过程叫做重排。触发：添加或者删除可见的DOM元素、元素尺寸改变——边距、填充、边框、宽度和高度。
  2. 当一个元素的外观发生改变，但没有改变布局，重新把元素外观绘制出来的过程叫做重绘。触发：改变元素的color、background、box-shadow等属性。
  3. 重排重绘优化建议：
    - 样式表越简单，重排和重绘就越快。尽量用class，少用style一条条改变样式。
    - 重排和重绘的DOM元素层级越高，成本就越高。如果可以灵活用display，absolute，flex等重排开销会比较小，或不会影响其他元素的重排。
    - 使用虚拟DOM的脚本库。

### JSON.parse(JSON.stringfy(X))深拷贝无法正确实现情况
  1. Date对象变为字符串
  2. 正则RegExp、Error对象变为空对象{}
  3. 函数、undefined、Symbol类型属性丢失
  4. NaN、Infinity、-Infinity变为null
  5. enumerable为false(不可枚举)的属性丢失
  6. 循环引用的对象不能正确拷贝
  7. 其中X只能是Number, String, Boolean, Array, 扁平对象, 即那些能够被 
  JSON直接表示的数据结构。