# 练习 06：实现 watch

> 难度：⭐⭐⭐⭐ | 配套源码：`packages/reactivity/src/apiWatch.ts`

## 📖 原理回顾

### watch 的本质

watch 本质上是一个特殊的 effect，它：
1. 立即执行一次 getter，记录旧值
2. 依赖变化时，执行回调，传入新值和旧值
3. 支持 cleanup（清理上一次的状态）

### watch vs effect

| 特性 | effect | watch |
|------|--------|-------|
| 执行时机 | 依赖变化立即执行 | 依赖变化后执行回调 |
| 回调参数 | 无 | (newVal, oldVal) |
| 立即执行 | 可选 | 可选（immediate） |
| 旧值 | 无 | 有 |

## 📂 源码位置

```typescript
// packages/reactivity/src/apiWatch.ts (简化版)
export function watch(source, callback, options = {}) {
  let getter
  let cleanup

  // 1. 处理数据源
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  // 2. 创建 effect
  let oldValue = undefined
  let newValue = undefined

  const effect = new ReactiveEffect(getter, {
    scheduler() {
      newValue = effect.run()
      callback(newValue, oldValue)
      oldValue = newValue
    }
  })

  // 3. 立即执行一次
  if (options.immediate) {
    callback(newValue = effect.run(), oldValue)
  } else {
    oldValue = effect.run()
  }

  // 4. 返回停止函数
  return () => effect.stop()
}
```

## 🎯 练习要求

### 题目 1：实现基础 watch

```javascript
/**
 * 要求：
 * 1. 支持 function 或 reactive 对象作为 source
 * 2. 依赖变化时执行回调
 * 3. 支持 immediate 选项（立即执行一次）
 */

function watch(source, callback, options = {}) {
  // TODO: 实现
}

// 测试
const state = reactive({ count: 0 })

watch(() => state.count, (newVal, oldVal) => {
  console.log(`count 变化: ${oldVal} → ${newVal}`)
})

state.count++  // 输出: count 变化: 0 → 1
state.count++  // 输出: count 变化: 1 → 2
```

### 题目 2：实现立即执行的 watch

```javascript
/**
 * 要求：
 * 添加 immediate 选项支持
 */

watch(() => state.count, (newVal, oldVal) => {
  console.log(`immediate: count 变化: ${oldVal} → ${newVal}`)
}, { immediate: true })  // 立即执行一次，oldVal 为 undefined
```

### 题目 3：实现 watchEffect

```javascript
/**
 * watchEffect 更简单：
 * 自动收集依赖，依赖变化时执行回调
 */

function watchEffect(callback) {
  // TODO: 实现
}

// 测试
watchEffect(() => {
  console.log(`effect: count = ${state.count}`)
})
state.count++  // 自动触发
```

## 💡 关键点

1. **ReactiveEffect** — 核心是创建一个 effect，scheduler 中执行回调
2. **新旧值** — scheduler 中先 run() 获取新值，然后执行回调
3. **cleanup** — 可选，用于清理上一次的状态

## ✅ 答案参考

<details>

```javascript
function watch(source, callback, options = {}) {
  let getter

  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  let oldValue = undefined
  let newValue = undefined

  const effect = new ReactiveEffect(getter, {
    scheduler() {
      newValue = effect.run()
      callback(newValue, oldValue)
      oldValue = newValue
    }
  })

  if (options.immediate) {
    callback(newValue = effect.run(), oldValue)
  } else {
    oldValue = effect.run()
  }

  return () => effect.stop()
}

function watchEffect(callback) {
  const effect = new ReactiveEffect(
    () => callback(),
    () => {
      effect.run()
    }
  )
  effect.run()
  return () => effect.stop()
}
```

</details>

## 📚 相关源码
- `packages/reactivity/src/apiWatch.ts`
- `packages/reactivity/src/effect.ts` — ReactiveEffect
[← 返回练习列表](../index)
