# defineProperty vs Proxy

## 📖 本节总结

`Object.defineProperty` 是 Vue2 的选择，`Proxy` 是 Vue3 的选择。两者的 API 能力和设计哲学有本质区别。

## Object.defineProperty
### 基本语法
```javascript
const obj = {}
Object.defineProperty(obj, 'name', {
  value: '张三',           // 属性值
  enumerable: true,       // 是否可枚举
  configurable: true,      // 是否可配置（删除/修改属性描述符）
  writable: true,          // 是否可写
  // 以下是访问器描述符（与 value/writable 互斥）
  get() {
    console.log('读取 name')
    return this._name
  },
  set(newVal) {
    console.log('设置 name 为', newVal)
    this._name = newVal
  }
})
```
### defineProperty 的局限
```javascript
// 局限1：无法监听新增属性
const obj = { name: '张三' }
Object.defineProperty(obj, 'age', {
  get() { return this._age },
  set(val) { this._age = val }
})
obj.name = '李四'    // ✅ 可监听
obj.age = 25         // ✅ 可监听
obj.gender = '男'   // ❌ 无法监听！gender 没有被 defineProperty
// 局限2：无法监听删除属性
delete obj.name      // ❌ 无法监听删除操作
// 局限3：数组索引变化需要特殊处理
const arr = reactive([1, 2, 3])
arr[0] = 100         // ❌ Vue2 需要 Vue.set(arr, 0, 100)
// 局限4：需要预先知道属性名，无法批量
// 如果对象有 100 个属性，需要调用 100 次
for (const key in obj) {
  Object.defineProperty(obj, key, { /* ... */ })
}
```
## Proxy
### 基本语法
```javascript
const obj = { name: '张三' }
const proxy = new Proxy(obj, {
  // 拦截属性读取
  get(target, key, receiver) {
    console.log(`读取 ${key}`)
    return Reflect.get(target, key, receiver)
  },
  // 拦截属性设置
  set(target, key, value, receiver) {
    console.log(`设置 ${key} = ${value}`)
    return Reflect.set(target, key, value, receiver)
  },
  // 拦截属性删除
  deleteProperty(target, key) {
    console.log(`删除 ${key}`)
    return Reflect.deleteProperty(target, key)
  },
  // 拦截 in 操作符
  has(target, key) {
    console.log(`检查 ${key}`)
    return Reflect.has(target, key)
  },
  // 拦截 Object.keys / for...in
  ownKeys(target) {
    console.log('获取所有键')
    return Reflect.ownKeys(target)
  },
  // 拦截 Object.getOwnPropertyDescriptor
  getOwnPropertyDescriptor(target, key) {
    return Reflect.getOwnPropertyDescriptor(target, key)
  }
})
```
### Proxy 的优势
```javascript
// 优势1：自动监听所有操作
const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    track(target, key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const old = target[key]
    Reflect.set(target, key, value, receiver)
    if (old !== value) trigger(target, key)
    return true
  }
})
proxy.newProp = '新增属性'   // ✅ 自动触发 set
delete proxy.name           // ✅ 自动触发 deleteProperty
'name' in proxy             // ✅ 自动触发 has
Object.keys(proxy)          // ✅ 自动触发 ownKeys
```
## 核心对比
### 1. 拦截范围对比
```javascript
// defineProperty 只能拦截一个属性
Object.defineProperty(obj, 'name', {
  get() { /* 拦截读取 */ },
  set() { /* 拦截写入 */ }
})
// 如果对象有 100 个属性，需要循环 100 次
// Proxy 拦截整个对象的所有操作
new Proxy(obj, {
  get() { /* 拦截所有读取 */ },
  set() { /* 拦截所有写入 */ }
})
// 一次代理，拦截所有操作
```
### 2. 原型链处理对比
```javascript
const parent = { common: 'parent' }
const child = Object.create(parent)
child.name = 'child'
// defineProperty 无法正确处理原型链
let nameValue
Object.defineProperty(child, 'name', {
  get() {
    // 这里的 this 指向 child
    return nameValue
  },
  set(val) {
    nameValue = val
  }
})
// Proxy 的 receiver 正确处理 this 绑定
const proxy = new Proxy(child, {
  get(target, key, receiver) {
    // receiver 就是 proxy 本身，this 绑定正确
    return Reflect.get(target, key, receiver)
  }
})
```
### 3. 嵌套对象处理
```javascript
const obj = { user: { profile: { name: '张三' } } }
// defineProperty：需要递归处理
function defineReactive(obj) {
  if (typeof obj !== 'object' || obj === null) return
  for (const key in obj) {
    defineReactive(obj[key])  // 递归
    Object.defineProperty(obj, key, {
      get() { return obj[key] },
      set(val) { obj[key] = val }
    })
  }
}
// Proxy：自动深层代理
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      // 只有在访问时才会递归代理（惰性）
      return typeof res === 'object' ? reactive(res) : res
    }
  })
}
```
## 性能对比
### 初始化性能
```javascript
// defineProperty：需要遍历所有属性
// 时间复杂度 O(n)，n = 属性数量
for (const key in obj) {
  Object.defineProperty(obj, key, {})
}
// Proxy：只需要一次代理
// 时间复杂度 O(1)
new Proxy(obj, {})
```
### 访问性能
```javascript
// 两者访问性能相近
// defineProperty：直接返回属性值
// Proxy：多一层 handler 调用
// 但 Proxy 有 JIT 优化空间，现代引擎对 Proxy 的优化很好
```
## 实际应用对比
### Vue2 中的实现
```javascript
// vue/src/core/observer/index.js
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: Function,
  shallow?: boolean
) {
  // 每个属性创建一个 Dep 实例
  const dep = new Dep()
  // 获取属性描述符
  const property = Object.getOwnPropertyDescriptor(obj, key)
  // 如果属性不可配置，跳过
  if (property && property.configurable === false) {
    return
  }
  // 获取 getter/setter
  const getter = property && property.get
  const setter = property && property.set
  // 如果没有 getter/setter，使用默认值
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  // 递归处理深层对象
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      // 依赖收集
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value) return
      // 触发更新
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow ? observe(newVal) : newVal
      dep.notify()
    }
  })
}
```
### Vue3 中的实现
```javascript
// packages/reactivity/src/baseHandler.ts
export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    // IS_REACTIVE 标记
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    // 依赖收集
    track(target, key)
    // 获取值
    const res = Reflect.get(target, key, receiver)
    // 深层响应式：递归代理
    if (isObject(res)) {
      return reactive(res)
    }
    return res
  },
  set(target, key, value, receiver) {
    // 获取旧值
    const oldValue = target[key]
    // 设置新值
    const result = Reflect.set(target, key, value, receiver)
    // 值变化时触发更新
    if (oldValue !== value) {
      trigger(target, key, value, oldValue)
    }
    return result
  },
  deleteProperty(target, key) {
    const hadKey = Object.prototype.hasOwnProperty(target, key)
    const result = Reflect.deleteProperty(target, key)
    if (hadKey && result) {
      trigger(target, key)
    }
    return result
  },
  has(target, key) {
    track(target, key)
    return Reflect.has(target, key)
  },
  ownKeys(target) {
    track(target, ITERATE_KEY)
    return Reflect.ownKeys(target)
  }
}
```
## 总结
| 特性 | Object.defineProperty | Proxy |
|------|----------------------|-------|
| 拦截操作 | 仅 get/set | 13 种操作 |
| 新增属性 | ❌ 不支持 | ✅ 支持 |
| 删除属性 | ❌ 不支持 | ✅ 支持 |
| 数组索引 | ⚠️ 需 hack | ✅ 支持 |
| 原型链 | ⚠️ 需处理 | ✅ 正确处理 |
| 深层对象 | 需递归 | 惰性递归 |
| 初始化 | O(n) 遍历 | O(1) 一次 |
| 浏览器支持 | 全部 | 现代浏览器 |
