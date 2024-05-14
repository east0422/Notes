vite import.meta.glob动态路由未正常加载组件显示

vue(3.4.19) + vue-router(4.3.0) + vite(5.1.4)

// 未正常加载显示失败示例：
第一步: const modules = import.meta.glob('../views/**/*.vue')
第二步：component: () => modules[`../views/${comp.replace(/\s/g, '')}.vue`]


解决方案：
  方案一：保持第一步不变，修改第二步modules加载对应组件后面增加括号()，即component: () => modules[`../views/${component.replace(/\s/g, '')}.vue`]()
  方案二：第二步不变，modules[xxx]后面不需括号，修改第一步增加{eager: true}参数const modules = import.meta.glob('../views/**/*.vue', {eager: true})
  推荐使用第一种解决方案，方案一按需执行，方案二预先执行所有，并且{eager: true}不支持反面匹配模式(!无效)


原因浅析：
  import.meta.glob方法导入匹配到的模块，该方法返回一个对象其中每个键都是匹配到的模块路径，每个值都是一个异步加载函数。在默认情况下这些异步加载函数是按需执行的，即只有在真正需要使用对应的模块时才会执行。使用modules[xxx]并未执行函数，后面加括号才会立即执行当前异步加载函数。{eager: true}的参数配置在应用加载时就预先加载所有匹配到的模块。

