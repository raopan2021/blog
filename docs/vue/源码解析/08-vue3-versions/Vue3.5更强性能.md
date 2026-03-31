# Vue 3.5

## 📖 本节总结

Vue 3.5 带来了全面的响应式系统重构、SSR 改进、新增多个重要 API。

---

## 响应式系统优化

### 深层响应式懒加载

```javascript
// Vue 3.5 改进了深层响应式的懒加载机制
// 只有实际访问到的深层属性才会被代理

const state = reactive({
  user: {
    profile: {
      name: '张三'
    }
  }
})

// 只有访问到的路径才会创建代理
state.user           // 创建了第一层代理
state.user.profile   // 访问时才创建第二层
```

### Map/Set 完整支持

```javascript
// Vue 3.5 对 Map 和 Set 有完整的响应式支持
const map = reactive(new Map())
map.set('key', 'value')  // ✅ 响应式
map.get('key')          // ✅ 响应式
map.has('key')          // ✅ 响应式
map.delete('key')       // ✅ 响应式

const set = reactive(new Set())
set.add(1)              // ✅ 响应式
set.has(1)              // ✅ 响应式
set.delete(1)           // ✅ 响应式
```

---

## Reactive Props Destructure

### 解构后的 Props 保持响应式

```vue
<script setup>
// Vue 3.5 改进了 props 解构后的响应式
const { title, count } = defineProps({
  title: String,
  count: Number
})

// 解构后的变量自动保持响应式
// 在模板中使用 {{ title }} 会正确响应变化
</script>
```

### 与 watch 结合

```vue
<script setup>
const { query } = defineProps<{
  query: string
}>()

// 现在可以正确 watch 解构后的 props
watch(query, (newVal) => {
  console.log('query changed:', newVal)
})
</script>
```

---

## SSR 改进

### Lazy Hydration（懒水合）

```vue
<template>
  <!-- 使用 v-html 中的内容会在需要时才水合 -->
  <div v-html="content" hydrate-on-visible></div>

  <!-- 指定 hydrate 策略 -->
  <div v-html="content" hydrate-on-idle></div>
</template>
```

### 服务端渲染性能提升

```javascript
// Vue 3.5 改进了服务端渲染的性能
// 减少了不必要的序列化
// 优化了 hydration 过程
```

---

## useId()

### 生成稳定的 ID

```vue
<script setup>
import { useId } from 'vue'

// 生成唯一的、稳定的 ID
const id = useId()

// 在表单元素中使用
// 刷新页面后 ID 保持一致（SSR/CSR 一致性）
</script>

<template>
  <label :for="id">用户名</label>
  <input :id="id" type="text" />
</template>
```

### 多个 ID

```vue
<script setup>
const id = useId()
// id 格式: v-:xxx（如 v-f4a2b3c1）

// 多个 ID 可以基于此生成
const firstId = id
const secondId = `${id}-field`
</script>
```

---

## data-allow-mismatch

### 客户端失配警告

```vue
<template>
  <!-- 允许客户端与服务端内容不匹配，不显示警告 -->
  <div data-allow-mismatch>
    {{ dynamicContent }}
  </div>

  <!-- 指定只忽略 class 属性 -->
  <div data-allow-mismatch="class">
    {{ dynamicClass }}
  </div>
</template>
```

---

## Custom Elements 改进

### 自定义元素增强

```javascript
// Vue 3.5 改进了自定义元素的支持

// 更好的 prop 类型处理
// 支持 Vue 的响应式系统与自定义元素结合
```

---

## useTemplateRef()

### 获取模板 ref

```vue
<script setup>
import { useTemplateRef } from 'vue'

// 更简洁的模板 ref 获取方式
const container = useTemplateRef('container')

onMounted(() => {
  // 可以直接访问 DOM 元素
  console.log(container.value)
})
</script>

<template>
  <div ref="container">内容</div>
</template>
```

---

## Deferred Teleport

### 延迟传送

```vue
<template>
  <!-- defer 属性让 Teleport 延迟执行 -->
  <Teleport to="body" defer>
    <div>稍后传送</div>
  </Teleport>
</template>
```

---

## onWatcherCleanup()

### Watch 清理函数

```vue
<script setup>
import { ref, onWatcherCleanup } from 'vue'

const count = ref(0)

watch(count, (newCount) => {
  // 设置定时器
  const timer = setTimeout(() => {
    console.log('count changed to:', newCount)
  }, 1000)

  // 返回清理函数
  onWatcherCleanup(() => {
    clearTimeout(timer)
  })
})
</script>
```

---

## 性能提升

| 场景 | 提升 |
|------|------|
| 响应式系统 | 显著优化 |
| SSR 水合 | 更快 |
| 内存使用 | 更少 |

---

## 总结

| 特性 | 说明 |
|------|------|
| 响应式优化 | 深层懒加载、Map/Set 支持 |
| Reactive Props Destructure | 解构后保持响应式 |
| SSR 改进 | Lazy Hydration |
| useId() | 稳定的唯一 ID |
| data-allow-mismatch | 允许内容失配 |
| useTemplateRef() | 简化的模板 ref |
| Deferred Teleport | 延迟传送 |
| onWatcherCleanup() | Watch 清理函数 |
