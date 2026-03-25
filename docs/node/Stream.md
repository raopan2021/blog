# Stream 流

> Stream 是 Node.js 处理流式数据的抽象接口，用于处理大量数据或实时数据

## 四种基本流

| 类型 | 方向 | 说明 |
|------|------|------|
| Readable | 可读 | 数据的来源（如文件读取、网络请求） |
| Writable | 可写 | 数据的目的地（如文件写入、网络响应） |
| Duplex | 双工 | 同时可读可写（如 TCP Socket） |
| Transform | 转换 | 在读写过程中修改数据（如压缩、加密） |

## Readable 流（可读流）

```js
const { Readable } = require('stream')

// 消费数据
const readable = Readable.from(['hello', 'world'])

readable.on('data', (chunk) => {
  console.log('收到数据:', chunk.toString())
  // 输出:
  // 收到数据: hello
  // 收到数据: world
})

readable.on('end', () => {
  console.log('数据接收完毕')
})
```


### 两种读取模式

```js
const fs = require('fs')

// 流动模式（默认）- 自动推送数据
const stream1 = fs.createReadStream('./big-file.txt')
stream1.on('data', (chunk) => {
  console.log('收到:', chunk.toString().substring(0, 50))
})

// 暂停模式 - 手动控制
const stream2 = fs.createReadStream('./big-file.txt')

stream2.on('readable', () => {
  let chunk
  while ((chunk = stream2.read()) !== null) {
    console.log('收到:', chunk.toString().substring(0, 50))
  }
})
```


## Writable 流（可写流）

```js
const { Writable } = require('stream')

// 创建可写流（写入文件）
const fs = require('fs')
const writeStream = fs.createWriteStream('./output.txt')

writeStream.write('第一行数据\n')
writeStream.write('第二行数据\n')
writeStream.end('最后一行') // 结束写入

writeStream.on('finish', () => {
  console.log('写入完成')
})

writeStream.on('error', (err) => {
  console.error('写入失败:', err)
})
```


## pipe（管道）

> pipe 是连接可读流和可写流的最简单方式

```js
const fs = require('fs')

// 文件复制（边读边写，不会一次性加载到内存）
const readStream = fs.createReadStream('./source.txt')
const writeStream = fs.createWriteStream('./dest.txt')

// pipe 自动处理背压（backpressure）
readStream.pipe(writeStream)

writeStream.on('finish', () => {
  console.log('复制完成')
})
```


### 常用 pipe 操作

```js
const fs = require('fs')
const zlib = require('zlib')

// 文件压缩
fs.createReadStream('./input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('./input.txt.gz'))

// 解压
fs.createReadStream('./input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('./input.txt'))

// 链式处理
fs.createReadStream('./input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(zlib.createDeflate())
  .pipe(fs.createWriteStream('./output.txt.gz'))
```


## Transform 流（转换流）

```js
const { Transform } = require('stream')

// 创建转换流：大写转换器
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    // 将数据转为大写
    this.push(chunk.toString().toUpperCase())
    callback() // 完成处理
  }
})

// 使用
const fs = require('fs')

fs.createReadStream('./input.txt')
  .pipe(upperCase)
  .pipe(fs.createWriteStream('./output.txt'))

// 或者直接使用
upperCase.write('hello')
upperCase.push('WORLD')
```


## HTTP 中的 Stream

```js
const http = require('http')
const fs = require('fs')

// 服务端：流式响应大文件
const server = http.createServer((req, res) => {
  const stream = fs.createReadStream('./big-file.txt')

  res.setHeader('Content-Type', 'text/plain')
  // pipe 自动处理背压
  stream.pipe(res)

  stream.on('error', (err) => {
    console.error('读取文件失败:', err)
    res.statusCode = 500
    res.end('Server Error')
  })
})

server.listen(3000)

// 客户端：流式下载
const file = fs.createWriteStream('./downloaded.txt')
http.get('http://localhost:3000/file', (res) => {
  res.pipe(file)

  file.on('finish', () => {
    console.log('下载完成')
  })
})
```


## Stream 事件

```js
const readable = fs.createReadStream('./test.txt')

// 可读流事件
readable.on('data', (chunk) => { /* 处理数据 */ })
readable.on('end', () => { /* 数据读完 */ })
readable.on('error', (err) => { /* 出错 */ })
readable.on('close', () => { /* 流关闭 */ })

// 可写流事件
const writable = fs.createWriteStream('./output.txt')
writable.on('finish', () => { /* 写入完成 */ })
writable.on('error', (err) => { /* 写入失败 */ })

// pipe 事件
readable.pipe(writable)
writable.on('pipe', (src) => { /* 开始 pipe */ })
writable.on('unpipe', (src) => { /* 取消 pipe */ })
```


## backpressure（背压）

> 当写入速度跟不上读取速度时，pipe 会自动暂停读取，避免内存溢出

```js
// 手动处理背压
readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk)
  if (!canContinue) {
    readable.pause() // 暂停读取
    writable.once('drain', () => { // 等缓冲区清空
      readable.resume() // 恢复读取
    })
  }
})
```


## 流式处理大文件示例

```js
const fs = require('fs')
const readline = require('readline')

// 逐行读取大文件（不会把整个文件加载到内存）
async function processLargeFile(filePath) {
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  let lineNumber = 0

  for await (const line of rl) {
    lineNumber++
    console.log(`${lineNumber}: ${line}`)
  }

  console.log(`共处理 ${lineNumber} 行`)
}

processLargeFile('./large-file.txt')
```


## 判断是否为 Stream

```js
const { isStream, isReadable, isWritable } = require('stream')

const readable = fs.createReadStream('./test.txt')

console.log(isStream(readable))      // true
console.log(isReadable(readable))    // true
console.log(isWritable(readable))     // false
```


## 实用场景

1. **文件处理**：大文件复制、压缩、解压
2. **网络传输**：HTTP 大文件下载/上传
3. **日志处理**：实时日志分析
4. **数据处理**：CSV/JSON 流式解析
5. **媒体处理**：音视频流处理
