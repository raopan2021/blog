# fs 文件系统模块

> fs（file system）模块提供了与文件系统交互的 API

## 引入模块

```js
const fs = require('fs')
// 或
import fs from 'fs'
```


## 常用 API

### 同步 vs 异步 vs 回调

```js
// 同步读取（阻塞）
const data = fs.readFileSync('./test.txt', 'utf-8')
console.log(data)

// 异步回调（非阻塞）
fs.readFile('./test.txt', 'utf-8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// 异步 Promise（推荐）
import { readFile } from 'fs/promises'
const data = await readFile('./test.txt', 'utf-8')
```


### 读取文件

```js
import { readFile, readFileSync } from 'fs'

// 读取文本
const content = readFileSync('test.txt', 'utf-8')

// 读取二进制
const buffer = readFileSync('test.png')

// 异步读取
readFile('test.txt', 'utf-8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// Promise 方式
import { readFile } from 'fs/promises'
const data = await readFile('test.txt', 'utf-8')
```


### 写入文件

```js
import { writeFile, appendFile } from 'fs'

// 覆盖写入
writeFile('test.txt', 'hello world', 'utf-8', (err) => {
  if (err) throw err
  console.log('写入成功')
})

// Promise 方式
await writeFile('test.txt', 'hello world', 'utf-8')

// 追加内容
appendFile('test.txt', '\n追加的内容', 'utf-8')

// 同步方式
fs.writeFileSync('test.txt', 'hello', 'utf-8')
```


### 判断文件/目录是否存在

```js
import { existsSync, access } from 'fs'

// 同步判断
if (existsSync('./test.txt')) {
  console.log('文件存在')
}

// 异步判断（推荐）
access('./test.txt', (err) => {
  if (err) {
    console.log('文件不存在')
  } else {
    console.log('文件存在')
  }
})

// Promise 方式
import { access } from 'fs/promises'
try {
  await access('test.txt')
  console.log('文件存在')
} catch {
  console.log('文件不存在')
}
```


### 复制文件

```js
import { copyFile } from 'fs'

// 异步复制
copyFile('source.txt', 'dest.txt', (err) => {
  if (err) throw err
  console.log('复制成功')
})

// Promise 方式
import { copyFile } from 'fs/promises'
await copyFile('source.txt', 'dest.txt')
```


### 删除文件

```js
import { unlink } from 'fs'

// 删除文件
unlink('test.txt', (err) => {
  if (err) throw err
  console.log('删除成功')
})

// Promise 方式
import { unlink } from 'fs/promises'
await unlink('test.txt')
```


### 目录操作

```js
import { mkdir, rmdir, readdir, rm } from 'fs'

// 创建目录（递归创建）
mkdir('./a/b/c', { recursive: true }, (err) => {
  if (err) throw err
})

// Promise 方式
import { mkdir } from 'fs/promises'
await mkdir('./a/b/c', { recursive: true })

// 读取目录
readdir('./dir', (err, files) => {
  if (err) throw err
  console.log(files) // ['file1.txt', 'file2.js', ...]
})

// 删除空目录
rmdir('./empty-dir', (err) => {
  if (err) throw err
})

// 删除目录（递归删除，包含内容）
import { rm } from 'fs/promises'
await rm('./dir', { recursive: true, force: true })
```


### 获取文件信息

```js
import { stat } from 'fs'

stat('test.txt', (err, stats) => {
  if (err) throw err
  console.log('是文件:', stats.isFile())
  console.log('是目录:', stats.isDirectory())
  console.log('文件大小:', stats.size)
  console.log('创建时间:', stats.birthtime)
  console.log('修改时间:', stats.mtime)
})

// Promise 方式
import { stat } from 'fs/promises'
const stats = await stat('test.txt')
console.log(stats.size)
```


### 重命名/移动

```js
import { rename } from 'fs'

// 重命名
rename('old.txt', 'new.txt', (err) => {
  if (err) throw err
})

// 移动（跨目录）
rename('./old/dir/file.txt', './new/dir/file.txt', (err) => {
  if (err) throw err
})
```


## 监听文件变化（chokidar）

```js
import chokidar from 'chokidar'

// 监听文件变化
const watcher = chokidar.watch('./src', {
  persistent: true,
  ignoreInitial: true
})

watcher
  .on('add', (path) => console.log(`新增: ${path}`))
  .on('change', (path) => console.log(`修改: ${path}`))
  .on('unlink', (path) => console.log(`删除: ${path}`))
```


## 路径问题

> 注意：fs 模块的路径是相对于当前工作目录（process.cwd()），不是相对于当前文件

```js
import { readFile } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 使用 __dirname 构建绝对路径（CommonJS）
readFile(join(__dirname, 'test.txt'), 'utf-8', callback)

// ES Module 使用 import.meta.url
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
```

