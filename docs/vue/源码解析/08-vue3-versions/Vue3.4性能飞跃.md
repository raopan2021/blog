# Vue 3.4

## 📖 本节总结

Vue 3.4 在编译器和运行时都带来了显著的性能提升，特别是 DOM diff 算法的优化。

---

## 编译优化：Block 提升

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

```javascript
// 静态部分被提升到 render 函数外部
const _hoisted_1 = h('div', { class: 'static-header' }, [
  h('h1', '标题'),
  h('span', '静态内容')
])

// render 函数更小更快
function render(_ctx) {
  return h('div', [
    _hoisted_1,
    h('div', _ctx.dynamic)
  ])
}
```

---

## Prop 稳定性检测

```vue
<template>
  <!-- Vue 3.4 会检测 prop 是否稳定 -->
  <Child :key="item.id" />      <!-- item.id 可能变化 -->
  <Child :key="stableKey" />    <!-- stableKey 稳定，标记为 stable -->
</template>
```

---

## DOM Diff 优化

```javascript
// Vue 3.4 改进了 children 的 diff 算法
// 减少了不必要的 DOM 操作
```

### 性能对比

| 场景 | Vue 3.3 | Vue 3.4 | 提升 |
|------|----------|----------|------|
| 列表渲染 100 项 | 100% | 140% | 40% |
| 列表插入 | 100% | 150% | 50% |
| 列表删除 | 100% | 135% | 35% |

---

## v-bind 样式优化

```vue
<template>
  <div :style="{ color: textColor, fontSize: fontSize }">
    内容
  </div>

  <!-- CSS variable 更好支持 -->
  <div :style="{ '--color': dynamicColor }">
    内容
  </div>
</template>
```

---

## 响应式系统优化

```javascript
// 改进1：减少不必要的 track 调用
// 改进2：优化了 Set/Map 的处理
// 改进3：减少了内存分配
```

### 性能对比

| 操作 | Vue 3.3 | Vue 3.4 | 提升 |
|------|----------|----------|------|
| reactive() | 100% | 115% | 15% |
| ref.get | 100% | 120% | 20% |
| ref.set | 100% | 118% | 18% |

---

## 构建产物优化

```javascript
// Vue 3.4 的打包体积进一步减小
// 核心 runtime 从 22KB 降到 21KB (gzip)
```

---

## 性能总结

| 类别 | 改进项 | 提升 |
|------|--------|------|
| 编译 | Block 提升 | 15-20% |
| 编译 | Prop 稳定性检测 | 10-15% |
| 运行时 | DOM diff | 30-50% |
| 运行时 | 响应式系统 | 15-30% |
| 体积 | 打包大小 | 5-8% |
