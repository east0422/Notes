// 将一个页面A的storage(sessionStorage或localStorage)复制到另一个页面B，常用于调试使用
// 命令脚本均在对应页面的console控制台中操作
// 1. 复制A页面storage，执行下述命令会将storage数据复制到粘贴板中
copy(sessionStorage) // 或copy(localStorage)

// 2. B页面中将粘贴板中数据赋值给一个变量storage
let storage = `copy V`
// 3. B页面中操作将变量数据赋值给storage中
for(const key in storage) {
  sessionStorage.setItem(key, storage[key])
  // localStorage.setItem(key, storage[key])
}
