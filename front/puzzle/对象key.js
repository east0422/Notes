// example 1
var a = {}, b = '123', c = 123
a[b] = 'b'
a[c]='c' // c 的键名会被转换成字符串'123'，这里会把b覆盖掉，a[c] = 'c'
console.log(a[b], a[c], a) // c c { '123': 'c' }
// example 2
var a = {}, b = Symbol('123'), c = Symbol('123')
a[b] = 'b' // b是Symbol类型，不需要转换，a[b] = 'b'
a[c] = 'c' // c是Symbol类型，不需要转换。任何一个Symbol类型的值都是不相等的，所以不会覆盖 b。a[c] = 'c'
console.log(a[b], a[c], a) // b c { [Symbol(123)]: 'b', [Symbol(123)]: 'c' }
// example 3
var a = {}, b = {key: '123'}, c = {key: '456'}
a[b] = 'b' // b不是字符串也不是Symbol类型，需要转换成字符串。对象类型会调用toString方法转换成字符串[object Object]。a[b] = 'b'
a[c] = 'c' // c不是字符串也不是Symbol 类型，需要转换成字符串。对象类型会调用toString方法转换成字符串[object Object]。a[c] = 'c'
console.log(a[b], a[c], a) // c c { '[object Object]': 'c' }
console.log(b, b.toString()) // { key: '123' } [object Object]

/**
 * 1. 对象的键名只能是字符串和Symbol类型(任何一个Symbol类型的值都是不相等的)
 * 2. 其他类型的键名会被转换成字符串类型
 * 3. 对象转字符串默认会调用toString方法
 */
