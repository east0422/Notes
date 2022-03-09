前端笔记

#### 1. var、let、const的区别
* var定义的变量没有块的概念，可以跨块访问, 不能跨函数访问，允许在同一作用域中重复声明。存在变量提升，声明之前就访问变量使用默认值undefined。在全局环境声明变量(在任何函数外部)，会在全局对象里新建一个属性(变量会被挂载到window上，浏览器环境指的是window对象，Node指的是global对象)。
* let定义的变量只能在块作用域里访问，不能跨块访问，也不能跨函数访问。不允许在同一作用域中重复声明，否则将抛出异常。暂时性死区，在变量声明之前访问变量的话会直接报错提示ReferenceError。在全局环境声明变量，则不会在全局对象里新建一个属性。
* const用来定义常量使用时必须初始化(即必须赋值)，只能在块作用域里访问，而且不能修改。不能修改并不是指变量值不得改动，而是变量指向的那个内存地址不得改动。对于简单类型数据(数值、字符串、布尔值)，值就保存在变量指向的那个内存地址，因此等同于常量。复合类型(数组，对象，函数等)只能保证其地址引用不变，但不能保证其数据不变。
  ```
  // 块作用域
  {
    var a = 1; let b = 2; const c = 3; // c = 4; // 报错TypeError: Assignment to constant variable.
    // var a = 11; // 允许重复声明，之前的值会被覆盖掉
    // var a; // a的值还是1而不是undefined
    // let b = 22; // 报错SyntaxError: Identifier 'b' has already been declared
    // const c = 33; // 报错SyntaxError: Identifier 'c' has already been declared 
    var aa; let bb;
    // const必须初始化
    // const cc; // 报错SyntaxError: Missing initializer in const declaration
    console.log(a, b, c, aa, bb); // 1 2 3 undefined undefined
  }
  // var可以跨块访问
  console.log(a, aa); // 1 undefined
  // let不能跨块访问
  // console.log(b); // 报错ReferenceError: b is not defined
  // console.log(c); // 报错ReferenceError: c is not defined
  console.log(bb); // 报错ReferenceError: bb is not defined
  // 函数作用域
  (function A() {
    // 使用var声明该变量是局部的，不会影响外部全局变量值
    // var a = 10;
    // 不使用var声明该变量是全局的，更改值则会影响全局变量值
    // a = 10;
    console.log(a); // 10
    var d = 5;
    let e = 6;
    const f = 7;
    console.log(d, e, f); // 5, 6, 7
  })();
  console.log(a); // 取决于A函数中a是否使用var声明,var声明则此处指为1，直接重新赋值10则此处值为10
  (function B() {
    console.log(a); // 取决于A函数中a是否使用var声明,var声明则此处指为1，直接重新赋值10则此处值为10
    // var不能跨函数访问
    console.log(d) // 报错ReferenceError: d is not defined
  })();
  // console.log(d); // 报错ReferenceError: d is not defined
  // console.log(e); // 报错ReferenceError: e is not defined
  // console.log(f); // 报错ReferenceError: f is not defined
  ```

2. Rest参数
* 函数的最后一个参数有"..."这样的前缀，它就会变成一个参数数组。
  `function test(...args){console.log(args);}; test(1,2,3);// [1,2,3]`
* Rest参数只是没有指定变量名称的参数数组，而arguments是所有参数的集合。arguments对象不是一个真正的数组，而Rest参数是一个真正的数组，可以使用数组的各种方法(sort, map等)。

3. 展开操作符...
* 用于函数调用。
  `let args=[0, 1, 2]; console.log(args);// [ 0, 1, 2 ] console.log(...args);// 0 1 2`
* 用于数组字面量。
  `let arr1=[1,2,3]; let arr2=[4,5,6]; let arr3=[...arr1, ...arr2];console.log(arr3); // [ 1, 2, 3, 4, 5, 6 ]`
* 对象的展开操作符。
  `let nike={age: 20, name:'nike'}; nike = {...nike, sex:'F', age: 30};console.log(nike); // { age: 30, name: 'nike', sex: 'F' }`

4. 解构赋值
* 解构数组。
  `let arr=[1,5,7]; let [a,b,c]=arr; console.log(a,b,c);// 1,5,7`
* 解构对象。
  `let obj={name:'aa',age:30}; let {name,age}=obj; console.log(name,age);// aa, 30`


  