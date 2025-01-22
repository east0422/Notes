Vue2与Vue3的区别
  1. 双向绑定
    1. vue2主要使用ES5的Object.defineProperty()对数据劫持(setter、getter)，结合发布订阅模式
    2. vue3主要使用ES6的Proxy对数据进行代理，通过reactive()或ref()函数给每一个对象都包一层Proxy，通过代理监听属性变化
    3. defineProperty与proxy对比(前者只能监听某个属性不能对全对象监听-deep，对数组监听是单独的特殊异步处理)
  2. 生命周期
    1. beforeCreate & created -> setup(组件创建之前执行，用于定义响应式数据和函数)
    2. beforeMount/mounted/beforeUpdate/updated -> onBeforeMount/onMounted/onBeforeUpdate/onUpdated
    3. beforeDestroy -> onBeforeUnmount
    4. destroyed -> onUnmounted 
  3. 数据监听
    1. vue2常用computed和watch(所依赖的数据必须时响应式的)。vue3中引入了watchEffect(不需要传入依赖项)，watchEffect会立即执行传入的一个函数，同时响应式追踪器依赖并在其依赖变更时重新运行该函数。watchEffect相当于将watch的依赖源和回调函数合并，当任何有用到的响应式依赖更新时该回调函数便会重新执行。
  4. 组件通信
    1. 父传子：props -> props，$attrs -> attrs，provide -> provide
    2. 子传父：this.$emit -> context.emit，inject -> inject
    3. 子组件访问父组件: $parent -> 无
    4. 父组件访问子组件：$children -> 无，$ref -> (子组件指定ref属性定义同名ref引用变量)
    5. 兄弟传值：EventBus -> mitt
  5. Options api与Composition api
    1. vue2中可直接获取props(可使用this)，vue3中通过setup(props, context)指令传递
    2. vue2使用选项api(data、props、components、computed、methods等)在对应选项中填充对应的数据和方法。vue3常使用合成api，数据和方法都定义在setup中，如果数据或者函数在模板中使用需要在setup中使用return返回
    3. vue2可以使用TypeScript，但支持并不完善，需要额外的配置和类型声明。vue3对TypeScript提供了更好的支持，包括类型推断和静态类型检查等。这使得开发者可以在开发过程中更早地发现潜在的问题，提高代码质量和开发效率。
  6. 指令与插槽
    1. vue2中可以直接使用slot，v-for优先级高于v-if。vue3中具名插槽必须使用v-slot(v-slot:slotA简写为#slotA)，v-if优先级高于v-for(v-if中使用v-for变量未定义)，移除了on事件native和keyCode修饰符，移除了过滤器。
  7. 组件结构
    1. vue2只有一个根节点，vue3可以有多个根节点。
  8. 路由
    1. vue3中使用路由守卫beforeRouteEnter(进入路由前触发，此时组件还未创建)需将其放在setup外面(setup中组件已创建)
  9. 性能优化
    1. Vue3‌在性能方面进行了大量优化，如编译优化、响应式系统优化、虚拟DOM优化等。这些优化使得Vue3在运行时的性能更好，页面的渲染速度更快。
  10. 新特性
    1. Fragment(允许拥有多个根节点，减少了不必要的嵌套)
    2. Teleport(可以将组件的渲染内容移动到指定的DOM节点，适用于模态框、通知等场景)
    3. Suspense(用于处理异步组件加载，提供更好的用户体验)
