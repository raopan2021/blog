# Vue 3.3 泛型组件

## 📖 本节总结

Vue 3.3 主要带来了泛型组件支持、defineSlots 和 defineEmits 的改进，以及更好的 TypeScript 集成。

---

## 1. 泛型组件

### 之前（Vue 3.2）

```vue
<!-- List.vue -->
<script setup>
// 无法指定 item 的类型
defineProps({
  items: Array
})
</script>

<template>
  <div v-for="item in items">
    {{ item.name }}  <!-- 不知道 item 是什么类型 -->
  </div>
</template>
```

### 之后（Vue 3.3）

```vue
<!-- List.vue -->
<script setup lang="ts">
// Vue 3.3 支持泛型组件
interface Item {
  id: number
  name: string
}

defineProps<{
  items: Item[]
}>()
</script>

<template>
  <div v-for="item in items" :key="item.id">
    {{ item.name }}  <!-- 类型安全！ -->
  </div>
</template>
```

### 使用泛型组件

```vue
<script setup lang="ts">
import List from './List.vue'

interface User {
  id: number
  name: string
  email: string
}

// 直接传递泛型参数
<List<User> :items="users" />
</script>
```

## 2. 改进的 defineSlots

### 之前

```vue
<script setup>
const slots = defineSlots()

// slots 是已知的，但类型不精确
</script>
```

### 之后（Vue 3.3）

```vue
<script setup lang="ts">
// Vue 3.3 支持类型化的 slots
const slots = defineSlots<{
  default(props: { msg: string }): any
  header(): any
  footer(props: { count: number }): any
}>()
</script>
```

## 3. 改进的 defineEmits

### 之前

```vue
<script setup>
// 类型不精确
const emit = defineEmits(['update', 'delete'])
emit('update', 1)  // 参数类型未知
emit('wrong', 1)    // 编译时不会报错！
</script>
```

### 之后（Vue 3.3）

```vue
<script setup lang="ts">
// 类型精确的 emit
const emit = defineEmits<{
  (e: 'update', value: number): void
  (e: 'delete', id: number): void
}>()

emit('update', 1)   // ✅ 正确
emit('delete', 2)   // ✅ 正确
emit('wrong', 1)    // ❌ 编译错误！
</script>
```

## 4. defineModel（实验性）

```vue
<script setup>
// Vue 3.3 引入了 defineModel（实验性）
// 更简洁的双向绑定

const model = defineModel<string>()

// 使用
// <input v-model="model" />
// 编译后等价于
// <input :value="model" @update:modelValue="model = $event" />
</script>
```

## 5. generic 属性（实验性）

```vue
<!-- Vue 3.3 支持在 template 中使用 generic -->
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>

<template>
  <!-- 可以使用 T 作为类型 -->
  <div v-for="item in items">
    {{ item }}
  </div>
</template>
```

## 6. 更简洁的 defineProps

### 之前

```typescript
// 需要接口定义
interface Props {
  title: string
  count?: number
  items: string[]
}

defineProps<Props>()
```

### 之后（Vue 3.3）

```typescript
// 支持直接使用类型引用
type Props = {
  title: string
  count?: number
  items: string[]
}

const { title, count, items } = defineProps<Props>()
```

## 7. 更多 TypeScript 改进

```vue
<script setup lang="ts">
// 更精确的 toRef
const { count } = toRefs(props)

// 更精确的 watch
watch(items, (newItems, oldItems) => {
  // newItems 和 oldItems 类型都是 Props['items']
})

// 更精确的 computed
const doubled = computed<number>(() => count.value * 2)
</script>
```

## 总结

Vue 3.3 的核心改进：

| 特性 | 说明 |
|------|------|
| 泛型组件 | 组件可以指定类型参数 |
| defineSlots 改进 | 类型化的 slots |
| defineEmits 改进 | 类型化的 emits，更安全 |
| defineModel | 简化的双向绑定 |
| generic 属性 | template 中使用泛型 |
| TypeScript 集成 | 更好的类型推导 |

---

[← 返回模块概览](../index)
