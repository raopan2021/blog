# Vue 3.5 更强性能

## 📖 本节总结

Vue 3.5 在响应式系统、TypeScript 支持和开发体验方面都有显著提升。

## 响应式系统重构
### 更好的 Map/Set 支持
```javascript
// Vue 3.5 对 Map/Set 有更好的响应式支持
const map = reactive(new Map())
map.set('key', 'value')  // ✅ 响应式
const set = reactive(new Set())
set.add(1)  // ✅ 响应式
```
### 深层响应式改进
```javascript
// Vue 3.5 改进了深层响应式的性能
const state = reactive({
  deeply: {
    nested: {
      value: 1
    }
  }
})
// 访问深层属性更快
console.log(state.deeply.nested.value)
```
## TypeScript 改进
### 更精确的类型推导
```typescript
// Vue 3.5 改进了 defineProps 的类型推导
// 之前可能需要手动指定
const props = defineProps<{
  items: Array<{ id: number; name: string }>
}>()
// Vue 3.5 更好地处理复杂类型
```
### defineEmits 改进
```typescript
// Vue 3.5 改进了 emit 的类型检查
const emit = defineEmits<{
  (e: 'update', value: number): void
  (e: 'delete', id: number): void
}>()
// 更容易推断参数类型
emit('update', 123)  // ✅
emit('update', 'str')  // ❌ 类型错误
```
## 性能提升
### 响应式性能
```javascript
// Vue 3.5 对响应式系统进行了优化
// track 和 trigger 调用减少
// 内存分配优化
```
### 编译优化
```vue
<!-- Vue 3.5 进一步改进了编译优化 -->
<template>
  <!-- 更好的静态提升 -->
  <div class="static-class">
    <span>静态内容</span>
  </div>
  <!-- 更高效的动态绑定 -->
  <div :class="dynamicClass">
    {{ message }}
  </div>
</template>
```
## defineModel 正式版
```vue
<script setup>
// Vue 3.4 实验性，Vue 3.5 正式版
const model = defineModel<string>()
// 使用
// <input v-model="model" />
</script>
```
## watchEffect 改进
```javascript
// Vue 3.5 改进了 watchEffect
watchEffect(() => {
  // 更好的依赖追踪
  console.log(state.count)
}, {
  // 新的选项
  flush: 'post',  // post 或 sync
  onTrack: (e) => debugger,
  onTrigger: (e) => debugger
})
```
## DevTools 改进
```javascript
// Vue 3.5 改进了 DevTools 支持
// 更好的组件树显示
// 更详细的性能分析
// 响应式依赖可视化
```
## 错误处理改进
```javascript
// Vue 3.5 改进了错误处理
const app = createApp(App)
// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error(err)
  console.error(info)
}
// 组件错误处理
onErrorCaptured((err, instance, info) => {
  console.error(err)
  return false  // 阻止冒泡
})
```
## SSR 改进
```javascript
// Vue 3.5 改进了服务端渲染
// 更好的 hydration
// 更快的首屏渲染
```

```bash
# Vue 3.5 完全兼容 3.x

# 建议同时升级
npm install @vitejs/plugin-vue@latest
```

## 性能对比

| 场景 | Vue 3.4 | Vue 3.5 | 提升 |
|------|----------|----------|------|
| 响应式创建 | 100% | 115% | 15% |
| 组件挂载 | 100% | 120% | 20% |
| watch 触发 | 100% | 130% | 30% |
| SSR 首屏 | 100% | 140% | 40% |

## 总结

Vue 3.5 的核心改进：

| 类别 | 改进 |
|------|------|
| 响应式 | Map/Set 支持、深层性能 |
| TypeScript | 更好的类型推导 |
| 性能 | 整体 15-30% 提升 |
| defineModel | 正式版 |
| DevTools | 更好的支持 |
| SSR | hydration 改进 |
