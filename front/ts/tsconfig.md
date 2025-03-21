# ts tsconfig.json配置详解

### 目录结构
```bash
project-root/
├── src/
├── dist/
└── tsconfig.json
```

### 顶层配置项

#### compilerOptions(核心配置)
```json
{
  "compilerOptions": { ... }
}
```

#### include/exclude
include指定需要编译的文件或目录, exclude指定不需要编译的文件或者目录。不管exclude如何设置，任何被files或include指定的文件所引用的文件也会被包含进来。A.ts引用了B.ts，因此B.ts不能被排除，除非引用它的A.ts在exclude列表中
```json
{
  "include": ["src/**/*.ts"], // src目录及其子目录下的所有.ts文件
  "exclude": ["node_modules", "dist", "tests", "**/*.spec.ts"]
}
```

#### files
明确指定需要编译的文件(不能使用模式匹配)，常用于明确知道只有少量文件需要编译时
```json
{
  "files": ["core.ts", "app.ts"]
}
```

#### extends
指定需要继承的tsconfig.json配置文件，可以是npm安装包中文件也可以是本地文件
```json
{
  "extends": "./tsconfig.base.json",
  "extends": "@tsconfig/recommended/tsconfig.json"
}
```

#### references
一个对象的数组，指明要引用的工程。每个引用的path属性都可以指向到包含tsconfig.json文件的目录，或者直接指向到配置文件本身(名字是任意的)。常用于mono-project，一个仓库中的多个关联子应用能够联动编译，当被依赖者发生变动时就会触发所有依赖者的重新编译
```
 "references": [
    {
      "path": "./tsconfig.node.json"
    },
    {
      "path": "./tsconfig.app.json"
    }
  ]
```

### 核心编译器选项（compilerOptions）

#### 基础配置
| 配置项          | 描述                          | 示例值                     |
|-----------------|-------------------------------|---------------------------|
| target          | 编译目标ES版本                | "ES5", "ES6", "ES2022"    |
| module          | 模块系统                      | "CommonJS", "ES6", "Node" |
| outDir          | 输出目录                      | "./dist"                  |
| rootDir         | 源文件根目录                  | "./src"                   |
| outFile         | 输出文件名                    | "./dist/index.js"         |

**示例：**
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS", // 指定要将代码编译为哪种模块系统(默认值取决于target值，如果target是ES3或者ES5，那么module的默认值就是CommonJS，如果target是ES2015、ES2016等，module的默认值就是ES Modules)。如果项目是Nodejs项目，在代码中使用了import语法，而Nodejs是不支持import(ES6)语法的，Nodejs支持的是CommonJS语法。这时就可以通过module告诉ts编译器，将代码转换为CommonJS语法，这样就能在Nodejs中运行了
    "outDir": "./dist", // 指定编译后的文件放到哪里，当指定的目录不存在时编译器会自动创建。永远会被编译器排除，除非你明确地使用files将其包含进来(这时就算用exclude指定也没用)
    "outFile": "./dist/bundle.js", // 将所有源码编译合成为一个js文件，前提是module选项被设置成System或者AMD。outFile的输出目录不会基于outDir的值，所以你需要在outFile中指定目录
    "rootDir": "./src", // 指定需要编译代码所在的目录
    "removeComments": false, // 在编译过程中移除注释，默认值false
  }
}
```

#### 类型检查
| 配置项          | 描述                          | 示例值    |
|-----------------|-------------------------------|----------|
| strict          | 启用所有严格检查              | true     |
| noImplicitAny   | 禁止隐式any类型               | true     |
| strictNullChecks| 严格的null检查                | true     |

**示例：**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

#### 模块解析
| 配置项            | 描述                          | 示例值          |
|-------------------|-------------------------------|----------------|
| baseUrl           | 模块解析基础路径              | "./"           |
| paths             | 模块路径映射                  | {"@/*": ["src/*"]} |
| moduleResolution  | 模块解析策略                  | "node", "classic", "nodenext", "bundler" |

**示例：**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "moduleResolution": "node" // 确定如何解析模块。bundler是一种较新的策略，旨在更好地与现代打包工具集成
  }
}
```

#### 输出控制
| 配置项            | 描述                          | 示例值    |
|-------------------|-------------------------------|----------|
| sourceMap         | 生成source map文件            | true     |
| declaration       | 生成.d.ts声明文件              | true     |
| removeComments    | 删除注释                      | true     |

#### 模块格式检测
- .mts、.mjs和.d.mts文件会被认为是ES模块
- .cts、.cjs和.d.cts文件会被认为是CommonJS模块
- 如果最近的package.json文件包含"type": "module"，则.ts、.tsx、.js 、.jsx、.d.ts文件会被认为是 ES模块，否则他们会被认为是CommonJS模块

### 完整配置示例
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS", // module为nodenext或node16时会强制要求moduleResolution与module采用相同的名称；如果不指定moduleResolution则默认为nodenext或node16；当module为preserve时，esModuleInterop选项仅针对其类型检查行为默认启用，import语句永远不会转换为require调用，所以 esModuleInterop不会影响输出的js代码。当module为preserve时moduleResolution默认为bundler。module为nodenext时target默认为esnext；module为node16时target默认会为es2022。module为nodenext或node16时esModuleInterop默认为true。
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true, // 告诉ts进行严格的类型检查
    "jsx": "preserve", // 告诉ts如何处理jsx语法。默认preserve，告诉ts遇到jsx不做额外处理。一般情况不需要设置该属性
    "allowJs": true, // 允许在代码中导入.js文件。在ts文件中如果import一个js文件，但是没有设置allowJs为true，首先编译器会报错，然后，即使你将错误检查关掉，在编译结果中，也不会包含你import的js文件
    "checkJs": true, // 让ts对js文件进行类型检查
    "esModuleInterop": true, // 简化导入CommonJS的语法
    "types": ["node"], // 告诉ts只从node_modules/types中读取指定的类型文件。默认情况下ts会将node_modules/@types中的所有包类型文件声明至全局空间，通过设置types属性，我们可以让ts仅将node_modules/@types/node中的类型定义声明至全局空间
    "typeRoots": ["../shared/types"], // 指定类型文件所在的目录。默认ts只会从node_modules/@types和当前tsconfig.json所在目录的根目录和子孙目录中查找类型文件，当你的类型文件不在这些位置时，就需要通过typeRoots来指定了，比如在mono-repo项目中，你的类型文件可能在当前package的上层，这时ts无法自动读取到你需要的声明文件
    "lib": ["DOM", "DOM.Iterable", "ESNext"], // 当指定target的时候ts会偷偷引入一些.d.ts类型声明文件，如果你想额外引入一些默认引入没有包含的声明文件，则可以通过lib来实现。一旦你使用了lib属性，那么target默认引入的声明文件将被取消，所以一旦你使用了lib属性，你就需要把target默认引入的库文件显示的引入一遍，否则就会导致默认的声明文件丢失，导致编译失败
    "skipLibCheck": true, // 跳过ts类型检查
    "forceConsistentCasingInFileNames": true, // 强制要求文件名的大小写一致，避免在不同的操作系统上出现不同的行为
    "useDefineForClassFields": false, // 是否使用defineProperty而不是直接赋值来初始化类字段，告诉typescript如何编译class。若target编译器选项设置为ES2022或更高版本，包括ESNext，则默认值为true。若target设置为ES2022以下的版本，则默认值为false
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "sourceMap": true, // 生成源代码与编译后代码之间的映射关系，映射关系会存在.map文件中以便于调试(主流浏览器的调试工具都支持sourceMap功能，会按照默认的规则找到.map文件，然后解读源代码和编译后代码之间的映射关系)
    "inlineSourceMap": false, // 和sourceMap的作用一样，区别是不会额外生成.map文件，而是将.map文件的内容合并到编译后的文件中
    "declaration": true, // 编译过程中是否生成.d.ts声明文件。默认为false
    "declarationDir": "./dist/types", // 将declaration开启后声明的.d.ts文件统一放到指定目录中
    "allowImportingTsExtensions": true, // 让我们可以在引入ts文件时加上.ts文件后缀
    "resolveJsonModule": true, // 允许在ts中直接引入.json文件。如果moduleResolution为bundler则会包含resolveJsonModule为true的效果
    "isolatedModules": false, // 告诉typescript对每个文件进行独立编译，以提高编译速度，通常不需要开启。启用这个属性之后，会禁用一些需要跨文件推断类型的特性：1、不能使用const enum。2、每个文件都必须包含import或者export(二者其一)。3、不能使用全局模块扩充。4、不能使用/// <reference />
    "noEmit": false, // 让ts不要进行文件编译，只进行类型检查。当使用构建工具进行了ts编译的时候可以将这个开启，将编译工作交给构建工具。如果设置为false，ts编译器将在检测到无错误时输出编译结果。如果设置为true，即使没有错误也不会输出任何文件。在这里，它被显式地设置为false，意味着当没有错误时，编译器将会输出编译后的文件。
    "noUnusedLocals": true, // 让ts检查那些声明了但是却没有使用的局部变量
    "noUnusedParameters": true, // 让ts检查函数中定义了，但却未使用的参数
    "noFallthroughCasesInSwitch": true, // 让ts在遇到switch贯穿问题(case没有break或return)时进行报错，防止意外的疏忽
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

### 重要特性说明

#### 路径映射（Path Mapping）
```ts
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["src/*"]
  },
}
// 将src路径重映射为@
// 使用前
import { Button } from 'src/components/Button'
// 使用后
import { Button } from '@/components/Button'
```

#### 支持的glob通配符有
- * 匹配0或多个字符(不包括目录分隔符)
- ? 匹配一个任意字符(不包括目录分隔符)
- **/ 递归匹配任意子目录

#### 严格模式（strict）
开启后会同时启用：
- noImplicitAny: 禁止隐式的any类型
- strictNullChecks: 更严格的空值检查
- strictFunctionTypes: 对函数参数进行更严格的检查
- strictBindCallApply: 对bind、call和apply方法的参数进行更严格的检查
- strictPropertyInitialization: 确保类的非空属性在构造函数里被初始化
- noImplicitThis: 当this表达式的值为any类型时生成一个错误
- alwaysStrict: 以严格模式解析并为每个源文件生成"use strict"语句

#### 配置实例
```ts
/** useDefineForClassFields */
class MyClass {
  public field = 'value'
}
// false
class MyClass {
  constructor() {
    this.field = 'value'
  }
}
// true
class MyClass {
  constructor() {
    Object.defineProperty(this, 'field', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 'value'
    })
  }
}

/** esModuleInterop */
// false
const path = require('path')
import * as express from 'express'
const app = express()
// true
import path from 'path'
import express from 'express'
const app = express()

/** allowImportingTsExtensions */
// false
import utils from './utils.ts' // 会报错
// true
import utils from './utils.ts' // 不会报错

/** resolveJsonModule */
// false
import data from './data.json' // 会报错
// true
import data from './data.json' // 不会报错

/** noUnusedLocals */
// true
function example(x: number, y: number) {
 let z = 10 // 报错：'z'被声明但从未使用
 return x + y
}

/** noUnusedParameters */
// true
function example(x: number, y: number) { // 错误：'y'被声明但从未使用
 return x * 2
}

/** noFallthroughCasesInSwitch */
// true
function example(value: number) {
 switch (value) {
   case 1:
    console.log("One")
    // 错误：这里会报告贯穿错误，因为没有break或return
   case 2:
    console.log("Two")
    break
 }
}

/** forceConsistentCasingInFileNames */
// false。两者都会被接受，即使实际文件名是Utils.ts
import { someFunction } from './Utils.ts'
import { anotherFunction } from './utils.ts'
// true。实际文件名是Utils.ts
import { someFunction } from './utils.ts' // 错误：文件名大小写不匹配
```

#### module
 - 表示编译后得到的js代码采取怎样的模块管理方式，常见的值有CommonJS、ESNext、ES2020、NodeNext
 - CommonJS：生成的代码用的是require()和module.exports的模块管理方式，即使用CommonJS的模块化规范
 - ESNext、ES2020：生成的代码用的是import export的模块管理方式
 - NodeNext：比较特殊，要看package.json的type字段，这个字段如果是module的话，生成的代码用的就是import export；值得注意的是，module负责的是模块管理方式，不负责js语法版本，因为这是由target字段管理的
 - ESNext总是表示最新版本的esModule；ES2020这种表示的是特定版本的esModule；一般来讲向最新版本看齐即可，当然有明确的版本要求下也可设置为特定版本的值

#### moduleResolution
- 这个字段表示ts按照什么样的规则找到模块，将模块信息提供给你，让你在编写代码的时候可以看到类型提示等
- 它所寻找的是模块类型信息。tsc遇到import语句时它不会导入js或ts代码，这个是bundle工具要做的事情，它只负责将ts文件编译为js文件，而import语句会转化为require语句，tsc不会改变导入的路径，以前是import "./a", 现在就是require("./a")。针对编译后的js文件，bundle工具会识别require，根据自己的搜索方式加载被导入的module
- classic只是tsc自身默认的模块寻找方式，不会自动查找父目录和node_modules中的模块，这个方式已经不常用
- node现在默认策略，tsc会仿照早期nodejs的方式寻找模块。module字段必须要设置为CommonJS,否则你编写编译代码的时候不会有什么问题，但是用node执行代码的时候会报错。因为早期nodejs是不支持esModule风格的代码，而且tsc在编译的时候，不会对引用的路径自动做调整
- NodeNext
- Bundler
```ts
///// classic不会检查目录B下的index文件，也不会查找node_modules或处理package.json的types/main字段
// /demo/A.ts
import { B } from "./B";
// 相对路径导入时会依次查找/demo/B.ts -> /demo/B.d.ts
// /demo/Hello/A.ts
import { B } from "B";
// 非相对路径导入会从当前文件所在的目录开始，向上查找所有父目录，尝试定位到匹配的.ts或.d.ts文件。也就是说它会依次检查当前目录、父目录、祖父目录等等，直到找到对应的模块文件或者到达根目录。会依次查找/demo/Hello/B.ts -> /demo/Hello/B.d.ts -> /demo/B.ts -> /demo/B.d.ts -> /B.ts -> /B.d.ts

///// node
// /demo/Hello/A.ts
import { B } from './B';
// 相对路径导入不会查找node_modules，也不会查找父目录，仅查找当前目录及其子目录。依次寻找/demo/Hello/B.ts -> /demo/Hello/B.tsx -> /demo/Hello/B.d.ts -> /demo/Hello/B.js(allowJs: true) -> /demo/Hello/B.jsx(allowJs: true) -> /demo/Hello/B/package.json(访问types、main字段) -> /demo/Hello/B/index.ts -> /demo/Hello/B/index.tsx -> /Hello/B/index.d.ts -> /demo/Hello/B/index.js(allowJs: true) -> /demo/Hello/B/index.jsx(allowJs: true) ->/demo/Hello/B.json (resolveJsonModule: true)
// /demo/A.ts
import { B } from 'B';
// 非相对路径仅查找node_modules和全局模块，不涉及本地文件(除非配置了baseUrl或paths)。依次寻找 全局环境声明(如lib.d.ts中的接口或类型) -> 检查本地文件路径(baseUrl或paths有配置。baseUrl: "./"从项目根目录开始查找；paths: {"B": ["src/B"]}映射到指定路径) -> 递归向上逐级查找每个父目录中的node_modules直到根目录(后缀(.ts > .tsx > .d.ts > .js > .jsx) => 目录下的package.json中types或main字段，以及index对应后缀文件 => 作用域包(如果B是作用域包, 如@scope/B则查找node_modules/@scope/B目录，规则同上)，如下) -> 全局node_modules
// /demo/node_modules/B.ts -> /demo/node_modules/B.tsx -> /demo/node_modules/B.d.ts -> /demo/node_modules/B/package.json(访问types、main字段) -> /demo/node_modules/@types/B.d.ts -> /demo/node_modules/@types/B/package.json(访问types、main字段) -> /demo/node_modules/@types/B/index.d.ts -> /demo/node_modules/B/index.ts -> /demo/node_modules/B/index.tsx -> /demo/node_modules/B/index.d.ts -> /node_modules/B.ts -> /node_modules/B.tsx -> /node_modules/B.d.ts -> /node_modules/B/package.json(访问types、main字段) -> /node_modules/@types/B/index.d.ts -> /node_modules/B/index.ts -> /node_modules/B/index.tsx -> /node_modules/B/index.d.ts



```


### 调试技巧
1. 查看生效配置：
```bash
tsc --showConfig
```

2. 指定配置文件：
```bash
tsc -p tsconfig.prod.json
```

### 参考资源
- [官方文档](https://www.tslang.org/tsconfig)
- [TSConfig基础模板](https://github.com/tsconfig/bases)
