# Rollup

## 📖 本节总结

Rollup 是**专为库打包设计**的工具，Tree-shaking 效果最好，输出代码简洁。

---

## 与 Webpack 的区别

| 场景 | Webpack | Rollup |
|------|---------|--------|
| 应用打包 | ✅ 擅长 | ⚠️ 可以但配置复杂 |
| 库打包 | ⚠️ 可以但输出大 | ✅ 擅长 |
| Tree-shaking | 一般 | ✅ 很好 |
| 插件生态 | 丰富 | 一般 |

---

## 核心概念

### 配置文件

```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es',           // es / cjs / umd / iife
    name: 'MyLibrary',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    terser()
  ]
}
```

### 输出格式

```javascript
// ES Module
output: {
  format: 'es',
  file: 'bundle.mjs'
}

// CommonJS
output: {
  format: 'cjs',
  file: 'bundle.cjs'
}

// UMD（通用模块定义）
output: {
  format: 'umd',
  name: 'MyLibrary',
  globals: {
    react: 'React'
  }
}
```

---

## Tree Shaking

### 原理

```javascript
// src/math.js
export function add(a, b) {
  return a + b
}

export function subtract(a, b) {
  return a - b
}

// src/index.js
import { add } from './math'
console.log(add(1, 2))

// Rollup 只会打包 add 函数
// subtract 会被 Tree Shaking 掉
```

### 效果对比

```
Webpack 打包结果（未优化）:
/* 1234 bytes */
function add() {...}
function subtract() {...}
function multiply() {...}
// 包含所有导出

Rollup 打包结果:
/* 56 bytes */
function add() { return a + b }
console.log(add(1, 2))
// 只包含用到的
```

---

## 插件

### 常用插件

```javascript
import resolve from '@rollup/plugin-node-resolve'  // 解析 node_modules
import commonjs from '@rollup/plugin-commonjs'     // 处理 CommonJS
import babel from '@rollup/plugin-babel'           // 转译
import terser from '@rollup/plugin-terser'         // 压缩
import json from '@rollup/plugin-json'             // 导入 JSON
```

### 编写插件

```javascript
// 简单的 Rollup 插件
export default function myPlugin(options) {
  return {
    name: 'my-plugin',

    resolveId(source) {
      if (source === 'virtual-module') {
        return source
      }
    },

    load(id) {
      if (id === 'virtual-module') {
        return 'export default "virtual content"'
      }
    },

    transform(code, id) {
      if (id.endsWith('.special')) {
        return {
          code: transform(code),
          map: generateMap()
        }
      }
    }
  }
}
```

---

## 优缺点

| 优点 | 缺点 |
|------|------|
| Tree-shaking 最好 | 不适合大型应用 |
| 输出简洁 | 插件生态不如 Webpack |
| 配置简单（库场景）| 开发服务器功能弱 |
| 适合库开发 | |

---

## 总结

Rollup 是**库打包的首选**，Tree-shaking 效果最好，输出代码简洁。Vue、React 等库都用它打包。
