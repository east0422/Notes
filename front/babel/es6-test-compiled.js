"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var arr = [1, 2, 3];
var arr2 = arr.map(function (num) {
  return num * 2;
});
console.log(arr2);
var dic = { name: "zhangsan", age: 33 };
dic = _extends({}, dic, { sex: "Male" });
console.log(dic);
