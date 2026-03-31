# KeepAlive 缓存组件

## 📖 本节总结

`KeepAlive` 可以缓存组件实例，避免重复的挂载和卸载，常用于 tabs、路由切换等场景。

## 为什么需要 KeepAlive？
```vue
<!-- 没有 KeepAlive -->
<template>
  <component :is="currentTab" />
</template>
<!-- 每次切换都会：-->
<!-- 1. 卸载旧组件（调用 unmounted）-->
<!-- 2. 创建新组件（调用 mounted）-->
<!-- 3. 丢失状态（输入内容、滚动位置等）-->
```
```vue
<!-- 使用 KeepAlive -->
<template>
  <KeepAlive>
    <component :is="currentTab" />
  </KeepAlive>
</template>
<!-- 切换时：-->
<!-- 1. 组件被缓存（不调用 unmounted）-->
<!-- 2. 再次显示时直接激活（不调用 mounted）-->
<!-- 3. 状态保留-->
```
## 基本用法
```vue
<!-- 缓存所有子组件 -->
<KeepAlive>
  <component :is="currentView" />
</KeepAlive>
<!-- 只缓存特定组件 -->
<KeepAlive include="Tab1,Tab2">
  <component :is="currentView" />
</KeepAlive>
<!-- 使用条件 -->
<KeepAlive :include="/Tab\d/">
  <component :is="currentView" />
</KeepAlive>
<!-- 最大缓存数量 -->
<KeepAlive :max="10">
  <component :is="currentView" />
</KeepAlive>
```
## include / exclude
```vue
<!-- include: 只有匹配的组件会被缓存 -->
<KeepAlive include="Home,About">
  <component :is="currentView" />
</KeepAlive>
<!-- exclude: 匹配的组件不会被缓存 -->
<KeepAlive exclude="Settings">
  <component :is="currentView" />
</KeepAlive>
<!-- 两者都可以是：-->
<!-- - 字符串，用逗号分隔 -->
<!-- - 正则表达式 -->
<!-- - 函数 (name => boolean) -->
```
## max 属性
```vue
<!-- 最多缓存 3 个组件 -->
<KeepAlive :max="3">
  <component :is="currentView" />
</KeepAlive>
<!-- 当缓存超过 3 个时，最久未使用的会被清除 -->
```
## KeepAlive 的实现原理
### 组件结构
```javascript
// packages/runtime-core/src/components/KeepAlive.ts
const KeepAlive = {
  name: 'KeepAlive',
  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },
  setup(props, { slots }) {
    // 缓存的组件实例
    const cache = new Map()
    // 当前渲染的组件 key
    let current = null
    return () => {
      // 获取要缓存的组件
      const vnode = slots.default?.()
      if (!vnode) return vnode
      // 获取组件名称
      const name = getComponentName(vnode.type)
      // 检查是否应该缓存
      const shouldKeep = shouldKeepAlive(vnode, name, props)
      if (!shouldKeep) {
        return vnode
      }
      // 缓存逻辑...
    }
  }
}
```
### 缓存机制
```javascript
// 使用 Map 缓存组件实例
const cache = new Map()
// 缓存组件
function cacheComponent(key, instance) {
  cache.set(key, instance)
}
// 获取缓存
function getCachedComponent(key) {
  return cache.get(key)
}
// 清除缓存
function pruneCache(key) {
  cache.delete(key)
}
```
### activated / deactivated
```javascript
// 被缓存的组件会触发 activated
const ChildComponent = {
  mounted() {
    console.log('mounted')  // 首次挂载时调用
  },
  activated() {
    console.log('activated')  // 激活时调用（从缓存恢复）
  },
  deactivated() {
    console.log('deactivated')  // 停用时调用（被缓存）
  },
  unmounted() {
    console.log('unmounted')  // 真正卸载时调用
  }
}
```
### 生命周期调用时机
```
首次渲染 Home 组件:
  mounted()         ✅ 调用
  activated()       ✅ 调用
切换到 About 组件:
  deactivated()     ✅ 调用（Home 被缓存）
  mounted()         ✅ 调用（About 挂载）
切换回 Home 组件:
  activated()       ✅ 调用（Home 从缓存恢复）
  deactivated()     ❌ 不调用（About 被缓存）
About 真正卸载时:
  unmounted()       ✅ 调用
```
## 与路由结合
```vue
<!-- 路由组件缓存 -->
<template>
  <KeepAlive include="Home,About,Settings">
    <router-view />
  </KeepAlive>
</template>
```
### 常见问题
```vue
<!-- 1. include/exclude 不生效？-->
<!-- 检查组件是否有 name 属性-->
<script>
export default {
  name: 'MyTab'  // 需要有 name
}
</script>
<!-- 2. 组件状态丢失？-->
<!-- KeepAlive 只能缓存组件实例，响应式数据需要保证数据源在组件外部或使用 persist state -->
<!-- 3. 内存泄漏？-->
<!-- 使用 max 属性限制缓存数量-->
<KeepAlive :max="10">
  <component :is="currentView" />
</KeepAlive>
```
## 总结
| 属性 | 说明 |
|------|------|
| include | 只有匹配的组件被缓存 |
| exclude | 匹配的组件不被缓存 |
| max | 最大缓存数量 |
| 生命周期 | 说明 |
|----------|------|
| activated | 组件激活（从缓存恢复） |
| deactivated | 组件停用（被缓存） |
