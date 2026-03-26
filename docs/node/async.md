# 异步编程

> Node.js 采用异步非阻塞 I/O 模型，掌握异步编程是 Node.js 开发的核心

## 异步编程模式

### 回调函数

```js
// 异步读取文件
const fs = require('fs')

fs.readFile('./test.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error('读取失败:', err)
    return
  }
  console.log('文件内容:', data)
})

console.log('继续执行...') // 先执行
```

### 回调地狱

```js
// 回调地狱示例
fs.readFile('./a.txt', (err, data) => {
  fs.readFile('./b.txt', (err, data) => {
    fs.readFile('./c.txt', (err, data) => {
      // 嵌套越来越深，难以维护
    })
  })
})
```

## Promise

Promise 解决了回调地狱的问题。

### 基本用法

```js
// 创建 Promise
const promise = new Promise((resolve, reject) => {
  // 异步操作
  fs.readFile('./test.txt', 'utf-8', (err, data) => {
    if (err) reject(err)
    else resolve(data)
  })
})

// 使用 Promise
promise
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

### Promise 链式调用

```js
// 链式调用
fs.promises.readFile('./a.txt', 'utf-8')
  .then(data => {
    console.log('a:', data)
    return fs.promises.readFile('./b.txt', 'utf-8')
  })
  .then(data => {
    console.log('b:', data)
    return fs.promises.readFile('./c.txt', 'utf-8')
  })
  .then(data => console.log('c:', data))
  .catch(err => console.error(err))
```

### Promise 方法

```js
// Promise.all - 所有都完成
Promise.all([
  fs.promises.readFile('./a.txt'),
  fs.promises.readFile('./b.txt'),
  fs.promises.readFile('./c.txt')
]).then(([a, b, c]) => {
  console.log(a, b, c)
})

// Promise.race - 任意一个完成
Promise.race([
  fetch('https://api1.com'),
  fetch('https://api2.com')
]).then(res => console.log(res))

// Promise.allSettled - 所有完成（不论成功失败）
Promise.allSettled([
  fs.promises.readFile('./a.txt'),
  fs.promises.readFile('./not-exist.txt')
]).then(results => {
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      console.log(`文件${i}:`, result.value)
    } else {
      console.log(`文件${i}失败:`, result.reason)
    }
  })
})
```

## async/await

async/await 是 Promise 的语法糖，让异步代码看起来像同步代码。

### 基本用法

```js
async function readFiles() {
  try {
    const a = await fs.promises.readFile('./a.txt', 'utf-8')
    const b = await fs.promises.readFile('./b.txt', 'utf-8')
    const c = await fs.promises.readFile('./c.txt', 'utf-8')
    console.log(a, b, c)
  } catch (err) {
    console.error(err)
  }
}

readFiles()
```

### 箭头函数写法

```js
const readFiles = async () => {
  const [a, b, c] = await Promise.all([
    fs.promises.readFile('./a.txt', 'utf-8'),
    fs.promises.readFile('./b.txt', 'utf-8'),
    fs.promises.readFile('./c.txt', 'utf-8')
  ])
  return { a, b, c }
}
```

### 并行 vs 串行

```js
// 串行：一个个执行（较慢）
async function serial() {
  const a = await fetchA()
  const b = await fetchB()
  const c = await fetchC()
}

// 并行：同时执行（较快）
async function parallel() {
  const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()])
}
```

## 错误处理

### try/catch

```js
async function readFile() {
  try {
    const data = await fs.promises.readFile('./test.txt', 'utf-8')
    console.log(data)
  } catch (err) {
    console.error('读取失败:', err)
  }
}
```

### Promise 错误处理

```js
// catch 方法
promise
  .then(data => console.log(data))
  .catch(err => console.error(err))

// finally 方法
promise
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => console.log('完成'))
```

## 常用异步模块

### fs.promises

```js
const fs = require('fs/promises')

async function main() {
  const data = await fs.readFile('./test.txt', 'utf-8')
  await fs.writeFile('./output.txt', data)
  await fs.mkdir('./dir', { recursive: true })
  const files = await fs.readdir('./dir')
}

main()
```

### 其他 promisify

```js
const { promisify } = require('util')
const sleep = promisify(setTimeout)

async function demo() {
  console.log('开始')
  await sleep(1000)
  console.log('1秒后')
}
```

## 最佳实践

1. **优先使用 async/await**：代码更易读
2. **使用 Promise.all 并行处理**：提高性能
3. **正确处理错误**：使用 try/catch
4. **避免回调地狱**：使用 Promise 或 async/await
5. **不要忽略 await 错误**：每个 await 都可能失败
