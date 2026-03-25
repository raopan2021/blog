# Buffer 缓冲区

> Buffer 用于处理二进制数据，在 Node.js 中用于处理文件、网络 streams 等

## 创建 Buffer

```js
// 从字符串创建
const buf1 = Buffer.from('hello')
const buf2 = Buffer.from('hello', 'utf-8')

// 从数组创建（每个元素为 0-255 的字节）
const buf3 = Buffer.from([72, 101, 108, 108, 111])

// 创建指定大小的 Buffer（初始值为 0）
const buf4 = Buffer.alloc(10)

// 创建未初始化的 Buffer（可能包含旧数据，速度更快）
const buf5 = Buffer.allocUnsafe(10)

// 创建填充指定值的 Buffer
const buf6 = Buffer.alloc(10, 'a')
const buf7 = Buffer.alloc(10, 0x41) // 十六进制
```

## Buffer 与 String 互转

```js
// String → Buffer
const buf = Buffer.from('hello world', 'utf-8')

// Buffer → String
const str = buf.toString('utf-8')
console.log(str) // 'hello world'

// 指定编码
const bufGbk = Buffer.from('你好', 'gbk')
console.log(bufGbk.toString('gbk')) // '你好'

// 支持的编码: utf8, hex, base64, latin1, gbk, ...
```

## Buffer 常用操作

```js
const buf = Buffer.from('hello world')

// 长度
console.log(buf.length) // 11

// 按索引访问（返回字节值 0-255）
console.log(buf[0]) // 104 ('h' 的 ASCII)

// 切片（共享内存）
const subBuf = buf.slice(0, 5)
console.log(subBuf.toString()) // 'hello'

// 复制
const destBuf = Buffer.alloc(10)
buf.copy(destBuf, 0, 0, 5) // 从 destBuf 的 0 位置开始，复制 buf 的 0-5
console.log(destBuf.toString()) // 'hello'

// 连接多个 Buffer
const buf1 = Buffer.from('hello')
const buf2 = Buffer.from('world')
const combined = Buffer.concat([buf1, buf2])
console.log(combined.toString()) // 'helloworld'

// 比较（字典序）
const bufA = Buffer.from('a')
const bufB = Buffer.from('b')
console.log(bufA.compare(bufB)) // -1（bufA < bufB）

// 填充
const bufFill = Buffer.alloc(10, 'x')
console.log(bufFill.toString()) // 'xxxxxxxxxx'

// 是否存在某字节
console.log(buf.includes(104)) // true（包含 'h' 的字节值）
console.log(buf.includes('hello')) // false（不能直接用字符串）
```

## Buffer 与 JSON

```js
const buf = Buffer.from('hello')

// 序列化
const json = buf.toJSON()
console.log(json)
// { type: 'Buffer', data: [104, 101, 108, 108, 111] }

// 反序列化
const restored = Buffer.from(json.data)
console.log(restored.toString()) // 'hello'
```

## 进制转换

```js
const buf = Buffer.from('hello')

// 转为十六进制字符串
console.log(buf.toString('hex'))
// 68656c6c6f

// 从十六进制字符串创建 Buffer
const bufFromHex = Buffer.from('68656c6c6f', 'hex')
console.log(bufFromHex.toString()) // 'hello'

// 转为 base64
console.log(buf.toString('base64'))
// aGVsbG8=
```

## 处理文件数据

```js
const fs = require('fs')
const { readFile, writeFile } = require('fs/promises')

// 读取文件（自动得到 Buffer）
const buf = await readFile('./image.png')
console.log('文件大小:', buf.length, '字节')

// 写入 Buffer 到文件
await writeFile('./output.png', buf)

// 写入时指定编码（会进行编码转换）
await writeFile('./text.txt', '你好世界', 'utf-8')
```

## 处理网络数据

```js
const http = require('http')

const server = http.createServer((req, res) => {
  // 获取请求体的原始二进制数据
  const chunks = []

  req.on('data', (chunk) => {
    // chunk 是 Buffer
    chunks.push(chunk)
  })

  req.on('end', () => {
    // 合并所有 Buffer
    const body = Buffer.concat(chunks)
    console.log('请求体（原始字节）:', body)
    console.log('请求体（字符串）:', body.toString())
    console.log('请求体（十六进制）:', body.toString('hex'))
  })
})

server.listen(3000)
```

## TypedArray 互转

```js
// Buffer → Uint8Array（共享内存，修改一方会影响另一方）
const buf = Buffer.from([1, 2, 3, 4, 5])
const uint8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.length)

// Uint8Array → Buffer
const arr = new Uint8Array([1, 2, 3, 4, 5])
const bufFromArr = Buffer.from(arr)

// Buffer → ArrayBuffer
const arrayBuffer = buf.buffer.slice(
  buf.byteOffset,
  buf.byteOffset + buf.byteLength
)
```

## Buffer.split（分割）

> Node.js 没有内置 Buffer.split，需要自己实现或使用库

```js
// 实现简单的 split
function bufferSplit(buf, separator) {
  const result = []
  let start = 0
  let index = buf.indexOf(separator)

  while (index !== -1) {
    result.push(buf.slice(start, index))
    start = index + separator.length
    index = buf.indexOf(separator, start)
  }

  result.push(buf.slice(start))
  return result
}

const buf = Buffer.from('hello\nworld\nnode')
const parts = bufferSplit(buf, Buffer.from('\n'))
parts.forEach(p => console.log(p.toString()))
// hello
// world
// node
```

## 注意事项

1. **Buffer 内存管理**：Buffer.allocUnsafe() 较快但可能有旧数据，需自行填充
2. **字符编码**：不同编码下一个字符占用的字节数不同（UTF-8 中文 3 字节，GBK 2 字节）
3. **性能**：处理大量数据时优先使用 Buffer，避免字符串转换开销
