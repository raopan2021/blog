# 练习 05：实现计算属性

> 难度：⭐⭐⭐ | 配套源码：`packages/reactivity/src/computed.ts`

## 📖 原理回顾

### computed 的核心特性

1. **惰性求值** — 只有在访问 .value 时才计算
2. **缓存** — 依赖不变时，返回缓存值，不重新计算
3. **依赖追踪** — 自动收集依赖，依赖变化时标记为"脏"

### 计算属性的工作流程

```
访问 computed.value
     ↓
effect.dirty === true?  → 是 → 执行 getter 重新计算
     ↓
effect.dirty === false? → 否 → 返回缓存值
     ↓
依赖变化 → triggerRefValue → dirty = true
```

## 📂 源码位置

```typescript
// packages/reactivity/src/computed.ts
class ComputedRefImpl {
  public _value;
  public effect;
  public dep;
  constructor(getter, public setter) {
    // 创建 effect，监听依赖变化
    this.effect = new ReactiveEffect(
      () => getter(this._value),  // getter 函数
      () => {
        // 依赖变化时触发：标记为脏
        triggerRefValue(this);
      }
    );
  }

  get value() {
    if (this.effect.dirty) {
      this._value = this.effect.run();  // 重新计算
      trackRefValue(this);              // 收集当前 effect 的依赖
    }
    return this._value;
  }

  set value(v) {
    this.setter(v);
  }
}
```

## 🎯 练习要求

### 题目 1：实现基础 computed

```javascript
/**
 * 要求：
 * 1. 惰性求值：第一次访问时执行 getter
 * 2. 缓存机制：依赖不变时返回缓存值
 * 3. 依赖变化时自动失效
 */

class ComputedRefImpl {
  constructor(getter, setter) {
    // TODO: 初始化
    // 1. 创建 effect
    // 2. 设置 dirty = true
    this._value = undefined
    this.effect = ???
    this._dirty = true
  }

  get value() {
    // TODO: 实现惰性求值和缓存
    if (???) {
      this._value = ???
      this._dirty = false
    }
    return this._value
  }

  set value(v) {
    this.setter(v)
  }
}

function computed(getterOrOptions) {
  const getter = typeof getterOrOptions === 'function'
    ? getterOrOptions
    : getterOrOptions.get
  const setter = typeof getterOrOptions === 'function'
    ? () => {}
    : getterOrOptions.setter

  return new ComputedRefImpl(getter, setter)
}

// 测试
const count = ref(1)
const doubled = computed(() => {
  console.log('计算中...')
  return count.value * 2
})

console.log(doubled.value)  // 计算中... 2
console.log(doubled.value)  // 不打印（使用缓存）2
count.value = 2
console.log(doubled.value)  // 计算中... 4
```

### 题目 2：实现计算属性的依赖收集

```javascript
/**
 * 要求：
 * 当 effect 中访问 computed 时，computed 应该收集这个 effect
 * 这样 computed 变化时，effect 才会重新执行
 */

// 参考 trackRefValue 的实现
function trackRefValue(ref) {
  if (activeEffect) {
    trackEffect(activeEffect, ref.dep)
  }
}

// 在 computed 的 value getter 中调用 trackRefValue
```

## 💡 关键理解

1. **ReactiveEffect** — computed 内部创建一个 effect，监听 getter 中的响应式依赖
2. **dirty 标志** — 依赖变化时触发 scheduler，将 dirty 设为 true
3. **缓存** — dirty 为 false 时直接返回缓存的 _value

## ✅ 答案参考

<details>

```javascript
class ComputedRefImpl {
  constructor(getter, setter) {
    this._value = undefined
    this._dirty = true

    // 创建 effect，监听 getter 中的响应式依赖
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => {
        // 依赖变化时触发
        this._dirty = true
        triggerRefValue(this)
      }
    )
  }

  get value() {
    // 收集当前 effect 的依赖
    trackRefValue(this)

    // 如果是脏值，重新计算
    if (this._dirty) {
      this._value = this.effect.run()
      this._dirty = false
    }

    return this._value
  }

  set value(v) {
    this.setter(v)
  }
}
```

</details>

## 📚 相关源码
- `packages/reactivity/src/computed.ts`
- `packages/reactivity/src/ref.ts` — trackRefValue、triggerRefValue
- `packages/reactivity/src/effect.ts` — ReactiveEffect
[← 返回练习列表](../index)
