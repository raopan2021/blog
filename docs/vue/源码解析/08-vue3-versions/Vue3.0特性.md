# Vue 3.0 初版特性

## 📖 本节总结

Vue 3.0 是 Vue 历史上的重大升级，带来了全新的响应式系统、Composition API 和改进的编译时优化。

## Vue 3.0 的核心亮点
### 1. Proxy 响应式系统
```javascript
// Vue2 的响应式（Object.defineProperty）
Object.defineProperty(obj, 'name', {
  get() { track(); return value },
  set(newVal) { trigger(); value = newVal }
})
// Vue3 的响应式（Proxy）
const proxy = new Proxy(obj, {
  get(target, key) {
    track(target, key)
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    Reflect.set(target, key, value)
    trigger(target, key)
    return true
  }
})
```
### 2. Composition API
```vue
<!-- Vue2：Options API -->
<template>
  <div>{{ message }}</div>
</template>
<script>
export default {
  data() {
    return { message: 'Hello' }
  },
  methods: {
    handleClick() { /* ... */ }
  },
  mounted() { /* ... */ }
}
</script>
<!-- Vue3：Composition API -->
<template>
  <div>{{ message }}</div>
  <button @click="handleClick">点击</button>
</template>
<script setup>
import { ref, onMounted } from 'vue'
// 响应式状态
const message = ref('Hello')
// 方法
function handleClick() {
  message.value = 'World'
}
// 生命周期
onMounted(() => {
  console.log('mounted')
})
</script>
```
### 3. Teleport（传送门）
```vue
<template>
  <!-- 将 modal 传送到 body 下 -->
  <Teleport to="body">
    <div class="modal">
      <h1>模态框</h1>
      <button @click="$emit('close')">关闭</button>
    </div>
  </Teleport>
</template>
<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
}
</style>
```
### 4. Suspense（异步加载）
```vue
<template>
  <Suspense>
    <!-- 异步组件 -->
    <template #default>
      <AsyncComponent />
    </template>
    <!-- loading 状态 -->
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'
const AsyncComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)
</script>
```
### 5. Fragment（多根节点）
```vue
<!-- Vue2：只能有一个根节点 -->
<template>
  <div class="header">头部</div>
  <!-- ❌ 不允许 -->
</template>
<!-- Vue3：支持多根节点 -->
<template>
  <header>头部</header>
  <main>内容</main>
  <footer>底部</footer>
</template>
```
## Vue 3.0 的架构改进
### 1. Monorepo 架构
```
vue-next/
├── packages/
│   ├── reactivity/      # 响应式系统
│   ├── runtime-core/   # 运行时核心
│   ├── runtime-dom/    # DOM 特定实现
│   ├── compiler-core/  # 编译核心
│   ├── compiler-dom/   # DOM 编译
│   ├── compiler-sfc/   # 单文件组件编译
│   └── shared/         # 共享工具
└── pnpm-workspace.yaml
```
### 2. 更好的 Tree-shaking
```javascript
// Vue2：整个 Vue 被打包
import Vue from 'vue'
Vue.nextTick()  // 即使只用 nextTick，也要打包整个 Vue
// Vue3：按需导入
import { nextTick } from 'vue'
nextTick()  // 只打包需要的内容
```
### 3. 虚拟 DOM 重写
```javascript
// Vue2 的虚拟 DOM
const vnode = {
  type: 'div',
  children: ['text'],
  attrs: { id: 'app' }
}
// Vue3 的虚拟 DOM
const vnode = {
  type: 'div',
  props: { id: 'app', onClick: fn },
  children: [
    { type: 'span', children: 'text' }
  ],
  patchFlag: 1,  // 编译时优化标记
  shapeFlag: 1   // 形状标记
}
```
## 新增的内置组件
| 组件 | 说明 |
|------|------|
| Teleport | 将子组件传送到 DOM 树的任意位置 |
| Suspense | 异步加载组件的 loading 状态 |
| Transition | 动画过渡（改进版） |
| TransitionGroup | 列表过渡（改进版） |
| KeepAlive | 缓存组件实例 |
## 总结
Vue 3.0 的核心改进：
1. **性能** — Proxy 响应式 + 虚拟 DOM 重写 + 编译优化
2. **可维护** — Monorepo + TypeScript 重写
3. **灵活** — Composition API + 更好的逻辑复用
4. **体验** — Teleport + Suspense + Fragment
