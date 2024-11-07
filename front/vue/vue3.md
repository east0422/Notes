# vue3

### watch与watchEffect
  - watch默认非即时，即时响应需加immediate: true，对象深度监听需加deep: true。调用watch返回方法可停止监听。需明确指定侦听的数据，可以监听一个或多个数据，甚至可以监听计算属性或深度侦听对象。
  - watchEffect用于创建即时执行的侦听器。它会立即执行一次传入的函数，同时会自动追踪函数内部使用到的响应式数据，无需像watch一样需手动指定侦听的具体数据，当这些数据发生变化时，会再次执行该函数。返回一个无需手动停止的函数，当组件卸载时Vue会自动停止对响应式数据的追踪，也可以显式调用返回值主动停止侦听。flush参数指定侦听器执行时机，默认pre先执行侦听器再更新dom，所有默认侦听器中获取的dom变量值是先前的，可修改为post先修改dom后执行侦听器。
  - watch监视reactive定义的响应式数据时默认自动开启了深度监视(deep为true)，并且该深度监视不可通过配置项{deep:false}关闭(deep配置项只会对属性对象生效)。
  - watch监视ref定义的[引用类型]数据：直接写数据名，监视的是源数据的[地址值(堆/栈内存的关系)]，若想深层监视对象内部的数据，则需要手动开启深度监视。修改数据中某一个属性时会出现newValue和oldValue都是同一个新值的情况，因为它们是指向同一个源对象地址(数组同理：如果直接通过数组下标索引修改某个值则newValue和oldValue也会是同一个新值的情况)。若修改了整个ref.value的值，newValue则是新的值，oldValue则是旧的值，这是因为相当于从新分配了一块内存空间，新旧数据已经不指向同一块源对象地址了。

### ref与reactive
  - 两者定义的变量都是响应式数据，底层都是proxy
  - ref常用于定义基本数据类型，也可以是对象类型(多用于数组)；若定义对象时，其底层的本质还是reactive，系统就会自动将ref转换为reactive；在js/ts中访问ref定义的变量使用.value，在template模版中使用不需要.value
  - reactive仅用于定义引用数据类型(多用于对象)，定义基本数据类型会报警告，会递归地将对象的所有属性转换为响应式数据，所以reactive的响应式是深层次的，其底层是通过ES6的Proxy来实现数据响应式，Proxy不适用于基本数据类型，相对于Vue2的Object.defineProperty，具有能监听增删操作，能监听对象属性的变化等优点
  - ref返回一个由RefImpl类构造出来的对象，reactive返回一个原始对象的响应式代理Proxy

### vite中图片动态加载方式
  - 适用于单个资源文件import img from '@/assets/xxx.png'
  - 图片在src/assets目录下单个引入
    ```
    const getAssetsImg = (url: string) => {
      // new URL中不能使用@，../为相对路径，不同位置可能不同
      return new URL(`../assets/img/${url}`, import.meta.url).href
    }
    ```
  - 图片在src/assets目录下批量引入
    ```
    // import.meta.glob不能保证每次返回时都是按照顺序返回的，若需按序排列则需进行额外处理才行
    const imgModules = import.meta.glob('/src/assets/*.{png,jpg}', { eager: true })
    const images = ref<string[]>([])
    for (const key in imgModules) {
      images.value.push(imgModules[key].default)
    }
    ```
  - 图片在public目录下
    ```
    // 1. 该目录中的资源在开发时能直接通过/根路径访问到，并且打包时会被完整复制到目标目录的根目录下(eg: public/xxx.png在源码中被引用为/xxx.png)
    // 2. 使用js方法。参数使用相对路径(eg: /public/imgs/xxx.png则imgUrl为./imgs/xxx.png)，返回图片的绝对路径
    const loadPicture = (imgUrl) => {
      let pathnameArr = location.pathname.split('/')
      let realPathArr = []
      pathnameArr.forEach(item =>{
        if(item && item.slice(-5) !== '.html') {
          realPathArr.push(item)
        }
      })
      let realPath = location.origin + '/'
      if(realPathArr.length > 0){
        realPath = realPath + realPathArr.join('/') + '/'
      }
  
      return new URL(imgUrl, realPath).href
    }
    ```

### SFC CSS Features
  - :deep()伪类深度选择器，用于样式穿透，如：.a :deep(.b)
  - :slotted()伪类，用于设置插槽样式:slotted(div) { color: red;}
  - :global()是less中的一个伪类，它可以引用全局样式，常用于修改第三方组件或模块的样式，避免再定义非scoped的style
  - CSS Modules：<style module>标签会编译为CSS Modules并且会将结果样式类以默认$style对象暴露给组件()
    ```
    // 不设置module名称则默认为$style
    template>
      <p :class="$style.red">This should be red</p>
    </template>
    <style module>
    .red {
      color: red;
    }
    </style>

    // 自定义module名称
    <template>
      <p :class="classes.red">red</p>
    </template>
    <style module="classes">
    .red {
      color: red;
    }
    </style>
    ```
  - v-bind()在css中动态绑定使用js变量
    ```
    // 非setup中直接使用变量
    <template>
      <div class="text">hello</div>
    </template>
    <script>
    export default {
      data() {
        return {
          color: 'red'
        }
      }
    }
    </script>
    <style>
    .text {
      color: v-bind(color)
    }
    </style>

    // setup中必须使用引号括起来
    <template>
      <p>hello</p>
    </template>
    <script setup>
      import { ref } from 'vue'
      const theme = ref({
        color: 'red'
      })
    </script>
    <style scoped>
      p {
        color: v-bind('theme.color')
      }
    </style>
    ```
    