前端笔记

#### var、let、const的区别
  1. var定义的变量没有块的概念，可以跨块访问, 不能跨函数访问，允许在同一作用域中重复声明。存在变量提升，声明之前就访问变量使用默认值undefined。在全局环境声明变量(在任何函数外部)，会在全局对象里新建一个属性(变量会被挂载到window上，浏览器环境指的是window对象，Node指的是global对象)。
  2. let定义的变量只能在块作用域里访问，不能跨块访问，也不能跨函数访问。不允许在同一作用域中重复声明，否则将抛出异常。暂时性死区，在变量声明之前访问变量的话会直接报错提示ReferenceError。在全局环境声明变量，则不会在全局对象里新建一个属性。
  3. const用来定义常量使用时必须初始化(即必须赋值)，只能在块作用域里访问，而且不能修改。不能修改并不是指变量值不得改动，而是变量指向的那个内存地址不得改动。对于简单类型数据(数值、字符串、布尔值)，值就保存在变量指向的那个内存地址，因此等同于常量。复合类型(数组，对象，函数等)只能保证其地址引用不变，但不能保证其数据不变。
      ```
      // 块作用域
      {
        var a = 1; let b = 2; const c = 3; // c = 4; // 报错TypeError: Assignment to constant variable.
        // var a = 11; // 允许重复声明，之前的值会被覆盖掉
        // var a; // a的值还是1而不是undefined
        // let b = 22; // 报错SyntaxError: Identifier 'b' has already been declared
        // const c = 33; // 报错SyntaxError: Identifier 'c' has already been declared 
        var aa; let bb;
        // const必须初始化
        // const cc; // 报错SyntaxError: Missing initializer in const declaration
        console.log(a, b, c, aa, bb); // 1 2 3 undefined undefined
      }
      // var可以跨块访问
      console.log(a, aa); // 1 undefined
      // let不能跨块访问
      // console.log(b); // 报错ReferenceError: b is not defined
      // console.log(c); // 报错ReferenceError: c is not defined
      console.log(bb); // 报错ReferenceError: bb is not defined
      // 函数作用域
      (function A() {
        // 使用var声明该变量是局部的，不会影响外部全局变量值
        // var a = 10;
        // 不使用var声明该变量是全局的，更改值则会影响全局变量值
        // a = 10;
        console.log(a); // 10
        var d = 5;
        let e = 6;
        const f = 7;
        console.log(d, e, f); // 5, 6, 7
      })();
      console.log(a); // 取决于A函数中a是否使用var声明,var声明则此处指为1，直接重新赋值10则此处值为10
      (function B() {
        console.log(a); // 取决于A函数中a是否使用var声明,var声明则此处指为1，直接重新赋值10则此处值为10
        // var不能跨函数访问
        console.log(d) // 报错ReferenceError: d is not defined
      })();
      // console.log(d); // 报错ReferenceError: d is not defined
      // console.log(e); // 报错ReferenceError: e is not defined
      // console.log(f); // 报错ReferenceError: f is not defined
      ```

#### 回流与重绘
  1. 当渲染树中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建，称为回流(reflow)。每个页面至少需要一次回流(第一次加载时)。在回流的时候，浏览器会使渲染树中受到影响的部分失效，并重新构造这部分渲染树。完成回流后浏览器会重新绘制受影响的部分到屏幕中，该过程称为重绘(redraw)。

#### isNaN检测机制
  1. 首先验证当前要检测的值是否为数字类型的，如果不是浏览器会默认把值转化为数字类型，把非数字类型的值转换为数字。
     - 其他基本类型转换为数字，直接使用Number方法转换
        ```
        // 字符串转数字
        Number('13') -> 13;
        Number('13.05') -> 13.05;
        Number('13px') -> NaN; // 若当前字符串中出现任意一个非有效数字字符结果则为NaN
        // 布尔转数字
        Number(true) -> 1;
        Number(false) -> 0;
        // 其他
        Number(undefined) -> NaN;
        Number(null) -> 0;
        ```
     - 引用数据类型转换为数字，引用值先调用toString方法转换为字符串，然后再把字符串调取Number转换为数字
        ```
        // 对象
        ({}).toString() -> '[object Object]' -> NaN
        // 数组
        [1, 2].toString() -> '1,2' -> NaN
        [1].toString() -> '1' -> 1
        [].toString() -> '' -> 0
        // 正则
        /^$/.toString() -> '/^$/' -> NaN
        ```  
  2. 当前检测的值已经是数字类型，是有效数字返回false，不是返回true(数字类型中只有NaN不是有效数字，其余都是有效数字)。
  3. NaN和谁都不相等(包括自己 NaN == NaN -> false)，检查一个变量num存储的值是否为一个有效数字只能使用isNaN(num)

#### ==比较
  1. 若两边数据类型不一样则先转换为相同类型(数字)再进行比较
  2. 对象==对象不一定相等，因为对象操作的时引用地址，地址不相同则不相等`{} == {} -> false;[] == [] -> false`
  3. 特殊情况`null == undefiend -> true; null == undefined -> false; [] == true -> false; ![] == true -> false`

#### parseInt于parseFloat
  1. 与Number类似，同样是为了把其他类型值转换为数字类型，与Number区别的地方在于字符串转换分析上。
  2. 从字符串最左侧字符开始查找有效数字字符，并且转换为数字，一旦遇到非有效数字字符查找结束。
      ```
      // Number出现任意非有效数字字符结果就是NaN，parseInt把一个字符串左侧中的整数部分解析出来，pareseFloat把一个字符串左侧小数(浮点数)部分解析出来
      Number('13.5px') -> NaN
      parseInt('13.5px') -> 13
      parseFloat('13.5px') -> 13.5
      parseInt('aa13.5px') -> NaN
      parseFloat('aa13.5px') -> NaN
      ``` 

#### form中input设置readonly和disabled区别
  1. readonly不可编辑，但可选择和复制，值可传递到后台。
  2. disabled不可编辑，不能选择和复制，值也不可以传递到后台。

#### Rest参数
  1. 函数的最后一个参数有"..."这样的前缀，它就会变成一个参数数组。
    `function test(...args){console.log(args);}; test(1,2,3);// [1,2,3]`
  2. Rest参数只是没有指定变量名称的参数数组，而arguments是所有参数的集合。arguments对象不是一个真正的数组，而Rest参数是一个真正的数组，可以使用数组的各种方法(sort, map等)。

#### 展开操作符...
  1. 用于函数调用。
    `let args=[0, 1, 2]; console.log(args);// [ 0, 1, 2 ] console.log(...args);// 0 1 2`
  2. 用于数组字面量。
    `let arr1=[1,2,3]; let arr2=[4,5,6]; let arr3=[...arr1, ...arr2];console.log(arr3); // [ 1, 2, 3, 4, 5, 6 ]`
  3. 对象的展开操作符。
    `let nike={age: 20, name:'nike'}; nike = {...nike, sex:'F', age: 30};console.log(nike); // { age: 30, name: 'nike', sex: 'F' }`

#### 解构赋值
  1. 解构数组。
    `let arr=[1,5,7]; let [a,b,c]=arr; console.log(a,b,c);// 1,5,7`
  2. 解构对象。
    `let obj={name:'aa',age:30}; let {name,age}=obj; console.log(name,age);// aa, 30`

#### npm
  1. 定义：用来安装、管理和分享JavaScript包，同时会自动处理多个包之间的依赖。npm和Node.js绑定在一起的，安装了Node.js，npm会被自动安装。
  2. 常用命令：
      ```
      npm install -g xxx // 全局安装 
      npm install xxx // 本地安装
      npm prefix -g // 查看全局包安装位置
      npm init // 创建package.json文件
      npm install xxx --save // 安装包同时将信息自动写进dependencies(生产环境中需要依赖的包)字段中
      npm install xxx --save-dev // 安装包同时将信息自动写进devDependencies(仅在开发和测试环节中需要依赖的包)字段中
      ```

#### 包和模块
  1. 包(package)是一个用package.json文件描述的文件夹或文件。
  2. 模块(module)指的是任何可以被Node.js中require方法载入的文件。可以被当作模块的典型例子(1、一个包括有main字段package.json的文件夹；2、一个包括index.js的文件夹；3、一个单独的JavaScript文件。)
  3. 所有的模块都是包，但是不是所有的包都是模块(eg:一些CLI包只包括可执行的命令行工具)。

#### Grunt
  1. Grunt是一个命令行工具，可以通过npm来安装`npm install grunt-cli -g`。
  2. Grunt使用插件机制和Gruntfile.js实现了多任务的配置、组合和运行。Grunt任务的配置是通过一个名为Gruntfile.js的文件来进行的，这个文件是一个标准的Node.js模块。
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

#### Gulp
  1. 在Grunt之后出现，吸取了Grunt的优点推出了很多全新的特性，安装命令行工具`npm install -g gulp-cli`。
  2. 也是通过插件机制来完成第三方工具的适配，通过一个名为gulpfile.js文件来完成任务的配置。
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

#### 模块打包工具(Bundler)
  1. 将浏览器不支持的模块进行编译、转换、合并，并且最后生成的代码可以在浏览器端良好运行的工具。
  2. RequireJS: RequireJS是一个JavaScript模块加载器，基于AMD规范实现。同时也提供了对模块进行打包与构建的工具r.js，通过将开发时单独的匿名模块具名化并进行合并，实现线上页面资源加载的性能优化。RequireJS从入口文件开始，递归地进行静态分析，找出所有直接或间接被依赖(require)的模块，然后进行转换与合并。
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
  3. browerify: browserify是一个以在浏览器中使用Node.js模块为出发点的工具。对CommonJS规范(Node.js模块所采用的规范)的模块代码进行的转换与包装；对很多Node.js的标准package进行了浏览器端的适配，只要是遵循CommonJS规范的JavaScript模块，即使是纯前端代码，也可以使用它进行打包。
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
  4. webpack:  webpack支持AMD和CommonJS类型，通过loader机制也可以使用ES6的模块格式。通过一个config文件能提供更加丰富的功能，支持多种静态文件，有强大的代码拆分与异步加载等。
      ```
    
      ```