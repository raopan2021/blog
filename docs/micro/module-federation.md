---
title: Module Federation 微前端学习
head:
  - - meta
    - name: description
      content: Module Federation 微前端学习
  - - meta
    - name: keywords
      content: module federation 微前端 webpack vite @module-federation/vite 远程模块 共享依赖
---

# Module Federation 微前端学习

::: tip ✨ Module Federation 微前端学习

Module Federation 源自 Webpack 5，最初由 Zack Jackson 提出，现已演进为一套跨框架的微前端/模块共享解决方案。@module-federation/vite 让 Vite 项目也能享受 Module Federation 的强大能力

[Module Federation 官网](https://module-federation.io/)
[GitHub 仓库](https://github.com/module-federation/vite)
:::

## Module Federation 简介

Module Federation（模块联邦）是一种**模块共享**技术，而非完整的微前端框架。它的核心思想是：

- **远程模块**：将应用中的一部分模块单独构建，作为远程模块供其他应用消费
- **共享依赖**：多个应用共享的依赖（如 React、Vue）只加载一次
- **运行时加载**：模块在运行时动态加载，无需刷新页面

```
┌──────────────────────────────────────────────────────┐
│                    Host (主机应用)                    │
│  ┌──────────────┐    ┌──────────────────────────────┐ │
│  │   Remote    │    │         Local Code          │ │
│  │  ┌────────┐ │    │  ┌────────────────────────┐  │ │
│  │  │ Remote │ │ ◄──│──│   import RemoteApp    │  │ │
│  │  │  App   │ │    │  └────────────────────────┘  │ │
│  │  └────────┘ │    │  ┌────────────────────────┐  │ │
│  │   Remote    │    │  │    Shared: vue        │  │ │
│  │  ┌────────┐ │    │  │    Shared: react      │  │ │
│  │  │ Remote │ │    │  └────────────────────────┘  │ │
│  │  │  Lib   │ │    │                              │ │
│  │  └────────┘ │    │                              │ │
│  └──────────────┘    └──────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

## 与微前端框架对比

| 特性 | Module Federation | Qiankun | micro-app | Wujie |
|------|------------------|---------|-----------|-------|
| 定位 | 模块共享/微前端 | 微前端框架 | 微前端框架 | 微前端框架 |
| 隔离方式 | 运行时加载隔离 | JS 沙箱 + CSS 隔离 | Web Component | Web Component + iframe 降级 |
| 子应用技术栈 | 任意 | 任意 | 任意 | 任意 |
| 通信方式 | 直接 import | GlobalState | window 通信 | props + event bus |
| 路由管理 | 应用自行管理 | 主应用路由 | Web Component | iframe 路由 |
| 学习成本 | 较低 | 较高 | 较低 | 中等 |
| 适用场景 | 模块共享、渐进式迁移 | 多应用集成 | 多应用集成 | 多应用 + IE 兼容 |

### 什么时候选择 Module Federation？

✅ **适合使用 Module Federation 的场景**：
- 多个项目需要共享组件/工具函数
- 渐进式迁移：从巨石应用拆分为微应用
- 多团队共享基础库
- 需要在运行时动态加载模块

❌ **不适合使用 Module Federation 的场景**：
- 需要强隔离的子应用（样式、全局变量）
- 需要统一管理所有子应用路由
- IE 兼容需求

## @module-federation/vite

`@module-federation/vite` 是 Module Federation 的 Vite 实现，支持：

- 🏗️ 构建符合 Module Federation 规范的远程模块
- 📦 消费远程 Module Federation 模块
- 🔌 配置共享依赖
- 🏷️ 自动生成远程模块类型
- ⚡ 支持开发时热更新

### 安装

```sh
npm install @module-federation/vite
```

或

```sh
pnpm add @module-federation/vite
```

## 快速开始

### 项目结构

```
my-workspace/
├── host/           # 主机应用
│   ├── src/
│   └── vite.config.ts
├── remote/         # 远程模块应用
│   ├── src/
│   └── vite.config.ts
└── package.json
```

### workspace 配置

```json
{
  "name": "my-workspace",
  "private": true,
  "workspaces": ["host", "remote"],
  "scripts": {
    "dev:host": "pnpm --filter host dev",
    "dev:remote": "pnpm --filter remote dev",
    "build": "pnpm --filter remote build && pnpm --filter host build"
  }
}
```

## 远程应用配置

远程应用需要暴露模块供主机应用使用

### vite.config.ts

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'remote',                      // 远程模块名称
      filename: 'remoteEntry.js',           // 入口文件名
      exposes: {                           // 暴露的模块
        './RemoteApp': './src/components/RemoteApp.vue',
        './Button': './src/components/Button.vue',
      },
      shared: ['vue', 'pinia'],            // 共享的依赖
    }),
  ],
  server: {
    port: 5001,
    origin: 'http://localhost:5001',       // 开发时必须指定 origin
  },
  build: {
    target: 'chrome89',                    // 必须设置 target
  },
})
```

### 完整配置示例

```ts
federation({
  name: 'remote-app',
  filename: 'remoteEntry.js',
  exposes: {
    './RemoteApp': './src/components/RemoteApp.vue',
    './utils': './src/utils/index.ts',
  },
  shared: {
    vue: {
      singleton: true,      // 是否单例模式
      requiredVersion: '^3.0.0',
      get: (container) => container.__esModule ? container.vue : undefined,
    },
    pinia: {
      singleton: false,
    },
  },
  // 可选：额外的 var 格式入口
  // varFilename: 'remoteEntry.json',
  // 可选：禁用资源分析
  // disableAssetsAnalyze: true,
  // 可选：生成 manifest
  // manifest: true,
})
```

## 主机应用配置

### vite.config.ts

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host',
      remotes: {
        // ESM 格式远程模块
        remote: {
          type: 'module',
          name: 'remote',
          entry: 'http://localhost:5001/remoteEntry.js',
          entryGlobalName: 'remote',
        },
        // Var 格式远程模块（兼容旧版）
        // remoteVar: 'remoteVar@http://localhost:5002/remoteEntry.js',
      },
      shared: ['vue', 'pinia'],
    }),
  ],
  server: {
    port: 5000,
    origin: 'http://localhost:5000',
  },
  build: {
    target: 'chrome89',
  },
})
```

### 完整配置示例

```ts
federation({
  name: 'host-app',
  remotes: {
    remote: {
      type: 'module',
      name: 'remote',
      entry: 'http://localhost:5001/remoteEntry.js',
      entryGlobalName: 'remote',
      // 可选：自定义加载函数
      // external: "(() => import('remote'))()",
    },
    // 支持多个远程模块
    anotherRemote: {
      type: 'module',
      name: 'anotherRemote',
      entry: 'http://localhost:5003/remoteEntry.js',
    },
  },
  shared: {
    vue: {
      singleton: true,
      requiredVersion: '^3.0.0',
      eager: false,              // 是否预加载
    },
    pinia: {
      singleton: true,
    },
  },
  // 可选：启用 manifest
  // manifest: true,
})
```

## 消费远程模块

### Vue 示例

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// 动态导入远程模块
const RemoteButton = defineAsyncComponent(() =>
  import('remote/Button')
)

const RemoteApp = defineAsyncComponent(() =>
  import('remote/RemoteApp')
)
</script>

<template>
  <div>
    <h1>主机应用</h1>
    
    <!-- 使用远程组件 -->
    <RemoteButton />
    
    <!-- 使用远程应用 -->
    <RemoteApp />
  </div>
</template>
```

### React 示例

```tsx
import { lazy, Suspense } from 'react'

// 动态导入远程模块
const RemoteButton = lazy(() => import('remote/Button'))
const RemoteApp = lazy(() => import('remote/RemoteApp'))

function App() {
  return (
    <div>
      <h1>主机应用</h1>
      
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteButton />
        <RemoteApp />
      </Suspense>
    </div>
  )
}

export default App
```

### 原生 JS 示例

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import * as remote from 'http://localhost:5001/remoteEntry.js'
    
    // 获取远程模块
    const { RemoteApp, Button } = await remote.get('./RemoteApp')
    
    console.log('RemoteApp:', RemoteApp)
    console.log('Button:', Button)
  </script>
</head>
</html>
```

## 共享依赖

`shared` 配置用于声明需要在主机和远程之间共享的依赖

### 配置选项

```ts
federation({
  shared: {
    // 简单配置
    vue: true,
    pinia: true,
    
    // 详细配置
    react: {
      singleton: true,           // 是否单例（只加载一次）
      requiredVersion: '^18.0.0', // 要求的版本
      eager: false,              // 是否预加载（true 时不延迟加载）
      // 自定义获取方式
      get: (container) => container.__esModule 
        ? container.react 
        : undefined,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: '^18.0.0',
    },
  },
})
```

### 版本匹配策略

当主机和远程都依赖同一库时：

| 主机版本 | 远程版本 | 结果 |
|---------|---------|------|
| ^16.0.0 | ^16.0.0 | 使用主机版本（单例） |
| ^16.0.0 | ^17.0.0 | 报错（版本不兼容） |
| ^16.0.0 | ^16.2.0 | 使用主机版本 |
| 16.0.0 | 16.0.0 | 使用主机版本 |

### 不共享的库

只在一个应用使用的库不应该放在 shared 中

```ts
// 错误：lodash 只在远程使用，不应该共享
shared: ['lodash']  // ❌

// 正确：lodash 应该被打包到远程中
// 移除 lodash 从 shared
exposes: {
  './Utils': './src/utils/index.ts'  // ✅ lodash 会自动打包
}
```

## 类型支持

@module-federation/vite 支持自动生成远程模块类型

### 1. 安装依赖

```sh
pnpm add -D @module-federation/dts-plugin
```

### 2. 配置远程应用

```ts
// vite.config.ts
import { federation } from '@module-federation/vite'
import { dts } from '@module-federation/dts-plugin'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'remote',
      exposes: {
        './Button': './src/components/Button.vue',
      },
      shared: ['vue'],
    }),
    dts({
      // 生成类型文件的路径
      outputPath: 'dist/remote',
      // 是否在每次构建时生成
      autoGenerate: true,
    }),
  ],
})
```

### 3. 配置主机应用

```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host',
      remotes: {
        remote: {
          type: 'module',
          name: 'remote',
          entry: 'http://localhost:5001/remoteEntry.js',
          // 指定类型文件
          // typia: 'http://localhost:5001/dist/remote/remote.d.ts',
        },
      },
      shared: ['vue'],
    }),
  ],
})
```

### 4. 使用类型

```vue
<script setup lang="ts">
// 如果配置了 typia，可以获得类型提示
import type { RemoteApp as RemoteAppType } from 'remote/RemoteApp'

// 使用 defineAsyncComponent
const RemoteApp = defineAsyncComponent(() => 
  import('remote/RemoteApp')
) as typeof RemoteAppType
</script>
```

## 开发与生产

### 开发模式

```ts
// vite.config.ts
export default defineConfig({
  server: {
    port: 5000,
    origin: 'http://localhost:5000',  // 必须指定
  },
})
```

开发时，远程模块通过 `http://localhost:5001/remoteEntry.js` 直接加载

### 生产构建

```ts
// vite.config.ts
export default defineConfig({
  base: '/static/',  // 设置基础路径
  build: {
    target: 'chrome89',
    minify: false,   // 可选：禁用压缩便于调试
  },
})
```

## 部署

### 静态资源服务器

```
/static/
├── host/              # 主机应用
│   ├── index.html
│   ├── assets/
│   └── remoteEntry.js
└── remote/            # 远程模块
    ├── remoteEntry.js
    ├── assets/
    └── remote/
        ├── Button.js
        └── RemoteApp.js
```

### Nginx 配置

```nginx
server {
    listen 80;
    server_name localhost;

    # 主机应用
    location / {
        root /usr/share/nginx/html/host;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 远程模块 - 必须设置 CORS
    location /remote/ {
        alias /usr/share/nginx/html/remote/;
        
        # CORS 头
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods GET POST OPTIONS;
        add_header Access-Control-Allow-Headers *;
        
        # 缓存静态资源
        location ~* \.(js|css|woff2|ttf)$ {
            add_header Cache-Control "public, max-age=31536000";
            add_header Access-Control-Allow-Origin *;
        }
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Docker 部署

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 常见问题

### 1. 远程模块加载失败

确保 `server.origin` 配置正确

```ts
// vite.config.ts
server: {
  origin: 'http://localhost:5001',  // 必须与实际地址一致
}
```

### 2. 共享依赖版本冲突

使用 `requiredVersion` 约束版本

```ts
shared: {
  react: {
    singleton: true,
    requiredVersion: '^18.0.0',  // 约束版本范围
  },
}
```

### 3. 样式冲突

Module Federation 不提供样式隔离，需要自行处理

```css
/* 使用 CSS Modules */
.my-button {
  /* ... */
}
```

或使用 BEM 等命名约定

### 4. 跨域问题

开发时确保远程服务器配置了正确的 CORS

```ts
server: {
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
}
```

## Module Federation vs 传统微前端

| 对比项 | Module Federation | 传统微前端 |
|-------|-----------------|-----------|
| 隔离级别 | 运行时（模块加载） | 运行时（JS 沙箱） + 样式 |
| 集成方式 | 编译时声明，运行时加载 | 运行时动态加载 |
| 路由 | 子应用自行管理 | 主应用统一管理 |
| 通信 | 直接 import | 框架特定 API |
| 适用规模 | 中小型共享模块 | 大型多应用集成 |
| 团队自治 | 高 | 低 |

## 学习资源

- [Module Federation 官网](https://module-federation.io/)
- [@module-federation/vite GitHub](https://github.com/module-federation/vite)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [官方示例仓库](https://github.com/module-federation/vite/tree/main/examples)

---

_持续更新中，欢迎提出建议和补充！_
