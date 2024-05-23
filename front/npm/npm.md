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

## npm
### npm
  - 定义：用来安装、管理和分享JavaScript包，同时会自动处理多个包之间的依赖。npm和Node.js绑定在一起的，安装了Node.js，npm会被自动安装。
  - 常用命令：
    ```
    npm install -g xxx // 全局安装 
    npm install xxx // 本地安装
    npm prefix -g // 查看全局包安装位置
    npm init // 创建package.json文件
    npm install xxx --save // 安装包同时将信息自动写进dependencies(生产环境中需要依赖的包)字段中
    npm install xxx --save-dev // 安装包同时将信息自动写进devDependencies(仅在开发和测试环节中需要依赖的包)字段中
    ```

### install
  - npm install安装模块到node_modules目录中。安装之前npm install会先检查node_modules目录之中是否已经存在指定模块，若存在则不再重新安装(即使远程仓库已经有了一个新版本也是如此)。
  - npm install -f或--force不管模块是否安装过，npm都要强制重新安装。
  - npm install默认会安装所有依赖(开发和生产依赖都安装)，通过--production选项可以仅仅安装生产依赖。

### update
  - npm update更新已安装模块。会先到远程仓库查询最新版本，然后查询本地版本，若本地版本不存在或远程版本较新就会安装。

### registry
  - npm模块仓库提供了一个查询服务叫做registry。
  - 以npmjs.org为例，它的查询服务网址是https://registry.npmjs.org/，这个网址后面跟上模块名(效果等同于命令npm view/v/info/show 模块名)就会得到一个json对象，里面是该模块所有版本信息，模块名后面还可以跟上版本号或标签用来查询某个具体版本信息https://registry.npmjs.org/react/v0.14.6就会看到react模块0.14.6版本信息。返回的json对象里面有一个dist.tarball属性是该版本压缩包的网址，到该网址下载压缩包解压就得到模块源码，npm install和npm update命令都是通过这种方式安装模块的。
  
### 缓存目录
  - install或update命令从registry下载压缩包之后都存放在本地的缓存目录(linux或mac默认是用户主目录下的.npm目录，windows默认是%AppData%/npm-cache)。
  - npm config get cache查看目录位置；ls ~/.npm 或npm cache ls浏览目录内容，后面加模块名浏览对应模块。
  - rm -rf ~/.npm/*或npm cache clean清空缓存

### 模块安装过程
  - node模块安装过程如下：
    ```
    1. 发出npm install命令。
    2. 查询node_modules目录中是否已存在指定模块。
    3. 若存在，则不再重新安装。若不存在，npm向registry查询模块压缩包的网址。
    4. 下载压缩包，存放在~/.npm目录。
    5. 解压压缩包到当前项目的node_modules目录。
    ```
  - 一个模块安装以后，本地其实保存了两份。一份是缓存目录下的压缩包，另一份是node_modules目录下解压后的代码。不过运行npm install时只会检查node_modules目录而不会检查缓存目录(若一个模块在缓存目录下有压缩包，但是没有安装在node_modules目录中，npm依然会从远程仓库下载一次新的压缩包，为了解决这个问题可使用--cache-min参数)。

### --cache-min参数
  - npm提供了一个--cache-min参数用于从缓存目录安装模块。--cache-min参数指定一个时间(单位为分钟)，只有超过这个时间的模块，才会从registry下载。
  - npm install --cache-min 9999999只有超过9999999分钟的模块才从registry下载，实际上就是指定所有模块都从缓存安装，这样大大加快了下载速度。
  - npm install --cache-min Infinity

### scripts
  - scripts是package.json中内置的脚本入口，是key-value键值对配置，key为可运行的命令，可以通过npm run xxx来执行命令。除了运行基本的scripts命令，还可以结合pre和post完成前置和后续操作
  ```
    "scripts": {
      "xxx": "echo xxx",
      "prexxx": "echo pre",
      "postxxx": "echo post"
    }
    // 执行npm run xxx会依次输出pre -> xxx -> post
  ```
 
### 版本号
  - major.minor.patch-pre。主版本号(major)：当你做了不兼容的API修改；次版本号(minor)：当你做了向下兼容的功能性新增；修订号(patch)：当你做了向下兼容的问题修正。先行版本号(pre)是加到修订号的后面作为版本号的延伸，当要发行大版本或核心功能时但不能保证这个版本完全正常，就要先发一个先行版本。先行版本号的格式是在修订版本号后面加上一个连接号(-)，再加上一连串以点(.)分割的标识符，标识符可以由英文、数字和连接号([0-9A-Za-z-])组成(如：1.0​​.0-alpha，1.0​​.0-beta.1, 1.0​​.0-0.3.5等)。
  - 常见的先行版本号有：alpha：不稳定版本，一般而言，该版本的Bug较多，需要继续修改，是测试版本；beta：基本稳定，相对于Alpha版已经有了很大的进步，消除了严重错误；rc：和正式版基本相同，基本上不存在导致错误的Bug；release：最终版本。
  - 每个npm包的版本号都是唯一的，每次更新npm包后都需要更新版本号，否则会报错提示。当主版本号升级后，次版本号和修订号需要重置为0，次版本号进行升级后，修订版本需要重置为0。
    ```
    // 当前版本1.0.2，每次输出结果是基于1.0.2版本执行
    npm version patch // 1.0.3
    npm version minor // 1.1.0
    npm version major // 2.0.0
    npm version prepatch // 1.0.3-0
    npm version preminor // 1.1.0-0
    npm version premajor // 2.0.0-0
    npm version prerelease // 1.0.3-0
    ```
  - 版本标识符 没有任何符号：完全百分百匹配，必须使用当前指定版本号；对比符号类的：>(大于)>=(大于等于)<(小于)<=(小于等于)；波浪符号~：固定主版本号和次版本号，修订号可以随意更改；插入符号^：固定主版本号，次版本号和修订号可以随意更改；任意版本*：对版本没有限制，通常不使用；或符号：||可以用来设置多个版本号限制规则(如：>=3.0.0 || <=1.0.0)。