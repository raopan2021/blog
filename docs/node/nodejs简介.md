# Node.js 简介

> Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境

## 什么是 Node.js

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，让 JavaScript 可以在服务器端运行。

## Node.js 特点

### 单线程

Node.js 采用单线程模型，通过事件循环和非阻塞 I/O 来处理并发请求。

```js
// 单线程示例
console.log('开始')

setTimeout(() => {
  console.log('定时器')
}, 1000)

console.log('结束')
// 输出: 开始 -> 结束 -> 定时器
```

### 非阻塞 I/O

Node.js 的 I/O 操作是异步的，不会阻塞主线程。

```js
const fs = require('fs')

// 非阻塞读取
fs.readFile('./test.txt', 'utf-8', (err, data) => {
  if (err) throw err
  console.log('文件内容:', data)
})

console.log('读取文件中...') // 这行会先执行
```

### 事件驱动

Node.js 通过事件循环来处理回调函数。

```js
const EventEmitter = require('events')
const emitter = new EventEmitter()

emitter.on('greet', () => {
  console.log('你好！')
})

emitter.emit('greet') // 触发事件
```

## 模块系统

Node.js 使用模块系统来组织代码，主要有 CommonJS 和 ES Module 两种方式。

### CommonJS（Node.js 默认）

```js
// 导出
module.exports = { name: 'test' }

// 导入
const test = require('./test')
```

### ES Module

```js
// 导出
export const name = 'test'

// 导入
import { name } from './test'
```

## Node.js 能做什么

1. **后端服务**：API 服务器、RESTful API
2. **命令行工具**：脚手架、构建工具
3. **前端工具**：Webpack 插件、Vite 插件
4. **实时应用**：聊天应用、在线协作
5. **桌面应用**：Electron 应用
6. **爬虫和数据处理**：文件处理、网络请求

## 安装 Node.js

推荐使用 nvm（Node Version Manager）来管理 Node.js 版本。

```bash
# 使用 nvm 安装
nvm install 18
nvm use 18
```

## 第一个 Node.js 程序

```js
// hello.js
console.log('Hello, Node.js!')

// 运行
node hello.js
```

## 常用内置模块

| 模块 | 说明 |
|------|------|
| fs | 文件系统操作 |
| http | 创建 HTTP 服务 |
| path | 路径处理 |
| url | URL 解析 |
| querystring | 查询字符串解析 |
| crypto | 加密模块 |
| events | 事件模块 |
| stream | 流操作 |
| buffer | 缓冲区 |
