# webpack

### 构建打包分析
  - 初级分析(内置stats)
    ```
    // 通过设置webpack内置stats来统计我们的构建信息
    // 在package.json中添加配置信息，运行npm run build:stats后在项目的根目录下回生成一个stats.json文件，这个文件回记录项目构建的各种新型
    "scripts": {
      "build:stats": "vue-cli-service build --json > stats.json"
    }
    ```
  - 速度分析(speed-measure-webpack-plugin)
    ```
    // 可以看到每个loader和插件的执行耗时
    // 第一步：安装依赖包
    npm i speed-measure-webpack-plugin -D
    // 第二步：配置文件中引入插件
    const SpeedMeasurePlugin = require ('speed-measure-webpack-plugin')
    const smp = new SpeedMeasurePlugin()
    // 第三步：使用
    // vue-cli 2.x使用
    const config = {
      // ...webpack配置
    }
    module.exports = smp.wrap(config)
    // vue-cli 3.x使用，主要区别是包裹configureWebpack
    module.exports = {
      configureWebpack: smp.wrap({plugins:[]})
    }
    // vue-cli 4.x使用
    module.exports = {
      // ...其他配置
      configureWebpack: config => {
        config.plugins.push(smp)
        // 生产环境不打印console
        if (process.env.NODE_ENV === 'production') {
          config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
          config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
          config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
          config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
        }
      },
    }
    ```
 