---
title: 字节 Garfish 微前端学习
head:
  - - meta
    - name: description
      content: 字节 Garfish 微前端学习
  - - meta
    - name: keywords
      content: garfish 微前端 vue react angular 主应用 子应用 应用通信 pnpm vite
---

# 字节 Garfish 微前端学习

::: tip ✨ 字节 Garfish 微前端学习

Garfish 是字节跳动推出的微前端框架，支持多框架子应用集成，提供沙箱隔离、预加载、路由劫持等能力

[Garfish 官方文档](https://www.garfishjs.org/)
[Garfish GitHub](https://github.com/bytedance/garfish)
:::

## Garfish 特点

| 特性 | 说明 |
|------|------|
| 跨框架 | 支持 Vue、React、Angular、Svelte 等任意框架 |
| 路由驱动 | 配置路由激活信息即可自动完成挂载和销毁 |
| 沙箱隔离 | JS 沙箱 + CSS 样式隔离 |
| 预加载 | 子应用预加载，提升加载速度 |
| API 简洁 | 接入简单，配置量少 |
| 体积小 | 压缩后约 14KB |

### 架构原理

Garfish 核心由三个模块组成：

- **Loader 模块**：负责子应用资源的加载与解析
- **Router 模块**：实现路由驱动与子应用切换
- **Sandbox 模块**：提供 JS 和 CSS 的隔离环境

```
┌─────────────────────────────────────────────────────┐
│                      主应用                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐ │
│  │ Loader  │  │ Router  │  │      Sandbox        │ │
│  │  加载   │  │  路由   │  │  JS沙箱 │ CSS隔离  │ │
│  └────┬────┘  └────┬────┘  └──────────┬──────────┘ │
│       │             │                    │            │
│  ┌────▼─────────────▼────────────────────▼────┐     │
│  │              子应用容器                       │     │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────┐  │     │
│  │  │  React   │  │   Vue    │  │ Angular │  │     │
│  │  │  子应用   │  │   子应用   │  │  子应用  │  │     │
│  │  └──────────┘  └──────────┘  └─────────┘  │     │
│  └───────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

## 安装依赖

```sh
# 核心包
pnpm add garfish

# 各框架桥接插件（按需安装）
pnpm add @garfish/vue-plugin      # Vue2
pnpm add @garfish/bridge-vue-v3   # Vue3
pnpm add @garfish/react-plugin    # React
pnpm add @garfish/angular-plugin  # Angular

# 路由模块（可选）
pnpm add @garfish/router
```

## 主应用构建

### 基础配置

```ts
// main.ts
import Garfish from 'garfish'

const garfish = new Garfish({
  domGetter: '#subapp-container',  // 子应用挂载容器
  basename: '/',                    // 应用基础路径
  router: {
    mode: 'history',               // or 'hash'
    registerRouterCode: true,      // 自动注册路由劫持代码
  },
  sandbox: {
    open: true,                    // 开启沙箱
    strictStyleIsolation: false,   // 严格样式隔离
    fixOperatorChain: true,        // 修复操作符链
  },
  plugins: [
    // 可选：加载插件
  ],
  apps: [
    // 预配置子应用（也可以通过 registerApp 动态注册）
  ],
})

// 启动
garfish.start()
```

### 完整配置

```ts
import Garfish from 'garfish'

const garfish = new Garfish({
  domGetter: () => document.querySelector('#subapp-container') as HTMLElement,
  basename: '/',
  
  // 路由配置
  router: {
    mode: 'history',          // 'history' | 'hash'
    basename: '/',
    registerRouterCode: true, // 自动注入路由劫持代码
    routes: [                 // 子应用路由配置
      {
        path: '/react/*',
        name: 'react-app',
        entry: 'http://localhost:8091',
      },
      {
        path: '/vue/*',
        name: 'vue-app',
        entry: 'http://localhost:8093',
      },
    ],
  },
  
  // 沙箱配置
  sandbox: {
    open: true,
    // JS 沙箱配置
    snapshot: false,          // 是否使用快照模式（兼容性更好）
    strictStyleIsolation: false,
    // CSS 隔离
    styleScopePatch: true,
    // 修复问题
    fixOperatorChain: true,
    // 需要排除的全局变量
    excludeNativeGlobalVariables: ['__REDUX_DEVTOOLS_EXTENSION__'],
  },
  
  // 全局错误处理
  errorReporterHandler: (err: Error, GARFISH_EVENTS: string) => {
    console.error('[Garfish Error]', err, GARFISH_EVENTS)
    // 上报错误
  },
  
  // 子应用配置
  apps: [
    {
      name: 'react-app',
      activeWhen: '/react',           // 路由激活条件
      entry: 'http://localhost:8091', // 子应用入口地址
      props: {                         // 传递给子应用的数据
        appName: 'react-app',
        onGlobalStateChange: (state) => console.log('state changed', state),
      },
      // 子应用资源配置
      resourcePath: ['/static/js/chunk-vendors.js'],
    },
  ],
})

// 启动前可以注册子应用
garfish.use([
  {
    name: 'vue-app',
    activeWhen: '/vue',
    entry: 'http://localhost:8093',
  },
])

// 启动
garfish.start()
```

### 动态注册子应用

```ts
import { registerApp, registerProvider } from 'garfish'

// 动态注册子应用
registerApp([
  {
    name: 'react-app',
    activeWhen: '/react',
    entry: 'http://localhost:8091',
  },
  {
    name: 'vue-app',
    activeWhen: '/vue',
    entry: 'http://localhost:8093',
  },
])

// 也可以注册 provider 工厂函数
registerProvider((basename) => {
  return {
    name: 'dynamic-app',
    activeWhen: `/${basename}`,
    entry: `http://localhost:${8080 + Math.random() * 10}`,
  }
})
```

### 子应用容器组件

```vue
<template>
  <div id="subapp-container">
    <!-- 子应用将挂载到这里 -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  // 确保容器存在后再启动 Garfish
})

onBeforeUnmount(() => {
  // 可选：清理
})
</script>
```

## 子应用构建

### Vue 3 子应用

#### 方式一：使用 @garfish/bridge-vue-v3（推荐）

```sh
pnpm add @garfish/bridge-vue-v3
```

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { vueBridge } from '@garfish/bridge-vue-v3'

const router = createRouter({
  history: createWebHistory(
    window.__GARFISH_BASENAME__ || import.meta.env.BASE_URL
  ),
  routes: [
    { path: '/', component: () => import('./views/Home.vue') },
    { path: '/about', component: () => import('./views/About.vue') },
  ],
})

// 创建 App 实例的工厂函数
function createAppInstance() {
  const app = createApp(App)
  app.use(router)
  return app
}

// 导出 provider 给 Garfish 调用
export const provider = vueBridge({
  // 根组件
  rootComponent: App,
  
  // createApp 选项
  appOptions: ({ basename, dom, appName, props }) => {
    return {
      el: dom?.querySelector('#app') || '#app',
    }
  },
  
  // 实例创建后处理
  handleInstance: (vueInstance, { basename, dom, appName, props }) => {
    // 添加路由
    vueInstance.use(router)
    
    // 可以在这里做更多初始化
    console.log('[Vue3 子应用] 挂载', { appName, basename, props })
  },
})

// 独立运行（不使用微前端时直接渲染）
if (!window.__GARFISH_PARENT__) {
  createApp(App).use(router).mount('#app')
}
```

#### 方式二：手动导出 provider

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

let app: ReturnType<typeof createApp> | null = null

export function provider({ dom, basename, props }) {
  const container = dom?.querySelector('#app') || '#app'
  
  app = createApp(App)
  
  const router = createRouter({
    history: createWebHistory(basename || '/'),
    routes: [
      { path: '/', component: () => import('./views/Home.vue') },
      { path: '/about', component: () => import('./views/About.vue') },
    ],
  })
  
  app.use(router)
  app.mount(container)
  
  return {
    app,
    destroy: () => {
      app?.unmount()
      app = null
    },
  }
}

// 独立运行
if (!window.__GARFISH_PARENT__) {
  createApp(App).mount('#app')
}
```

### Vue 2 子应用

```sh
pnpm add @garfish/vue-plugin
```

```ts
// main.js
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { vueBridge } from '@garfish/vue-plugin'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: () => import('./views/Home.vue') },
  { path: '/about', component: () => import('./views/About.vue') },
]

export const provider = vueBridge({
  rootComponent: App,
  appOptions: {
    router: new VueRouter({
      mode: 'history',
      base: window.__GARFISH_BASENAME__ || '/',
      routes,
    }),
  },
  handleInstance: (vueInstance, { basename, appName }) => {
    console.log('[Vue2 子应用] 挂载', { appName, basename })
  },
})

// 独立运行
if (!window.__GARFISH_PARENT__) {
  new Vue({
    router: new VueRouter({
      mode: 'history',
      base: '/',
      routes,
    }),
    render: (h) => h(App),
  }).$mount('#app')
}
```

### React 子应用

```sh
pnpm add @garfish/react-plugin
```

```tsx
// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { reactBridge } from '@garfish/react-plugin'

function AppWrapper() {
  return (
    <BrowserRouter basename={window.__GARFISH_BASENAME__ || '/'}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

export const provider = reactBridge({
  rootComponent: App,
  appOptions: ({ dom }) => {
    const container = dom?.querySelector('#root') || '#root'
    return { el: container }
  },
  handleInstance: (reactInstance, { basename, appName }) => {
    console.log('[React 子应用] 挂载', { appName, basename })
  },
})

// 独立运行
if (!window.__GARFISH_PARENT__) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
```

### React + Vite 子应用注意事项

::: warning ⚡ Vite + React 子应用注意点

使用 `@vitejs/plugin-react-swc` 时，可能遇到子应用无法渲染的问题。解决方案：

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // 如果子应用加载失败，暂时移除 @vitejs/plugin-react-swc
    react(),  // 使用标准 react 插件而非 swc 版本
  ],
  server: {
    port: 8091,
    // 确保 CORS
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
```

:::

### Angular 子应用

```sh
pnpm add @garfish/angular-plugin
```

```ts
// main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app/app.module'
import { angularBridge } from '@garfish/angular-plugin'

export const provider = angularBridge({
  rootComponent: AppModule,
  appOptions: {
    ngModule: AppModule,
  },
  handleInstance: (ngModuleRef, { appName }) => {
    console.log('[Angular 子应用] 挂载', { appName })
  },
})

if (!window.__GARFISH_PARENT__) {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err))
}
```

### 子应用 publicPath 配置

::: warning ⚡ 重要：子应用 publicPath

子应用的 base 必须与 Garfish 路由中的 `activeWhen` 一致，否则会导致资源 404

```ts
// 子应用 vite.config.ts
export default defineConfig({
  base: '/vue',  // 必须与 activeWhen: '/vue' 一致
  // ...
})
```

```js
// 子应用 vue.config.js
module.exports = defineConfig({
  publicPath: '/vue',  // 必须与 activeWhen: '/vue' 一致
  // ...
})
```

:::

## 通信机制

### 全局状态共享

Garfish 提供了简洁的全局状态管理 API

#### 主应用设置全局数据

```ts
import { setGlobalData, getGlobalData } from 'garfish'

// 设置全局数据
setGlobalData({
  user: {
    name: '张三',
    token: 'xxx',
    isLogin: true,
  },
  system: {
    theme: 'dark',
    lang: 'zh-CN',
  },
})

// 获取全局数据
const globalData = getGlobalData()
console.log(globalData.user)  // { name: '张三', ... }
```

#### 子应用监听全局数据变化

```ts
// Vue3 子应用
import { inject } from 'vue'

export default {
  setup() {
    const globalData = inject('garfishGlobalData', {})
    
    // 监听全局数据变化
    const unsubscribe = window.__GARFISH_EVENTS__?.onGlobalStateChange?.(
      (state) => {
        console.log('全局状态变化:', state)
      }
    )
    
    onUnmounted(() => {
      unsubscribe?.()
    })
    
    return { globalData }
  }
}
```

### Channel 事件总线

基于事件总线的跨应用通信

#### 子应用向主应用发消息

```ts
import { bus } from 'garfish'

// 子应用发送事件
bus.emit('child:login', { userId: 123, name: '张三' })
bus.emit('child:routeChange', { path: '/home', query: {} })
```

#### 主应用监听子应用事件

```ts
import { bus } from 'garfish'

// 监听任意子应用的事件
bus.use('child:login', (data) => {
  console.log('[主应用] 收到子应用登录事件:', data)
  // 更新全局状态
  setGlobalData({ user: { name: data.name, isLogin: true } })
})

bus.use('child:routeChange', (data) => {
  console.log('[主应用] 子应用路由变化:', data)
})
```

#### 主应用向子应用发消息

```ts
import { bus } from 'garfish'

// 主应用向指定子应用发送事件
bus.emit('main:themeChange', { theme: 'dark' }, 'react-app')

// 所有子应用都能收到
bus.emit('main:logout')
```

#### 子应用监听主应用事件

```ts
import { bus } from 'garfish'

bus.use('main:themeChange', (data) => {
  console.log('[子应用] 收到主题变化:', data)
  // 更新子应用主题
})

bus.use('main:logout', () => {
  console.log('[子应用] 收到登出事件')
  // 清理子应用状态
})
```

### 子应用间通信

```ts
// 子应用 A 发送
bus.emit('app-a:action', { from: 'app-a' })

// 子应用 B 接收
bus.use('app-a:action', (data) => {
  console.log('[子应用 B] 收到 A 的消息:', data)
})
```

## 预加载配置

子应用预加载可以显著提升首次加载速度

```ts
import { preloadApp, setupApp } from 'garfish'

// 预配置（不立即挂载）
setupApp({
  name: 'react-app',
  entry: 'http://localhost:8091',
  attrs: {
    // iframe 属性（可选）
    noSandbox: false,
  },
})

// 预加载（后台加载资源，但不执行）
preloadApp({
  name: 'react-app',
  entry: 'http://localhost:8091',
})

// 也可以预加载所有子应用
preloadApp({ name: '*' })
```

### 路由懒加载 + 预加载

```ts
// 当用户hover到导航时预加载
function hoverToLoad(name: string) {
  const link = document.querySelector(`[data-app="${name}"]`)
  if (link) {
    link.addEventListener('mouseenter', () => {
      preloadApp({ name })
    }, { once: true })
  }
}
```

## 路由隔离

### basename 自动处理

Garfish 会自动向子应用注入 `basename`，子应用路由应使用它：

```ts
// ✅ 正确
const router = createRouter({
  history: createWebHistory(
    window.__GARFISH_BASENAME__ || import.meta.env.BASE_URL
  ),
  routes: [],
})

// ❌ 错误 - 硬编码 basename
const router = createRouter({
  history: createWebHistory('/vue'),  // 写死了
  routes: [],
})
```

### 子应用内部路由跳转

```ts
// 子应用内部路由跳转
router.push('/about')

// 或者通过 Garfish 跳转
import { jumpRouter } from 'garfish'
jumpRouter({ path: '/about' }, 'vue-app')  // 跳转指定子应用路由
```

## CSS 隔离

### 严格样式隔离

```ts
const garfish = new Garfish({
  sandbox: {
    strictStyleIsolation: true,  // 开启严格样式隔离
  },
})
```

开启后，Garfish 会给子应用的根元素添加一个随机属性的 scoped 标记：

```css
/* 子应用样式会被编译成 */
.vue-app[data-garfish-scope] {
  /* 样式 */
}
```

### 手动添加 CSS 前缀

在子应用的 CSS 中使用统一的类名前缀：

```css
/* 子应用样式 */
.my-app-button {
  color: #409eff;
}

/* 编译后自动添加前缀 */
.my-app-button[data-garfish-scope] {
  color: #409eff;
}
```

### 全局样式穿透

如果需要子应用样式影响主应用，使用 `:global`：

```css
/* 只会影响主应用的样式 */
:global(.global-class) {
  color: red;
}
```

## 生命周期

### 子应用生命周期

```ts
export const provider = {
  // 初始化时调用（只调用一次）
  async bootstrap() {
    console.log('[子应用] 初始化')
    return Promise.resolve()
  },
  
  // 每次挂载前调用
  async mount({ dom, basename, props }) {
    console.log('[子应用] 挂载', { dom, basename, props })
    // 创建 Vue/React 实例等
    return Promise.resolve()
  },
  
  // 每次卸载前调用
  async unmount() {
    console.log('[子应用] 卸载')
    // 销毁实例等
    return Promise.resolve()
  },
  
  // 销毁时调用（只调用一次）
  async destroy() {
    console.log('[子应用] 销毁')
    // 清理定时器、事件监听等
    return Promise.resolve()
  },
}
```

### 主应用生命周期

```ts
import { on, off } from 'garfish'

// 子应用加载前
on(GARFISH_EVENTS.LOADING, (appInfo) => {
  console.log('[主应用] 子应用加载中:', appInfo.name)
})

// 子应用渲染前
on(GARFISH_EVENTS.BEFORE_MOUNT, (appInfo) => {
  console.log('[主应用] 子应用即将挂载:', appInfo.name)
})

// 子应用渲染后
on(GARFISH_EVENTS.MOUNTED, (appInfo, container) => {
  console.log('[主应用] 子应用已挂载:', appInfo.name)
})

// 子应用卸载前
on(GARFISH_EVENTS.UNMOUNTED, (appInfo) => {
  console.log('[主应用] 子应用已卸载:', appInfo.name)
})

// 子应用加载出错
on(GARFISH_EVENTS.ERROR, (err, appInfo) => {
  console.error('[主应用] 子应用出错:', appInfo.name, err)
})

// 路由变化（子应用被激活）
on(GARFISH_EVENTS.ACTIVE, (appInfo) => {
  console.log('[主应用] 子应用激活:', appInfo.name)
})
```

## 常见问题

### 1. 子应用静态资源 404

**检查项**：

- 子应用的 `base`/`publicPath` 是否与 Garfish 路由 `activeWhen` 一致
- 子应用开发服务器的 CORS 配置
- `domGetter` 返回的容器是否存在

```ts
// 确认配置正确
registerApp([
  {
    name: 'vue-app',
    activeWhen: '/vue',           // ← 必须与子应用 base 一致
    entry: 'http://localhost:8093',
  },
])
```

```ts
// vite.config.ts
export default {
  base: '/vue',  // ← 必须与 activeWhen 一致
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
}
```

### 2. 样式冲突

**方案一**：开启严格样式隔离

```ts
sandbox: {
  strictStyleIsolation: true,
}
```

**方案二**：子应用使用 CSS Modules

```css
/* Button.module.css */
.button {
  color: blue;
}
```

**方案三**：子应用添加命名空间

```css
.vue-app .button {
  color: blue;
}
```

### 3. 子应用无法渲染

**检查项**：

- 是否正确导出了 `provider`
- 子应用入口 HTML 中 `#app` 容器是否存在
- 是否引入了框架桥接插件

```ts
// ✅ 正确导出
export const provider = vueBridge({ ... })

// ❌ 错误
export default vueBridge({ ... })
```

### 4. 全局变量污染

**方案**：使用 Garfish 沙箱提供的 API

```ts
import { defineVariable, getVariable } from 'garfish'

// 定义子应用私有的全局变量
defineVariable('myAppVersion', '1.0.0')

// 获取变量
const version = getVariable('myAppVersion')

// 在子应用代码中使用
window.myAppVersion  // 会被沙箱隔离
```

### 5. Vite 子应用跨域

```ts
// vite.config.ts
export default defineConfig({
  server: {
    port: 8091,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
    // 如果使用 iframe 模式
    cors: true,
  },
})
```

### 6. 多次挂载同一子应用

Garfish 默认不支持同一子应用多实例。如果需要：

```ts
// 配置多实例支持
registerApp([
  {
    name: 'react-app',
    activeWhen: '/react/*',
    entry: 'http://localhost:8091',
    instanceId: 'react-app-1',  // 指定实例 ID
  },
])
```

## 与 Qiankun 对比

| 对比项 | Garfish | Qiankun |
|-------|---------|---------|
| 团队 | 字节跳动 | 阿里 |
| 沙箱 | JS 沙箱 + CSS 隔离 | JS 沙箱 + CSS Modules |
| 路由 | 自动劫持 | 需要配置 |
| 子应用接入 | 配置简单 | 需要导出生命周期 |
| Vue3 支持 | @garfish/bridge-vue-v3 | 官方支持 |
| 预加载 | setupApp + preloadApp | prefetch |
| 社区活跃度 | 一般 | 较活跃 |
| 文档质量 | 较简洁 | 较完善 |

**选择建议**：
- 需要快速接入多框架 → Garfish
- 需要更好的社区支持 → Qiankun
- 需要 IE 兼容 → Qiankun / Wujie

## 部署

### Nginx 配置

```nginx
server {
    listen 80;
    server_name localhost;

    # 主应用
    location / {
        root /usr/share/nginx/html/main-app;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # CORS
        add_header Access-Control-Allow-Origin *;
    }

    # React 子应用
    location /react {
        alias /usr/share/nginx/html/react-app;
        index index.html;
        try_files $uri $uri/ /react/index.html;
        
        add_header Access-Control-Allow-Origin *;
    }

    # Vue 子应用
    location /vue {
        alias /usr/share/nginx/html/vue-app;
        index index.html;
        try_files $uri $uri/ /vue/index.html;
        
        add_header Access-Control-Allow-Origin *;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        add_header Cache-Control "public, max-age=31536000";
        add_header Access-Control-Allow-Origin *;
    }
}
```

### Docker 多阶段构建

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

# 分别构建主应用和子应用
RUN pnpm --filter main-app build
RUN pnpm --filter react-app build
RUN pnpm --filter vue-app build

FROM nginx:alpine
COPY --from=builder /app/apps/main-app/dist /usr/share/nginx/html/main-app
COPY --from=builder /app/apps/react-app/dist /usr/share/nginx/html/react-app
COPY --from=builder /app/apps/vue-app/dist /usr/share/nginx/html/vue-app

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 一级域名部署

如果主应用和子应用部署在同一级域名下（不同路径），Nginx 配置：

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 主应用 - 根路径
    location / {
        root /usr/share/nginx/html/main;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 子应用 A - /app1 路径
    location /app1 {
        alias /usr/share/nginx/html/subapp1;
        index index.html;
        try_files $uri $uri/ /app1/index.html;
    }

    # 子应用 B - /app2 路径
    location /app2 {
        alias /usr/share/nginx/html/subapp2;
        index index.html;
        try_files $uri $uri/ /app2/index.html;
    }

    # 静态资源
    location ~* \.(js|css|ico|png|jpg|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

详见官方文档：https://www.garfishjs.org/
