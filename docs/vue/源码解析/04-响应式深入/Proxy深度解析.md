# Proxy 与 Reflect 深度解析

> 为什么 Vue3 选择 Proxy？Reflect 解决了什么问题？

## Reflect 是什么？

Reflect 是 ES6 新增的**静态对象**，提供了一套**统一的操作对象的方法**。

### 为什么要用 Reflect？

```javascript
const obj = { name: '张三' }

// ❌ 传统方式：直接操作
obj.name = '李四'
console.log('name' in obj)
delete obj.name

// ✅ Reflect 方式：函数化操作
Reflect.set(obj, 'name', '李四')
console.log(Reflect.has(obj, 'name'))
Reflect.deleteProperty(obj, 'name')
```

**好处**：所有操作都是函数，可以作为参数传递，可以自定义行为。

## Reflect 的 13 种方法

```javascript
// 对应 Proxy 的 13 个拦截器
Reflect.apply(target, thisArg, args)          // 函数调用
Reflect.construct(target, args, newTarget)   // new 操作符
Reflect.get(target, key, receiver)           // 读取属性
Reflect.set(target, key, value, receiver)    // 写入属性
Reflect.has(target, key)                      // in 操作符
Reflect.deleteProperty(target, key)           // delete 操作符
Reflect.ownKeys(target)                       // Object.keys()
Reflect.getOwnPropertyDescriptor(target,key) // Object.getOwnPropertyDescriptor()
Reflect.defineProperty(target,key,desc)      // Object.defineProperty()
Reflect.getPrototypeOf(target)                // Object.getPrototypeOf()
Reflect.setPrototypeOf(target, prototype)    // Object.setPrototypeOf()
Reflect.isExtensible(target)                  // Object.isExtensible()
Reflect.preventExtensions(target)             // Object.preventExtensions()
```

## Proxy 的 13 种拦截器

### 1. get - 读取属性

```javascript
const proxy = new Proxy({}, {
  get(target, key, receiver) {
    console.log(`读取 ${key}`)
    // 必须返回属性值
    return Reflect.get(target, key, receiver)
  }
})

proxy.name  // "读取 name"
```

### 2. set - 写入属性

```javascript
const proxy = new Proxy({}, {
  set(target, key, value, receiver) {
    console.log(`设置 ${key} = ${value}`)
    // 必须返回 boolean（是否成功）
    return Reflect.set(target, key, value, receiver)
  }
})

proxy.name = '张三'  // "设置 name = 张三"
```

### 3. has - in 操作符

```javascript
const proxy = new Proxy({ name: '张三' }, {
  has(target, key) {
    console.log(`检查 ${key} 是否存在`)
    return Reflect.has(target, key)
  }
})

'name' in proxy  // "检查 name 是否存在" → true
```

### 4. deleteProperty - delete 操作符

```javascript
const proxy = new Proxy({ name: '张三' }, {
  deleteProperty(target, key) {
    console.log(`删除 ${key}`)
    return Reflect.deleteProperty(target, key)
  }
})

delete proxy.name  // "删除 name"
```

### 5. getPrototypeOf / setPrototypeOf

```javascript
const proto = { common: '共享属性' }
const proxy = new Proxy({}, {
  getPrototypeOf(target) {
    return Reflect.getPrototypeOf(target)
  },
  setPrototypeOf(target, prototype) {
    console.log('设置原型为', prototype)
    return Reflect.setPrototypeOf(target, prototype)
  }
})

Object.getPrototypeOf(proxy)         // 获取原型
Object.setPrototypeOf(proxy, proto) // 设置原型
```

## receiver 的作用

**这是理解 Vue 响应式的关键！**

```javascript
const parent = { name: '父级' }
const child = { age: 18 }

// 没有 receiver
const proxy1 = new Proxy(parent, {
  get(target, key) {
    console.log(`key: ${key}`)
    return target[key]  // ❌ 丢失 child 的上下文
  }
})

// 有 receiver
const proxy2 = new Proxy(parent, {
  get(target, key, receiver) {
    console.log(`key: ${key}`)
    return Reflect.get(target, key, receiver)  // ✅ 正确传递 this
  }
})

// 当访问 child.name 时，this 应该指向 child
console.log(proxy2.name)  // "父级"
```

### 经典场景：继承

```javascript
const proto = {
  get() {
    return this.value  // ⚠️ 这里的 this 指向谁？
  }
}

const handler = {
  get(target, key, receiver) {
    // 如果不用 Reflect.get，this 可能指向错误的对象
    return Reflect.get(target, key, receiver)
  }
}

const obj = Object.create(proto)
obj.value = 100

const proxy = new Proxy(obj, handler)
console.log(proxy.get())  // 100 ✅ 正确
```

## Vue 中的实际应用

### 完整的 reactive 实现

```javascript
/**
 * 响应式核心：完整的 Proxy 实现
 */
function reactive(obj) {
  // 如果已经是响应式代理，直接返回
  if (isReactive(obj)) {
    return obj
  }

  // 创建 Proxy 代理
  return new Proxy(obj, {
    // ============ 属性访问 ============
    get(target, key, receiver) {
      // 1. 收集依赖
      track(target, key)

      // 2. 获取值
      const value = Reflect.get(target, key, receiver)

      // 3. 如果是深层对象，递归代理（懒加载）
      if (isObject(value)) {
        return reactive(value)
      }

      return value
    },

    // ============ 属性设置 ============
    set(target, key, value, receiver) {
      // 1. 获取旧值
      const oldValue = Reflect.get(target, key, receiver)

      // 2. 设置新值
      const result = Reflect.set(target, key, value, receiver)

      // 3. 只有值真的变了才触发
      if (oldValue !== value) {
        trigger(target, key, oldValue, newValue)
      }

      return result
    },

    // ============ 删除属性 ============
    deleteProperty(target, key) {
      const hadKey = Reflect.has(target, key)
      const result = Reflect.deleteProperty(target, key)

      if (hadKey && result) {
        trigger(target, key)  // 删除也触发更新
      }

      return result
    },

    // ============ in 操作符 ============
    has(target, key) {
      track(target, key)
      return Reflect.has(target, key)
    },

    // ============ Object.keys() ============
    ownKeys(target) {
      // 不追踪（Object.keys 不需要追踪）
      return Reflect.ownKeys(target)
    },

    // ============ Object.defineProperty ============
    defineProperty(target, key, descriptor) {
      const result = Reflect.defineProperty(target, key, descriptor)
      if (result) {
        trigger(target, key)  // 定义新属性也触发更新
      }
      return result
    },

    // ============ 原型相关 ============
    getPrototypeOf(target) {
      return Reflect.getPrototypeOf(target)
    },
    setPrototypeOf(target, prototype) {
      return Reflect.setPrototypeOf(target, prototype)
    },

    // ============ 扩展性 ============
    isExtensible(target) {
      return Reflect.isExtensible(target)
    },
    preventExtensions(target) {
      return Reflect.preventExtensions(target)
    },

    // ============ 属性描述符 ============
    getOwnPropertyDescriptor(target, key) {
      return Reflect.getOwnPropertyDescriptor(target, key)
    }
  })
}
```

### 数组的特殊处理

```javascript
/**
 * 数组响应式的特殊处理
 */
function reactiveArray(arr) {
  return new Proxy(arr, {
    get(target, key, receiver) {
      // 数组方法的特殊处理
      if (key === 'push') {
        // arr.push(x) 应该触发依赖收集
        return function(...args) {
          track(target, 'length')  // push 会改变 length
          return Array.prototype.push.apply(target, args)
        }
      }

      if (key === 'pop' || key === 'shift' || key === 'unshift') {
        return function(...args) {
          // 这些操作也会改变 length
          const result = Array.prototype[key].apply(target, args)
          trigger(target, 'length')
          return result
        }
      }

      // 索引访问，正常追踪
      track(target, key)
      return Reflect.get(target, key, receiver)
    },

    set(target, key, value, receiver) {
      // 设置数组索引
      if (typeof key === 'string' && !isNaN(key)) {
        const length = target.length
        trigger(target, 'length')  // 可能影响 length

        // 如果设置的是超过当前长度的索引
        if (parseInt(key) >= length) {
          trigger(target, 'length')
        }
      }

      return Reflect.set(target, key, value, receiver)
    }
  })
}
```

## 性能优化：懒代理

Vue3 的响应式是**惰性的** — 只有访问到的深层对象才会被代理。

```javascript
/**
 * 懒代理实现
 * 只有真正访问到深层对象时，才创建代理
 */
function lazyReactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key)

      const value = Reflect.get(target, key, receiver)

      // 只有在访问时才递归代理
      // 而不是一开始就递归代理所有深层对象
      if (typeof value === 'object' && value !== null) {
        // 代理后缓存起来，避免重复创建代理
        if (!value[ReactiveFlags.LAZY]) {
          Object.defineProperty(value, ReactiveFlags.LAZY, {
            value: reactive(value)
          })
        }
        return value[ReactiveFlags.LAZY]
      }

      return value
    }
  })
}

// 标记符号
const ReactiveFlags = {
  SKIP: Symbol('skip'),
  LAZY: Symbol('lazy'),
  IS_REACTIVE: Symbol('isReactive')
}
```

## 常见问题

### Q: 为什么 Vue3 的 reactive 可以检测新增属性？

```javascript
// Vue2：defineProperty 无法检测新增属性
const obj = { name: '张三' }
Object.defineProperty(obj, 'age', {
  get() { return this._age || 0 },
  set(v) { this._age = v }
})
obj.age = 18  // ✅ 可以检测
obj.height = 180  // ❌ 无法检测！

// Vue3：Proxy 可以检测新增属性
const proxy = new Proxy(obj, {
  get(target, key) {
    track(target, key)
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    // 新增的 key 也会触发 set
    Reflect.set(target, key, value)
    return true
  }
})
proxy.height = 180  // ✅ 完全可以检测
```

### Q: 为什么 Vue3 的 reactive 可以检测删除？

```javascript
// Vue2 无法检测 delete
delete obj.name  // ❌ 不会触发响应

// Vue3 可以检测 delete
const proxy = reactive({ name: '张三' })
delete proxy.name  // ✅ 会触发更新
```

### Q: 为什么 Vue3 的 reactive 比 Vue2 的 defineProperty 更好？

| 特性 | defineProperty | Proxy |
|------|----------------|-------|
| 新增属性 | ❌ 需要 Vue.set | ✅ 自动检测 |
| 删除属性 | ❌ 需要 Vue.delete | ✅ 自动检测 |
| 数组索引 | ❌ 需要hack | ✅ 原生支持 |
| 性能 | ❌ 需要遍历 | ✅ 按需代理 |

## 总结

| 概念 | 说明 |
|------|------|
| Reflect | 统一的对象操作 API，与 Proxy 配套使用 |
| receiver | 确保 this 绑定正确的对象 |
| 13 种拦截器 | Proxy 可以拦截的所有操作 |
| 惰性代理 | 按需创建深层代理，优化性能 |
| 数组特殊处理 | push/pop 等方法需要额外处理 |

---

## 下节预告

下一节我们将学习 **effect 与 watch 原理**，理解 Vue 如何追踪依赖、如何调度更新。

[← 返回模块概览](../index) | [→ 下一节：effect 与 watch](./effect与watch)
