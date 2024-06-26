var a = {n: 1}
var b = a
a.x = a = {n: 2}
console.log(a.x) // undefined而非预想中的{n: 2}
console.log(b.x) // {n: 2}

/** 浅析：=赋值运算符顺序是从右往左，但.成员访问运算符优先级最高。
 * var a = {n: 1} a指向了堆内存中的对象{n: 1}，称为对象A
 * var b = a a赋值给b时传的是栈中a的地址(相当于新建了一个不同名'指针')，还是指向对象A，并未在堆内存中新建对象
 * a.x .运算符优先级高于=赋值运算符，先操作a.x，为堆内存中a指向的对象A创建一个变量x，值为undefined
 * a = {n: 2}赋值运算符从右往左，在堆内存中新建一个对象B，将a指向对象B，b指向仍然为对象A
 * a.x = a 此时并不会重新解析a而是沿用最初解析a.x的a，此时左侧a.x中的a指向的还是对象A，而右侧的a指向的则是对象B，两个指向的并非为同一个对象，所以对象A中的x指向了对象B
 * console.log(a.x) 此时重新解析a，a指向的是新对象B，对象B中并没有x，所以输出undefined
 * console.log(b.x) b指向对象A，对象A中的x则指向对象B，所以输出{n: 2}
 */
