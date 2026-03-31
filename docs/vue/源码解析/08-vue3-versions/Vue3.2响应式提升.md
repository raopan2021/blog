# Vue 3.2 响应式提升

## 📖 本节总结

Vue 3.2 引入了 `<script setup>` 语法糖，这是 Composition API 的重大改进，同时响应式系统也有了显著性能提升。

## 1. script setup 语法糖
### 之前
```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
const count = ref(0)
const doubled = computed(() => count.value * 2)
function increment() {
  count.value++
}
onMounted(() => {
  console.log('mounted')
})
// 需要在顶部手动导出
defineExpose({ count })
</script>
```
### 之后（Vue 3.2）
```vue
<script setup>
// 直接使用，无需导入 ref 等（编译器会自动转换）
// 但为了类型提示，建议还是导入
import { ref, computed, onMounted } from 'vue'
const count = ref(0)
const doubled = computed(() => count.value * 2)
function increment() {
  count.value++
}
onMounted(() => {
  console.log('mounted')
})
// 组件暴露（编译时自动处理）
defineExpose({ count })
</script>
```
### 编译器自动转换
```javascript
// <script setup> 会被编译成这样的普通 render 函数
export default {
  setup(props, { expose }) {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)
    function increment() {
      count.value++
    }
    onMounted(() => {
      console.log('mounted')
    })
    // defineExpose 自动处理
    expose({ count })
    return () => h('div', count.value)
  }
}
```
## 2. 响应式变量提升（Reactive Props Destructure）
```vue
<script setup>
// Vue 3.2 支持直接解构 props
const { title, count } = defineProps({
  title: String,
  count: Number
})
// 解构后的变量自动保持响应式！
// 在模板中使用 {{ title }} 会正确响应
</script>
```
### 编译后
```javascript
// Vue 编译器会自动处理，保持响应式
export default {
  setup(props) {
    // 编译为：
    const title = toRef(props, 'title')
    const count = toRef(props, 'count')
    return { title, count }
  }
}
```
## 3. 响应式 props 解构改进
```vue
<script setup>
// Vue 3.2 之前
const props = defineProps({ msg: String })
// 使用时需要 props.msg
console.log(props.msg)
// Vue 3.2 支持
const { msg } = defineProps({ msg: String })
console.log(msg)  // 直接使用，也是响应式的
</script>
```
## 4. 性能提升
### 响应式系统优化
```javascript
// Vue 3.2 对 track 和 trigger 进行了优化
// 减少了不必要的依赖收集
// 改进前
function track(target, key) {
  // 每次访问都要检查
  if (activeEffect) {
    // ...收集依赖
  }
}
// 改进后
// 增加了 early return 优化
// 减少了函数调用开销
```
### benchmark 对比
| 操作 | Vue 3.1 | Vue 3.2 | 提升 |
|------|---------|----------|------|
| reactive 创建 | 100% | 115% | 15% |
| ref 访问 | 100% | 120% | 20% |
| computed | 100% | 118% | 18% |
| watch | 100% | 112% | 12% |
## 5. 新增 defineProps 和 defineEmits 宏
```vue
<script setup>
// 之前的写法
const props = defineProps({
  title: String,
  count: Number,
  items: Array
})
const emit = defineEmits(['update', 'delete'])
// Vue 3.2 支持更简洁的写法
const props = defineProps<{
  title: string
  count: number
  items: string[]
}>()
const emit = defineEmits<{
  (e: 'update', value: number): void
  (e: 'delete', id: number): void
}>()
</script>
```
## 6. 新增 withDefaults
```vue
<script setup lang="ts">
interface Props {
  title?: string
  count?: number
}
// Vue 3.2 支持带默认值的类型化 props
const props = withDefaults(defineProps<Props>(), {
  title: '默认标题',
  count: 0
})
</script>
```
## 总结
Vue 3.2 的核心改进：
| 特性 | 说明 |
|------|------|
| `<script setup>` | 编译时语法糖，更简洁的组件代码 |
| `defineProps` | 编译时宏，类型化的 props |
| `defineEmits` | 编译时宏，类型化的 emits |
| `withDefaults` | 带默认值的 props 定义 |
| `defineExpose` | 编译时宏，暴露组件属性 |
| 响应式性能 | 整体提升 10-20% |
