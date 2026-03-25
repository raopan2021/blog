---
title: 阿里 Qiankun 乾坤微前端学习
head:
  - - meta
    - name: description
      content: 阿里 Qiankun 乾坤微前端学习
  - - meta
    - name: keywords
      content: qiankun 乾坤 微前端 vue react angular 主应用 子应用 应用通信 pnpm
---

# 阿里 Qiankun 乾坤微前端学习

::: tip ✨ 阿里 Qiankun 乾坤微前端学习

此 Demo 以`Vue 3`作为基座主应用，子应用分别为使用了`create-react-app`、`vue-cli`、`vite`创建的`React 18`、`Vue2`、`Vue3`项目

[此Demo的Github地址](https://github.com/welives/qiankun-demo)

编写此笔记时所使用的`Qiankun`版本为`2.x`
:::

## 相关文档

- [Qiankun](https://qiankun.umijs.org/)
- [single-spa](https://single-spa.js.org/)
- [Vue](https://cn.vuejs.org/)
- [React](https://zh-hans.react.dev/)

## 主应用构建

新建一个`qiankun-demo`目录，这里将使用`pnpm`的`monorepo`模式管理各项目

### 初始化项目

```sh
mkdir qiankun-demo && cd qiankun-demo
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
    "noUnusedLocals": true,
    "noImplicitAny": true,
    "strictNullChecks": false,
    "esModuleInterop": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
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
pnpm add qiankun
```

编辑`src/main.ts`，初始化 qiankun

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { registerMicroApps, start } from 'qiankun' // [!code ++]
import type { MicroApp as MicroAppType } from 'qiankun' // [!code ++]

const app = createApp(App)
app.mount('#app')

// 定义子应用配置 // [!code ++]
const microApps: { name: string; entry: string; container: string; activeRule: string }[] = [ // [!code ++]
  { // [!code ++]
    name: 'child-react18', // [!code ++]
    entry: '//localhost:3100', // [!code ++]
    container: '#subapp-container', // [!code ++]
    activeRule: '/child-react18', // [!code ++]
  }, // [!code ++]
  { // [!code ++]
    name: 'child-vue2', // [!code ++]
    entry: '//localhost:3200', // [!code ++]
    container: '#subapp-container', // [!code ++]
    activeRule: '/child-vue2', // [!code ++]
  }, // [!code ++]
  { // [!code ++]
    name: 'child-vue3', // [!code ++]
    entry: '//localhost:3300', // [!code ++]
    container: '#subapp-container', // [!code ++]
    activeRule: '/child-vue3', // [!code ++]
  }, // [!code ++]
] // [!code ++]

// 注册子应用 // [!code ++]
registerMicroApps(microApps, { // [!code ++]
  beforeLoad: [ // [!code ++]
    (app) => { // [!code ++]
      console.log('[主应用] before load', app.name) // [!code ++]
      return Promise.resolve() // [!code ++]
    }, // [!code ++]
  ], // [!code ++]
  beforeMount: [ // [!code ++]
    (app) => { // [!code ++]
      console.log('[主应用] before mount', app.name) // [!code ++]
      return Promise.resolve() // [!code ++]
    }, // [!code ++]
  ], // [!code ++]
  afterMount: [ // [!code ++]
    (app) => { // [!code ++]
      console.log('[主应用] after mount', app.name) // [!code ++]
      return Promise.resolve() // [!code ++]
    }, // [!code ++]
  ], // [!code ++]
  afterUnmount: [ // [!code ++]
    (app) => { // [!code ++]
      console.log('[主应用] after unmount', app.name) // [!code ++]
      return Promise.resolve() // [!code ++]
    }, // [!code ++]
  ], // [!code ++]
}) // [!code ++]

// 启动 qiankun // [!code ++]
start({ // [!code ++]
  prefetch: 'all', // 预加载所有子应用 // [!code ++]
  singular: false, // 是否单例模式，false 表示多实例 // [!code ++]
}) // [!code ++]
```

编辑`src/App.vue`，添加导航和子应用容器

```vue
<template>
  <div id="qiankun-demo">
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/child-react18">React18子应用</router-link>
      <router-link to="/child-vue2">Vue2子应用</router-link>
      <router-link to="/child-vue3">Vue3子应用</router-link>
    </nav>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
    <!-- 子应用容器 -->
    <div id="subapp-container"></div>
  </div>
</template>

<script setup lang="ts">
// App.vue
</script>

<style>
#qiankun-demo {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
nav {
  padding: 20px;
}
nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #42b983;
}
nav a.router-link-active {
  font-weight: bold;
  color: #2c3e50;
}
#subapp-container {
  padding: 20px;
  min-height: 400px;
}
</style>
```

编辑`src/router/index.ts`，添加子应用路由

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

创建占位组件`src/views/ChildReactApp.vue`、`src/views/ChildVue2App.vue`、`src/views/ChildVue3App.vue`

```vue
<!-- ChildReactApp.vue -->
<template>
  <div class="child-app-wrapper">
    <!-- react18 子应用将挂载在这里 -->
  </div>
</template>

<!-- ChildVue2App.vue -->
<template>
  <div class="child-app-wrapper">
    <!-- vue2 子应用将挂载在这里 -->
  </div>
</template>

<!-- ChildVue3App.vue -->
<template>
  <div class="child-app-wrapper">
    <!-- vue3 子应用将挂载在这里 -->
  </div>
</template>

<style scoped>
.child-app-wrapper {
  border: 1px dashed #42b983;
  padding: 20px;
  border-radius: 8px;
}
</style>
```

编辑`vite.config.ts`，确保主应用运行在合适端口

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
```

## 子应用构建

### 子应用① React18

使用`create-react-app`创建

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

let root: ReactDOM.Root | null = null

// qiankun 生命周期函数
export async function bootstrap() {
  console.log('[React18] 子应用 bootstrap')
}

export async function mount(props: { container?: HTMLElement }) {
  console.log('[React18] 子应用 mount', props)
  const container = props.container?.querySelector('#root') || document.getElementById('root')
  if (container) {
    root = ReactDOM.createRoot(container)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}

export async function unmount() {
  console.log('[React18] 子应用 unmount')
  root?.unmount()
  root = null
}

// 独立运行时直接渲染
if (!window.__POWERED_BY_QIANKUN__) {
  const container = document.getElementById('root')
  if (container) {
    ReactDOM.createRoot(container).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}
```

编辑`public/index.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="React18 子应用" />
    <title>React18 子应用</title>
    <!-- 用于独立运行时的标题 -->
    <title>React 子应用</title>
  </head>
</html>
```

编辑`src/App.tsx`

```tsx
import React, { useState, useEffect } from 'react'

interface Props {
  name?: string
}

function App({ name }: Props) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // 监听主应用下发的数据
    const handleData = (e: CustomEvent) => {
      console.log('[React18] 收到主应用数据:', e.detail)
      setData(e.detail)
    }

    // @ts-ignore
    window?.__QIANKUN_PROPS__?.addEventListener?.('data-change', handleData)

    return () => {
      // @ts-ignore
      window?.__QIANKUN_PROPS__?.removeEventListener?.('data-change', handleData)
    }
  }, [])

  const sendToMain = () => {
    // @ts-ignore
    window.__QIANKUN_UNMOUNT__?.({ type: 'react18-msg', data: '来自 React18 的消息' })
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

编辑`src/index.css`添加简单样式

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

使用`vue-cli`创建

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

let instance = null

// qiankun 生命周期函数
export function bootstrap() {
  console.log('[Vue2] 子应用 bootstrap')
}

export async function mount(props) {
  console.log('[Vue2] 子应用 mount', props)

  // 监听主应用下发的数据
  if (props.onGlobalStateChange) {
    props.onGlobalStateChange((state) => {
      console.log('[Vue2] 收到主应用数据:', state)
      instance?.$set(instance, 'mainData', state)
    }, true)
  }

  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app')
}

export async function unmount() {
  console.log('[Vue2] 子应用 unmount')
  instance?.$destroy()
  instance = null
}

// 独立运行时直接渲染
if (!window.__POWERED_BY_QIANKUN__) {
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
  base: window.__POWERED_BY_QIANKUN__ ? '/child-vue2' : '/',
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
  methods: {
    sendToMain() {
      // @ts-ignore
      if (window.__QIANKUN_UNMOUNT__) {
        // @ts-ignore
        window.__QIANKUN_UNMOUNT__({
          type: 'vue2-msg',
          data: '来自 Vue2 的消息',
        })
      }
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

使用`vite`创建

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
import { resolve } from 'path'

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

let app: ReturnType<typeof createApp> | null = null

// qiankun 生命周期函数
export async function bootstrap() {
  console.log('[Vue3] 子应用 bootstrap')
}

export async function mount(props: any) {
  console.log('[Vue3] 子应用 mount', props)

  // 监听主应用下发的数据
  if (props.onGlobalStateChange) {
    props.onGlobalStateChange(
      (state: any) => {
        console.log('[Vue3] 收到主应用数据:', state)
        // 可以通过 provide/inject 或 store 传递数据
      },
      true
    )
  }

  app = createApp(App)
  app.use(router)
  app.mount(props.container ? props.container.querySelector('#app') : '#app')
}

export async function unmount() {
  console.log('[Vue3] 子应用 unmount')
  app?.unmount()
  app = null
}

// 独立运行时直接渲染
if (!window.__POWERED_BY_QIANKUN__) {
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
    window.__POWERED_BY_QIANKUN__ ? '/child-vue3' : '/'
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
import { ref, provide, onMounted, onUnmounted } from 'vue'
import { version as vueVersion } from 'vue'

const mainData = ref<any>(null)

// @ts-ignore
const props = window.__QIANKUN_PROPS__

onMounted(() => {
  // 监听主应用下发的数据
  if (props?.onGlobalStateChange) {
    props.onGlobalStateChange(
      (state: any) => {
        console.log('[Vue3] 收到主应用数据:', state)
        mainData.value = state
      },
      true
    )
  }
})

const sendToMain = () => {
  // @ts-ignore
  if (window.__QIANKUN_UNMOUNT__) {
    // @ts-ignore
    window.__QIANKUN_UNMOUNT__({
      type: 'vue3-msg',
      data: '来自 Vue3 的消息',
    })
  }
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

## 主应用子应用通信

qiankun 提供了`initGlobalState`方法用于主应用和子应用之间的通信。

### 主应用发送数据给子应用

编辑`src/main.ts`，添加全局状态管理

```ts
import { initGlobalState, registerMicroApps, start } from 'qiankun'
import type { Actions } from 'qiankun'

// 初始化全局状态
const initialState = {
  user: null,
  token: '',
}

// 创建全局状态实例
const actions: Actions = initGlobalState(initialState)

// 监听全局状态变化
actions.onGlobalStateChange((state, prev) => {
  console.log('[主应用] 状态变化:', state, '前一个状态:', prev)
})

// 设置全局状态
export function setGlobalState(state: Partial<typeof initialState>) {
  actions.setGlobalState(state)
}

// 获取当前全局状态
export function getGlobalState() {
  return actions.getGlobalState()
}

// 导出 actions 供其他组件使用
export { actions }
```

在组件中使用

```vue
<template>
  <div>
    <button @click="sendToChild">发送数据给子应用</button>
  </div>
</template>

<script setup lang="ts">
import { actions } from '../main'

const sendToChild = () => {
  actions.setGlobalState({
    user: { name: '张三', age: 18 },
    token: 'abc123',
  })
}
</script>
```

### 子应用接收主应用数据

在子应用的 mount 生命周期中接收数据

```ts
// Vue3 子应用示例
export async function mount(props) {
  console.log('[Vue3] mount', props)

  // 监听主应用状态变化
  props.onGlobalStateChange?.((state: any, prev: any) => {
    console.log('[Vue3] 状态变化:', state, 'prev:', prev)
  }, true)

  app = createApp(App)
  app.mount(props.container?.querySelector('#app') || '#app')
}
```

### 子应用发送数据给主应用

子应用通过`props`获取主应用的方法来发送数据

```ts
// 子应用 mount 时获取主应用的方法
export async function mount(props) {
  // 发送数据给主应用
  props.setGlobalState?.({
    type: 'child-msg',
    data: '来自子应用的消息',
  })
}
```

## 样式隔离

qiankun 提供了两种样式隔离方式

### 严格样式隔离（strictStyleIsolation）

启用后，子应用的样式会影响主应用，需要通过`container`选择器包裹

编辑`src/main.ts`

```ts
start({
  prefetch: 'all',
  singular: false,
  sandbox: {
    strictStyleIsolation: true, // 严格样式隔离
  },
})
```

### 实验性样式隔离（experimentalStyleIsolation）

启用后，qiankun 会自动给子应用的样式添加前缀

```ts
start({
  prefetch: 'all',
  singular: false,
  sandbox: {
    experimentalStyleIsolation: true, // 实验性样式隔离
  },
})
```

### 子应用添加命名空间

在子应用的 CSS 中添加统一的类名前缀

```css
.vue2-app {
  /* 所有样式都添加 .vue2-app 前缀 */
}
.vue2-app h1 {
  color: #42b983;
}
```

## 常见问题

### 1. 子应用静态资源 404

确保子应用的`publicPath`配置正确

```ts
// vue.config.js
module.exports = defineConfig({
  publicPath: '/child-vue2',
})
```

```ts
// vite.config.ts
export default defineConfig({
  base: '/child-vue3',
})
```

### 2. 子应用路由跳转丢失

确保子应用的`base`与`activeRule`一致

```ts
// 主应用
{
  name: 'child-vue3',
  entry: '//localhost:3300',
  container: '#subapp-container',
  activeRule: '/child-vue3',
}

// 子应用 router
createRouter({
  history: createWebHistory('/child-vue3'), // 必须与 activeRule 一致
  routes,
})
```

### 3. 子应用获取不到主应用数据

确保在 mount 生命周期后再调用`onGlobalStateChange`

```ts
export async function mount(props) {
  // 正确：在 mount 中监听
  props.onGlobalStateChange?.((state) => {
    console.log('收到数据:', state)
  }, true)
}
```

### 4. 子应用全局变量冲突

使用 qiankun 的沙箱机制可以隔离全局变量，如果仍有冲突，可以：

1. 使用`imports`明确声明需要隔离的模块
2. 在子应用中使用`IIFE`包裹代码

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

    # CORS 头
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

# 构建主应用
RUN pnpm --filter main-app build

# 构建子应用
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

详见官方文档：https://qiankun.umijs.org/
