# path 路径模块

> path 模块提供了处理文件路径的实用工具

## 引入模块

```js
const path = require('path')
// 或 ES Module
import path from 'path'
```

## 核心方法

### 路径拼接

```js
// 拼接路径片段（自动处理分隔符）
path.join('/foo', 'bar', 'baz/asdf')
// 结果: '/foo/bar/baz/asdf'

// 解析为绝对路径（从右到左，直到找到绝对路径）
path.resolve('/foo', 'bar', '/baz')
// 结果: '/baz'

// 当前目录的绝对路径
path.resolve('index.html')
// 结果: '/Users/xxx/project/index.html'

// 配合 __dirname 使用
path.join(__dirname, 'public', 'index.html')
```

### 获取路径信息

```js
// 获取文件/目录名称（最后一部分）
path.basename('/foo/bar/index.html')
// 结果: 'index.html'

path.basename('/foo/bar/index.html', '.html')
// 结果: 'index'

// 获取目录部分
path.dirname('/foo/bar/index.html')
// 结果: '/foo/bar'

// 获取文件扩展名
path.extname('/foo/bar/index.html')
// 结果: '.html'

// 获取文件名（不含扩展名）
path.basename('/foo/bar/index.html', path.extname('/foo/bar/index.html'))
// 结果: 'index'
```

### 路径解析

```js
// 判断是否为绝对路径
path.isAbsolute('/foo/bar')   // true
path.isAbsolute('./foo/bar')  // false
path.isAbsolute('foo/bar')    // false

// 规范化路径（解析 .. 和 . ，处理多余分隔符）
path.normalize('/foo//bar///baz/../qux')
// 结果: '/foo/bar/qux'

// 解析相对路径
path.relative('/foo/bar/baz', '/foo/bar/qux')
// 结果: '../qux'
```

### 路径分隔符

```js
// 跨平台路径分隔符
path.sep
// Linux/Mac: '/'   Windows: '\\'

// 将路径转换为平台特定的分隔符
path.join('foo', 'bar')
// Linux: 'foo/bar'   Windows: 'foo\\bar'

// 将路径中的分隔符统一转换为 /（用于 URL）
path.sep === '\\' ? path.replace('\\', '/') : p
```

## Windows vs POSIX

```js
// 返回适用于 Windows 的路径
path.win32.join('foo', 'bar')
// 结果: 'foo\\bar'

// 返回适用于 POSIX 的路径
path.posix.join('foo', 'bar')
// 结果: 'foo/bar'
```

## 实际应用示例

### 获取项目根目录

```js
// CommonJS
const projectRoot = path.resolve(__dirname, '..')

// ES Module
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
```

### 拼接资源路径

```js
const publicPath = path.join(__dirname, '..', 'public')
const indexPath = path.join(publicPath, 'index.html')

// 或使用 resolve
const indexPath = path.resolve(__dirname, 'public', 'index.html')
```

### 处理文件扩展名

```js
function getFileNameWithoutExt(filePath) {
  const ext = path.extname(filePath)
  return path.basename(filePath, ext)
}

getFileNameWithoutExt('/foo/bar/index.html')
// 结果: 'index'
```

## 与 URL 的转换

```js
import { fileURLToPath } from 'url'
import { pathToFileURL } from 'url'

// URL → 文件路径
const filePath = fileURLToPath('file:///foo/bar/index.html')
// 结果: '/foo/bar/index.html'

// 文件路径 → URL
const url = pathToFileURL('/foo/bar/index.html')
// 结果: 'file:///foo/bar/index.html'
```
