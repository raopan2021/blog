---
title: 字节 Garfish 微前端学习
head:
  - - meta
    - name: description
      content: 字节 Garfish 微前端学习
  - - meta
    - name: keywords
      content: garfish 微前端 vue react 主应用 子应用 应用通信 pnpm
---

# 字节 Garfish 微前端学习

::: tip ✨ 字节 Garfish 微前端学习

Garfish 是字节跳动推出的微前端框架，支持多框架子应用集成，提供沙箱隔离、预加载、路由劫持等能力

[Garfish 官方文档](https://www.garfish.top/)
:::

## Garfish 特点

- 🛡️ **沙箱隔离**：支持 JS 和 CSS 隔离
- ⚡ **预加载**：子应用预加载，提升加载速度
- 🔀 **路由劫持**：自动劫持路由，支持子应用独立路由
- 🌐 **多框架支持**：Vue、React、Angular 等
- 📦 **体积小**：压缩后约 14KB

## 主应用构建

### 安装

```sh
pnpm add garfish
```

### 初始化

```ts
import Garfish from 'garfish'

const garfish = new Garfish({
  apps: [
    {
      name: 'react-app',
      entry: 'http://localhost:3000',
      container: '#subapp-container',
      basename: '/react',
    },
    {
      name: 'vue-app',
      entry: 'http://localhost:4000',
      container: '#subapp-container',
      basename: '/vue',
    },
  ],
  sandbox: {
    open: true, // 开启沙箱
  },
})

// 启动
garfish.run()
```

### 路由配置

```ts
import { registerApp, setExternalFunction } from 'garfish'

// 注册子应用
registerApp([
  {
    name: 'react-app',
    activeWhen: '/react',
    entry: 'http://localhost:3000',
  },
  {
    name: 'vue-app',
    activeWhen: '/vue',
    entry: 'http://localhost:4000',
  },
])
```

## 子应用构建

### Vue3 子应用

```ts
// main.ts
import { Garfish, loadable } from '@garfish/vue-plugin'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

export function provider() {
  const app = createApp(App)
  app.use(router)
  app.mount('#app')

  return {
    app,
    destroy: () => app.unmount(),
  }
}

// 导出 loadable 组件
export default loadable({
  provider,
  appName: 'vue-app',
})
```

### React 子应用

```ts
// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Garfish, loadable } from '@garfish/react-plugin'

function AppWrapper() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

export function provider() {
  const container = document.getElementById('root')
  const app = ReactDOM.createRoot(container!)
  app.render(<AppWrapper />)

  return {
    app,
    destroy: () => app.unmount(),
  }
}

export default loadable({
  provider,
  appName: 'react-app',
})
```

## 通信机制

### 主应用发送数据给子应用

```ts
// 主应用
import { setGlobalData, getGlobalData } from 'garfish'

// 发送数据
setGlobalData({ user: { name: '张三' } })

// 获取数据
const data = getGlobalData()
```

子应用接收：

```ts
// 子应用
import { useContext, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const globalData = inject('garfishGlobalData')
    return () => h('div', globalData.user.name)
  }
})
```

### 子应用发送数据给主应用

```ts
// 子应用
import { emit } from 'garfish'

emit('child-event', { data: '来自子应用' })
```

主应用监听：

```ts
// 主应用
import { on } from 'garfish'

on('child-event', (data) => {
  console.log('收到子应用数据:', data)
})
```

## 路由隔离

Garfish 自动处理子应用路由，子应用可以使用自己的路由系统

```ts
// vue-app 路由
const router = createRouter({
  history: createWebHistory('/vue'),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
  ],
})
```

## 常见问题

### 1. 子应用静态资源 404

确保子应用的 base 配置与 Garfish 路由一致

```ts
// vue.config.js
module.exports = defineConfig({
  base: '/vue',
})
```

### 2. 样式冲突

Garfish 默认开启样式隔离，如需关闭：

```ts
const garfish = new Garfish({
  sandbox: {
    strictStyleIsolation: false,
  },
})
```

### 3. 全局变量污染

使用 Garfish 提供的 API 处理全局变量

```ts
import { defineVariable, getVariable } from 'garfish'

// 定义全局变量
defineVariable('appName', 'my-app')

// 获取全局变量
const name = getVariable('appName')
```

## 部署

### Nginx 配置

```nginx
server {
    listen 80;
    server_name localhost;

    # 主应用
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 子应用
    location /vue {
        alias /usr/share/nginx/html/vue-app;
        index index.html;
        try_files $uri $uri/ /vue/index.html;
    }

    location /react {
        alias /usr/share/nginx/html/react-app;
        index index.html;
        try_files $uri $uri/ /react/index.html;
    }
}
```

---

详见官方文档：https://www.garfish.top/
