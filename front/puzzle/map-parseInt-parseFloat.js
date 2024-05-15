/** Array.prototype.map
 * Array.prototype.map(callbackFn, thisArg)方法创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。
 * callbackFn为数组中的每个元素执行的函数。它的返回值作为一个元素被添加为新数组中。
 * callbackFn(element,index,array)函数被调用时将传入以下参数：
 *   element数组中当前正在处理的元素
 *   index正在处理的元素在数组中的索引
 *   array调用map()方法的数组本身
 * thisArg执行callbackFn时用作this的值
 * map创建一个新数组，不使用返回数组的情况下不推荐使用它；推荐使用forEach或for...of
*/
let arr = ['1', '2', '3']
console.log(arr.map((e) => e * 2 )) // [ 2, 4, 6 ]

/** parseFloat
 * parseFloat(string) 给定值被解析成浮点数，如果给定值不能被转换成数值，则会返回NaN。是个全局函数，不属于任何对象
 * 如果 parseFloat在解析过程中遇到了正号(+)、负号(-)、数字(0-9)、小数点(.)、或者科学记数法中的指数(e或E)以外的字符，则它会忽略该字符以及之后的所有字符，返回当前已经解析到的浮点数。
 * 第二个小数点的出现也会使解析停止(在这之前的字符都会被解析)。
 * 参数首位和末位的空白符会被忽略。
 * 如果参数字符串的第一个字符不能被解析成为数字，则parseFloat返回NaN。
 * parseFloat也可以解析并返回Infinity。
 * parseFloat解析BigInt为Numbers, 丢失精度。因为末位n字符被丢弃
 * 也可以转换一个已经定义toString或者valueOf方法的对象，它返回的值和在调用该方法的结果上调用parseFloat值相同。
 */
console.log(arr.map(parseFloat)) // [ 1, 2, 3 ]

/** parseInt
 * parseInt(string, radix)函数将其第一个参数转换为一个字符串，对该字符串进行解析，然后返回一个整数或NaN。
 * string为要被解析的参数值，如果不是一个字符串，则将其转换为字符串(使用ToString抽象操作)。字符串开头的空白符将会被忽略。
 * radix可选，从2到36的整数表示进制的基数。例如指定16表示被解析值是十六进制数。
 *  假如指定0或未指定基数将会根据字符串的值进行推算。注意，推算的结果不会永远是默认值。
 * 当radix值小于2(1)或大于36时返回NaN，当string第一个非空格字符不能转换为数字时返回NaN，当转换的值string大于或等于基数radix时返回NaN。
 * 如果radix是undefined、0或未指定的，js会假定以下情况：
 *   输入的string以0x或0X(一个0后面是小写或大写的X)开头，那么radix被假定为16，字符串的其余部分被当做十六进制数去解析。
 *   输入的string以"0"(0)开头，radix被假定为8(八进制)或10(十进制)。具体选择哪一个radix取决于实现。因此在使用parseInt时，尽量指定一个radix。
 *   输入的string以任何其他值开头，radix是10(十进制)。
 */
console.log(arr.map(parseInt)) // [ 1, NaN, NaN ]
// ['1', '2', '3'].map(parseInt)实际过程为
// ['1', '2', '3'].map(parseInt('1', 0)) // 1
// ['1', '2', '3'].map(parseInt('2', 1)) // NaN
// ['1', '2', '3'].map(parseInt('3', 2)) // NaN
console.log(parseInt(3, 3)) // NaN

/** map原数组增加元素，返回数组元素数量不变
 * map方法是一个复制方法。不会改变this。然而作为callbackFn提供的函数可以更改数组。
 * 请注意，在第一次调用callbackFn之前，数组的长度已经被保存。
 * 因此当开始调用map时，callbackFn将不会访问超出数组初始长度的任何元素。
 * 对已访问索引的更改不会导致再次在这些元素上调用callbackFn。
 * 如果数组中一个现有的、尚未访问的元素被callbackFn更改，则它传递给callbackFn的值将是该元素被修改后的值。
 * 被删除的元素则不会被访问。
 */
let newArr = arr.map((e, i, oldArr) =>{
  if (i == 2) {
    oldArr.push('4')
  }
  return e
})
console.log(newArr) // [ '1', '2', '3' ]
console.log(arr)  // [ '1', '2', '3', '4' ]

/** Number
 * Number是一个构造函数，但也可以作为一个函数来使用，它将任何值转换为等效的数字类型。
 * 当作为函数调用时它只接受一个参数并尝试将其转换为数字，不需要额外的参数。
 * 且对多种类型的输入值(如字符串、布尔值、null、undefined等)都有明确的转换规则。
 */
console.log(arr.map(Number)) // [ 1, 2, 3, 4 ]