---
title: 腾讯 Wujie 无界微前端学习
head:
  - - meta
    - name: description
      content: 腾讯 Wujie 无界微前端学习
  - - meta
    - name: keywords
      content: wujie 无界 微前端 vue react iframe 降级 主应用 子应用 应用通信 pnpm
---

# 腾讯 Wujie 无界微前端学习

::: tip ✨ 腾讯 Wujie 无界微前端学习

此 Demo 以`Vue 3`作为基座主应用，子应用分别为使用了`create-react-app`、`vue-cli`、`vite`创建的`React 18`、`Vue2`、`Vue3`项目

[此Demo的Github地址](https://github.com/welives/wujie-demo)

编写此笔记时所使用的`Wujie`版本为`1.x`
:::

## 相关文档

- [Wujie](https://wujie-micro.github.io/)
- [Web Component](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)
- [Vue](https://cn.vuejs.org/)
- [React](https://zh-hans.react.dev/)

## Wujie 特点

- ⚡ **iframe 降级方案**：兼容性最强，即使在沙箱环境也能正常运行
- 🛡️ **沙箱隔离**：支持 JS 和 CSS 隔离
- 🔌 **插件化**：提供丰富的生命周期钩子
- 🌐 **通信简单**：基于 props 的双向通信
- 📱 **无感刷新**：支持子应用热更新
- 🎯 **多实例支持**：支持同时运行多个子应用实例

## 主应用构建

### 初始化项目

```sh
mkdir wujie-demo && cd wujie-demo
mkdir apps
pnpm init
touch pnpm-workspace.yaml
pnpm add -wD typescript @types/node
touch tsconfig.json
touch .gitignore
```

```yaml [pnpm-workspace.yaml]
packages:
  - 'apps/*'
```

```json [tsconfig.json]
{
  "compilerOptions": {
    "baseUrl": ".",
    "module": "ESNext",
    "target": "ESNext",
    "moduleResolution": "Node",
    "allowJs": true,
    "sourceMap": true,
    "strict": true,
    "noEmit": true,
    "declaration": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "noUnusedLocals": false,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "esModuleInterop": true,
    "types": ["node"]
  },
  "exclude": ["node_modules", "dist", "build"]
}
```

```ini [.gitignore]
node_modules/
.DS_Store
dist/
build/
.vscode/
.idea
*.iml
```

### 创建主应用（Vue 3）

```sh
cd apps
pnpm create vue main-app --typescript
cd main-app
pnpm install
pnpm add wujie-vue3
```

编辑`src/main.ts`

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

编辑`src/App.vue`

```vue
<template>
  <div id="wujie-demo">
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/child-react18">React18子应用</router-link>
      <router-link to="/child-vue2">Vue2子应用</router-link>
      <router-link to="/child-vue3">Vue3子应用</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
// App.vue
</script>

<style>
#wujie-demo {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
nav {
  padding: 20px;
  background-color: #f5f5f5;
}
nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #0070f3;
}
nav a.router-link-active {
  font-weight: bold;
  color: #003778;
}
</style>
```

编辑`src/router/index.ts`

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/child-react18',
      name: 'child-react18',
      component: () => import('../views/ChildReactApp.vue'),
    },
    {
      path: '/child-vue2',
      name: 'child-vue2',
      component: () => import('../views/ChildVue2App.vue'),
    },
    {
      path: '/child-vue3',
      name: 'child-vue3',
      component: () => import('../views/ChildVue3App.vue'),
    },
  ],
})

export default router
```

创建`src/views/Home.vue`

```vue
<template>
  <div class="home">
    <h1>Wujie 主应用</h1>
    <p>基于 iframe 降级的微前端框架</p>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  padding: 40px;
}
</style>
```

编辑`vite.config.ts`

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
  },
})
```

## 子应用构建

### 子应用① React18

```sh
cd apps
pnpm create react-app child-react18 --template typescript
cd child-react18
pnpm install
```

新建`.env`文件

```ini
BROWSER=none
HOST=localhost
PORT=3100
PUBLIC_URL='/child-react18'
```

编辑`src/index.tsx`

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

function Root() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

const container = document.getElementById('root')

// wujie 独立运行时
if (!window.__POWERED_BY_WUJIE__) {
  if (container) {
    ReactDOM.createRoot(container).render(<Root />)
  }
}

// 导出 mount/unmount 给 wujie 调用
export { Root }
export function mount({ app: AppComponent, routes }: any) {
  console.log('[React18] mount', { app: AppComponent, routes })
  const container = document.getElementById('root')
  if (container) {
    ReactDOM.createRoot(container).render(<Root />)
  }
}

export function unmount() {
  console.log('[React18] unmount')
  ReactDOM.createRoot(document.getElementById('root')!).unmount()
}
```

编辑`src/App.tsx`

```tsx
import React, { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // 监听主应用下发的数据
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'wujie-data') {
        console.log('[React18] 收到主应用数据:', event.data)
        setData(event.data.payload)
      }
    }

    window.addEventListener('message', handleMessage)

    // 主动获取主应用数据
    // @ts-ignore
    if (window.$wujie?.props) {
      // @ts-ignore
      const initialData = window.$wujie.props.data
      if (initialData) {
        setData(initialData)
      }
    }

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const sendToMain = () => {
    // @ts-ignore
    window.$wujie?.bus?.emit('react18-msg', {
      type: 'react18-msg',
      data: '来自 React18 的消息',
    })
  }

  return (
    <div className="App">
      <header>
        <h1>子应用① -- React@{React.version}</h1>
        <p>收到主应用数据: {JSON.stringify(data)}</p>
        <button onClick={sendToMain}>发送数据给主应用</button>
      </header>
    </div>
  )
}

export default App
```

编辑`src/index.css`

```css
.App {
  text-align: center;
  padding: 20px;
}
.App header {
  background-color: #282c34;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 8px;
}
.App h1 {
  font-size: 1.5em;
}
.App button {
  padding: 10px 20px;
  background-color: #61dafb;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
```

### 子应用② Vue2

```sh
cd apps
vue create child-vue2
cd child-vue2
pnpm install
```

新建`.env`文件

```ini
VUE_APP_HOST=localhost
VUE_APP_PORT=3200
```

编辑`vue.config.js`

```js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  devServer: {
    host: process.env.VUE_APP_HOST,
    port: process.env.VUE_APP_PORT,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  publicPath: '/child-vue2',
})
```

编辑`public/index.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Vue2 子应用</title>
  </head>
</html>
```

编辑`src/main.js`

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// wujie 生命周期
let instance = null

export function bootstrap() {
  console.log('[Vue2] bootstrap')
}

export function mount({ app: AppComponent, routes }) {
  console.log('[Vue2] mount', { app: AppComponent, routes })
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app')
}

export function unmount() {
  console.log('[Vue2] unmount')
  instance?.$destroy()
  instance = null
}

// 独立运行
if (!window.__POWERED_BY_WUJIE__) {
  new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app')
}
```

编辑`src/router/index.js`

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: window.__POWERED_BY_WUJIE__ ? '/child-vue2' : '/',
  routes,
})

export default router
```

编辑`src/App.vue`

```vue
<template>
  <div id="app">
    <h1>子应用② -- Vue@2.6.14</h1>
    <p>收到主应用数据: {{ JSON.stringify(mainData) }}</p>
    <button @click="sendToMain">发送数据给主应用</button>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      mainData: null,
    }
  },
  mounted() {
    // 监听主应用数据
    // @ts-ignore
    if (window.$wujie?.props) {
      // @ts-ignore
      this.mainData = window.$wujie.props.data
    }

    // 监听 bus 事件
    // @ts-ignore
    window.$wujie?.bus?.on('main-data-change', (data) => {
      console.log('[Vue2] 收到主应用数据:', data)
      this.mainData = data
    })
  },
  beforeDestroy() {
    // @ts-ignore
    window.$wujie?.bus?.off('main-data-change')
  },
  methods: {
    sendToMain() {
      // @ts-ignore
      window.$wujie?.bus?.emit('vue2-msg', {
        type: 'vue2-msg',
        data: '来自 Vue2 的消息',
      })
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  padding: 20px;
}
button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
```

创建`src/components/Home.vue`

```vue
<template>
  <div class="home">
    <h2>Vue2 子应用首页</h2>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>
```

### 子应用③ Vue3

```sh
cd apps
pnpm create vue child-vue3
cd child-vue3
pnpm install
```

新建`.env`文件

```ini
VITE_APP_HOST=localhost
VITE_APP_PORT=3300
```

编辑`vite.config.ts`

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/child-vue3',
  server: {
    host: 'localhost',
    port: 3300,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
```

编辑`index.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue3 子应用</title>
  </head>
</html>
```

编辑`src/main.ts`

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// wujie 生命周期
let app: ReturnType<typeof createApp> | null = null

export function bootstrap() {
  console.log('[Vue3] bootstrap')
}

export function mount({ app: AppComponent, routes }: any) {
  console.log('[Vue3] mount', { app: AppComponent, routes })
  app = createApp(App)
  app.use(router)
  app.mount('#app')
}

export function unmount() {
  console.log('[Vue3] unmount')
  app?.unmount()
  app = null
}

// 独立运行
if (!window.__POWERED_BY_WUJIE__) {
  createApp(App).use(router).mount('#app')
}
```

编辑`src/router/index.ts`

```ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
]

export default createRouter({
  history: createWebHistory(
    // @ts-ignore
    window.__POWERED_BY_WUJIE__ ? '/child-vue3' : '/'
  ),
  routes,
})
```

编辑`src/App.vue`

```vue
<template>
  <div class="app">
    <h1>子应用③ -- Vue@{{ vueVersion }}</h1>
    <p>收到主应用数据: {{ JSON.stringify(mainData) }}</p>
    <button @click="sendToMain">发送数据给主应用</button>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, version as vueVersion } from 'vue'
import { useRouter } from 'vue-router'

const mainData = ref<any>(null)
// @ts-ignore
const router = useRouter()

onMounted(() => {
  // 监听主应用数据
  // @ts-ignore
  if (window.$wujie?.props) {
    // @ts-ignore
    mainData.value = window.$wujie.props.data
  }

  // @ts-ignore
  window.$wujie?.bus?.$on('main-data-change', (data: any) => {
    console.log('[Vue3] 收到主应用数据:', data)
    mainData.value = data
  })
})

onUnmounted(() => {
  // @ts-ignore
  window.$wujie?.bus?.$off('main-data-change')
})

const sendToMain = () => {
  // @ts-ignore
  window.$wujie?.bus?.$emit('vue3-msg', {
    type: 'vue3-msg',
    data: '来自 Vue3 的消息',
  })
}
</script>

<style scoped>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  padding: 20px;
  background-color: #f0f9ff;
  border-radius: 8px;
}
button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
```

创建`src/components/Home.vue`

```vue
<template>
  <div class="home">
    <h2>Vue3 子应用首页</h2>
  </div>
</template>

<script setup lang="ts">
// Home component
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>
```

## 主应用使用 WujieVue

编辑`src/views/ChildReactApp.vue`

```vue
<template>
  <div class="child-app-wrapper">
    <WujieVue
      width="100%"
      height="400px"
      name="child-react18"
      :url="react18Url"
      :props="react18Props"
      @change="handleChange"
    ></WujieVue>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WujieVue from 'wujie-vue3'

const react18Url = 'http://localhost:3100/child-react18'

// 传递给子应用的数据
const react18Props = ref({
  data: {
    fromMain: '主应用初始数据',
    timestamp: Date.now(),
  },
})

// 监听子应用事件
const handleChange = (data: any) => {
  console.log('[主应用] 收到 React18 数据:', data)
}

// 子应用挂载完成
const onMounted = () => {
  console.log('[主应用] React18 挂载完成')
}
</script>

<style scoped>
.child-app-wrapper {
  border: 1px dashed #0070f3;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}
</style>
```

编辑`src/views/ChildVue2App.vue`

```vue
<template>
  <div class="child-app-wrapper">
    <WujieVue
      width="100%"
      height="400px"
      name="child-vue2"
      :url="vue2Url"
      :props="vue2Props"
      @change="handleChange"
    ></WujieVue>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WujieVue from 'wujie-vue3'

const vue2Url = 'http://localhost:3200/child-vue2'

const vue2Props = ref({
  data: {
    fromMain: '主应用初始数据',
    timestamp: Date.now(),
  },
})

const handleChange = (data: any) => {
  console.log('[主应用] 收到 Vue2 数据:', data)
}
</script>

<style scoped>
.child-app-wrapper {
  border: 1px dashed #42b983;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}
</style>
```

编辑`src/views/ChildVue3App.vue`

```vue
<template>
  <div class="child-app-wrapper">
    <WujieVue
      width="100%"
      height="400px"
      name="child-vue3"
      :url="vue3Url"
      :props="vue3Props"
      @change="handleChange"
    ></WujieVue>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WujieVue from 'wujie-vue3'

const vue3Url = 'http://localhost:3300/child-vue3'

const vue3Props = ref({
  data: {
    fromMain: '主应用初始数据',
    timestamp: Date.now(),
  },
})

const handleChange = (data: any) => {
  console.log('[主应用] 收到 Vue3 数据:', data)
}
</script>

<style scoped>
.child-app-wrapper {
  border: 1px dashed #f5a623;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}
</style>
```

## setupApp 预加载配置

在主应用入口配置预加载，可以提升子应用首次加载速度

编辑`src/main.ts`

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupApp, preloadApp } from 'wujie' // [!code ++]

const app = createApp(App)
app.use(router)
app.mount('#app')

// 预加载子应用 // [!code ++]
setupApp({ // [!code ++]
  name: 'child-react18', // [!code ++]
  url: 'http://localhost:3100/child-react18', // [!code ++]
  attrs: { // [!code ++]
    // iframe 属性配置 // [!code ++]
  }, // [!code ++]
}) // [!code ++]

setupApp({ // [!code ++]
  name: 'child-vue2', // [!code ++]
  url: 'http://localhost:3200/child-vue2', // [!code ++]
}) // [!code ++]

setupApp({ // [!code ++]
  name: 'child-vue3', // [!code ++]
  url: 'http://localhost:3300/child-vue3', // [!code ++]
}) // [!code ++]

// 可选：预加载 // [!code ++]
preloadApp({ name: 'child-react18' }) // [!code ++]
preloadApp({ name: 'child-vue3' }) // [!code ++]
```

## 子应用通信

### 主应用发送数据给子应用

通过`:props`属性传递数据

```vue
<WujieVue
  width="100%"
  height="400px"
  name="child-react18"
  :url="react18Url"
  :props="{
    data: { message: '来自主应用的消息' }
  }"
></WujieVue>
```

子应用接收

```ts
// Vue3 子应用
onMounted(() => {
  // @ts-ignore
  if (window.$wujie?.props) {
    // @ts-ignore
    const data = window.$wujie.props.data
    console.log('收到主应用数据:', data)
  }
})
```

### 子应用发送数据给主应用

通过`$wujie.bus`发送事件

```ts
// 子应用
// @ts-ignore
window.$wujie?.bus?.$emit('child-msg', {
  type: 'msg-from-child',
  data: '来自子应用的消息',
})
```

主应用监听

```vue
<template>
  <WujieVue
    width="100%"
    height="400px"
    name="child-react18"
    :url="react18Url"
    @change="handleChildMsg"
  ></WujieVue>
</template>

<script setup lang="ts">
const handleChildMsg = (data: any) => {
  console.log('收到子应用消息:', data)
}
</script>
```

## 降级模式

wujie 默认使用 Web Component 沙箱，在不支持的环境下会自动降级为 iframe

### 强制使用 iframe 模式

```vue
<WujieVue
  width="100%"
  height="400px"
  name="child-vue3"
  url="http://localhost:3300/child-vue3"
  :attrs="{ mode: 'iframe' }"
></WujieVue>
```

### 判断当前模式

```ts
// @ts-ignore
if (window.__POWERED_BY_WUJIE__) {
  // @ts-ignore
  const mode = window.$wujie?.mode // 'webComponent' | 'iframe'
  console.log('当前模式:', mode)
}
```

## 生命周期

### 主应用生命周期

```vue
<template>
  <WujieVue
    width="100%"
    height="400px"
    name="child-react18"
    :url="react18Url"
    @created="onCreated"
    @beforeMount="onBeforeMount"
    @mounted="onMounted"
    @beforeUnmount="onBeforeUnmount"
    @unmounted="onUnmounted"
  ></WujieVue>
</template>

<script setup lang="ts">
const onCreated = () => {
  console.log('[主应用] 子应用创建')
}
const onBeforeMount = () => {
  console.log('[主应用] 子应用即将挂载')
}
const onMounted = () => {
  console.log('[主应用] 子应用挂载完成')
}
const onBeforeUnmount = () => {
  console.log('[主应用] 子应用即将卸载')
}
const onUnmounted = () => {
  console.log('[主应用] 子应用卸载完成')
}
</script>
```

### 子应用生命周期

```ts
// 子应用导出生命周期函数
export function bootstrap() {
  console.log('[子应用] 初始化')
}

export function mount() {
  console.log('[子应用] 挂载')
}

export function unmount() {
  console.log('[子应用] 卸载')
}
```

## 常见问题

### 1. 子应用样式丢失

确保子应用的 CSS 没有使用绝对路径

```css
/* 错误 */
background: url('/assets/logo.png');

/* 正确 */
background: url('./assets/logo.png');
/* 或使用相对路径 */
```

### 2. 子应用静态资源 404

确保子应用的 base 配置正确

```ts
// vite.config.ts
export default defineConfig({
  base: '/child-vue3', // 必须与主应用路由一致
})
```

### 3. 跨域问题

确保子应用开发服务器配置了 CORS

```ts
// vite.config.ts
export default defineConfig({
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
```

### 4. 子应用路由跳转

wujie 支持子应用使用自己的路由系统，确保 base 配置正确

```ts
createRouter({
  history: createWebHistory(
    // @ts-ignore
    window.__POWERED_BY_WUJIE__ ? '/child-vue3' : '/'
  ),
  routes,
})
```

### 5. 全局变量冲突

wujie 提供了沙箱隔离，但如果仍有冲突，可以在子应用中使用 IIFE 包裹代码

```ts
;(function () {
  // 你的代码
  const myVar = 'test'
  console.log(myVar)
})()
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

    # 子应用 react18
    location /child-react18 {
        alias /usr/share/nginx/html/child-react18;
        index index.html;
        try_files $uri $uri/ /child-react18/index.html;
    }

    # 子应用 vue2
    location /child-vue2 {
        alias /usr/share/nginx/html/child-vue2;
        index index.html;
        try_files $uri $uri/ /child-vue2/index.html;
    }

    # 子应用 vue3
    location /child-vue3 {
        alias /usr/share/nginx/html/child-vue3;
        index index.html;
        try_files $uri $uri/ /child-vue3/index.html;
    }

    # 静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        add_header Access-Control-Allow-Origin *;
        expires 7d;
    }
}
```

### Docker 部署

在项目根目录新建`Dockerfile`

```dockerfile
FROM node:20-slim AS builder

WORKDIR /app
COPY . /app

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# 构建所有子应用
RUN pnpm --filter main-app build
RUN pnpm --filter child-react18 build
RUN pnpm --filter child-vue2 build
RUN pnpm --filter child-vue3 build

FROM nginx:alpine
COPY --from=builder /app/apps/main-app/dist /usr/share/nginx/html
COPY --from=builder /app/apps/child-react18/build /usr/share/nginx/html/child-react18
COPY --from=builder /app/apps/child-vue2/dist /usr/share/nginx/html/child-vue2
COPY --from=builder /app/apps/child-vue3/dist /usr/share/nginx/html/child-vue3

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

详见官方文档：https://wujie-micro.github.io/
