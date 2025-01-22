vue3 setup语法糖与setup函数区别
  1. setup语法糖
    - 属性和方法无需return返回，可直接使用。
    - 引入的组件可以自动注册，不需要再通过components进行注册，而且无法指定当前组件的名称，会自动以文件名为主，省去了name属性。
    - 有更好的运行时性能。
    - 使用defineProps({prop1: String, prop2: Boolean})接收props中的数据。
    - useAttrs方法获取attrs属性；useSlots方法获取slots插槽；defineEmits方法获取emit自定义事件。
    - 组件默认不会对外暴露任何内部声明的属性。如果有部分属性要暴露出去，可以使用 defineExpose。
  2. setup函数
    - setup(props, context)接收两个参数。props参数接收传递的数据(需使用props接收)；context上下文环境，其中包含了属性attrs、插槽slots、自定义事件emit、暴露公共属性(函数)expose四部分。

  ```
    // setup函数
    <template>
      <div>{{todoList}}</div>
      <span>{{prop1}} {{prop2}}</span>
      <CompA></CompA>
      <comp-a></comp-a>
    </template>
    <script>
      import CompA from './CompA.vue'
      import { toRefs } from 'vue'
      export default {
        components: {
          CompA
        },
        props: {
          prop1: String,
          prop2: Boolean
        },
        setup(props, context) {
          const {prop1, prop2} = toRefs(props)
          let todoList = [
            {todo: 'xxx', isCheck: false},
            {todo: 'xxx', isCheck: true}
          ]

          const { attrs, slots, emit, expose } = context

          // 也可以使用expose保留属性和方法然后返回其他渲染内容
          // expose({
          //  todoList,
          //  prop1,
          //  prop2
          // })

          // 返回的对象暴露给模板和组件实例
          return {
            todoList,
            prop1,
            prop2
          }
        }
      }
    </script>
    
    // setup语法糖
    <template>
      <div>{{todoList}}</div>
      <span>{{prop1}} {{prop2}}</span>
      <CompA></CompA>
      <comp-a></comp-a>
    </template>
    <script setup>
      import CompA from './CompA.vue'
      import { toRefs, useAttrs, useSlots } from 'vue'
  
      // defineProps、defineEmits、defineExpose都是只能在语法糖中使用的编译器宏。不需要导入，且会随着<script setup>的处理过程一同被编译掉
      const props = defineProps({
        prop1: String,
        prop2: Boolean
      })
      const { prop1, prop2 } = toRefs(props)
      let todoList = [
        {todo: 'xxx', isCheck: false},
        {todo: 'xxx', isCheck: true}
      ]

      const slots = useSlots()
      const attrs = useAttrs()
      const emits = defineEmits(['cancel', 'confirm'])
      
      const cancelClick = () => {
        emits('cancel')
      }
      const confirmClick = () => {
        emits('confirm', xxx)
      }
      const show = () => {
        // todo: xxx
      }

      // defineExpose仅在setup语法糖中可使用
      defineExpose({
        todoList,
        show
      })
    </script>
  ```