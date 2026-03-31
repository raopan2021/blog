# effect 与 watch 原理

> Vue 如何知道"哪个函数用了哪个数据"？又是如何调度更新的？

## effect 的本质

**effect = 副作用函数 = "当数据变化时要执行的函数"**

```javascript
// 这些都是 effect
effect(() => {
  // 渲染函数
  document.title = state.title
})

// 组件更新函数
effect(() => {
  // 重新渲染组件
  updateComponent(instance)
})

// computed 内部
effect(() => {
  // 重新计算值
  return state.firstName + state.lastName
})
```

## effect 的完整实现

```javascript
/**
 * 全局变量
 */
let currentEffect = null        // 当前正在执行的 effect
const effectStack = []          // effect 栈（用于嵌套）
let effectId = 0                // effect 唯一 ID

/**
 * effect 选项
 */
export interface ReactiveEffectOptions {
  lazy?: boolean        // 是否延迟执行
  scheduler?: Function  // 调度器
  onStop?: Function    // 停止时的回调
}

/**
 * 创建 effect
 * @param {Function} fn - 要执行的函数
 * @param {ReactiveEffectOptions} options - 选项
 * @returns {ReactiveEffect} effect 对象
 */
export function effect(fn, options = {}) {
  // 如果已经是 effect，直接执行
  if (isEffect(fn)) {
    fn = fn.fn
  }

  // 创建 effect 对象
  const effect = createReactiveEffect(fn, options)

  // 如果不是懒执行，立即执行
  if (!options.lazy) {
    effect()
  }

  return effect
}

/**
 * 创建 ReactiveEffect 对象
 */
function createReactiveEffect(fn, options) {
  const effect = {
    id: effectId++,           // 唯一 ID
    fn: fn,                   // 原始函数
    active: true,              // 是否激活
    deps: [],                 // 依赖的所有 deps（用于清理）
    options: options,          // 选项
    // 执行函数
    run() {
      if (!this.active) {
        // 已停用，直接执行
        return this.fn()
      }

      try {
        // 1. 入栈
        effectStack.push(this)

        // 2. 设置当前 effect
        currentEffect = this

        // 3. 执行函数（此时触发 track 收集依赖）
        return this.fn()

      } finally {
        // 4. 出栈
        effectStack.pop()

        // 5. 恢复上一个 effect
        currentEffect = effectStack[effectStack.length - 1]
      }
    },
    // 停止函数
    stop() {
      if (this.active) {
        // 清理依赖
        cleanupEffect(this)
        // 调用 onStop 回调
        this.options.onStop?.()
        this.active = false
      }
    }
  }

  // 将函数替换为 run 方法
  effect.fn = function() {
    return effect.run()
  }

  return effect
}
```

## 依赖收集（track）的完整实现

```javascript
/**
 * 依赖图
 * targetMap[target] = depsMap
 * depsMap[key] = deps (Set of effects)
 */
const targetMap = new WeakMap()

/**
 * 收集依赖
 * 在 getter 中调用，建立 "谁用了这个属性" 的映射
 */
export function track(target, key) {
  // 没有正在执行的 effect，跳过
  if (!currentEffect) return

  // 获取 target 的 depsMap
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  // 获取 key 的 deps（所有依赖这个属性的 effect）
  let deps = depsMap.get(key)
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }

  // 添加当前 effect（去重）
  if (!deps.has(currentEffect)) {
    deps.add(currentEffect)
    // 反向引用：effect 知道自己依赖了哪些
    currentEffect.deps.push(deps)
  }
}
```

## 触发更新（trigger）的完整实现

```javascript
/**
 * 触发更新
 * 在 setter 中调用，执行所有依赖这个属性的 effect
 */
export function trigger(target, key, newValue, oldValue) {
  // 获取依赖图
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  // 获取所有依赖这个 key 的 effects
  const effects = depsMap.get(key)
  if (!effects) return

  // 创建一个新的 effects 集合，避免在执行中修改
  const effectsToRun = new Set()

  // 添加所有 effects
  effects.forEach(effect => {
    effectsToRun.add(effect)
  })

  // 遍历并执行
  effectsToRun.forEach(effect => {
    // 如果有调度器，使用调度器
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      // 否则直接执行
      effect.run()
    }
  })
}
```

## scheduler 调度器

**为什么需要调度器？**

```javascript
// 场景：连续修改数据
state.count = 1
state.count = 2
state.count = 3

// 如果每次修改都触发更新，会渲染 3 次
// 但实际上只需要最终渲染 1 次

// 解决方案：使用调度器批量更新
effect(() => {
  render(state)
}, {
  scheduler(effect) {
    // 收集到队列中，等待批量执行
    queueJob(effect)
  }
})
```

### 完整的调度器实现

```javascript
/**
 * 更新队列
 */
const queue = []
let isFlushing = false
let flushIndex = 0

/**
 * 将 effect 添加到队列中
 */
function queueJob(job) {
  // 避免重复添加
  if (!queue.includes(job)) {
    queue.push(job)
  }

  // 如果没有在执行，开始执行
  if (!isFlushing) {
    isFlushing = true
    Promise.resolve().then(flushJobs)
  }
}

/**
 * 批量执行队列中的 jobs
 */
function flushJobs() {
  isFlushing = true
  flushIndex = 0

  // 按顺序执行
  while (flushIndex < queue.length) {
    const job = queue[flushIndex]
    job()
    flushIndex++
  }

  // 清空队列
  queue.length = 0
  isFlushing = false
}
```

## computed 的 effect 实现

```javascript
/**
 * 创建计算属性
 * computed 本质上是一个带有缓存的 effect
 */
export function computed(getter) {
  // 用于存储上一次的值
  let value
  // 标记是否需要重新计算
  let dirty = true

  // 创建 effect，延迟执行（lazy）
  const effect = new ReactiveEffect(getter, {
    lazy: true,
    // 调度器：当依赖变化时，只标记 dirty，不立即重新计算
    scheduler() {
      dirty = true
    }
  })

  // 返回一个带有 getter 的对象
  return {
    // 计算属性的 getter
    get value() {
      // 收集当前 effect 的依赖
      trackEffect(effect)

      // 如果需要重新计算
      if (dirty) {
        dirty = false
        // 执行 effect 获取新值
        value = effect.run()
      }

      return value
    }
  }
}
```

## watch 的实现

`watch` 本质上是侦听特定数据源变化的 effect。

```javascript
/**
 * watch 选项
 */
export interface WatchOptions {
  immediate?: boolean      // 是否立即执行
  deep?: boolean           // 是否深度监听
  flush?: 'pre' | 'post' | 'sync'  // 执行时机
  onCleanup?: Function     // 清理回调
}

/**
 * 侦听数据变化
 */
export function watch(source, callback, options = {}) {
  let getter
  let cleanup

  // 1. 处理数据源
  if (typeof source === 'function') {
    // source 是函数，直接作为 getter
    getter = source
  } else {
    // source 是响应式对象，遍历其属性
    getter = () => traverse(source)
  }

  // 2. 创建 effect
  let oldValue = undefined
  let newValue = undefined

  const effect = new ReactiveEffect(getter, {
    lazy: true,
    scheduler() {
      // 依赖变化时，执行回调
      newValue = effect.run()

      // 调用清理函数（如果有）
      cleanup?.()

      // 调用 watch 回调
      callback(newValue, oldValue)

      // 更新旧值
      oldValue = newValue
    }
  })

  // 3. 如果是立即执行
  if (options.immediate) {
    // 立即执行一次
    newValue = effect.run()
    callback(newValue, oldValue)
    oldValue = newValue
  } else {
    // 否则先获取一次旧值
    oldValue = effect.run()
  }

  // 4. 返回停止函数
  return () => {
    effect.stop()
  }
}

/**
 * 遍历响应式对象的所有属性（用于 deep watch）
 */
function traverse(value, seen = new Set()) {
  // 如果不是对象，或者是已经访问过的，直接返回
  if (typeof value !== 'object' || value === null || seen.has(value)) {
    return value
  }

  // 标记为已访问
  seen.add(value)

  // 递归遍历所有属性
  for (const key in value) {
    traverse(value[key], seen)
  }

  return value
}
```

## watchEffect 的实现

`watchEffect` 更简单，不需要指定数据源，自动收集依赖：

```javascript
/**
 * watchEffect
 * 自动收集依赖的 watch
 */
export function watchEffect(callback, options = {}) {
  // cleanup 函数
  let cleanup

  // 包装回调，注入清理函数
  const wrappedCallback = () => {
    // 调用清理函数
    cleanup?.()

    // 执行回调，并将清理函数注入进去
    cleanup = callback(() => {})
  }

  // 创建 effect
  const effect = new ReactiveEffect(wrappedCallback, {
    scheduler() {
      // 下一次微任务时执行
      queueJob(effect)
    }
  })

  // 立即执行一次
  if (!options.lazy) {
    effect.run()
  }

  // 返回停止函数
  return () => {
    effect.stop()
  }
}

// 使用示例
watchEffect(() => {
  // 自动收集这里的响应式依赖
  console.log(state.count)
  console.log(state.name)

  // 返回清理函数
  return () => {
    // 清理资源
  }
})
```

## 完整的 effect 执行流程

```
1. 组件渲染
   ↓
2. 创建 effect
   ↓
3. effect.run() 入栈
   ↓
4. 执行 render()
   ↓
5. 读取响应式数据 → track() 收集依赖
   ↓
6. render() 完成
   ↓
7. effect.run() 出栈
   ↓
8. 数据变化 → trigger()
   ↓
9. 找到依赖的 effect
   ↓
10. 执行 effect.scheduler 或 effect.run
   ↓
11. 批量更新（queueJob）
```

## 常见问题

### Q: effect 和 watch 有什么区别？

| 特性 | effect | watch |
|------|--------|-------|
| 用途 | 通用副作用执行 | 侦听特定数据变化 |
| 依赖收集 | 自动 | 需要指定 source |
| 回调参数 | 无 | 获得新值和旧值 |
| 懒执行 | 可选 | 默认不立即执行 |

### Q: 为什么需要 cleanup？

```javascript
watch(() => state.name, (newName) => {
  // 设置定时器
  const timer = setInterval(() => {
    console.log(newName)
  }, 1000)

  // 返回清理函数
  return () => clearInterval(timer)
})
```

### Q: computed 和 watch 有什么区别？

| 特性 | computed | watch |
|------|----------|-------|
| 用途 | 派生值 | 响应变化 |
| 缓存 | ✅ 有缓存 | ❌ 每次变化都执行 |
| 返回值 | 返回值 | 执行回调 |

## 总结

| 概念 | 说明 |
|------|------|
| ReactiveEffect | effect 的核心实现 |
| effectStack | 支持嵌套 effect |
| scheduler | 调度器，控制更新时机 |
| queueJob | 批量更新队列 |
| watch | 侦听数据变化的封装 |
| cleanup | 清理副作用 |

---

## 下节预告

下一节我们将学习最后一个模块 **性能优化**，了解虚拟 DOM 和 Diff 算法的核心原理。

[← 返回模块概览](../index) | [← 上一节：Proxy 深度解析](./Proxy深度解析)
