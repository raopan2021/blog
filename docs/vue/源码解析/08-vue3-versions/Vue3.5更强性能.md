# Vue 3.5

## 📖 本节总结

Vue 3.5 是 Vue3 的重要版本，带来了响应式系统重构、TypeScript 改进和性能大幅提升。

---

## 响应式系统重构

### 深层响应式懒加载

```javascript
// Vue 3.5 改进了深层响应式的懒加载机制
// 只有实际访问到的深层属性才会被代理

const state = reactive({
  deeply: {
    nested: {
      value: 1
    }
  }
})

// 深层属性只有在访问时才创建代理
// 减少了不必要的代理创建
```

### Map/Set 响应式支持

```javascript
// Vue 3.5 对 Map 和 Set 有完整的响应式支持
const map = reactive(new Map())
map.set('key', 'value')  // ✅ 响应式
map.get('key')          // ✅ 响应式
map.has('key')          // ✅ 响应式

const set = reactive(new Set())
set.add(1)              // ✅ 响应式
set.delete(1)           // ✅ 响应式
```

---

## TypeScript 改进

### 更精确的类型推导

```typescript
// Vue 3.5 改进了 defineProps 的类型推导
// 复杂类型现在能更好地被推断

// 之前可能需要手动指定类型
const props = defineProps<{
  items: Array<{ id: number; name: string }>
}>()

// Vue 3.5 能更准确地推断类型
```

### defineModel 正式版

```vue
<script setup lang="ts">
// Vue 3.5 defineModel 成为正式版
// 不再需要实验性标志

const modelValue = defineModel<string>()
// 等价于
// const modelValue = defineModel({ type: String })

// 使用
// <input v-model="modelValue" />
</script>
```

---

## 性能提升

### 响应式系统性能

```javascript
// Vue 3.5 对响应式系统进行了优化
// 减少了不必要的 track 和 trigger 调用
// 优化了内存分配
```

### 编译优化

```vue
<!-- Vue 3.5 进一步改进了编译优化 -->
<!-- 更好的静态提升 -->
<!-- 更高效的动态绑定处理 -->
```

---

## SSR 改进

### Hydration 优化

```javascript
// Vue 3.5 改进了服务端渲染的水合过程
// 减少了 hydration 期间的不匹配警告
// 加快了首屏渲染速度
```

---

## 错误处理改进

```javascript
// Vue 3.5 改进了错误处理
// 提供更清晰的错误信息

// 组件错误处理
onErrorCaptured((err, instance, info) => {
  console.error(err)
  console.error(info)
  return false  // 阻止错误冒泡
})
```

---

## 迁移指南

```bash
# Vue 3.5 完全兼容 3.x 版本
# 大部分项目可以直接升级

npm install vue@3.5
npm install @vitejs/plugin-vue@latest
```

### 已知变化

| 变化 | 说明 |
|------|------|
| 响应式系统 | 深层响应式行为略有变化 |
| defineModel | 从实验性变为正式版 |
| SSR | hydration 行为更严格 |

---

## 总结

| 类别 | 改进 |
|------|------|
| 响应式 | Map/Set 支持、深层懒加载 |
| TypeScript | 更好的类型推导 |
| defineModel | 正式版 |
| 性能 | 整体 15-30% 提升 |
| SSR | hydration 优化 |
| 错误处理 | 更清晰的错误信息 |
