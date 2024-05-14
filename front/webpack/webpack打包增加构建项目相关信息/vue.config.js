const packageInfo = require('./package.json')
const execSync = require('child_process').execSync

module.exports = {
  publicPath: '/',
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    port: 8080,
    open: true,
    proxy: {}
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].version = '版本号: ' + packageInfo.version + ' ' + (new Date()).toLocaleString()
      // 构建打包信息
      let pkgInfo = 'project-name'
      // 当前分支名
      pkgInfo += (' ' + execSync('git name-rev --name-only HEAD').toString().trim())
      // 当前commit hash
      pkgInfo += (' ' + execSync('git show -s --format=%H').toString().trim())
      // 构建人姓名
      pkgInfo += (' ' + execSync('git config user.name').toString().trim())
      args[0].pkgInfo = pkgInfo
      return args
    })
  }
}
