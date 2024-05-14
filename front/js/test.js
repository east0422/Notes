// 以下代码执行输出结果是什么
// function b() {
//   console.log(a);
//   var a = 10;
//   function a() {}
//   a = 100;
//   console.log(a);
// }
// b();
// function c() {
//   console.log(a);
//   function a() {}
//   var a = 10;
//   a = 100;
//   console.log(a);
// }
// c();

// (function d(num) {
//   console.log(num);
//   var num = 10;
// })(100)(
//   (function e(num) {
//     console.log(num);
//     var num = 10;
//     function num() {}
//   })(100)
// )(
//   (function f(num) {
//     function num() {}
//     console.log(num);
//     var num = 10;
//     console.log(num);
//   })(100)
// );

//仍然是预解析(在与解析过程中还要考虑一下当前变量的作用域)
function m() {
  console.log(a1); // underfined
  console.log(a2); // underfined
  console.log(b1); // underfined
  console.log(b2); // underfined
  if (false) {
    function b1() {}
    var a1 = 10;
  }
  if (true) {
    function b2() {}
    var a2 = 10;
  }
  console.log(a1); // underfined
  console.log(a2); // 10
  console.log(b1); // underfined
  console.log(b2); // function
}
// m();

function n() {
  if (2 > 1) {
    // arr = 10;
    brr = 10;
    // let arr;
    var brr;
    // console.log(arr);
    console.log(brr);
  }
}
// n(); // ReferenceError

var myperson={
  name : "Zhang",
  age : 25,
  sex : "male",
  introduction:function(){
    console.log(this.name+this.age+this.sex);
  }
};
// myperson.introduction(); // Zhang25male

var person1 = new Object()
person1.name = 'east'
person1.age = 18
person1.greeting = function() {
  console.log('Hi, I\'m ' + this.name + ' and ' + this.age + ' years old!')
}
// person1.greeting() // Hi, I'm east and 18 years old!
function doSomething() {}
doSomething.prototype.foo = 'bar'
var dost1 = new doSomething()
dost1.prop = 'some value'
console.log(dost1)
