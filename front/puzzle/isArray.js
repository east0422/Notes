// 判断是否为数组
// 日志打印
function logInfo(info, isSep = false) {
  if (isSep) {
    console.log(`-----${info}-----`)
  } else {
    console.log(info)
  }
}

/** 方法一 Object.prototype.toString.call()
 * 对于几乎所有的数据类型都能进行判断，包括对象、数组、函数、日期和原始数据类型，即使是null和undefined，常用于判断浏览器内置对象。
 * 每一个继承Object的对象都有toString方法，若toString没有重写会返回[Object type]，其中type为对象的类型。
 * 但当除了Object类型的对象外其他类型直接使用toString方法时会直接返回都是内容的字符串，
 * 所以我们需要使用call(参数数组立即执行)或apply(多个参数立即执行)或bind(多个参数，非立即执行)来改变toString方法的执行上下文。
 */
logInfo('Object.prototype.toString.call', true)
logInfo(Object.prototype.toString.call('hello')) // [object String]
logInfo(Object.prototype.toString.call(1)) // [object Number]
logInfo(Object.prototype.toString.call(Symbol(1))) // [object Symbol]
logInfo(Object.prototype.toString.call(null))  // [object Null]
logInfo(Object.prototype.toString.call(undefined))   // [object Undefined]
logInfo(Object.prototype.toString.call(function() {})) // [object Function]
logInfo(Object.prototype.toString.call({name: 'zhangsan'})) // [object Object]
logInfo(Object.prototype.toString.call(new Date)) // [object Date]
logInfo(Object.prototype.toString.call([])) // [object Array]

/** 方法二 instanceof
 * instanceof用于检测一个对象是否是特定特定构造函数的实例，它通常用于检测对象是否是某个类的实例。
 * instanceof的内部机制是通过判断对象的原型链中是不是能找到类型的prototype。
 * 使用instanceof判断一个对象是否为数组，instanceof会判断这个对象的原型链上是否会找到对应的Array的原型，找到返回true，否则返回false。
 * instanceof只能用来判断对象类型，不能用来判断原始数据类型。并且所有对象类型instanceof Object都是true。
 */
logInfo('instanceof', true)
logInfo([] instanceof Array) // true
logInfo([] instanceof Object) // true
logInfo({} instanceof Object) // true
logInfo('hello' instanceof String) // false
logInfo('hello' instanceof Object) // false
logInfo(1 instanceof Number) // false
logInfo(1 instanceof Object) // false

class MyArray extends Array{}
let ma1 = new MyArray()
logInfo(ma1 instanceof MyArray) // true
logInfo(ma1 instanceof Array) // true
logInfo(ma1 instanceof Object) // true

/** 方法三 Array.isArray()
 * Array.isArray()是ES5新增的方法，专门用于检测对象是否是数组。
 * 当不存在Array.isArray()时可以用Object.prototype.toString.call()实现，如：if (!Array.isArray) { Array.isArray = function(arg) { return Object.prototype.toString.call(arg) === '[object Array]';};}
 */
logInfo('Array.isArray', true)
logInfo(Array.isArray([])) // true
logInfo(Array.isArray('hello')) // false
logInfo(Array.isArray(undefined)) // false

/**
 * 区别
 * 通用性：Object.prototype.toString.call()最通用的方法，适用于所有数据类型。instanceof主要用于检测对象是否是特定构造函数的实例，不适用于原始数据类型。Array.isArray()专门用于检测对象是否是数组。
 * 直观性：Object.prototype.toString.call()语法相对冗长，需要解析结果。instanceof非常直观，易于理解。Array.isArray()简单明了，专门用于数组检测。
 * 适用性：Object.prototype.toString.call()适用于几乎所有数据类型，包括原始数据类型和对象。instanceof主要用于检测对象是否是某个类的实例。Array.isArray()专门用于数组检测。
 * 返回值：Object.prototype.toString.call()返回一个字符串需要进一步解析。instanceof返回布尔值。Array.isArray()返回布尔值。
 * 选择使用：
 *  若需要检测一个对象是否是数组，最好使用Array.isArray()，这是最简单和最直观的方法。
 *  若需要检测对象是否是特定构造函数的实例，可以使用instanceof，这对于面向对象编程非常有用。
 *  若需要更通用的类型检测，包括原始数据类型和对象，可以使用Object.prototype.toString.call()，这种方法非常灵活，但语法相对冗长。
 */