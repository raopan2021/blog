# 练习 02：理解 Proxy 的 receiver

> 难度：⭐⭐⭐ | 配套源码：`packages/reactivity/src/baseHandler.ts`

## 📖 原理回顾

### 什么是 receiver？

`receiver` 是 Proxy 特有的参数，代表**谁在使用这个属性**。常见场景：

```javascript
const parent = { name: 'parent' }
const child = Object.create(parent)  // child 继承自 parent

child.name = 'child'  // 设置 child 的 name

console.log(child.name)  // 'child'
console.log(parent.name) // 'parent' - 不受影响
```

### 为什么 Proxy 需要 receiver？

```javascript
const obj = { name: '原始对象' }
const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    // 问题：这里返回什么？
    return target[key]  // ❌ 可能丢失原型链信息

    return Reflect.get(target, key, receiver)  // ✅ 正确处理 this 绑定
  }
})
```

## 📂 源码位置

```typescript
// packages/reactivity/src/baseHandler.ts
export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, recevier) {
    if (key === ReactiveFlags.IS_REACTIVE) return true;

    track(target, key);
    let res = Reflect.get(target, key, recevier);  // ⚠️ 使用 receiver
    if (isObject(res)) return reactive(res);

    return res;
  },

  set(target, key, value, recevier) {
    let oldValue = target[key];
    let result = Reflect.set(target, key, value, recevier);  // ⚠️ 使用 receiver
    if (oldValue !== value) {
      trigger(target, key, value, oldValue);
    }
    return result;
  },
};
```

## 🎯 练习要求

### 题目 1：理解 receiver 的作用

```javascript
const parent = {
  name: 'parent',
  getAlias() {
    return this.name + '_alias'
  }
}

const child = Object.create(parent)
child.name = 'child'

// 使用 Proxy 实现，使得：
// 1. child.getAlias() 返回 'child_alias'
// 2. 读取属性时能正确触发依赖收集
// 3. 设置属性时能正确触发更新

// TODO: 实现这个 Proxy handler
const proxy = new Proxy(child, {
  get(target, key, receiver) {
    // 请思考：这里应该返回什么？
    return ???;
  },
  set(target, key, value, receiver) {
    // 请思考：这里应该做什么？
    return ???;
  }
})

console.log(proxy.getAlias())  // 期望：'child_alias'
console.log(proxy.name)        // 期望：'child'
proxy.name = 'new_child'
console.log(proxy.name)        // 期望：'new_child'
```

### 题目 2：解决原型链问题

```javascript
// 场景：Vue3 中常见的问题
const obj = { name: 'obj' }
const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    // 如果不用 Reflect.get，可能导致：
    // const proto = Object.getPrototypeOf(target)
    // proto.name 访问时，this 指向 target 而不是 proxy

    // 请用 Reflect.get 修复这个问题
    return ???;
  }
})

// 验证
const proto = Object.getPrototypeOf(proxy)
console.log(proto.name)  // 应该触发 get，返回 undefined 或报错
```

## 💡 关键点

1. **Reflect.get** vs **target[key]**：
   - `target[key]` 不处理 receiver，this 可能指向错误的对象
   - `Reflect.get(target, key, receiver)` 正确传递 receiver

2. **set 中的 receiver**：
   - 设置属性时，receiver 确保 `this` 指向代理对象
   - `Reflect.set(target, key, value, receiver)` 确保正确触发 setter

## ✅ 答案参考

<details>

```javascript
const proxy = new Proxy(child, {
  get(target, key, receiver) {
    // 使用 Reflect.get 正确处理 this 绑定
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    // 获取旧值
    const oldValue = target[key]
    // 使用 Reflect.set 确保正确触发
    const result = Reflect.set(target, key, value, receiver)
    // 值变化时触发更新
    if (oldValue !== value) {
      console.log(`触发更新：${key}: ${oldValue} → ${value}`)
    }
    return result
  }
})
```

</details>

## 📚 相关讨论
这道题在 Vue3 源码中的实际应用：
```javascript
// 当 effect 中访问 proxy.name 时
effect(() => {
  console.log(state.name)
})
// 如果没有正确使用 receiver，
// 当 name 在原型链上时，可能无法正确收集依赖
```
[← 返回练习列表](../index)
