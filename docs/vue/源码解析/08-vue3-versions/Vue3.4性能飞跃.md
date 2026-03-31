# Vue 3.4 性能飞跃

## 📖 本节总结

Vue 3.4 在编译器和运行时都带来了显著的性能提升，特别是 DOM diff 算法的优化。

## 1. 编译优化：Block 提升
### 之前
```vue
<template>
  <!-- 每次渲染都会重新创建这些静态节点 -->
  <div class="static-header">
    <h1>标题</h1>
    <span>静态内容</span>
  </div>
  <!-- 动态部分 -->
  <div>{{ dynamic }}</div>
</template>
```
### 之后（Vue 3.4）
```javascript
// 静态部分被提升到 render 函数外部
const _hoisted_1 = h('div', { class: 'static-header' }, [
  h('h1', '标题'),
  h('span', '静态内容')
])
// render 函数更小更快
function render(_ctx) {
  return h('div', [
    _hoisted_1,  // 复用静态节点
    h('div', _ctx.dynamic)
  ])
}
```
## 2. 编译优化：Prop 稳定性检测
```vue
<template>
  <!-- Vue 3.4 会检测 prop 是否稳定 -->
  <Child :key="item.id" />      <!-- item.id 可能变化 -->
  <Child :key="stableKey" />    <!-- stableKey 稳定，标记为 stable -->
</template>
```
### 性能影响
```javascript
// 不稳定的 key 需要重新创建组件
// 稳定的 key 可以复用组件实例
// Vue 3.4 的改进减少了不必要的组件重建
```
## 3. DOM diff 优化
```javascript
// Vue 3.4 改进了 children 的 diff 算法
// 减少了不必要的 DOM 操作
// 之前：逐个比较
// 之后：批量处理 + 优化路径
```
### 对比测试
| 场景 | Vue 3.3 | Vue 3.4 | 提升 |
|------|----------|----------|------|
| 列表渲染 100 项 | 100% | 140% | 40% |
| 列表插入 | 100% | 150% | 50% |
| 列表删除 | 100% | 135% | 35% |
| 随机更新 | 100% | 125% | 25% |
## 4. v-bind 样式优化
```vue
<template>
  <!-- Vue 3.4 优化了动态 style 的处理 -->
  <div :style="{ color: textColor, fontSize: fontSize }">
    内容
  </div>
  <!-- CSS variable 更好支持 -->
  <div :style="{ '--color': dynamicColor }">
    内容
  </div>
</template>
```
## 5. 更快的响应式系统
```javascript
// Vue 3.4 对 track 和 trigger 进行了进一步优化
// 改进1：减少不必要的 track 调用
// 改进2：优化了 Set/Map 的处理
// 改进3：减少了内存分配
```
### 响应式性能对比
| 操作 | Vue 3.3 | Vue 3.4 | 提升 |
|------|----------|----------|------|
| reactive() | 100% | 115% | 15% |
| ref.get | 100% | 120% | 20% |
| ref.set | 100% | 118% | 18% |
| watch | 100% | 130% | 30% |
## 6. 构建产物优化
```javascript
// Vue 3.4 的打包体积进一步减小
// 核心 runtime 从 22KB 降到 21KB (gzip)
// 改进：
// 1. 更好的 Tree-shaking
// 2. 移除了一些废弃 API
// 3. 优化了内部实现
```
## 7. v-for 中的 ref 改进
```vue
<template>
  <!-- Vue 3.4 支持更简洁的 ref 用法 -->
  <div v-for="item in items" :ref="el => items[i] = el">
    {{ item }}
  </div>
</template>
```
## 8. defineModel 成为正式特性
```vue
<script setup>
// Vue 3.4 defineModel 更加稳定
const modelValue = defineModel()
// 等价于
// const modelValue = defineModel({ type: String })
</script>
<template>
  <!-- 使用更简洁 -->
  <input v-model="modelValue" />
</template>
```
## 9. 新的编译器常量
```javascript
// Vue 3.4 引入了新的编译时常量
// 用于更好的编译时优化
// BLOCK、Teleport、Suspense 等都有优化
```
## 性能总结
| 类别 | 改进项 | 提升 |
|------|--------|------|
| 编译 | Block 提升 | 15-20% |
| 编译 | Prop 稳定性检测 | 10-15% |
| 运行时 | DOM diff | 30-50% |
| 运行时 | 响应式系统 | 15-30% |
| 体积 | 打包大小 | 5-8% |

```bash
# Vue 3.4 同样兼容 3.x

# 建议同时升级 vite
```

**重要升级**：Vite 5.0 是 Vue 3.4 的最佳搭档，建议一起升级。

