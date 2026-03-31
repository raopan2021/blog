# Vite 1.x 青铜器时代

## 📖 本节总结

Vite 1 是 Vite 的第一个版本，提出了**基于浏览器原生 ESM 的开发服务器**概念，颠覆了传统打包开发模式。

---

## 为什么需要 Vite？

### 传统构建工具的问题

```
Webpack 开发流程：

┌─────────────────────────────┐
│  1. 启动开发服务器           │
│  2. 解析所有依赖             │
│  3. 打包整个应用              │
│  4. 启动服务器               │
└─────────────────────────────┘

问题：应用越大，启动越慢（可能需要几分钟）
```

### Vite 的解决思路

```
Vite 开发流程：

┌─────────────────────────────┐
│  1. 启动开发服务器           │
│  2. 浏览器请求时才处理        │
│  3. 利用浏览器原生 ESM        │
└─────────────────────────────┘

优势：启动快（毫秒级）
```

---

## 核心原理

### 原生 ESM

```javascript
// 传统方式：所有模块打包成一个文件
import React from 'react'

// Vite 方式：浏览器直接请求
// <script type="module" src="/src/main.js"></script>
import React from '/node_modules/react/index.js'
```

### 按需编译

```
浏览器请求 /src/main.js
         ↓
Vite 拦截请求
         ↓
处理 import（转换 ESM）
         ↓
返回转换后的代码
         ↓
浏览器解析，发现 import Vue
         ↓
浏览器请求 /node_modules/vue/dist/vue.esm.js
         ↓
Vite 转换并返回
         ↓
...
```

---

## 依赖预构建

```javascript
// Vite 使用 esbuild 预构建依赖
// 将 CommonJS 模块转为 ESM

// 预构建后
import React from '/node_modules/.vite/react.js'

// 而不是
import React from '/node_modules/react/index.js'  // 可能不是 ESM
```

### 预构建配置

```javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    include: ['react', 'react-dom', 'lodash']
  }
})
```

---

## 热模块替换（HMR）

```javascript
// Vite 的 HMR 基于 ESM
// 当模块变化时，只替换变化的模块

// 组件修改
// Vite: 只更新这个组件，不需要刷新页面
// Webpack: 可能需要重新打包整个依赖链
```

---

## 问题与改进

| 问题 | 说明 |
|------|------|
| 生产构建慢 | 使用 rollup 打包，开发快但生产慢 |
| 插件生态不完善 | 早期插件较少 |
| CommonJS 处理 | 部分 npm 包不兼容 ESM |

---

## 总结

| 特性 | 说明 |
|------|------|
| ESM 开发服务器 | 启动快，按需编译 |
| 依赖预构建 | esbuild 快速转换 |
| HMR | 基于 ESM 的快速热更新 |
| 无需打包 | 开发环境直接运行源码 |
