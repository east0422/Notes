# 模块化

### CMD(Common Module Definition)
  - 是sea.js在推广过程中对模块定义的规范化产出，主要用于浏览器端。主要特点是：对于依赖的模块是延迟执行，依赖可以就近书写，等到需要用这个依赖的时候再引入这个依赖，应用有sea.js。

### AMD(Asynchronous Module Definition)
  - 是RequireJS在推广过程中对模块定义的规范化产出，也是主要用于浏览器端。其特点是：依赖前置，需要在定义时就写好需要的依赖，提前执行依赖，应用有require.js。