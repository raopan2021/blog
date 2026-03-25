---
title: 字节 Garfish 微前端学习
head:
  - - meta
    - name: description
      content: 字节 Garfish 微前端学习
  - - meta
    - name: keywords
      content: garfish 微前端 vue react angular 主应用 子应用 应用通信 pnpm
---

# 字节 Garfish 微前端学习

::: tip ✨ 字节 Garfish 微前端学习

Garfish 是字节跳动开源的微前端框架，旨在应对现代 Web 应用在前端生态繁荣与应用日益复杂化背景下的挑战。支持 Vue、React、Angular 等多种前端框架，通过简单路由配置即可启动，内置沙箱机制隔离微应用。

:::

## 安装 Garfish

首先，安装 Garfish 核心库：

```javascript
npm install @garfish/core --save
```

## 创建主应用

创建主应用的入口文件，如 `index.js` 或 `main.js`，并初始化 Garfish：

```javascript
import Garfish from '@garfish/core';

const garfish = new Garfish({
  router: {
    historyType: 'hash',
    publicPath: '/',
    routes: [
      {
        path: '/app1',
        microApp: {
          name: 'app1',
          entry: '//localhost:8081',
          container: '#root',
          activeRule: (location) => location.pathname === '/app1',
        },
      },
      {
        path: '/app2',
        microApp: {
          name: 'app2',
          entry: '//localhost:8082',
          container: '#root',
          activeRule: (location) => location.pathname === '/app2',
        },
      },
    ],
  },
});

garfish.start();
```

## 开发与构建微应用

每个微应用都应有独立的构建流程，以下是基于 `localhost:8081` 运行的 Vue 应用示例：

### Vue 示例

在微应用中，暴露必要的 API 供 Garfish 调用：

```javascript
// app1/main.js
import { bootstrap, mount, unmount } from '@garfish/runtime-vue';
import App from './App.vue';

bootstrap(App).then(mount(App)).catch(console.error);

window.unmount = unmount;
```

使用 Webpack 或 Rollup 等工具来打包微应用。例如，使用 Webpack：

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    publicPath: '/',
  },
  // 其他配置...
};
```

### React 示例

```javascript
// app-react/main.jsx
import { bootstrap, mount, unmount } from '@garfish/runtime-react';
import App from './App';

bootstrap(App).then(mount(App)).catch(console.error);

window.unmount = unmount;
```

### 子应用入口 HTML

每个子应用需要提供一个入口 HTML 文件：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>子应用</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

## Garfish 特点

- 🧩 **多框架支持**：兼容 Vue、React、Angular 等多种前端框架
- 🔒 **VM 沙箱**：内置 VM 沙箱机制，确保微应用之间的资源隔离，避免全局变量污染
- 🚀 **路由驱动**：通过路由规则管理微应用的加载与卸载，按需加载
- ⚡ **预加载**：支持子应用预加载，提升首次加载体验
- 📦 **插件化**：提供丰富的生命周期钩子，方便扩展
- 🔌 **通信简单**：基于 props 的主子应用数据通信机制

## 主应用使用 Garfish

### 基础配置

```javascript
import Garfish from '@garfish/core';

const garfish = new Garfish({
  //  basename 配置
  basename: '/',

  // 子应用配置
  apps: [
    {
      name: 'vue-app',
      entry: '//localhost:8081',
      container: '#vue-container',
      props: {
        data: { fromMain: '主应用数据' },
      },
    },
    {
      name: 'react-app',
      entry: '//localhost:8082',
      container: '#react-container',
    },
  ],

  // 沙箱配置
  sandbox: {
    fixTopBar: true,    // 修复 CSS z-index 问题
    fixGlobals: true,   // 修复全局变量冲突
    useShadowMode: false, // 开启 Shadow DOM 隔离
  },

  // 插件
  plugins: [],
});

// 启动
garfish.start();
```

### 在 Vue 中使用

```vue
<template>
  <div id="app">
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/vue-app">Vue 子应用</router-link>
      <router-link to="/react-app">React 子应用</router-link>
    </nav>
    <router-view />
    <div id="vue-container"></div>
    <div id="react-container"></div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { loadMicroApp } from '@garfish/core';

// 路由切换时加载子应用
const router = useRouter();
router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/vue-app')) {
    loadMicroApp({
      name: 'vue-app',
      entry: '//localhost:8081',
      container: '#vue-container',
    });
  }
  next();
});
</script>
```

### 传递数据给子应用

```javascript
const vueApp = loadMicroApp({
  name: 'vue-app',
  entry: '//localhost:8081',
  container: '#vue-container',
  props: {
    data: {
      message: '来自主应用的消息',
      user: { name: '主应用用户' },
    },
  },
});
```

子应用接收：

```javascript
import { useContext } from '@garfish/runtime-vue';

export function bootstrap() {
  const context = useContext();
  // 通过 props 接收主应用数据
  console.log('主应用数据:', context.props.data);
}
```

### 获取子应用数据

```javascript
// 主应用监听子应用事件
vueApp.addGlobalVar('__GARFISH_EVENTS__', true);

// 或通过 window 直接通信
window.postMessage({ type: 'main-to-child', data: {} }, '*');
```

## Garfish 与 Qiankun 对比

| 特性 | Garfish | Qiankun |
|------|---------|---------|
| 技术栈支持 | Vue、React、Angular 等 | Vue、React、Angular 等 |
| 路由管理 | 路由规则管理，按需加载 | 类似机制，细节有差异 |
| 隔离机制 | VM 沙箱，隔离能力强 | 沙箱机制，部分场景略逊 |
| 配置复杂度 | 配置简单，路由即可启动 | 配置详细，处理跨域时较复杂 |
| 社区支持 | 字节跳动出品，文档丰富 | 社区广泛，示例相对较少 |
| 预加载 | 支持 | 支持 |

## Garfish 常见问题

### Garfish 支持哪些前端框架？

Garfish 支持包括 Vue、React、Angular 在内的多种前端框架，开发者可以根据自身的技术栈选择合适的框架。

### 如何处理跨域问题？

1. **CORS 设置**：确保服务器配置了适当的 CORS 设置
2. **代理**：在开发环境中使用 Webpack 等构建工具的代理功能
3. **JSONP**：某些 API 场景下，可考虑使用 JSONP 请求

```javascript
// vite.config.js 开发环境代理
export default defineConfig({
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
});
```

### 如何保证微应用间的隔离？

Garfish 内置 VM 沙箱机制，确保微应用之间的资源隔离，避免全局变量污染：

```javascript
const garfish = new Garfish({
  sandbox: {
    useShadowMode: true,  // 开启 Shadow DOM 模式
    fixGlobals: true,     // 修复全局变量
    fixTopBar: true,      // 修复 CSS z-index 问题
  },
});
```

### 如何调试微应用？

1. **开发者工具**：利用浏览器的开发者工具
2. **日志输出**：使用 `console.log()` 等方法输出调试信息
3. **单元测试**：编写单元测试覆盖微应用的功能点

### 子应用静态资源 404

确保子应用的 base 配置正确：

```javascript
// vite.config.ts 子应用
export default defineConfig({
  base: '/child-vue/',  // 必须与主应用路由一致
});
```

### 全局样式冲突

使用 Shadow DOM 进行样式隔离：

```javascript
const garfish = new Garfish({
  sandbox: {
    useShadowMode: true,
  },
});
```

## 相关文档

- [Garfish 官方文档](https://www.garfishjs.com/)
- [Garfish GitHub](https://github.com/bytedance/garfish)
- [Vue](https://cn.vuejs.org/)
- [React](https://zh-hans.react.dev/)
- [Angular](https://angular.cn/)
