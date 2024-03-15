# EventLoop事件循环机制



> JS的运行机制就是事件循环!

## JS的执行顺序是什么？

1. JS是从上到下一行一行执行。
2. 如果某一行执行报错，则停止执行下面的代码。
3. 先执行同步代码，再执行异步代码

正确的执行顺序应该是序号1>3>2![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c17a2aaa70db4ecc92b809cfcdca68aa~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)



## 事件循环的执行过程

- 同步代码，调用栈执行后直接出栈

- 异步代码，放到Web API中，等待时机，等合适的时候放入回调队列（callbackQueue），等到调用栈空时eventLoop开始工作，轮询

  ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/470b695effb04555928976504bb518c5~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)



## 微任务和宏任务

<a href="https://www.bilibili.com/video/BV1G84y1B7hZ" target="_blank">事件循环-宏任务和微任务bilibili</a>

  - 微任务是由ES6语法规定的，包括：

    > Promise.then()（Promise本身是同步的，then/catch的回调函数是异步的）
    >
    > async/await
    >
    > object.observe
    >
    > process.nextTick(node)

  - 宏任务是由宿主环境（浏览器/node）规定的，包括：

    > 定时器
    >
    > 事件（例如：点击）
    >
    > ajax请求

微任务执行时机比宏任务要早

微任务在DOM渲染前触发，宏任务在DOM渲染后触发



## 事件循环的整体流程

1. 先清空call stack中的同步代码
2. 执行微任务队列中的微任务
3. 尝试DOM渲染
4. 触发Event Loop反复询问callbackQueue中是否有要执行的语句，有则放入call back继续执行![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97161f74e2e7494bad644e28e22bcf4e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)



## 事件循环经典案例

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbd9cfac79eb4e0896b82f2ae4074d6a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

 