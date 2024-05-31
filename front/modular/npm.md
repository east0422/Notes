# npm

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