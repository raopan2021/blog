# events 模块（事件驱动）

> events 模块实现了事件的发布/订阅模式，是 Node.js 事件驱动架构的核心

## 基本用法

```js
const EventEmitter = require('events')

// 创建事件发射器实例
const emitter = new EventEmitter()

// 注册事件监听
emitter.on('message', (data) => {
  console.log('收到消息:', data)
})

// 触发事件
emitter.emit('message', 'Hello World')
```

## on vs once

```js
// on：持续监听（可触发多次）
emitter.on('event', () => console.log('触发'))
emitter.emit('event') // 输出
emitter.emit('event') // 输出

// once：只触发一次
emitter.once('event', () => console.log('只触发一次'))
emitter.emit('event') // 输出
emitter.emit('event') // 不输出
```

## 事件监听器方法

```js
const EventEmitter = require('events')
const emitter = new EventEmitter()

// 注册监听
emitter.on('message', handler)

// 移除指定监听
emitter.off('message', handler)
// 或
emitter.removeListener('message', handler)

// 移除所有监听
emitter.removeAllListeners('message')

// 移除所有监听（所有事件）
emitter.removeAllListeners()

// 返回监听器数量
console.log(emitter.listenerCount('message')) // 1

// 返回所有监听器数组
console.log(emitter.listeners('message'))

// 检查是否有监听
console.log(emitter.hasListeners('message')) // true
```

## 传递参数

```js
emitter.on('user', (name, age) => {
  console.log(`${name}, ${age}岁`)
})

emitter.emit('user', '张三', 18)
// 输出: 张三, 18岁
```

## 错误处理

```js
// 未捕获错误会导致进程崩溃
emitter.emit('error', new Error('出错了！'))

// 推荐写法：监听 error 事件
emitter.on('error', (err) => {
  console.error('发生错误:', err.message)
})

// 或使用 captureRejections（Node.js 14+）
const emitter = new EventEmitter({ captureRejections: true })
emitter.on('error', (err) => {
  console.error('错误:', err.message)
})
```

## 继承 EventEmitter

```js
const EventEmitter = require('events')

class MyEmitter extends EventEmitter {
  constructor() {
    super()
  }

  // 封装业务逻辑
  sendMessage(msg) {
    console.log('发送消息:', msg)
    this.emit('message', msg)
  }
}

const myEmitter = new MyEmitter()

myEmitter.on('message', (msg) => {
  console.log('收到消息:', msg)
})

myEmitter.sendMessage('Hello')
```

## 同步 vs 异步

> 事件监听是同步执行的，按注册顺序依次调用

```js
emitter.on('event', () => console.log('第一个'))
emitter.on('event', () => console.log('第二个'))

emitter.emit('event')
// 输出:
// 第一个
// 第二个
```

如果需要异步执行：

```js
emitter.on('event', () => {
  setImmediate(() => {
    console.log('异步执行')
  })
})
```

## 常用内置事件（HTTP 示例）

```js
const http = require('http')

const server = http.createServer()

// HTTP 服务器内置事件
server.on('request', (req, res) => {
  console.log('收到请求')
})

server.on('connection', (socket) => {
  console.log('有新的连接')
})

server.on('close', () => {
  console.log('服务器关闭')
})
```

## newListener 和 removeListener

```js
// 新增监听器时触发（可用于调试）
emitter.on('newListener', (event, listener) => {
  console.log(`新增监听: ${event}`)
})

// 移除监听器时触发
emitter.on('removeListener', (event, listener) => {
  console.log(`移除监听: ${event}`)
})
```

## EventEmitter.defaultMaxListeners

> 默认最大监听器数量为 10，超过会警告

```js
// 设置全局默认最大监听数
EventEmitter.defaultMaxListeners = 20

// 或在实例上设置
emitter.setMaxListeners(20)

// 获取最大监听数
console.log(emitter.getMaxListeners())
```

## 实际应用：发布订阅系统

```js
class EventBus extends EventEmitter {
  constructor() {
    super()
    this.handlers = {}
  }

  // 订阅
  subscribe(event, handler) {
    this.on(event, handler)
  }

  // 发布
  publish(event, data) {
    this.emit(event, data)
  }

  // 取消订阅
  unsubscribe(event, handler) {
    this.off(event, handler)
  }
}

// 使用
const bus = new EventBus()

bus.subscribe('user:login', (user) => {
  console.log('用户登录:', user.name)
})

bus.publish('user:login', { name: '张三', time: new Date() })
```
