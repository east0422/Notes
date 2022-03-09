Babel
### 常用步骤
1. 是一种多用途的JavaScript编译器，把最新版本的JavaScript编译成当下可以执行的版本。
  `npm install babel-cli -g // 安装Babel CLI，这是一个可以在命令行中使用Babel编译的方法`
2. 安装需要的预设及插件。
  ```
  npm install --save-dev babel-preset-es2015
  npm install --save-dev babel-plugin-transform-object-rest-spread
  ```
3. 新建.babelrc配置文件并配置预设和插件。
4. 使用Babel编译代码文件。
  `babel es6-test.js -o es6-test-compiled.js`

  