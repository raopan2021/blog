# 练习 01：实现响应式系统

> 难度：⭐⭐ | 配套源码：`packages/reactivity/src/`

## 📖 原理回顾

Vue3 的响应式系统基于 **Proxy** 实现，核心流程：

```
读取数据 → track() 收集依赖 → 返回值
修改数据 → trigger() 触发更新 → 执行 effect
```

## 📂 源码位置

```
packages/reactivity/src/
├── reactive.ts        # reactive() 函数
├── baseHandler.ts     # Proxy Handler
├── effect.ts          # ReactiveEffect、trackEffect、triggerEffects
├── ref.ts             # RefImpl
└── index.ts           # 导出入口
```

## 🎯 练习要求

### 题目 1：实现基础的 reactive

```javascript
/**
 * 要求：
 * 1. 使用 Proxy 包装对象
 * 2. 在 get 中调用 track() 收集依赖
 * 3. 在 set 中调用 trigger() 触发更新
 * 4. 深层响应式：取到的对象也进行代理
 */

// 初始代码
const targetMap = new WeakMap()

function track(target, key) {
  // TODO: 实现依赖收集
}

function trigger(target, key) {
  // TODO: 实现触发更新
}

function reactive(obj) {
  // TODO: 实现响应式包装
}

// 测试
const state = reactive({ name: '张三', age: 25 })
console.log(state.name)  // 应该打印并收集依赖
state.age = 30          // 应该触发更新
```

### 题目 2：实现 ref

```javascript
/**
 * 要求：
 * 1. 基础类型也需要响应式，所以用对象包裹
 * 2. 实现 __v_isRef 标识
 * 3. getter 中收集依赖，setter 中触发更新
 */

function ref(value) {
  // TODO: 实现 ref
}

const count = ref(0)
console.log(count.value)  // 0
count.value++            // 触发更新
```

## 💡 提示

1. 参考 `baseHandler.ts` 中的 Proxy handler 实现
2. 深层响应式使用递归：`reactive(value)`
3. WeakMap 的 key 是 target 对象，value 是 Map（key → deps）

## ✅ 答案参考

<details>

```javascript
// 完整实现
const reactiveMap = new WeakMap()

function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      depsMap = new Map()
      targetMap.set(target, depsMap)
    }
    let deps = depsMap.get(key)
    if (!deps) {
      deps = new Set()
      depsMap.set(key, deps)
    }
    deps.add(activeEffect)
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (depsMap) {
    const effects = depsMap.get(key)
    effects?.forEach(effect => effect())
  }
}

function reactive(obj) {
  if (!isObject(obj)) return obj

  const existingProxy = reactiveMap.get(obj)
  if (existingProxy) return existingProxy

  const proxy = new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key)
      let res = Reflect.get(target, key, receiver)
      return isObject(res) ? reactive(res) : res
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)
      if (oldValue !== value) {
        trigger(target, key)
      }
      return result
    }
  })

  reactiveMap.set(obj, proxy)
  return proxy
}
```

</details>

---

## 📚 相关源码

- `packages/reactivity/src/reactive.ts` — reactive 实现
- `packages/reactivity/src/baseHandler.ts` — Proxy handler
- `packages/reactivity/src/effect.ts` — trackEffect、triggerEffects

[← 返回练习列表](../index)
