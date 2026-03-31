# Transition 动画过渡

## 📖 本节总结

`Transition` 组件为单元素提供进入/离开的动画过渡效果，原理是在适当的时机添加/移除 CSS 类名。

## 基本用法
```vue
<template>
  <button @click="show = !show">切换</button>
  <Transition name="fade">
    <p v-if="show">Hello Vue!</p>
  </Transition>
</template>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```
## Transition 的工作原理
### 切换阶段
```
元素创建
    ↓
添加 name-enter / name-enter-active 类
    ↓
下一帧
    ↓
移除 name-enter，添加 name-enter-to
    ↓
transition 动画执行
    ↓
动画结束
    ↓
移除所有类名
```
### CSS 类名规则
| 类名 | 触发时机 |
|------|----------|
| `{name}-enter-from` | 进入前 |
| `{name}-enter-active` | 进入中 |
| `{name}-enter-to` | 进入后 |
| `{name}-leave-from` | 离开前 |
| `{name}-leave-active` | 离开中 |
| `{name}-leave-to` | 离开后 |
## Transition 实现
```javascript
// packages/runtime-core/src/components/Transition.ts
const Transition = {
  name: 'Transition',
  setup(props, { slots }) {
    return () => {
      const vnode = slots.default?.()
      if (!vnode) return vnode
      // 添加 transition 相关属性
      vnode.transition = {
        mode: 'in-out',  // or 'out-in'
        appear: props.appear
      }
      return vnode
    }
  }
}
```
### 钩子函数
```javascript
// 渲染器会调用这些钩子
const nodeOps = {
  insert: (el, parent, anchor) => {
    // 调用 transition 的 enter 钩子
    transitionHooks.enter(el, () => {
      parent.insertBefore(el, anchor)
    })
  },
  remove: (el) => {
    // 调用 transition 的 leave 钩子
    transitionHooks.leave(el, () => {
      el.parentNode.removeChild(el)
    })
  }
}
```
## appear 特性
```vue
<!-- 初始渲染也应用过渡 -->
<Transition appear>
  <p>初始出现也有动画</p>
</Transition>
```
## 模式
### in-out
```vue
<!-- 先进入，再离开 -->
<Transition mode="in-out">
  <component :is="show ? 'A' : 'B'" />
</Transition>
```
### out-in
```vue
<!-- 先离开，再进入 -->
<Transition mode="out-in">
  <component :is="show ? 'A' : 'B'" />
</Transition>
```
## 与 CSS 动画结合
```vue
<template>
  <Transition name="bounce">
    <p class="text">Hello!</p>
  </Transition>
</template>
<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}
</style>
```
## JavaScript 钩子
```vue
<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @enter-cancelled="onEnterCancelled"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
    @leave-cancelled="onLeaveCancelled"
  >
    <p v-if="show">Hello</p>
  </Transition>
</template>
<script setup>
// entering
function onBeforeEnter(el) {
  el.style.opacity = '0'
}
function onEnter(el, done) {
  // 使用 RAF 或 transitionend
  el.offsetHeight  // 触发重排
  el.style.transition = 'opacity 0.5s'
  el.style.opacity = '1'
  setTimeout(done, 500)  // done 标记结束
}
function onAfterEnter(el) {
  // 清理
}
function onEnterCancelled(el) {
  // 进入被中断
}
// leaving (同上类似)
</script>
```
## 列表过渡
### TransitionGroup
```vue
<template>
  <TransitionGroup name="list">
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </TransitionGroup>
</template>
<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
/* 移动动画 */
.list-move {
  transition: transform 0.5s;
}
</style>
```
### TransitionGroup 和 Transition 的区别
| 特性 | Transition | TransitionGroup |
|------|------------|-----------------|
| 子元素 | 单个 | 多个 |
| 容器 | 自动创建 | 需要手动提供 |
| 移动动画 | 不支持 | 支持（通过 FLIP） |
## 总结
| 类名 | 说明 |
|------|------|
| `{name}-enter-from` | 进入前状态 |
| `{name}-enter-active` | 进入中状态 |
| `{name}-enter-to` | 进入后状态 |
| `{name}-leave-from` | 离开前状态 |
| `{name}-leave-active` | 离开中状态 |
| `{name}-leave-to` | 离开后状态 |
| 属性 | 说明 |
|------|------|
| name | 类名前缀 |
| appear | 初始渲染也应用过渡 |
| mode | in-out / out-in |
| @before-enter | 进入前钩子 |
| @enter | 进入钩子 |
| @after-enter | 进入后钩子 |
