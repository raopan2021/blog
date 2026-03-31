# Teleport 传送门

## 📖 本节总结

`Teleport` 将子组件渲染到指定的 DOM 节点，常用于模态框、通知提示等需要脱离当前 DOM 树的场景。

## 基本用法
```vue
<template>
  <button @click="showModal = true">打开弹窗</button>
  <Teleport to="body">
    <div v-if="showModal" class="modal">
      <h2>模态框</h2>
      <button @click="showModal = false">关闭</button>
    </div>
  </Teleport>
</template>
```
## to 属性
```vue
<!-- 目标 DOM 选择器 -->
<Teleport to="body">
  <div>渲染到 body</div>
</Teleport>
<!-- 其他选择器 -->
<Teleport to="#modal-root">
  <div>渲染到 #modal-root</div>
</Teleport>
<Teleport to=".container">
  <div>渲染到 .container</div>
</Teleport>
```
## 动态目标
```vue
<!-- 使用 :to 动态绑定 -->
<Teleport :to="targetSelector">
  <div>内容</div>
</Teleport>
<script setup>
const targetSelector = ref('body')
</script>
```
## disabled 属性
```vue
<!-- 禁用传送功能 -->
<Teleport to="body" :disabled="isMobile">
  <div>在移动端不传送到 body</div>
</Teleport>
```
## 多层 Teleport
```vue
<Teleport to="body">
  <div class="outer">
    <Teleport to="#inner-target">
      <div class="inner">
        <!-- 最终渲染到 #inner-target -->
      </div>
    </Teleport>
  </div>
</Teleport>
```
## Teleport 的实现原理
### 编译
```javascript
// 模板
<Teleport to="body">
  <div>内容</div>
</Teleport>
// 编译后
{
  type: Teleport,
  props: {
    to: 'body'
  },
  children: [h('div', '内容')]
}
```
### Teleport 的 VNode 结构
```javascript
const vnode = {
  type: Teleport,
  props: {
    to: 'body',           // 目标选择器
    disabled: false       // 是否禁用
  },
  children: [
    h('div', '内容')
  ],
  shapeFlag: ShapeFlags.TELEPORT
}
```
### 渲染器处理
```javascript
// packages/runtime-core/src/renderer.ts
// processElement 中处理 Teleport
const processComponent = (n1, n2, container) => {
  if (n2.type === Teleport) {
    processTeleport(n1, n2, container)
  }
}
const processTeleport = (n1, n2, container) => {
  const { to, disabled } = n2.props
  // 获取目标 DOM
  const target = document.querySelector(to)
  if (disabled) {
    // 如果禁用，原地渲染
    mountChildren(n2.children, container)
  } else {
    // 传送到目标 DOM
    mountChildren(n2.children, target)
  }
}
```
### 更新处理
```javascript
const updateTeleport = (n1, n2) => {
  const { to: oldTo, disabled: oldDisabled } = n1.props
  const { to: newTo, disabled: newDisabled } = n2.props
  if (oldTo !== newTo || oldDisabled !== newDisabled) {
    // 目标改变，需要移动
    const newTarget = document.querySelector(newTo)
    if (newDisabled) {
      // 禁用：移动回原位置
      moveChildren(n2.children, n1.target)
    } else {
      // 启用：移动到新目标
      moveChildren(n1.children, newTarget)
    }
  }
}
```
## 常见场景
### 模态框
```vue
<template>
  <button @click="show = true">打开</button>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay">
      <div class="modal">
        <h3>标题</h3>
        <p>内容</p>
        <button @click="show = false">关闭</button>
      </div>
    </div>
  </Teleport>
</template>
<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
}
</style>
```
### 通知提示
```vue
<template>
  <Teleport to="body">
    <TransitionGroup name="toast">
      <div v-for="toast in toasts" :key="toast.id" class="toast">
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </Teleport>
</template>
```
## SSR 支持
```javascript
// 服务端渲染时，需要 hydration
// Teleport 在 SSR 中有特殊处理
// 输出到指定位置
// <div id="app"><!--[--><div>内容</div><!--]--></div>
// <div id="modal-root"><!--[--><div>模态框</div><!--]--></div>
```
## 与 KeepAlive 结合
```vue
<!-- 缓存弹窗内容 -->
<Teleport to="body">
  <KeepAlive>
    <Modal v-if="show" />
  </KeepAlive>
</Teleport>
```
## 总结
| 属性 | 说明 |
|------|------|
| to | 目标 DOM 选择器 |
| disabled | 是否禁用传送 |
| 特点 | 说明 |
|------|------|
| DOM 移动 | 子组件渲染到目标 DOM |
| 状态保留 | 组件状态不受影响 |
| 嵌套 | 可以多层嵌套 |
| SSR | 支持服务端渲染 |
