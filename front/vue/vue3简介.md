# 1. Composition API

## 1.1 setup 函数
Vue3引入了 `setup` 函数作为组件的入口点，它在组件实例创建之前执行，使得开发者能够更灵活地组织组件逻辑。
- `setup` 函数可以访问 `props` 和 `context`，其中 `context` 包含了 `attrs`、`slots`、`emit` 等属性，提供了对组件上下文的完整访问。
- `setup` 函数的执行时机早于 `beforeCreate` 钩子，这意味着在 `setup` 中无法访问 `data`、`computed`、`methods` 等选项，但可以通过 `setup` 返回的响应式数据和函数来实现相同的功能。

## 1.2 ref 和 reactive
`ref` 和 `reactive` 是 Vue3中用于创建响应式数据的两个核心函数。
- `ref` 用于处理基础数据类型，返回一个包含 `.value` 属性的响应式引用对象，通过 `.value` 属性来访问和修改，使得对基础类型的响应式状态管理变得简单。
- `reactive` 用于处理对象和数组等，将其转换为响应式对象，支持深层次的响应式状态管理，直接修改对象属性即可访问修改。

## 1.3 toRef 和 toRefs
`toRef` 和 `toRefs` 用于将 `reactive` 对象中的属性转换为单独的响应式引用。
- `toRef` 创建一个针对 `reactive` 对象中特定属性的响应式引用。
- `toRefs` 将 `reactive` 对象中的所有属性都转换为独立的响应式引用，便于在 `setup` 函数中解构使用。

## 1.4 readonly
`readonly` 函数用于创建响应式数据的只读版本，可以用于保护组件的状态不被外部直接修改。
- 当尝试修改只读响应式数据时，Vue会抛出错误，这有助于开发者识别和防止意外的数据变更。

## 1.5 computed 计算属性
`computed` 函数用于创建基于响应式依赖的计算属性。
- 计算属性会对其依赖进行跟踪，并在其依赖发生变化时重新计算值。
- 计算属性的 getter 和 setter 都可以用来创建派生状态，使得状态管理更加声明式和可预测。

## 1.6 watch 和 watchEffect
`watch` 和 `watchEffect` 提供了对响应式数据的观察和副作用执行的能力。
- `watch` 允许指定特定的响应式数据源，并在数据变化时执行回调函数，支持惰性观察和立即执行。
- `watchEffect` 自动收集其回调函数中用到的响应式数据，并在任何依赖改变时重新运行，适用于需要立即执行并响应依赖变化的场景。
  
# 2. 性能提升

## 2.1 更快的渲染
Vue3引入了全新的虚拟DOM算法，优化了组件的初始化和更新过程。通过静态节点提升（Static Tree Hoisting）和对 diff 算法的改进，Vue3能够更高效地处理大规模的DOM更新，从而提升了渲染性能。

- **静态节点提升**：Vue3在编译阶段会识别并提升不会变化的静态节点，这些节点在初次渲染后会被缓存，后续的更新中不再进行不必要的比较和渲染，显著减少了渲染成本。

- **优化的 diff 算法**：Vue3对 diff 算法进行了优化，通过更智能的比较策略，减少了不必要的DOM操作。算法能够更快地识别出变化的部分，并只对这些部分进行更新，从而提高了渲染效率。

- **异步组件和 Suspense**：Vue3引入了基于 Promise 的异步组件支持，配合 Suspense 组件，可以更优雅地处理组件加载状态，提升用户体验。

## 2.2 更小的包体积
Vue3通过模块化的设计和 Tree Shaking 支持，使得最终打包的文件体积大幅减小。

- **模块化设计**：Vue3将核心功能拆分成独立的模块，开发者可以根据需要按需引入，这样不仅减少了代码的冗余，也使得最终的打包体积更小。

- **Tree Shaking**：Vue3支持 Tree Shaking，这意味着在构建过程中，未使用的代码会被移除，从而减少了最终打包体积。这种优化对于大型项目尤其有效，可以显著减少加载时间和带宽消耗。

## 2.3 更好的 Tree-Shaking 支持
Vue3提供了更好的 Tree-Shaking 支持，这使得开发者可以更精确地控制哪些代码被包含在最终的打包文件中。

- **代码分割和按需加载**：Vue3支持代码分割和按需加载，这意味着应用的不同部分可以被分割成多个代码块，只有在需要时才会加载，这样可以减少应用的初始加载时间。

- **更细粒度的 API 分割**：Vue3将 API 分割得更细，使得开发者可以只引入所需的部分，而不是整个库，这样可以进一步提高 Tree Shaking 的效果。

- **构建工具的优化**：Vue3与现代构建工具（如 Vite、Webpack）的集成更加紧密，这些工具提供了更先进的 Tree Shaking 策略，可以更有效地移除未使用的代码。

# 3. 新组件和特性

## 3.1 Teleport
Teleport 是 Vue3引入的一个创新特性，它允许开发者将组件的子组件“传送”到DOM中的任意位置，而不仅仅是它们的直接父级内部。这一功能在处理如模态框、弹出菜单、提示框等需要从其原始位置在视觉上移动到其他地方的用户界面元素时特别有用。

- **基本用法**：通过 `to` 属性指定目标容器，Teleport 可以将内容渲染到指定的DOM节点中。例如，将模态框渲染到 `body` 元素中，以确保它能够覆盖整个页面。
- **动态目标**：`to` 属性可以是动态的，允许在运行时改变 Teleport 内容的目标位置，这为构建响应用户交互的 UI 提供了灵活性。
- **性能考虑**：虽然 Teleport 提供了极大的灵活性，但频繁地移动DOM元素可能会影响性能。开发者应避免在 Teleport 中使用复杂的组件结构，以减少性能损耗。

## 3.2 Suspense
Suspense 是 Vue3中用于处理异步组件加载的内置组件，它允许开发者在等待异步组件加载时显示备用内容，从而提供更平滑的用户体验。

- **异步组件**：Suspense 可以包裹异步组件，当组件正在加载时，显示一个回退内容（如加载指示器），组件加载完成后显示实际内容。
- **错误处理**：虽然 Suspense 本身不提供错误处理机制，但可以通过在父组件中使用 `errorCaptured` 钩子来捕获和处理异步组件加载过程中可能出现的错误。
- **事件处理**：Suspense 组件会触发 `pending`、`resolve` 和 `fallback` 三个事件，分别对应于进入挂起状态、异步依赖完成和回退内容显示时。

## 3.3 Fragment 多根节点支持
Vue3正式支持多根节点组件，也称为 Fragment，这使得开发者可以创建包含多个根节点的组件，而不需要将它们包裹在一个额外的元素中。

- **使用场景**：在 Vue2.x 中，组件必须有一个单一的根节点。在 Vue3中，开发者可以更自然地渲染多个同级元素，如布局组件中的 `<header>`、`<main>` 和 `<footer>`。
- **属性透传**：当组件包含多个根节点时，可以使用 `v-bind` 指令将属性透传到所有的根节点上，确保样式和功能的正确应用。
- **性能优化**：多根节点的支持减少了不必要的DOM包裹元素，从而减少了DOM操作和提高了渲染性能。同时，它也使得组件的结构更加清晰，有助于维护和理解。

# 4. TypeScript 支持

## 4.1 类型定义增强
Vue3通过与 TypeScript 的紧密集成，提供了更强大的类型定义和类型推断能力，这在定义组件、处理数据和编写函数时尤为突出。

- **组件定义强化**：Vue3允许开发者使用 TypeScript 的类类型（class）或接口（interface）来定义组件的 props、data、computed 属性和 methods，从而提供更精确的类型检查。例如，使用 `defineComponent` 方法可以确保组件的选项被正确地类型推断。

  ```typescript
  import { defineComponent, PropType } from 'vue'

  interface Book {
    title: string
    author?: string
    publishedYear: number
  }

  export default defineComponent({
    props: {
      myBook: {
        type: Object as PropType<Book>,
        required: true
      }
    },
    setup(props) {
      console.log(props.myBook.title) // 类型安全
    }
  })
  ```

- **泛型和自定义类型**：Vue3支持 TypeScript 的泛型和自定义类型，使得开发者可以创建更具表现力和可重用性的组件。例如，可以定义一个泛型组件，它可以接受不同类型的数据。

  ```typescript
  import { defineComponent } from 'vue'

  type ListItem = { id: number name: string }

  const ListComponent = defineComponent<{ items: ListItem[] }>({
    props: ['items'],
    setup(props) {
      // props.items 被推断为 ListItem[]
    }
  })
  ```

- **响应式系统的类型安全**：Vue3的响应式系统（如 `ref` 和 `reactive`）与 TypeScript 紧密集成，确保了在操作响应式数据时的类型安全。

  ```typescript
  import { ref, reactive } from 'vue'

  const count = ref<number>(0) // 明确的类型注解
  const state = reactive<{ count: number }>({ count: 0 }) // 响应式对象的类型注解
  ```

- **工具类型**：Vue3利用 TypeScript 的工具类型（如 `Partial`、`Readonly`、`Pick` 等）来处理组件的属性和状态，使得代码更加灵活和安全。

  ```typescript
  import { defineComponent, PropType } from 'vue'

  interface Book {
    title: string
    author: string
    publishedYear: number
  }

  const BookComponent = defineComponent({
    props: {
      details: {
        type: Object as PropType<Partial<Book>>,
        default: () => ({ title: '', author: '', publishedYear: 0 })
      }
    }
  })
  ```

- **模板中的类型检查**：在 Vue3中，即使在模板（`.vue` 文件）中，TypeScript 也能提供类型检查，确保模板表达式和绑定的类型安全。

  ```vue
  <template>
    <div>{{ book.title }}</div>
  </template>

  <script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      book: {
        type: Object as PropType<{ title: string }>,
        required: true
      }
    }
  })
  </script>
  ```

- **自定义 Hooks**：Vue3支持使用 TypeScript 编写自定义 Hooks，这些 Hooks 可以带有类型注解，使得它们在不同的组件间重用时更加安全和可靠。

  ```typescript
  import { ref, watch } from 'vue'

  function useTitle(title: string) {
    const titleRef = ref(title)
    watch(titleRef, (newTitle) => {
      document.title = newTitle
    })
    return titleRef
  }
  ```

# 5. 改进的 API

## 5.1 应用实例创建
Vue3通过 `createApp` 函数创建应用实例，这是构建Vue应用的起点。与Vue2相比，Vue 3的实例创建更加简洁和模块化。
- `createApp` 函数取代了Vue2中的 `new Vue()`，使得创建实例更加直观。
- 应用实例可以注册全局组件、指令和插件，提供了链式调用的方法，使得代码更加清晰。
- 例如，创建一个Vue 3应用实例并注册一个全局组件可以这样写：
  ```javascript
  import { createApp } from 'vue'
  import App from './App.vue'

  const app = createApp(App)
  app.mount('#app')
  ```
- 这种创建方式支持更好的模块化和树摇（tree-shaking），有助于减少最终打包文件的大小。

## 5.2 生命周期钩子
Vue3引入了Composition API，提供了一套新的生命周期钩子，与Vue2的选项式API中的生命周期钩子相比，它们更加灵活和一致。
- 新增的生命周期钩子包括 `setup`、`onBeforeMount`、`onMounted`、`onBeforeUpdate`、`onUpdated`、`onBeforeUnmount` 和 `onUnmounted`。
- 这些钩子函数在 `setup` 函数中使用，允许开发者在组件的不同阶段执行代码。
- 例如，使用 `onMounted` 钩子来执行组件挂载后的代码：
  ```javascript
  import { onMounted } from 'vue'

  export default {
    setup() {
      onMounted(() => {
        console.log('组件已挂载')
      })
    }
  }
  ```
- 生命周期钩子的引入使得组件的生命周期管理更加直观和灵活。

## 5.3 自定义指令
Vue3对自定义指令进行了改进，使其更加强大和灵活。
- 自定义指令允许开发者对DOM元素进行底层操作，提供了一种封装DOM操作逻辑的方式。
- Vue 3中自定义指令的注册方式更加简洁，可以直接在组件中使用 `directives` 选项进行局部注册，或者使用 `app.directive` 方法进行全局注册。
- 自定义指令可以定义多个钩子函数，如 `created`、`beforeMount`、`mounted`、`beforeUpdate`、`updated`、`beforeUnmount` 和 `unmounted`。
- 例如，创建一个自定义指令来控制元素的焦点：
  ```javascript
  import { createApp } from 'vue'

  const app = createApp({})

  app.directive('focus', {
    mounted(el) {
      el.focus()
    }
  })

  app.mount('#app')
  ```
- 自定义指令的改进使得Vue 3在处理DOM元素时更加灵活和强大。

# 6. 其他改进

## 6.1 静态提升
静态提升是 Vue3的一项编译优化特性，它能够提高应用的渲染性能。
- 通过静态提升，Vue3能够在编译时识别出模板中的静态内容（不依赖于响应式数据的内容），并在渲染函数外部生成这些静态内容的虚拟DOM。这样，在后续的渲染过程中，这些静态内容就不需要每次都重新创建，从而减少了不必要的计算和DOM操作。
- 根据官方文档和社区的测试，静态提升可以显著减少组件重新渲染时的开销，尤其是在大型列表或高频更新的场景中，性能提升尤为明显。
- 静态提升的实现依赖于Vue3重写的编译器，它能够更智能地分析模板并进行优化。这一特性的引入，使得Vue3在性能上有了质的飞跃，更加适合用于构建大型、复杂的前端应用。

## 6.2 内部代码重构
Vue3进行了全面的内部代码重构，使用了TypeScript进行编写，提高了代码的可维护性和健壮性。
- Vue3的重构包括了对响应式系统的重写，采用了基于Proxy的实现，替代了Vue2中的Object.defineProperty方案。新的响应式系统不仅提供了更好的性能，还解决了Vue2中某些边缘情况的问题。
- 重构后的代码更加模块化，易于理解和扩展。Vue3采用了monorepo的项目管理方式，将框架的不同部分拆分成独立的包，便于单独维护和更新。
- 内部代码的重构还包括了对虚拟DOM的优化，使得Vue3的虚拟DOM变得更加轻量和高效。这些改进使得Vue3在运行时性能上有了显著提升，尤其是在组件初始化和更新时的效率。
- 除了性能提升，Vue3的重构还带来了更好的TypeScript支持，使得开发者能够享受到TypeScript带来的类型安全和开发体验优势。重构后的代码也更加符合现代JavaScript开发的标准和实践。
