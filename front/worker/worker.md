# 前端多线程之Worker

### 简述
  - Worker可以在独立于主线程的后台独立线程中运行一个脚本操作(可执行费时的处理任务)，从而允许主线程(通常是UI线程)不会因此被阻塞/放慢。
  - worker就是为了JavaScript创造多线程环境，允许主线程创建Worker线程，将一些任务分配给后者运行。开启后台线程在不影响前台线程的前提下做一些耗时或者异步的操作。因为是不同的线程，所以主线程与worker线程互不干扰。也不会相互打断。所以在一些场景可以提高页面的流程性。Worker线程一旦新建成功就会始终运行，不会被主线程上的活动(比如用户点击按钮、提交表单)打断。这样有利于随时响应主线程的通信。但是这也造成了Worker比较耗费资源，不应该过度使用，一旦使用完毕就应该关闭。
  - 依赖于隔离环境的Worker没有权限访问其创建页面中其他变量和代码，反之，后者也无法访问Worker中的变量。数据通信的唯一方式就是调用postMessage，它会将传递信息复制一份，并在接收端触发message事件。隔离环境也意味着Worker无法访问DOM，在Worker中也就无法更新UI，除非付出巨大的努力(比如AMP的worker-dom)。

### 使用规则
  - 必须同源：也就是说js文件的路径必须和主线程的脚本同源。防止了外部引用
  - dom限制：在worker线程中不能操作dom(document，window，parent)。可以使用浏览器的navigator和location对象，也不能使用webSockets，IndexedDB这些数据存储机制
  - 通讯限制：worker线程和主线程不在一个上下文中所以不能直接通讯。也就是说主线程定义的变量在worker中也是不能使用的。只能通过消息完成
  - 提示禁止：worker线程不能alert和confirm
  - 传值dom：进行消息通讯也不能传值dom只能是变量
  - ie限制：ie9不能使用

### 使用流程
  - 主线程创建Worker对象
  - 给Worker对象绑定message监听事件，监听新线程传递的信息
  - 给新线程的self对象(当前window对象的一个引用)绑定message监听事件，监听主线程传递的信息
  - 两线程之间通过postMessage传递数据
  
### 常用属性方法
  - onerror: 在error事件发生时调用的函数，并且通过该函数冒泡worker(eg:`worker.onerror=function(){....}`)
  - onmessageerror: 在消息传递过程出现错误的属性事件。(eg: `worker.onmessageerror=function(){....}`)
  - onmessage: worker中message事件发生时用来接收数据(eg:`worker.onmessage=function(){....}`)。常与postMessage事件同时使用
  - postMessage：向线程worker的内部范围发送消息，可以设置参数，发送给worker线程的数据，在onmessage中接收
  - terminate：过多的开启worker线程非常浪费资源，所以在使用过后可以使用terminate终止它(eg: `worker.terminate()`)
  - close: 在worker线程自身也可以使用self.close()关闭

### 相关框架
  - Comlink: 一个底层使用RPC协议的库，它能帮助实现主线程和Worker互相访问彼此对象。使用Comlink的时候，不需要管postMessage
