# 模块机制

> Node.js 使用模块系统来组织和管理代码

## CommonJS vs ES Module

Node.js 支持两种模块系统：
- **CommonJS (CJS)**：Node.js 默认，使用 `require()` 和 `module.exports`
- **ES Module (ESM)**：JavaScript 标准，使用 `import` 和 `export`

## CommonJS

### 导出

```js
// 导出单个值
module.exports = function add(a, b) {
  return a + b
}

// 导出多个值
module.exports = {
  name: 'test',
  version: '1.0.0',
  add: (a, b) => a + b
}

// 使用 exports（注意：不能直接赋值）
exports.name = 'test'
exports.add = (a, b) => a + b
```

### 导入

```js
// 导入整个模块
const utils = require('./utils')

// 解构导入
const { name, add } = require('./utils')

// 导入内置模块
const fs = require('fs')
const path = require('path')
```

### 模块加载流程

```js
// 1. 解析文件路径
// 2. 加载模块文件
// 3. 包装模块（IIFE）
// 4. 执行模块代码
// 5. 返回 module.exports
```

## ES Module

### 导出

```js
// 命名导出
export const name = 'test'
export const add = (a, b) => a + b

// 默认导出
export default function main() {}

// 批量导出
const name = 'test'
const version = '1.0.0'
export { name, version }
```

### 导入

```js
// 导入命名导出
import { name, add } from './utils'

// 导入默认导出
import main from './utils'

// 导入所有
import * as utils from './utils'

// 导入并重命名
import { name as n } from './utils'

// 同时导入默认和命名
import defaultExport, { named } from './utils'
```

## 模块解析

### 相对路径

```js
// 当前目录
const utils = require('./utils')

// 上级目录
const utils = require('../utils')

// 上上级目录
const utils = require('../../utils')
```

### 绝对路径和包名

```js
// 内置模块
const fs = require('fs')

// node_modules 包
const axios = require('axios')

// 解析顺序：内置模块 -> node_modules -> 向上查找 node_modules
```

## Node.js 内置模块

### 常用内置模块

| 模块 | 说明 |
|------|------|
| fs | 文件系统 |
| path | 路径处理 |
| http | HTTP 服务 |
| url | URL 解析 |
| querystring | 查询字符串 |
| crypto | 加密 |
| os | 操作系统信息 |
| events | 事件 |
| stream | 流 |
| buffer | 二进制数据 |

### 使用示例

```js
const fs = require('fs')
const path = require('path')
const os = require('os')

// 获取当前目录
console.log(__dirname)

// 获取当前文件
console.log(__filename)

// 获取系统信息
console.log(os.platform())
console.log(os.cpus())
```

## package.json 中的模块配置

### type 字段

```json
{
  "type": "module"  // "module" 为 ESM，"commonjs" 为 CJS（默认）
}
```

### 条件导出

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

## 模块循环依赖

```js
// a.js
const { b } = require('./b')
console.log('a:', b)

module.exports = { name: 'a' }

// b.js
const { a } = require('./a')
console.log('b:', a)

module.exports = { name: 'b' }
```

> 注意：循环依赖可能导致意外结果，尽量避免

## 最佳实践

1. **优先使用 ES Module**：现代 Node.js 推荐使用 ESM
2. **避免循环依赖**：重构代码结构
3. **使用绝对路径**：通过 `path.join(__dirname, '...')`
4. **明确导出接口**：保持模块接口清晰
5. **使用 index.js 简化导入**：目录模块统一入口
