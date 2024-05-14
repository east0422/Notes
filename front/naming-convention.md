前端开发命名规范

### 项目
  - 全部采用小写，以中划线分隔(eg:personnel-management-system-web)

### 文件夹
  - vue项目中所有文件夹命名采用驼峰命名法，首字母小写

### 文件名
  - vue项目中所有组件命名采用驼峰命名法，首字母大写

### css
  - id、css由单词、下划线连接或数字组成命名(eg: .info-name)
  - 颜色16进制用小写字母，尽量用简写(eg: #fff)

### 图片
  - 全部小写，多个单词以下划线分隔

### js
  - 对象或json属性命名采用驼峰命名法`let obj = {resultType: '', name: '', statusShow: ''}`
  - 函数命名使用动宾短语和驼峰命名法，参数也使用驼峰命名法，可选参数以opt_ 开头`function getStyle(element, opt_child) {}`
  - 类使用名词和Pascal命名法(与驼峰命名法类似，只不过驼峰命名法是首字母小写，而帕斯卡命名法是首字母大写)，类的方法/属性使用驼峰命名法
  - boolean类型变量使用is或has开头，在对象中使用is_或has_开头
  - 常量全大写加下划线(eg: const MAX_COUNT = 10)
  - 组件名采用中划线连接
  - 操作符始终写在前一行，以免分号的隐式插入产生预想不到的问题

### vue2.0选项顺序
  ```
    export default {
      name: '',
      components: {}, // 组件
      mixins: [], // 混入
      model: {},
      props: {},
      data () {
        return {}
      }, // 数据
      computed: {}, // 计算属性
      filters: {}, // 过滤
      directives: {}, // 指令
      watch: {}, // 监听器
      methods: {}, // 方法
      created () {}, // 创建周期
      mounted () {}, // dom挂载周期
      destroyed () {} // 实例销毁周期
    }
  ```
