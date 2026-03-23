# 微前端

> 微前端是一种将前端应用拆分为多个独立子应用的架构模式，每个子应用可以独立开发、测试和部署

## 📚 目录

### 框架
- [micro-app](./micro-app.md) - 京东微前端方案
- [qiankun](./qiankun.md) - 阿里乾坤微前端框架
- [wujie](./wujie.md) - 字节跳动微前端框架

## 什么是微前端

微前端（Micro Frontends）借鉴了微服务的思想，将庞大的后端应用拆分为多个独立服务。在前端领域，它将一个大型应用拆分为多个可以独立开发、独立部署的子应用。

## 核心价值

- **技术栈无关**：主应用与子应用可以使用不同的框架
- **独立开发**：各子应用可由不同团队独立开发
- **独立部署**：子应用可独立部署，不影响其他应用
- **增量升级**：可以逐步升级或替换部分模块
- **状态隔离**：各子应用间样式和全局变量相互隔离

## 主流方案对比

| 方案 | 开发方 | 特点 | 侵入性 |
|------|--------|------|--------|
| qiankun | 阿里 | 基于 single-spa，生态成熟 | 较低 |
| micro-app | 京东 | Web Component 隔离 | 低 |
| wujie | 字节 | 降级 iframe，性能好 | 低 |
| single-spa | - | 最早的微前端方案 | 较高 |

## 基础架构

```
┌─────────────────────────────────────┐
│            主应用 (Container)        │
│  ┌─────────┐ ┌─────────┐ ┌────────┐  │
│  │ 子应用1 │ │ 子应用2 │ │ 子应用3│  │
│  │ Vue     │ │ React   │ │ jQuery│  │
│  └─────────┘ └─────────┘ └────────┘  │
└─────────────────────────────────────┘
```

## qiankun 接入指南

### 主应用配置

```bash
pnpm add qiankun
```

```js
// main.js
import { registerMicroApps, start } from 'qiankun'

const apps = [
  {
    name: 'vue-app',           // 子应用名称
    entry: '//localhost:8080', // 子应用入口
    container: '#container',   // 挂载容器
    activeRule: '/vue'          // 激活路由
  },
  {
    name: 'react-app',
    entry: '//localhost:3000',
    container: '#container',
    activeRule: '/react'
  }
]

registerMicroApps(apps)

// 启动
start({
  prefetch: 'all',       // 预加载
  sandbox: {
    strictStyleIsolation: true  // 严格样式隔离
  }
})
```

### 子应用接入（Vue3）

```js
// src/entry.js
import { createApp } from 'vue'
import App from './App.vue'

let app = null

// 导出生命周期
export async function bootstrap() {
  console.log('Vue 子应用初始化')
}

export async function mount(props) {
  console.log('Vue 子应用挂载', props)
  app = createApp(App)
  app.mount(props.container.querySelector('#app'))
}

export async function unmount() {
  console.log('Vue 子应用卸载')
  app?.unmount()
  app = null
}
```

### 主应用 → 子应用通信

```js
// 主应用
import { initGlobalState } from 'qiankun'

const state = { token: '', userInfo: {} }

// 初始化状态
const actions = initGlobalState(state)

actions.onGlobalStateChange((state, prev) => {
  console.log('状态变更:', state, prev)
})

// 设置状态
actions.setGlobalState({ token: 'xxx', userInfo: { name: '张三' } })

// 卸载
actions.offGlobalStateChange()
```

```js
// 子应用接收
import { initGlobalState } from 'qiankun'

const actions = initGlobalState({})

actions.onGlobalStateChange((state) => {
  console.log('收到主应用状态:', state)
}, true)
```

## micro-app 接入指南

### 主应用配置

```html
<script src="https://cdn.jsdelivr.net/npm/micro-app@latest/dist/micro-app.min.js"></script>
```

```html
<micro-app name="vue-app" url="http://localhost:8080" baseroute="/vue"></micro-app>
```

```js
// 监听子应用事件
const microApp = document.querySelector('micro-app')

microApp.addEventListener('data-change', (e) => {
  console.log('收到子应用数据:', e.detail.data)
})

// 向子应用发送数据
microApp.setData('vue-app', { fromMain: 'hello' })
```

### 子应用配置（Vue3）

```bash
pnpm add @micro-app/vue3
```

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import microApp from '@micro-app/vue3'

const app = createApp(App)
app.use(microApp)
app.mount('#app')
```

## wujie 接入指南

### 主应用配置

```bash
pnpm add wujie
```

```html
<WujieVue width="100%" height="100%" name="vue-app" url="http://localhost:8080"></WujieVue>
```

```js
import { setupApp, preloadApp } from 'wujie'

setupApp({
  name: 'vue-app',
  url: 'http://localhost:8080',
  attrs: {
    // iframe 属性
  }
})

// 预加载
preloadApp({ name: 'vue-app' })
```

## 样式隔离方案

### 方案一：CSS Modules

```css
/* 子应用样式 */
.main-app .button {
  color: #fff;
}
```

### 方案二：动态加载 CSS

```js
// 子应用加载时注入命名空间
const style = document.createElement('style')
style.textContent = `.main-app { /* 样式 */ }`
document.head.appendChild(style)
```

### 方案三：Shadow DOM（micro-app）

```js
// 子应用使用 Shadow DOM
const shadow = host.attachShadow({ mode: 'open' })
const app = document.createElement('div')
shadow.appendChild(app)
```

## 公共依赖管理

### 方案一：CDN external

```js
// webpack 配置
externals: {
  vue: 'Vue',
  react: 'React'
}
```

### 方案二：子应用全量打包（不推荐）

体积大，但简单

## 常见问题

### 1. 子应用静态资源 404

```js
// 主应用配置
const apps = [
  {
    name: 'vue-app',
    entry: '//localhost:8080',
    // 配置公共基础路径
    customLoader: (app) => {
      // 自定义资源加载
    }
  }
]
```

### 2. 子应用 cookie 丢失

确保同源或在请求头中携带认证信息

### 3. 多实例问题

使用单例模式确保子应用只加载一次

## 适用场景

✅ **适合使用微前端**：
- 大型后台管理系统，多团队协作
- 技术栈升级（Vue2 → Vue3 过渡期）
- 独立部署的需求

❌ **不适合使用微前端**：
- 小型项目（增加复杂度）
- 团队小（沟通成本高）
- 性能敏感的应用
