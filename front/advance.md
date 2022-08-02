前端笔记-高级

#### 构造函数-扩展
  1. var a = {}其实是var a = new Object()的语法糖。
  2. var a = []其实是var a = new Array()的语法糖。
  3. function foo(){...}其实是var foo = new Function(...)的语法糖。
  4. instanceof用于判断引用类型的变量属于哪个构造函数的一个方法(一个函数是否是一个变量的构造函数), f instanceof Foo的判断逻辑是f的__proto__一层一层往上能否对应到Foo.prototype。

#### new操作符具体做什么
  1. 创建一个空对象，并且this变量引用该对象，同时还继承了该函数的原型。
  2. 属性和方法被加入到this引用的对象中。
  3. 新创建的对象由this所引用，并且最后隐式的返回this。

#### 原型规则
  1. 所有的引用类型(数组，对象，函数)都具有对象特性，即可以自由扩展属性(null除外)。
  2. 所有的引用类型(数组，对象，函数)都有一个__proto__属性(隐式原型)，属性值是一个普通的对象。
  3. 所有的函数对象(Function)都有一个prototype属性(显式原型)，属性值也是一个普通对象，并且只有函数对象有prototype属性，因为prototype本身就是定义 
    在Function对象下的属性。当我们输入类似var person1 = new Person(...)来构造对象时，JavaScript实际上参考的是Person.prototype指向的对象来生成person1。另一方面，Person()函数是Person.prototype的构造函数，也就是说Person===Person.prototype.constructor // true
  4. 所有的引用类型(数组，对象，函数)__proto__属性(隐式原型)值指向它的构造函数的prototype属性值(显式原型)。
   `var obj = {}; obj.__proto__ === Object.prototype; // true`
  5. 当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的__proto__(即它的构造函数的prototype)中寻找。
  6. js为了避免死循环将Object.prototype的__proto__设为null。`Object.prototype.__proto__ === null // true`

#### js原型链
  1. 对象本质是一个hash表(存储键值对的表格);js内存分为代码区和数据区，数据区又分为stack栈内存和heap堆内存;js拥有全局作用域(window)、函数作用域、块级作用域(es6);当查找一个变量时，如果当前作用域没找到该变量，代码会继续往上一个作用域查找(可以理解为更大的大括号)，直到最外层的全局作用域为止，这就是所谓的作用域链。
  2. js的原型是通过函数的prototype属性来实现的，每一个函数都有一个隐藏属性prototype，普通对象是没有prototype属性的(比如：let a = {})。原型链是通过另一个隐藏属性[[prototype]]或叫proto来实现的，每一个对象都有这个隐藏属性。
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
  3. 找变量会涉及到作用域链；找对象属性涉及的是原型链。
   