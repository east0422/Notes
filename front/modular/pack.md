# 打包

### 包和模块
  - 包(package)是一个用package.json文件描述的文件夹或文件。
  - 模块(module)指的是任何可以被Node.js中require方法载入的文件。可以被当作模块的典型例子(1、一个包括有main字段package.json的文件夹；2、一个包括index.js的文件夹；3、一个单独的JavaScript文件。)
  - 所有的模块都是包，但是不是所有的包都是模块(eg:一些CLI包只包括可执行的命令行工具)。

### 模块打包工具(Bundler)
  - 将浏览器不支持的模块进行编译、转换、合并，并且最后生成的代码可以在浏览器端良好运行的工具。
  - RequireJS: RequireJS是一个JavaScript模块加载器，基于AMD规范实现。同时也提供了对模块进行打包与构建的工具r.js，通过将开发时单独的匿名模块具名化并进行合并，实现线上页面资源加载的性能优化。RequireJS从入口文件开始，递归地进行静态分析，找出所有直接或间接被依赖(require)的模块，然后进行转换与合并。
    ```
    // bundle.js
    define('hello', [], function(require){
      module.exports = 'hello!';
    });
    define('say', ['require', 'hello'], function(require){
      var hello = require('./hello');
      console.log(hello); // hello!
    })
    ```
  - browerify: browserify是一个以在浏览器中使用Node.js模块为出发点的工具。对CommonJS规范(Node.js模块所采用的规范)的模块代码进行的转换与包装；对很多Node.js的标准package进行了浏览器端的适配，只要是遵循CommonJS规范的JavaScript模块，即使是纯前端代码，也可以使用它进行打包。
    ```
    // add.js
    module.exports = function(x, y) {
      return x + y;
    };
    // test.js
    var add = require('./add');
    console.log(add(2, 3)); // 5
    // 使用browserify处理打包browserify test.js > bundle.js，生成的bundle.js是已经处理完毕，可供浏览器使用的文件，只需插入到<script>标签里面即可
    ```
  - webpack:  webpack支持AMD和CommonJS类型，通过loader机制也可以使用ES6的模块格式。通过一个config文件能提供更加丰富的功能，支持多种静态文件，有强大的代码拆分与异步加载等。

### Grunt
  - Grunt是一个命令行工具，可以通过npm来安装`npm install grunt-cli -g`。
  - Grunt使用插件机制和Gruntfile.js实现了多任务的配置、组合和运行。Grunt任务的配置是通过一个名为Gruntfile.js的文件来进行的，这个文件是一个标准的Node.js模块。
    ```
    module.exports = function(grunt) {
      // 自定义任务的配置
      grunt.initConfig({
        // 导入package.json文件中的项目元数据到Grunt配置中
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
          build: {
            options: {
              // 生成一个文件头注释
              bannner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
              src: 'src/<%= pkg.name %>.js',
              dest: 'build/<%= pkg.name %>.min.js'
            }
          }
        }
      });
      // 需要安装对应的任务插件npm install grunt-contrib-uglify --save-dev
      // 加载'uglify'任务插件
      grunt.loadNpmTasks('grunt-contrib-uglify');
      // 注册自定义任务(默认被执行的任务列表)
      grunt.registerTask('default', ['uglify']);
      // 当在命令行中执行grunt命令时如果不指定一个任务的话，将会执行uglify任务。这和执行grunt uglify或grunt default的效果一样。default任务列表数组中可以指定任意数目的任务(可以带参数)
      // grunt --help 命令列出所有可用的任务
    }
    ```

### Gulp
  - 在Grunt之后出现，吸取了Grunt的优点推出了很多全新的特性，安装命令行工具`npm install -g gulp-cli`。
  - 也是通过插件机制来完成第三方工具的适配，通过一个名为gulpfile.js文件来完成任务的配置。
    ```
    // 引入gulp
    const gulp = require('gulp');
    // 引入del
    const del = require('del');
    // 需要使用到gulp提供的方法
    const {src, dest, series, parallel} = gulp;
    // 创建清除dist任务
    function clean(cb) {
      del(['dist']);
      cb();
    }
    // 创建一个文件拷贝任务
    function copy() {
      // 使用解构出来的src和dest，src后面跟的是要读取的文件*.html代表的是该文件目录下所有的html文件 
      return src('src/views/*.html').pip(dest('dist/views'))
    }
    // 导出gulp任务，因此它是一个公开任务(public task)。可以被gulp命令直接调用
    exports.copy = copy;
    // 未导出gulp任务clean，因此它是一个私有任务(private task)，不可以被gulp命令直接调用
    // 命令行可使用导出的gulp任务gulp copy
    `series()` 组合中导出了copy和clean方法，copy和clean方法都可使用
    // series依次执行任务，copy会在clean任务后执行
    exports.default = series(clean, copy);
    // parallel以最大并发执行任务，clean和copy先后执行顺序不一定
    exports.default1 = parallel(clean, copy);
    ```
