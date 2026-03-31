# Vite 核心原理

> 深入理解 Vite 的工作原理

---

## 📖 本节总结

Vite 的核心原理包括：**基于 ESM 的开发服务器**、**依赖预构建**、**热模块替换（HMR）**。

---

## 1. 基于 ESM 的开发服务器

### 传统方式 vs Vite 方式

```
传统方式（Webpack）：
┌─────────────────────────────┐
│ 1. 启动时解析所有依赖      │
│ 2. 打包整个应用            │
│ 3. 启动服务器             │
│ 4. 返回打包后的文件         │
└─────────────────────────────┘
问题：应用越大，启动越慢

Vite 方式：
┌─────────────────────────────┐
│ 1. 启动轻量级开发服务器     │
│ 2. 浏览器请求时才处理       │
│ 3. 利用原生 ESM            │
└─────────────────────────────┘
优势：毫秒级启动
```

### 请求流程

```
浏览器请求 /src/main.js
         ↓
Vite 拦截请求，转换 ESM
         ↓
返回转换后的代码
         ↓
浏览器解析，发现 import Vue
         ↓
浏览器请求 /node_modules/vue/dist/vue.esm.js
         ↓
Vite 继续转换并返回
         ↓
...
```

---

## 2. 依赖预构建

### 为什么需要预构建？

```
1. 转换 CommonJS 模块为 ESM
2. 合并多个小模块为一个大模块
3. 减少浏览器请求数量
```

### 配置

```javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    include: ['react', 'react-dom', 'lodash'],
    exclude: []  // 排除的包
  }
})
```

### 预构建缓存

```javascript
// 预构建结果会缓存到 node_modules/.vite
// 依赖变化时会重新预构建
```

---

## 3. 热模块替换（HMR）

### 工作原理

```
┌─────────────────────────────────────┐
│  文件变化                              │
│       ↓                               │
│  Vite 定位变化的文件                    │
│       ↓                               │
│  只编译变化的模块                       │
│       ↓                               │
│  通过 WebSocket 通知浏览器              │
│       ↓                               │
│  浏览器替换变化的模块                   │
│       ↓                               │
│  保留组件状态（如果支持）               │
└─────────────────────────────────────┘
```

### Vue 的 HMR

```javascript
// Vite 通过 Vue 的 HMR API 支持组件级更新
// 修改组件时，只更新该组件，不刷新页面
```

### React 的 Fast Refresh

```javascript
// React 使用 Fast Refresh
// 函数组件支持保留状态热更新
// 类组件会完全重新渲染
```

---

## 4. 插件系统

### 插件结构

```javascript
export default function myPlugin(options) {
  return {
    name: 'my-plugin',

    // 解析模块 ID
    resolveId(id) {
      if (id === 'virtual-module') {
        return '\0virtual-module'
      }
    },

    // 加载模块
    load(id) {
      if (id === '\0virtual-module') {
        return 'export default "virtual"'
      }
    },

    // 转换代码
    transform(code, id) {
      if (id.endsWith('.vue')) {
        return {
          code: transformVue(code),
          map: generateSourceMap()
        }
      }
    },

    // 配置开发服务器
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 自定义中间件
        next()
      })
    }
  }
}
```

### 使用插件

```javascript
// vite.config.js
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    vue(),
    react()
  ]
})
```

---

## 5. 构建配置

### 生产构建

```javascript
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',  // 或 'esbuild'
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'axios']
        }
      }
    }
  }
})
```

### 代码分割

```javascript
// 动态导入会自动代码分割
const module = await import('./module.js')
```

---

## 6. 环境变量

### .env 文件

```bash
# .env - 所有环境
VITE_API_URL=https://api.example.com

# .env.development - 开发环境
VITE_API_URL=http://localhost:3000

# .env.production - 生产环境
VITE_API_URL=https://api.example.com
```

### 使用

```javascript
console.log(import.meta.env.VITE_API_URL)
```

---

## 总结

| 特性 | 说明 |
|------|------|
| ESM 开发 | 启动快，按需编译 |
| 依赖预构建 | esbuild 快速转换 |
| HMR | 毫秒级热更新 |
| 插件系统 | Rollup 兼容 |
| 构建 | Rollup 打包 |
| 环境变量 | import.meta.env |
