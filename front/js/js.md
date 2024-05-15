# note

### isNaN检测机制
  - 首先验证当前要检测的值是否为数字类型的，如果不是浏览器会默认把值转化为数字类型，把非数字类型的值转换为数字。
    * 其他基本类型转换为数字，直接使用Number方法转换
      ```
      // 字符串转数字
      Number('13') -> 13;
      Number('13.05') -> 13.05;
      Number('13px') -> NaN; // 若当前字符串中出现任意一个非有效数字字符结果则为NaN
      // 布尔转数字
      Number(true) -> 1;
      Number(false) -> 0;
      // 其他
      Number(undefined) -> NaN;
      Number(null) -> 0;
      ```
    * 引用数据类型转换为数字，引用值先调用toString方法转换为字符串，然后再把字符串调取Number转换为数字
      ```
      // 对象
      ({}).toString() -> '[object Object]' -> NaN
      // 数组
      [1, 2].toString() -> '1,2' -> NaN
      [1].toString() -> '1' -> 1
      [].toString() -> '' -> 0
      // 正则
      /^$/.toString() -> '/^$/' -> NaN
      ```  
  - 当前检测的值已经是数字类型，是有效数字返回false，不是返回true(数字类型中只有NaN不是有效数字，其余都是有效数字)。
  - NaN和谁都不相等(包括自己 NaN == NaN -> false)，检查一个变量num存储的值是否为一个有效数字只能使用isNaN(num)

### ==比较
  - 若两边数据类型不一样则先转换为相同类型(数字)再进行比较
  - 对象==对象不一定相等，因为对象操作的时引用地址，地址不相同则不相等`{} == {} -> false;[] == [] -> false`
  - 特殊情况`null == undefiend -> true; null == undefined -> false; [] == true -> false; ![] == true -> false`

### parseInt于parseFloat
  - 与Number类似，同样是为了把其他类型值转换为数字类型，与Number区别的地方在于字符串转换分析上。
  - 从字符串最左侧字符开始查找有效数字字符，并且转换为数字，一旦遇到非有效数字字符查找结束。
    ```
    // Number出现任意非有效数字字符结果就是NaN，parseInt把一个字符串左侧中的整数部分解析出来，pareseFloat把一个字符串左侧小数(浮点数)部分解析出来
    Number('13.5px') -> NaN
    parseInt('13.5px') -> 13
    parseFloat('13.5px') -> 13.5
    parseInt('aa13.5px') -> NaN
    parseFloat('aa13.5px') -> NaN
    ``` 

### form中input设置readonly和disabled区别
  - readonly不可编辑，但可选择和复制，值可传递到后台。
  - disabled不可编辑，不能选择和复制，值也不可以传递到后台。

### new底层原理
  - 创建一个空对象，作为将要返回的对象实例
  - 将这个空对象的原型，指向构造函数的prototype属性
  - 将这个空对象赋值给this，开始执行构造函数内部的代码
  - 返回这个新的对象。判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。

### new操作符具体做什么
  - 创建一个空对象obj即{}。
  - 将obj的__proto__属性指向构造函数constructor的原型即obj.__proto__ == obj.constructor.prototype。
  - 将构造函数constructor内部的this绑定到新建的对象，执行constructor(也就是跟调用普通函数一样，只是此时函数的this为新创建的对象obj而已，就好像执行obj.constructor()一样)。
  - 属性和方法被加入到this引用的对象中。
  - 若构造函数没有返回非原始值(即不是引用类型的值)，则返回该新建的对象obj(默认会添加return this)。否则，返回引用类型的值。

### this
  - 普通函数中的this
    * this总是代表它的直接调用者(js的this是执行上下文), 例如obj.func，那么func中的this就是obj。
    * 在默认情况(非严格模式下，未使用 'use strict')，没找到直接调用者，则this指的是window(约定俗成)。
    * 在严格模式下，没有直接调用者的函数中的this是undefined。
    * 使用call、apply、bind(ES5新增)绑定的this指的是绑定的对象。
  - 箭头函数中的this
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
  - 构造函数中的this，以下为通过new调用构造函数(构造函数中的this根据构造函数返回值的不同指向也不同)
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
  - 直接调用构造函数，当做普通函数，this指向全局对象window
    ```
    // this指向全局对象window
    function Person(name) {
      this.name = name
    }
    const p = Person('east')
    console.log('p:', p, ',name:', name, ',winname:', window.name) // p:undefined,name:east,winname:east
    ```
  - 对象方法中的this，当以对象方法调用函数时this指向调用当前函数的对象
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
  - getter与setter中的this，this指向调用getter、setter的对象
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
  - 原型链中的this，this指向调用函数的对象
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
  - 回调函数中的this
  - bind、call、apply改变this指向
    * bind返回的是一个新的函数，并未立即执行原函数
    * call参数需要一个个列举出来(thisValue, arg1, arg2, ...)，会立即执行原函数
    * apply参数是一个数组(thisValue, [arg1, arg2, ...])，会立即执行原函数
  - this优先级
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
  - 总结: this的指向是在调用函数时根据执行上下文所动态确定的
    
### 浏览器本地存储
  - 浏览器的本地存储主要分为Cookie、WebStorage, 其中WebStorage又可以分为localStorage和sessionStorage。
  - cookie
    * 优点：可配置过期时间(在设置的cookie过期时间之前有效，即使窗口关闭或浏览器关闭)、可跨域共享（具有相同祖先域名时）、与服务器数据交互等。
    * 缺点：
      + 客户端发送请求时，cookie始终在同源的http请求中携带，会作为头部将无用数据一起发送给服务器。
      + 请求被拦截后，cookie数据有泄漏和被篡改的安全风险。
      + cookie存储数据的大小被限制在4K(IE8、Firefox、opera每个域对cookie的数量也有限制，上限是50个，Safari/WebKit没有限制)。
  - localStorage和sessionStorage
    * sessionStorage仅在当前浏览器窗口关闭之前有效；localstorage数据始终有效，窗口或浏览器关闭也一直保存，除非删除数据。 
    * 优点：
      + 每个域名下可提供5M的存储容量（不同浏览器可能有差异，比如IE是10M）。
      + 以key/value键值对的方式存储字符串，方便数据存取操作。
      + 只存储在客户端本地，不会随请求发送给服务端。
    * 缺点：
      + 只能存入字符串，无法直接存储对象，每次存入和取出都要重新json处理一下，而JSON.stringify()对undefined、function等一些类型无法正常处理并且不能转换循环引用的对象,因此使用时需要注意。
    
### 帧渲染过程
  - 浏览器渲染页面的Renderer进程里，涉及了两个线程，二者之间通过名为Commit的消息保持同步：
    * Main线程：浏览器渲染的主要执行步骤，包含从JS执行到Composite合成的一序列操作。
    * Compositor线程：接受用户的一些交互操作(比如滚动) -> 唤起Main线程进行操作 -> 接收Main线程的操作结果 -> commit给真正把页面draw到屏幕上的GPU进程。  
  - 浏览器主要执行步骤JavaScript -> Style -> Layout -> Paint -> Composite:
    * JavaScript: 包含与视觉变化效果相关的js操作。包括并不限于：dom更新、元素样式动态改变、jQuery的animate函数等。
    * Style：样式计算。这个过程，浏览器根据css选择器计算哪些元素应该应用哪些规则，然后将样式规则落实到每个元素上去，确定每个元素具体的样式。
    * Layout：布局。在知道对一个元素应用哪些规则之后，浏览器即可开始计算它要占据的空间大小及其在屏幕的位置。
    * Painting：绘制。绘制是填充像素的过程。它涉及绘出文本、颜色、图像、边框和阴影，基本上包括元素的每个可视部分。绘制一般是在多个表面（通常称为层）上完成的。(paint和draw的区别：paint是把内容填充到页面，而draw是把页面反映到屏幕上)。
    * Composite：合成。由于页面的各部分可能被绘制到多层，由此它们需要按正确顺序绘制到屏幕上，以便正确渲染页面。对于与另一元素重叠的元素来说，这点特别重要，因为一个错误可能使一个元素错误地出现在另一个元素的上层。

### 节流与防抖
  - 节流(throttle): 让函数在指定的时间段内周期性地间断执行。适用于多次提交的场景(如点击按钮提交发送请求)。
  - 防抖(debounce): 让函数只有在过完一段时间后并且该段时间内不被调用才会被执行。适用于resize，search搜索联想(用户在不断输入值时用防抖来节约请求资源)等场景。
  - 节流和防抖都是防止某一事件频繁触发。防抖是将多次执行变为只执行一次，节流是将多次执行变为每隔一段时间执行。
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

### JSON.parse(JSON.stringfy(X))深拷贝无法正确实现情况
  - Date对象变为字符串
  - 正则RegExp、Error对象变为空对象{}
  - 函数、undefined、Symbol类型属性丢失
  - NaN、Infinity、-Infinity变为null
  - enumerable为false(不可枚举)的属性丢失
  - 循环引用的对象不能正确拷贝
  - 其中X只能是Number, String, Boolean, Array, 扁平对象, 即那些能够被JSON直接表示的数据结构。

### DOM
  - 当浏览器加载html页面时首先就是DOM结构的计算，计算出来的DOM结构就是DOM树(把页面中html标签像树状结构一样分析出之间的层级关系)。DOM树描述了标签间的关系(节点间的关系)，只要知道任何一个标签都可以依据DOM中提供的属性和方法获取到页面中任意一个标签或节点。

### 构造函数-扩展
  - var a = {}其实是var a = new Object()的语法糖。
  - var a = []其实是var a = new Array()的语法糖。
  - function foo(){...}其实是var foo = new Function(...)的语法糖。
  - instanceof用于判断引用类型的变量属于哪个构造函数的一个方法(一个函数是否是一个变量的构造函数), f instanceof Foo的判断逻辑是f的__proto__一层一层往上能否对应到Foo.prototype。

### 原型规则
  - 所有的引用类型(数组，对象，函数)都具有对象特性，即可以自由扩展属性(null除外)。
  - 所有的引用类型(数组，对象，函数)都有一个__proto__属性(隐式原型)，属性值是一个普通的对象。
  - 所有的函数对象(Function)都有一个prototype属性(显式原型)，属性值也是一个普通对象，并且只有函数对象有prototype属性，因为prototype本身就是定义在Function对象下的属性。当我们输入类似var person1 = new Person(...)来构造对象时，JavaScript实际上参考的是Person.prototype指向的对象来生成person1。另一方面，Person()函数是Person.prototype的构造函数，也就是说Person===Person.prototype.constructor // true。prototype是从一个函数指向一个对象，它的含义是函数的原型对象，也就是这个函数(其实所有函数都可以作为构造函数)所创建的实例的原型对象。
  - 所有的引用类型(数组，对象，函数)__proto__属性(隐式原型)值指向它的构造函数的prototype属性值(显式原型)。
   `var obj = {}; obj.__proto__ === Object.prototype; // true`
  - 当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的__proto__(即它的构造函数的prototype)中寻找。
  - js为了避免死循环将Object.prototype的__proto__设为null。`Object.prototype.__proto__ === null // true`
  - __proto__和constructor属性是对象所独有的，prototype属性是函数所独有的，由于js中函数也是一种对象，所以函数也拥有__proto__和constructor属性。constructor是从一个对象指向一个函数，含义就是指向该对象的构造函数，每个对象都有构造函数(本身拥有或继承而来，继承而来的要结合__proto__属性查看会更清楚点)。Function对象比较特殊，它的构造函数就是它自己(因为Function可以看成是一个函数，也可以是一个对象)，所有函数和对象最终都是由Function构造函数得来，所以constructor属性的终点就是Function这个函数。
  - 每个对象都可以找到其对应的constructor，因为创建对象的前提是需要有constructor，而这个constructor可能是对象自己本身显示定义的或通过__proto__在原型链中找到的。而单从constructor这个属性来讲，只有prototype对象才有。每个函数在创建时js会同时创建一个该函数对应的prototype对象，而函数创建的对象.__proto__ === 该函数.prototype，该函数.prototype.constructor === 该函数本身，所以通过函数创建的对象即使自己没有constructor属性，它也能通过__proto__找到对应的constructor，所以任何对象最终都可以找到其构造函数。

### js原型链
  - 对象本质是一个hash表(存储键值对的表格);js内存分为代码区和数据区，数据区又分为stack栈内存和heap堆内存;js拥有全局作用域(window)、函数作用域、块级作用域(es6);当查找一个变量时，如果当前作用域没找到该变量，代码会继续往上一个作用域查找(可以理解为更大的大括号)，直到最外层的全局作用域为止，这就是所谓的作用域链。
  - js的原型是通过函数的prototype属性来实现的，每一个函数都有一个隐藏属性prototype，普通对象是没有prototype属性的(比如：let a = {})。prototype属性的作用就是让该函数所实例化的对象们都可以找到公用的属性和方法，即person.__proto__ === Person.prototype。原型链是通过另一个隐藏属性[[prototype]]或叫__proto__来实现的，每一个对象都有这个隐藏属性。
    ```
    Object.prototype.objCustom = function() {}; 
    Object.prototype.arrCustom = 123
    Array.prototype.arrCustom = 456;
    function a() {
      let arr = [3, 5, 7];
      arr.foo = 'hello';
      console.log(arr.objCustom, arr.arrCustom, arr)
    }
    a() // [Function] 456 [ 3, 5, 7, foo: 'hello' ]
    // 解析: 首先在函数作用域中查找arr变量是存在的，接着找arr是否存在objCustom和arrCustom两个属性，变量arr本身是没有这两个属性，但是它是一个Array类型的变量，于是它通过原型链proto找到Array.prototype，Array.prototype存在arrCustom找到后不会继续查找该属性。objCustom属性在Array.prototype中也不存在，但是Array.prototype也是一个对象，里面也存在一个proto，所以继续查找，找到了最顶层的Object.prototype，此时找到了objCustom属性，若没找到则输出undefined。这个查找对象属性的过程就是原型链，通过proto实现。
    ```
  - 当访问一个对象的属性时，若该对象内部不存在这个属性，那么就会去它的__proto__属性所指向的那个对象(父对象)里找，一直找直到__proto__属性的终点null，再往上找就相当于在null上取值会报错，以上这种通过__proto__属性将对象连接起来的这条链路即为所谓的原型链。   
  - 找变量会涉及到作用域链；找对象属性涉及的是原型链。
   
### js内部运行机制
  - 当浏览器(它的内核/引擎)渲染和解析js的时候会提供一个供js代码运行的环境，我们把这个环境称为'全局作用域'。
  - 代码自上而下执行。
    * 基本数据类型的值会存储在当前作用域下。基本数据类型(值类型)是按照值来操作的，把原有的值复制一份放到新的空间或位置上和原来的值没有关系。
      ```
      // var a = 1;
      // 1. 首先开辟一个空间存储1
      // 2. 在当前作用域中声明一个变量a
      // 3. 让声明的变量和存储的1进行关联(把存储的1赋值给a，该赋值操作叫做定义)
      ``` 
    * 引用数据类型的值不能直接存储到当前的作用域下(因为可能存储的内容过于复杂)，我们需要先开辟一个新的空间(理解为仓库)，把内容存储到这个空间中。引用类型不是按值来操作，它操作的是空间的引用地址，把原来空间的地址赋值给新的变量，但是原来的空间没有被克隆，还是一个空间，这样就会出现多个变量关联的是相同的空间，相互间存在影响。
      ```
      // var obj = {a: 100};
      // 1. 首先开辟一个新的内存空间，把对象中的键值对依次存储起来(为了保证后面可以找到这个空间，此空间有一个16进制的地址)
      // 2. 声明一个变量
      // 3. 让变量和空间地址关联在一起(把空间地址赋值给变量)
      ``` 
  - 栈内存本身就是一个供js代码执行的环境，所有基本类型值都会直接在栈内存中开辟一个位置进行存储；堆内存独立于栈内存，用来存储引用类型中的信息值，对象存储的是键值对，函数存储的是代码字符串。

### 闭包
  - 定义和用法
    * 闭包指的是一个函数可以访问另一个函数作用域中变量。常见的闭包是在一个函数内部定义另外一个函数，内部函数可以引用外层的变量，外层变量不会被垃圾回收机制回收。当一个函数的返回值是另外一个函数，而返回的那个函数调用了其父函数内部的其它变量，若返回的这个函数在外部被执行就产生了闭包。
    * 当内部函数在定义它的作用域的外部被引用(使用)时，就创建了该内部函数的闭包，如果内部函数引用了位于父级函数的变量或其他数据时，当父级函数调用完毕后这些变量数据在内存中不会被GC释放，因为它们被一直饮用着，否则两者没有交互就不会长久存在于内存中，所以在Chrome中debug找不到闭包。
    * 通过调用闭包的内部函数获取到闭包的成员变量，在闭包中返回该函数，在外部接收该函数并执行就能获取闭包的成员变量。原因时因为词法作用域，也就是函数的作用域是其声明的作用域而不是执行调用时的作用域。
  - 实例如下：
    ```
    // 依据作用域的规则，底层作用域没有声明的变量会向上一级找，找到就返回没找到就一直找直到window的变量，没有就返回undefined。
    var count = 10; // 全局作用域，标记为flag1
    function add() {
      var count = 0; // 函数全局作用域，标记为flag2
      return function() {
        count+=1; // 函数内部作用域
        console.log('count:', count);
      }
    }
    var s = add();
    s(); // 1
    s(); // 2
    ```
  - 变量的作用域(全局变量和局部变量)
    * 函数内部可以读取函数外部的全局变量；在函数外部无法读取函数内的局部变量。
    * 函数内部声明变量的时候一定要使用var，如果不使用的话实际上声明了一个全局变量
  - 注意点：
    * 滥用闭包会造成内存泄漏，由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，可能会造成网页的性能问题，解决方法是在退出函数之前将不使用的局部变量全部删除。
    * 会改变父函数内部变量的值，所以若把父函数当作对象使用，把闭包当作它的公用方法，把内部变量当作它的私有属性，这时一定要小心不要随便改变父函数内部变量的值。
    * 一个闭包内对变量的修改不会影响到另外一个闭包中的变量。
    * 闭包的原理是作用域链，所以闭包访问的上级作用域中的变量是个对象，其值为其运算结束后的最后一个值。

### 内存泄漏
  - 定义：内存泄漏是指一块被分配的内存既不能使用又不能回收，直到浏览器进程结束。浏览器中也是采用自动垃圾回收方法管理内存但浏览器垃圾回收方法有bug会产生内存泄漏。
  - 内存泄漏常见情况：
    * 页面中元素被移除或替换时，若元素绑定的事件仍没被移除，此时需要先手工移除事件，不然会存在内存泄漏。
    * 函数内定义函数，并且内部函数事件回调引用外部变量形成了闭包，闭包可维持函数内局部变量，使其得不到释放。

###