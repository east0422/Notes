// 1. var 、let、const的区别
/**
{
  {
    var a = 1; let b = 2; const c = 3; // c = 4; // 报错: Identifier 'c' has already been declared
    // var a = 11; // 允许重复声明
    // let b = 22; // 报错SyntaxError: Identifier 'b' has already been declared
    // const c = 33; // 报错SyntaxError: Identifier 'c' has already been declared 
    var aa; let bb; // const cc; // 报错: Missing initializer in const declaration
    console.log(a, b, c, aa, bb); // 1 2 3 undefined undefined
  }
  console.log(a, aa); // 1 undefined
  // console.log(b); // 报错ReferenceError: b is not defined
  // console.log(c); // 报错ReferenceError: c is not defined
  // console.log(bb); // 报错ReferenceError: bb is not defined
  (function A() {
    // 使用var声明该变量是局部的，不会影响外部全局变量值
    // var a = 10;
    // 不使用var声明该变量是全局的，更改值则会影响全局变量值
    a = 10;
    console.log(a); // 取决于A函数中a是否使用var声明,var声明则此处指为1，直接重新赋值10则此处值为10
    var d = 5;
    let e = 6;
    const f = 7;
    console.log(d, e, f); // 5, 6, 7
  })();
  console.log(a); // 取决于A函数中a是否使用var声明,var声明则此处指为1，直接重新赋值10则此处值为10
  (function B() {
    console.log(a); // 取决于A函数中a是否使用var声明,var声明则此处指为1，直接重新赋值10则此处值为10
    // console.log(d) // 报错ReferenceError: d is not defined 
  })();
  // console.log(d); // 报错ReferenceError: d is not defined
  // console.log(e); // 报错ReferenceError: e is not defined
  // console.log(f); // 报错ReferenceError: f is not defined
}
*/

// 2. Rest参数
/**
{
  function test(...args) {
    console.log(args);
  }
  test(1, 2, 3); // [ 1, 2, 3 ]
  test([1, 2, 3]); // [ [ 1, 2, 3 ] ]
}
*/

// 3. 展开操作符...
/**
{
  let args = [0, 1, 2];
  console.log(args); // [ 0, 1, 2 ]
  console.log(...args); // 0 1 2

  let arr1 = [1,2,3];
  let arr2=[4,5,6];
  let arr3=[...arr1, ...arr2];
  console.log(arr3); // [ 1, 2, 3, 4, 5, 6 ]
  let arr4={...arr1, ...arr2};
  console.log(arr4); // { '0': 4, '1': 5, '2': 6 }

  let nike={age: 20, name:'nike'};
  nike = {...nike, sex:'F', age: 30};
  console.log(nike); // { age: 30, name: 'nike', sex: 'F' }
}
*/