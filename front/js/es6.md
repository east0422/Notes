# 《Understanding ECMAScript6》

## 块级绑定
  1. var声明与变量提升：使用var关键字声明的变量，无论其实际声明位置在何处，都会被视为声明于所在函数的顶部(如果声明不在任意函数内，则视为在全局作用域的顶部)，声明被提升到了函数顶部而初始化操作则保留在原处。
  2. let声明：会将变量的作用域限制在当前代码块(一对花括号包裹的)。let声明不会被提升，若想让变量在整个代码块内部可用需要手动将let声明放置到代码块顶部。let声明在代码块内部不能重复定义一个标识符。
  3. const声明：常量，值在被设置完成后就不允许再被更改，所有的const变量都需要在声明时进行初始化，否则报错。和let声明一样也是块级声明。

## 字符串与正则表达式
  1. 正则表达式u标志：正则表达式假定单个字符使用一个16位的码元来表示。ES6 为正则表达式定义了用于处理Unicode的u标志。当一个正则表达式设置了u标志时，它的工作模式将切换到针对字符而非码元，这意味着正则表达式将不会被字符串中的代理对所混淆，而是会按预期工作。
      ```
      var text = "𠮷"; // 日文字符
      console.log(text.length); // 2
      // 不使用u标志时，该正则表达式只匹配码元，不能匹配由两个码元表示的这个日文字符
      console.log(/^.$/.test(text)); // false
      // 启用u标志后，正则表达式就会比较字符而不是码元，因此能匹配这个日文字符
      console.log(/^.$/u.test(text)); // true 
      ```
  2. 识别子字符串方法：indexOf在字符串内识别子字符串。ES6包含了以下三个方法
    * includes()方法：默认从起始位置开始匹配，若提供第二参数索引值则从该索引位置开始匹配。
    * startsWith()方法：默认从起始位置开始匹配，若提供第二参数索引值则从该索引位置开始匹配。
    * endsWith()方法: 默认从尾部位置(长度减去需搜索文本的长度)开始匹配，若提供第二参数索引值则将该索引位置减去第一个参数(需搜索文本)的长度计算出的开始匹配的位置。查找过程实际上是正向而非逆向的。
   
## 函数
  1. 剩余参数：由三个点(...)与一个紧跟着的具名参数指定，它是包含传递给函数的其余参数的一个数组。一个函数只能有一个剩余参数，并且它必须被放到最后。剩余参数不能在对象字面量的setter属性中使用。
  2. 函数构造器的增强：Function 构造器允许你动态创建一个新函数，但在 JS 中并不常用。传给该构造器的参数都是字符串，它们就是目标函数的参数与函数体。
      ```
      var add = new Function("first", "second = first", "return first + second");
      console.log(add(15, 21)); // 36
      console.log(add(10)); // 20
      var pickFirst = new Function("...args", "return args[0]");
      console.log(pickFirst(1, 2)); // 1
      ```
  3. 扩展运算符: 扩展运算符允许将一个数组分割，并将各个项作为分离的参数传给函数。
      ```
      let values = [25, 50, 75, 100]
      Math.max.apply(Math, values) // 100
      Math.max(...values) // 100
      Math.max(...values, 150) // 150
      ```
  4. 箭头函数：
    * 没有this、super、arguments，也没有new.target绑定：this、super、arguments、以及函数内部的new.target的值由外层最近的非箭头函数来决定。
    * 不能使用new去调用：箭头函数没有[[Construct]]方法，因此不能被用为构造函数，使用new调用箭头函数会抛出错误。
    * 没有原型：既然不能对箭头函数使用new，那么它也不需要原型，也就是没有prototype属性。
    * 不能更改this：this的值在函数内部不能被修改，在函数的整个生命周期内其值会保持不变。
    * 没有arguments对象：箭头函数没有arguments绑定，你必须依赖于具名参数或剩余参数来访问函数的参数。
    * 不允许重复的具名参数：箭头函数不允许拥有重复的具名参数，无论是否在严格模式下；而相对来说，传统函数只有在严格模式下才禁止这种重复。 

## 扩展的对象功能
  1. Object.is()方法：此方法接收两个参数，并会在二者类型相同且值也相等时返回true。
      ```
      // 绝大多数情况下，Object.is()的结果与===运算符是相同的，仅有的例外是：它会认为+0与-0不相等，而且NaN等于NaN。没必要停止使用严格相等运算符(===)，选择Object.is()还是选择==或===取决于代码的实际需求
      +0 == -0 // true
      +0 === -0 // true
      Object.is(+0, -0) // false
      NaN == NaN // false
      NaN === NaN // false
      isNaN(NaN) // true
      Object.is(NaN, NaN) // true
      5 == '5' // true
      5 === '5' // false
      Object.is(5, '5') // false
      ```
  2. Object.assign()方法：接受任意数量的源对象，而接收对象会按照源对象在参数中的顺序来依次接收它们的属性(后面源对象的属性会覆盖前面重名属性)。
  3. 自有属性的枚举顺序：ES6严格定义了对象自有属性在被枚举时的返回顺序。这影响了Object.getOwnPropertyNames()与Reflect.ownKeys返回属性的方式，也同样影响了Object.assign()处理属性的顺序。
      ```
      自有属性枚举时基本顺序如下：
      1. 所有的数字类型键，按升序排列。
      2. 所有的字符串类型键，按被添加到对象的顺序排列。
      3. 所有的符号类型键，也按添加顺序排列。
      var obj = {a: 1, 0: 1, c: 1, 2: 1, b: 1, 1: 1};
      obj.d = 1;
      console.log(Object.getOwnPropertyNames(obj).join("")); // 012acbd
      console.log(Reflect.ownKeys(obj).join("")); // 012acbd
    ```
  4. 原型：一般来说，对象的原型会在通过构造器或Object.create()方法创建对象时被指定。对象原型的实际值被存储在一个内部属性__proto__上，Object.getPrototypeOf()方法会返回此属性存储的值，而Object.setPrototypeOf()方法则能够修改该值。
    ```
    1. 修改对象的原型：ES6允许通过Object.setPrototypeOf()方法修改任意指定对象的原型，它接收两个参数：需要被修改原型的对象以及将会成为前者原型的对象。
    let person = {hello() {return 'hello';}};
    let dog = {hello() {return 'woof';}};
    let p1 = Object.create(person); // 原型为person
    console.log(p1.hello()); // hello
    console.log(Object.getPrototypeOf(p1) === person); // true
    console.log(Object.is(Object.getPrototypeOf(p1), person)); // true
    console.log(p1.__proto__ === person); // true
    Object.setPrototypeOf(p1, dog); // 将原型修改为dog
    console.log(p1.hello()); // woof
    console.log(Object.getPrototypeOf(p1) === dog); // true
    console.log(Object.is(Object.getPrototypeOf(p1), dog)); // true
    console.log(p1.__proto__ === dog); // true
    p1.__proto__ = person; // 将原型修改为person
    console.log(p1.hello()); // hello
    console.log(Object.getPrototypeOf(p1) === person); // true

    2. 使用super引用的简单原型访问：调用原型上的方法时要使用Object.getPrototypeOf()与.call(this)有点复杂(Object.getPrototypeOf(this).xxx.call(this))，因此ES6引入了super，super引用能更轻易地在对象原型上进行功能调用。super是指向当前对象的原型的一个指针，实际上就是Object.getPrototypeOf(this)的值。
   ```
   
## 解构：更方便的数据访问
  1. 对象解构：在赋值语句的左侧使用了对象字面量。
      ```
      let obj = {name: 'zhangsan', age: 18};
      let {name, age} = obj; // name与age标识符既声明了本地变量也读取了对象的相应属性值
      console.log('name:', name, ', age:', age); // name: zhangsan, age: 18
      // 当使用解构配合var、let或const来声明变量时必须提供初始化器(即等号右边的值)，否则会因为缺失初始化器而抛出错误：
      var {name, age}; // 语法错误
      let {name, age}; // 语法错误
      const {name, age}; // 语法错误
      ```
    - 解构赋值：可以在赋值的时候使用解构，有时或许会在变量声明之后再更改它们的值。
          ```
          let obj = {name: 'zhangsan', age: 18};
          let name = 'lisi';
          let age = 30;
          // 必须用圆括号包裹解构赋值语句，暴露的花括号会被解析为代码块语句而块语句不允许在赋值操作符(即等号)左侧出现。圆括号标识了内部的花括号并不是块语句、而应该被解释为表达式从而完成赋值操作。
          ({name, age} = obj); // 使用解构来分配不同的值
          console.log('name:', name, ',age:', age); // name: zhangsan, age: 18
          // 解构赋值表达式的值为表达式右侧(在=之后)的值，也就是说在任何需要使用值的位置，都可以使用解构赋值表达式
          console.log(({name, age} = obj) === obj); // true
          // 当解构赋值表达式的右侧(=后面的表达式)的计算结果为null或undefined时，会抛出错误(任何读取null或undefined的属性的企图都会导致'运行时'错误runtime error)。
          ```
    - 默认值：使用解构赋值语句时，若所指定的本地变量在对象中没有找到同名属性，那么该变量会被赋值为undefined。可以选择性地定义一个默认值，以便在指定属性不存在时使用该值(在属性名后面添加一个等号并指定默认值)。指定默认值只有在对象对应属性缺失或对应属性值为undefined时该默认值才会被使用。
          ```
          let obj = {name: 'zhangsan', age: 18};
          let {name, age, sex} = obj; 
          console.log(sex); // undefined
          let {name, age, sex = 'F'} = obj; 
          console.log(sex); // F
          ```
    - 赋值给非同名本地变量：ES6有一个扩展语法允许在给本地变量赋值时使用一个不同的名称。
          ```
          let obj = {name: 'zhangsan', age: 18};
          // name: name1语法表示欲读取名为name的属性并将它的值存储在变量name1上
          let {name: name1, age: age1} = obj;
          console.log(name1, age1); // zhangsan 18
          // 也可以给变量别名添加默认值，在本地变量名称后添加等号与默认值
          let {name: name1, age: age1, sex: sex1='F'} = obj;
          console.log(name1, age1, sex1); // zhangsan 18 F
          ```
    - 嵌套的对象解构：使用类似于对象字面量的语法，也可以深入到嵌套的对象解构中去提取所需数据。
          ```
          let circle = {
              name: 'circle',
              loc: {
                  center: {x: 10, y: 50},
                  size: { radius: 100}
              },
              style: {color: 'red', width: 20}
          }
          let {loc: {center: lCenter}, style} = circle
          console.log(lCenter, style) // { x: 10, y: 50 } { color: 'red', width: 20 }
          ```
  2. 数组解构：数组解构时，解构作用在数组内部的位置上而不是作用在对象的属性名上。
      ```
      let colors = ['red', 'green', 'blue'];
      let [firstColor, secondColor] = colors;
      // thirdColor前面的逗号是为了数组前面的项提供的占位符
      let [,,thirdColor] = colors;
      console.log(firstColor, secondColor, thirdColor); // red green blue
      ```
      - 解构赋值：可以在赋值表达式中使用数组解构，但与对象解构不同，不必将表达式包含在圆括号内。
          ```
          let colors = ['red', 'green', 'blue'];
          let firstColor = 'black';
          let secondColor = 'white';
          console.log(firstColor, secondColor); // black white
          [firstColor, secondColor] = colors;
          console.log(firstColor, secondColor); // red green
          // 互换变量值，赋值语句左侧(即等号之前)的解构模式如同其他数组解构的范例，右侧则是为了互换而临时创建的数组字面量。firstColor与secondColor的值分别被复制到临时数组的第一个与第二个位置，对该数组进行解构，于是两个变量就互换了它们的值。
          [firstColor, secondColor] = [secondColor, firstColor];
          console.log(firstColor, secondColor); // green red
          ``` 
      - 默认值：允许在数组任意位置指定默认值，当指定位置的项不存在或其值为undefined则该默认值就会被使用。
          ```
          let colors = ['red'];
          let [firstColor, secondColor = 'blue'] = colors;
          console.log(firstColor, secondColor); // red blue
          ```
      - 嵌套解构：在整个解构模式中插入另一个数组模式，解构操作就会下探到嵌套的数组中。
          ```
          let colors = ['red', ['lightred', 'lightgreen', 'lightblue'], 'green', 'blue'];
          let [firstColor, [, secondColor], , , defaultColor = 'white'] = colors;
          console.log(firstColor, secondColor, defaultColor); // red lightgreen white
          ```
      - 剩余项：数组解构使用...语法来将剩余的项目赋值给一个指定的变量，剩余项必须是数组解构模式中最后的部分，之后不能再有逗号，否则就会有语法错误。
          ```
          let colors = ['red', 'green', 'blue'];
          let [firstColor, ...restColors] = colors;
          console.log(restColors); // [ 'green', 'blue' ]
          // 克隆数组
          let [...cloneColors] = colors;
          console.log(cloneColors); // [ 'red', 'green', 'blue' ]
          ```
  3. 混合解构：对象与数组解构能被组合使用，以创建更复杂的解构表达式。在对象与数组混合而成的结构中，能在其中准确提取所需的信息片段。
      ```
      let concentricCircle = {
          name: 'concentricCircle',
          center: {x: 100, y: 200},
          bgColor: 'white',
          circles: [
              {color: 'red', radius: 100},
              {color: 'green', radius: 150},
              {color: 'blue', radius: 180}
          ]
      }
      let { center: {x:cx, y:cy}, bgColor, color='black', circles: [firstCircle, ...restCircle]} = concentricCircle;
      console.log(cx, cy, bgColor, color, firstCircle, restCircle); // 100 200 white black { color: 'red', radius: 100 } [ { color: 'green', radius: 150 }, { color: 'blue', radius: 180 } ]
      ```
  4. 参数解构：在传递函数参数是，当js函数接收大量可选参数时，一种常用模式是创建一个包含附加参数的options对象。
    ```
    // options当做是第三个参数
    function setCookie(key, value, options) {}
    setCookie('token', 'eeaiii', {secure: true, expires: 60000})
    // 更清楚标明函数期望输入的替代方案，使用对象或数组解构的模式替代了具名参数
    function setCookie(key, value, {secure, path, domain, expires}) {}
    setCookie('token', 'eeaiii', {secure: true, expires: 60000})
    ```
   - 解构参数不可缺失：解构参数在未传递值的情况下会被设为undefined，类似于常规参数。默认情况下，调用函数时未给参数解构传值会抛出错误。
        ```
        function setCookie(key, value, {secure, path, domain, expires}) {}
        // 最后一个参数缺失了，它的值就变成了undefined，从undefined中获取对应属性就会报错
        setCookie('token', 'eeaiii') // 报错
        ```
   - 参数解构的默认值：可以为参数解构提供可解构的默认值。
        ```
        // 给解构的参数提供一个空对象作为默认值，若未传递第三个参数则secure等属性值全都会是undefined，此时不会有错误被抛出
        function setCookie(key, value, {secure, path, domain, expires} = {}) {}
        // 还可以给每个属性值设置默认值，不过当传入参数值为null时还是会引发程序异常。
        // 只有null和undefined是无法被解构的，而传入undefined会触发默认参数的使用条件从而避免了异常；但null既不会触发默认参数也不能被解构从而导致异常。
        function setCookie(key, value, {secure = false, path = '/', domain = 'xxx.com', expires = new Date(Date.now() + 360000000)} = {}) {}
        ```

## 符号与符号属性
  1. 创建符号值：符号没有字面量形式，这在js的基本类型中是独一无二的，有别于布尔类型的true或数值类型的42等，可以使用全局Symbol函数来创建一个符号值。符号的描述信息被存储在内部属性[[Description]]中，当符号的toString()方法被显式或隐式调用时，该属性都会被读取，此外没有任何办法可以从代码中直接访问[[Description]]属性。符号是基本类型的值，可以使用typeof运算符来判断一个变量是否为符号(es6扩充了typeof功能以便让它能返回'symbol')。
      ```
      // 创建一个符号类型的firstName变量
      let firstName = Symbol();
      let person = {};
      // 将符号变量作为person对象的一个属性，每次访问该属性都要使用这个符号值
      person[firstName] = 'li';
      console.log(person[firstName], person); // li { [Symbol()]: 'li' }
      // 符号值是基本类型的值，因此调用new Symbol()将会报错
      ```
  2. 使用符号值：可以在任意能使用'可计算属性名'的场合使用符号。符号除了方括号使用外，在对象的'可计算字面量属性名'中也能使用符号，还能在Object.defineProperty()或Object.defineProperties()调用中使用。
      ```
      let firstName = Symbol('first name');
      let person = {[firstName]: 'li'}; // 使用一个可计算字面量属性
      Object.defineProperty(person, firstName, {writable: false}); // 让该属性变为只读
      let secondName = Symbol('second name');
      let thirdName = Symbol('third name')
      Object.defineProperties(person, {
          [secondName]: {value: 'second', writable: false},
          [thirdName]: {value: 'third', writable: false, enumerable: true}
      });
      console.log(person[firstName], person[secondName], person[thirdName], person); // li second third { [Symbol(first name)]: 'li', [Symbol(third name)]: 'third' }
      ```
  3. 共享符号值：在不同的代码段(如不同的对象类型)中使用相同的符号值，用于表示一个唯一的标识符，跨域文件或代码来追踪符号值既困难又易错，为此ES6提供了'全局符号注册表'供你随时访问。创建共享符号值应使用Symbol.for()方法而不是Symbol()方法，Symbol.for()方法仅接受字符串类型的单个参数，作为目标符号值标识符，此参数同时也会成为该符号的描述信息。Symbol.for()首先会搜索全局符号注册表，看是否存在一个键值为参数值的符号值，若存在该方法会返回这个已存在的符号值，否则会创建一个新的符号值，并使用该键值将其记录到全局符号注册表中然后返回这个新的符号值。此后使用同一个键值取调用Symbol.for()方法都会返回同一个符号值。
      ```
      // 全局符号注册表类似于全部作用域，是一个共享环境
      // 第一次调用Symbol.for()未从全局符号注册表中检索到则创建该符号值
      let u1 = Symbol.for('uid')
      // 第二次调用检索到了
      let u2 = Symbol.for('uid')
      let u3 = Symbol('uid')
      let obj = {[u1]: '12345'}
      console.log(u1 === u2, u1 === u3) // true false
      console.log(obj[u1], obj[u2], obj[u3], u1, u2, u3) // 12345 12345 undefined Symbol(uid) Symbol(uid) Symbol(uid)
      // Symbol.keyFor()在全局符号注册表中根据符号值检索出对应的键值
      console.log(Symbol.keyFor(u1), Symbol.keyFor(u2), Symbol.keyFor(u3)) // uid uid undefined
      ```
  4. 符号值的转换：其他类型缺乏与符号值的合理等价，尤其是符号值无法被转换为字符串值或数值。因此将符号作为属性所达成的效果是其他类型所无法替代的。
      ```
      // console.log()自动调用了符号的String()方法来产生输出
      let u1 = Symbol.for('uid')
      // String()方法调用了xxx.toString()来获取符号的字符串描述信息。
      let desc = String(u1)
      console.log(u1, desc, u1 === desc, u1.toString() === desc) // Symbol(uid) Symbol(uid) false true
      // 将符号与字符串直接拼接会引发错误，将符号与字符串相连接会首先要求把符号转换为一个字符串，而这会引发错误，从而中止了转换行为。
      // let u2 = u1 + '' // TypeError: Cannot convert a Symbol value to a string
      // 类似也不能将符号转换为数值，对符号使用所有数学运算符都会引发错误
      // let u3 = u1 * 1 // TypeError: Cannot convert a Symbol value to a number
      // 符号值在逻辑运算中被认为等价于true，所以对符号使用逻辑运算符不会报错
      let u4 = u1 ? 1 : 0
      console.log(u4) // 1
      ```
  5. 检索符号属性：Object.keys()与Object.getOwnPropertyNames()方法可以检索对象的所有属性名称，前者返回所有的可枚举属性名称，而后者的返回值则不会顾虑属性是否可枚举。但二者都不能返回符号类型的属性。ES6新增了Object.getOwnPropertySymbols()方法以便检索对象的符号类型属性，符号属性默认是可枚举的。
      ```
      let u1 = Symbol.for('uid')
      let obj = {[u1]: '12345'}
      // getOwnPropertySymbols()返回一个数组，包含了对象自有属性名中的符号值
      let symbols = Object.getOwnPropertySymbols(obj)
      console.log(symbols, obj[symbols[0]]) // [ Symbol(uid) ] 12345
      let descriptor = Object.getOwnPropertyDescriptor(obj, u1)
      console.log(descriptor) // { value: '12345', writable: true, enumerable: true, configurable: true}
      let descriptors = Object.getOwnPropertyDescriptors(obj)
      console.log(descriptors) // {[Symbol(uid)]: { value: '12345', writable: true, enumerable: true, configurable: true}}
      ```
  6. 使用知名符号暴露内部方法：所有对象起初都不包含任何自有符号类型属性，但对象可以从它们的原型上继承符号类型属性。ES6预定义了一些此类属性，它们被称为'知名符号'。每一个知名符号都对应全局Symbol对象的一个属性(例如Symbol.create)。
      - Symbol.hasInstance：Symbol.hasInstance属性自身是不可写入、不可配置、不可枚举的，从而保证它不会被错误重写。每个函数都具有一个Symbol.hasInstance方法，用于判断指定对象是否为本函数的一个实例。这个方法定义在Function.prototype上，因此所有函数都继承了面对instanceof运算符时的默认行为。Symbol.hasInstance方法只接受单个参数，即需要检测的值，若该值是本函数的一个实例则方法会返回true。
          ```
          // obj instanceof Array;等价于Array[Symbol.hasInstance](obj);
          let obj = []
          console.log(obj instanceof Array) // true
          console.log(Array[Symbol.hasInstance](obj)) // true
          // ES6本质上将instanceof运算符重定义为上述方法调用的简写语法，这样使用instanceof便会触发一次方法调用(实际上允许你改变该运算符的工作方式)。
          function MyFunc() {}
          let func1 = new MyFunc()
          console.log(func1 instanceof MyFunc) // true
          console.log(MyFunc instanceof Function) // true
          console.log(func1 instanceof Function) // false
          console.log(MyFunc[Symbol.hasInstance](func1)) // true
          console.log(Function[Symbol.hasInstance](MyFunc)) // true
          console.log(Function[Symbol.hasInstance](func1)) // false
          // 使得任意对象都不会被判断为该函数的一个实例可以采用硬编码的方式让该函数的Symbol.hasInstance方法始终返回false
          Object.defineProperty(MyFunc, Symbol.hasInstance, {value: function(v) {return false}})
          console.log(func1 instanceof MyFunc) // false
          console.log(MyFunc instanceof Function) // true
          console.log(func1 instanceof Function) // false
          console.log(MyFunc[Symbol.hasInstance](func1)) // false
          console.log(Function[Symbol.hasInstance](MyFunc)) // true
          console.log(Function[Symbol.hasInstance](func1)) // false
          // 也可以基于任意条件来判断一个值是否为实例
          function SpecialNumber() {}
          // 重写了Symbol.hasInstance方法，在目标对象是数值对象的实例、并且其值介于1到100之间时返回true
          Object.defineProperty(SpecialNumber, Symbol.hasInstance, {
              value: function(v) {
                  return (v instanceof Number) && (v >=1 && v <= 100)
              }
          })
          let zero = new Number(0)
          let one = new Number(1)
          console.log(zero instanceof SpecialNumber)  // false
          console.log(one instanceof SpecialNumber) // true
          ```
      - Symbol.isConcatSpreadable：是一个布尔类型的属性，它表示目标对象拥有长度属性与数值类型的键、并且数值类型键所对应的属性值在参与concat() 调用时需要被分离为个体。该符号与其他的知名符号不同，默认情况下并不会作为任意常规对象的属性。它只出现在特定类型的对象上，用来标示该对象在作为concat()参数时应如何工作，从而有效改变该对象的默认行为。你可以用它来定义任意类型的对象，让该对象在参与concat()调用时能与数组类似。
          ```
          let colors1 = ['red', 'green']
          // concat()方法可以接受非数组的参数，此时这些参数只会直接被添加到数组中
          let colors2 = colors1.concat('white', ['blue', 'black'], 'brown')
          console.log(colors2) // [ 'red', 'green', 'white', 'blue', 'black', 'brown' ]
          // 是否有length和Symbol.isConcatSpreadable属性及不同值结果也不一样。colors对象的特征类似于数组：拥有长度属性及两个数值类型的键，并且Symbol.isConcatSpreadable属性值被设为true，用于指示该对象在被添加到数组时应该使用分离的属性值，若设为false则会当做一个整体不会被分离。
          let colors = {
              0: 'red',
              1: 'green',
              length: 2,
              [Symbol.isConcatSpreadable]: true
          }
          // 当colors对象被传递给concat()方法是，red和green被分离为独立的项，并跟在white之后
          let colorArr = ['white'].concat(colors)
          console.log(colorArr.length)    // 3
          console.log(colorArr)   // [ 'white', 'red', 'green' ]
          ```
      - Symbol.match、Symbol.replace、Symbol.search与Symbol.split：这些符号属性被定义在RegExp.prototype上作为默认实现，以供对应的字符串方法使用。在对象上定义这些属性，允许你创建不使用正则表达式却能进行模式匹配的对象，并且允许在任何方法中替代正则表达式。
          ```
          // Symbol.match：接受一个字符串参数，并返回一个包含匹配结果的数组；若匹配失败，则返回null。
          // Symbol.replace：接受一个字符串参数与一个替换用的字符串，并返回替换后的结果字符串。
          // Symbol.search：接受一个字符串参数，并返回匹配结果的数值索引；若匹配失败，则返回-1。
          // Symbol.split：接受一个字符串参数，并返回一个用匹配值分割而成的字符串数组。
          // hasLenOf10模拟正则表达式的工作方式，在字符串长度恰好为10时起作用。尽管hasLenOf10对象不是正则表达式但它仍然作为参数传递给这些字符串方法，并能够正常工作。
          let hasLenOf10 = { // 有效等价于 /^.{10}$/
              [Symbol.match]: function(value) {
                  return value.length === 10 ? [value] : null
              },
              [Symbol.replace]: function(value, replacement) {
                  return value.length === 10 ? replacement : value
              },
              [Symbol.search]: function(value) {
                  return value.length === 10 ? 0 : -1
              },
              [Symbol.split]: function(value) {
                  return value.length === 10 ? ['', ''] : [value]
              }
          }
          let msg1 = 'Hello world'   // len 11
          let msg2 = 'Hello john'    // len 10
          let match1 = msg1.match(hasLenOf10)
          let match2 = msg2.match(hasLenOf10)
          console.log(match1, ' - ', match2) // null  -  [ 'Hello john' ]
          let replace1 = msg1.replace(hasLenOf10, 'Howdy!')
          let replace2 = msg2.replace(hasLenOf10, 'Howdy!')
          console.log(replace1, ' - ', replace2) // Hello world  -  Howdy!
          let search1 = msg1.search(hasLenOf10)
          let search2 = msg2.search(hasLenOf10)
          console.log(search1, ' - ', search2) // -1  -  0
          let split1 = msg1.split(hasLenOf10)
          let split2 = msg2.split(hasLenOf10)
          console.log(split1, ' - ', split2) // [ 'Hello world' ]  -  [ '', '' ]
          ```
      - Symbol.toPrimitive：JS经常在使用特定运算符时试图进行隐式转换，以便将对象转换为基本类型值(例如，当使用相等==运算符来对字符串与对象进行比较时，该对象会在比较之前被转换为一个基本类型值)。到底转换为何种基本类型值，在此前属于内部操作，而ES6则通过Symbol.toPrimitive方法将其暴露出来以便让其可被更改。Symbol.toPrimitive方法被定义在所有常规类型的原型上，规定了在对象被转换为基本类型值的时候会发生什么。当需要转换时，Symbol.toPrimitive会被调用，并按照规范传入一个提示性的字符串参数。该参数有3种可能：当参数值为'number'时Symbol.toPrimitive应当返回一个数值；当参数值为'string'时应当返回一个字符串；而当参数为'default'时对返回值类型没有特别要求。
          ```
          // 对于大部分常规对象，'数值模式'依次会有下述行为：
          // 1. valueOf()方法，若结果是一个基本类型值，那么返回它;
          // 2. 否则调用toString()方法，若结果是一个基本类型值，那么返回它；
          // 3. 否则抛出一个错误；
          // 类似的，对于大部分常规对象，'字符串模式'依次会有下述行为：
          // 1. 调用toString()方法，若结果是一个基本类型值，那么返回它；
          // 2. 否则，调用valueOf()方法，若结果是一个基本类型值，那么返回它；
          // 3. 否则，抛出一个错误。
          // 多数情况下，常规对象的默认模式都等价于数值模式(只有Date类型例外，它默认使用字符串模式)。通过定义Symbol.toPrimitive方法可以重写这些默认的转换行为。'默认模式'只在使用==运算符、+运算符或传递单一参数给Date构造器时被使用，而大部分运算符都使用字符串模式或是数值模式。
          function Temperature(degrees) {
              this.degrees = degrees
          }
          // 使用Symbol.toPrimitive属性并将一个函数赋值给它，便可以重写默认的转换行为。返回值会依据方法的提示性参数而有所不同，可以使用字符串模式、数值模式或是默认模式，而该提示性参数会在调用时由JS引擎自动填写。
          Temperature.prototype[Symbol.toPrimitive] = function(hint) {
              switch (hint) {
                  case 'string':
                  return this.degrees + '\u00b0' // 温度符号
                  case 'number':
                  return this.degrees
                  case 'default':
                  return this.degrees + ' degrees'
              }
          }
          let freezing = new Temperature(32)
          // +运算符使用default触发了默认模式
          console.log(freezing + '!')            // '32 degrees!'
          // /运算符使用number触发了数值模式
          console.log(freezing / 2)              // 16
          // String()函数使用了string触发了字符串模式
          console.log(String(freezing))          // '32°'
          ```
      - Symbol.toStringTag：该符号代表了所有对象的一个属性，定义了 Object.prototype.toString.call()被调用时应当返回什么值。对于数组来说，在Symbol.toStringTag属性中存储了'Array'值，于是该函数的返回值也就是'Array'。
          ```
          function Person(name) {
              this.name = name
          }
          let p1 = new Person('zhangsan')
          // 除非进行了特殊指定，否则所有对象都会从Object.prototype继承 Symbol.toStringTag属性，其默认的属性值是字符串'Object'。
          console.log(p1.toString()) // [object Object]
          // 在Person的原型上定义了Symbol.toStringTag属性，用于给它的字符串表现形式提供默认行为。
          Person.prototype[Symbol.toStringTag] = 'Person'
          // 由于Person的原型继承了Object.prototype.toString()方法，Symbol.toStringTag的返回值在调用p1.toString()时也会被使用。
          console.log(p1.toString()) // [object Person]
          console.log(Object.prototype.toString.call(p1)) // [object Person]
          // 在该对象上定义自己的toString()方法，让它有不同的返回值而不用影响Object.prototype.toString.call()方法。
          Person.prototype.toString = function() {
              return this.name
          }
          console.log(p1.toString()) // zhangsan
          console.log(Object.prototype.toString.call(p1)) // [object Person]
          ```

## Set与Map
  1. Set：是一种无重复值的有序列表，允许对Set包含的数据进行快速访问，从而能更有效地追踪离散值。由于Set类型存储对象引用的方式，它也可以被称为Strong Set(强引用的Set)。对象存储在Set的一个实例中，实际上相当于存储在变量中。只要对于Set实例的引用仍然存在，所存储的对象就无法被垃圾回收机制回收，从而无法释放内存。
    - 创建Set并添加项目：使用new Set()来创建，调用add()方法向Set中添加项目，使用has()方法测试某个值是否存在于Set中，还可以检查size属性查看其中包含有多少项。Set构造器可以接收任意可迭代对象(能使用数组是因为它们默认就是可迭代的)作为参数。Set构造器会使用迭代器来提取参数中的值。
      ```
      // Set不会使用强制类型转换来判断值是否重复，意味着Set可以同时包含数值1和字符串'1'，将它们都作为相对独立的项(Set内部的比较使用Object.is()方法来判断两个值是否相等，唯一的例外是+0与-0在Set中被判断为是相等的)。
      let set = new Set()
      set.add(1)
      set.add('1')
      set.add(1) // 重复了，该调用被忽略
      set.add('aa')
      console.log(set.has(1), set.has(2)) // true false
      console.log(set.size) // 3
      console.log(set) // Set(3) { 1, '1', 'aa' }
      set.add(+0)
      set.add(0)
      set.add(-0)
      console.log(set) // Set(4) { 1, '1', 'aa', 0 }
      // 向Set添加多个对象不会被合并为同一项。o1与o2不会被转换为字符串所以它们在这个Set内部被认为是两个不同的项
      let o1 = {}, o2 = {}
      set.add(o1)
      set.add(o2)
      set.add({})
      console.log(set) // Set(7) { 1, '1', 'aa', 0, {}, {}, {} }
      // 对象属性的类型必须为字符串，非字符串的键会在内部被转换为字符串，{}会被转换为对象默认字符串'[object Object]'
      let obj = {}
      obj[o1] = 'obj'
      obj[2] = 2
      console.log(obj[o1], obj[o2], obj[{}], obj['[object Object]'], obj[2], obj['2']) // obj obj obj obj 2 2
      ```
    - 移除值：使用delete()方法可移除单个值，调用clear()方法可清除Set中所有值。
    - Set上的forEach()方法：forEach()方法会被传递一个回调函数，该回调接受三个参数(1.Set中下个位置的值；2.与第一个参数相同的值；3.目标Set自身;)。数组与Map都会给回调函数传递三个参数，前两个参数都分别是下个位置的值与键(给数组使用的键是数值索引)。为了让Set和这些回调函数保持参数一致(将Set中的每一项同时认定为键与值，回调函数的前两个参数就始终相同)，所以传给回调函数前两个参数是相同的。
      ```
      let set = new Set([1, 2])
      set.forEach(function(value, key, ownerSet) {
          console.log(key + '-' + value, ownerSet === set)
      })
      // 1-1 true 2-2 true
      ```
    - 将Set转换为数组：将数组传递给Set构造器即可将数组转换为Set。而使用扩展运算符(...)也能简单地将Set之类的可迭代对象转换为数组。
      ```
      // Set初始化时会清除重复值
      let set = new Set([1, 2, 3, 3, 4, 5, 3])
      // 使用扩展运算符将set的项放到一个新数组中，而set仍然包含在创建时所接收的项，这些项只是被复制到了新数组中而并未从set中消失
      let arr = [...set]
      console.log(arr) // [ 1, 2, 3, 4, 5 ]
      ```
    - Weak Set：该类型只允许存储对象弱引用，而不能存储基本类型的值。对象的弱引用在它自己成为该对象的唯一引用时不会阻止垃圾回收。Weak Set与正规Set之间最大的区别是对象的弱引用。对于WeakSet实例若调用add()方法时传入了非对象的参数就会抛出错误，has()或delete()则会在传入了非对象的参数时返回false；WeakSet不可迭代因此不能被用于for-of循环；WeakSet无法暴露出任何迭代器(如keys()与values()方法)因此没有任何编程手段可用于判断WeakSet的内容；WeakSet没有forEach()方法，也没有size属性。
      ```
      // 使用WeakSet构造器来创建，并包含add、has及delete()方法。
      let weakSet = new WeakSet()
      let key = {}
      weakSet.add(key)
      console.log(weakSet.has(key)) // true
      weakSet.delete(key)
      console.log(weakSet.has(key)) // false
      ```
  2. Map：Map类型是键值对的有序列表，而键和值都可以是任意类型。键的比较使用Object.is()方法，1与'1'的类型不同因此可以将它们同时作为键来使用。可以使用set(key, value)方法添加项，使用get(key)方法来提取对应的值。
   - Map的方法：has(key)判断指定键是否存在于Map中；delete(key)移除Map中的键及对应的值；clear()移除Map中所有的键与值。size属性指明包含了多少个键值对。
    ```
    let map = new Map()
    let key1 = {}
    let key2 = {}
    // 使用了对象key1和key2作为Map的键，并存储了两个不同的值
    map.set(key1, 1)
    map.set(key2, 2)
    // 由于这些键不会被强制转换成其他形式，每个对象都被认为是唯一的键
    console.log(map.get(key1), map.get(key2)) // 1 2

    console.log(map.size, map.has(key1), map.has(key2)) // 2 true true
    map.delete(key1)
    console.log(map.size, map.has(key1), map.has(key2)) // 1 false true
    map.clear()
    console.log(map.size, map.has(key1), map.has(key2)) // 0 false false
    ```
   - Map的初始化：类似于Set，能将数组传递给Map构造器以便使用数据来初始化一个Map。该数组中的每一项也必须是数组，内部数组的首个项会作为键，第二个项则为对应值。
    ```
    // 通过构造器中的初始化，name与age"这两个键被添加到map变量中。虽然由数组构成的数组看起来有点奇怪，这对于准确表示键来说却是必要的：因为键允许是任意数据类型，将键存储在数组中是确保它们在被添加到Map之前不会被强制转换为其他类型的唯一方法。
    let map = new Map([['name', 'zhansan'], ['age', 25]])
    console.log(map)  // Map(2) { 'name' => 'zhansan', 'age' => 25 }
    ``` 
   - Map上的forEach方法：类似于Set与数组的同名方法，它接受一个能接收三个参数的回调函数(1. Map中下个位置的值；2. 该值所对应的键；3. 目标Map自身；)，回调函数的这些参数更紧密契合了数组forEach()方法的行为，即第一个参数是值、第二参数则是键(数组中的键是数值索引)
    ```
    let map = new Map([['name', 'zhansan'], ['age', 25]])
    // 传递给forEach()的回调函数接收了每个键值对，按照键值对被添加到Map中的顺序，这种行为与在数组上调用forEach()方法有所不同，数组的回调函数会按数值索引的顺序接收到每一个项。
    map.forEach(function(value, key, ownerMap) {
        console.log(key + '-' + value,  map === ownerMap)
    })
    // name-zhansan true
    // age-25 true
    ``` 
   - Weak Map：WeakMap类型是键值对的无序列表，Weak版本都是存储对象弱引用的方式。在Weak Map中所有的键都必须是非null对象(尝试使用非对象的键会抛出错误)，而且这些对象都是弱引用，不会干扰垃圾回收，值则允许是任意类型。当Weak Map中的键在Weak Map之外不存在引用时该键值对会被移除。必须注意的是Weak Map的键才是弱引用而值不是。在Weak Map的值中存储对象，就算该对象的其他引用已全都被移除，也会阻止垃圾回收。
    ```
    // Weak Map的初始化需要把一个由数组构成的数组传递给WeakMap构造器。就像正规Map构造器那样，每个内部数组都应当有两个项，第一项是作为键的非null的对象，第二项则是对应的值(允许任意类型)。
    // Weak Map只有两个附加方法能用来与键值对交互。has()方法用于判断指定的键是否存在于Map中，而delete()方法则用于移除一个特定的键值对。
    ``` 

## 迭代器与生成器
  1. 何为迭代器：迭代器是被专用设计用于迭代的对象，带有特定接口。所有的迭代器对象都拥有next()方法，调用时会返回一个结果对象。结果对象有两个属性(对应下一个值的value，以及一个布尔类型的done，其值为true时表示没有更多值可供使用)。迭代器持有一个指向集合位置的内部指针，每当调用了next()方法，迭代器就会返回相应的下一个值。若在最后一个值被返回后再调用next()，所返回的done属性值会是true，并且value属性值会是迭代器自身的返回值(return value，即用return语句明确返回的值)。该返回值不是原数据集的一部分，却会成为迭代器数据的最后一个片段。它类似于函数的返回值，是向调用者返回信息的最后手段，在未提供时会使用undefined。
  2. 何为生成器：生成器(generator)是能返回一个迭代器的函数。生成器函数由放在function关键字之后的一个星号(*)来表示，并能使用新的yield关键字(yield 关键字也是ES6新特性，指定了next()方法调用迭代器时应当按顺序返回的值)。生成器函数会在每个yield语句后停止执行。例如，yield 1执行后，函数将不会再执行任何操作直到迭代器的next()方法被调用才继续执行yield 2。yield关键字只能用在生成器内部，用于其他任意位置都是语法错误，即使在生成器内部嵌套的函数中也不行。
      ```
      // 生成器函数表达式：可以使用函数表达式来创建一个生成器，只要在function 关键字与圆括号之间使用一个星号(*)即可。
      // 此处createIterator是一个生成器函数表达式而不是一个函数声明。这个函数表达式是匿名的，因此星号只能放置在function关键字与圆括号之间
      // 不能用箭头函数创建生成器
      let createIterator = function *(items) {
          for (let i = 0; i < items.length; i++) {
              yield items[i]
          }
      }
      let iterator = createIterator([1, 2, 3])
      console.log(iterator.next()) // { value: 1, done: false }
      console.log(iterator.next()) // { value: 2, done: false }
      console.log(iterator.next()) // { value: 3, done: false }
      console.log(iterator.next()) // { value: undefined, done: true }

      //生成器对象方法：由于生成器就是函数，因此也可以被添加到对象中
      var obj = {
          *createIterator(items) {
              for (let i = 0; i < items.length; i++) {
                  yield items[i]
              }
          }
      }
      let iterator = obj.createIterator([1, 2, 3])
      ```
  3. 可迭代对象与for-of循环：可迭代对象(iterable)是包含Symbol.iterator属性的对象，与迭代器紧密相关。这个Symbol.iterator知名符号定义了为指定对象返回迭代器的函数。在ES6中，所有的集合对象(数组、Set与Map)以及字符串都是可迭代对象，因此它们都有默认的迭代器。可迭代对象被设计用于与ES新增的for-of循环配合使用。生成器默认会为Symbol.iterator属性赋值，因此它创建的所有迭代器都是可迭代对象。for-of循环在循环每次执行时会调用可迭代对象的next()方法，并将结果对象的value值存储在一个变量上，循环过程会持续到结果对象的done属性变成true为止。若仅需迭代数组或集合的值，那么使用for-of循环而非for循环更好，for-of循环一般不易出错，因为需要留意的条件更少；传统的for循环则被用于处理更复杂的控制条件。在不可迭代对象、null或undefined上使用for-of语句会抛出错误。
      ```
      // 访问默认迭代器
      let values = [1, 2, 3]
      // 使用Symbol.iterator来访问对象上的默认迭代器，获取values数组的默认迭代器，并用它来迭代数组中的项
      let iterator = values[Symbol.iterator]()
      console.log(iterator.next()) // { value: 1, done: false }
      console.log(iterator.next()) // { value: 2, done: false }
      console.log(iterator.next()) // { value: 3, done: false }
      console.log(iterator.next()) // { value: undefined, done: true }
      // Symbol.iterator指定了默认迭代器，可以用其来检测一个对象是否能被迭代
      // isIterable()函数仅仅查看对象是否存在一个类型为函数的默认迭代器。 for-of循环在执行之前会做类似的检查
      function isIterable(object) {
          return typeof object[Symbol.iterator] === 'function'
      }
      console.log(isIterable([1, 2, 3])) // true
      console.log(isIterable('Hello')) // true
      console.log(isIterable(new Map())) // true
      console.log(isIterable(new Set())) // true
      console.log(isIterable(new WeakMap())) // false
      console.log(isIterable(new WeakSet())) // false

      // 创建可迭代对象
      // 开发者自定义对象默认情况下不是可迭代对象，但可以创建一个包含生成器的Symbol.iterator属性将它们变成可迭代对象
      // 用Symbol.iterator方法(注意其名称之前也有星号)创建了生成器，为collection对象定义了一个默认的迭代器
      let collection = {
          items: [],
          *[Symbol.iterator]() {
              // 使用了一个for-of循环来对this.items中的值进行迭代，并使用yield来返回每个值
              for (let item of this.items) {
                  yield item
              }
          }
      }
      collection.items.push(1)
      collection.items.push(2)
      collection.items.push(3)
      for (let x of collection) {
          console.log(x)
      }
      // 1 2 3
      ```
  4. 内置的迭代器：
    - 集合的迭代器：ES6具有三种集合对象类型(数组、Map与Set)，它们都拥有如下的迭代器
      ```
      // entries(): 返回一个包含键值对的迭代器；entries()迭代器会在每次next()被调用时返回一个双项数组，表示集合中每个元素的键与值(对于数组来说第一项是数值索引；而对于Set来说第一项既是键又是值；Map的第一项也是键)
      // values(): 返回一个包含集合中值的迭代器
      // keys(): 返回一个包含集合中键的迭代器
      ```
    - 
  5. 扩展运算符与非数组的可迭代对象

## 