# 练习 07：实现虚拟 DOM 与 Diff

> 难度：⭐⭐⭐⭐ | 配套源码：`packages/runtime-core/src/renderer.ts`

## 📖 原理回顾

### 虚拟 DOM 的结构

```typescript
// 简化版 VNode 结构
const vnode = {
  type: 'div',           // 标签名或组件
  props: { id: 'app' },  // 属性
  children: [],          // 子节点
  key: '唯一标识',       // 用于 Diff
  el: null               // 关联的真实 DOM
}
```

### Diff 算法的核心流程

```
1. 创建阶段：createElement → 创建真实 DOM
2. 更新阶段：patchElement → 比较新旧 VNode
3. 卸载阶段：unmount → 移除真实 DOM
```

## 📂 源码位置

```typescript
// packages/runtime-core/src/renderer.ts (核心流程)
const mountElement = (vnode, container, anchor, parentComponent) => {
  let el = (vnode.el = hostCreateElement(vnode.type))

  // 设置属性
  if (vnode.props) {
    for (let key in vnode.props) {
      hostPatchProp(el, key, null, vnode.props[key])
    }
  }

  // 处理子节点
  if (vnode.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    hostSetElementText(el, vnode.children)
  } else if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode.children, el, anchor, parentComponent)
  }

  hostInsert(el, container, anchor)
}

const patchElement = (n1, n2, container, anchor, parentComponent) => {
  // 1. 比较属性
  patchProps(n1.props, n2.props, el)

  // 2. 比较子节点
  patchChildren(n1, n2, el, anchor, parentComponent)
}
```

## 🎯 练习要求

### 题目 1：实现 h 函数（创建 VNode）

```javascript
/**
 * 要求：
 * 1. 支持多种调用方式：h('div')、h('div', props)、h('div', children)
 * 2. 添加 shapeFlag 标记（TEXT_CHILDREN、ARRAY_CHILDREN）
 */

const ShapeFlags = {
  ELEMENT: 1,
  TEXT_CHILDREN: 2,
  ARRAY_CHILDREN: 4,
  TEXT: 8
}

function h(type, propsOrChildren, children) {
  // TODO: 实现
}

// 测试
const vnode1 = h('div', { id: 'app' }, [
  h('span', null, 'hello'),
  h('span', null, 'world')
])

console.log(vnode1.type)   // 'div'
console.log(vnode1.props)  // { id: 'app' }
console.log(vnode1.children)  // [VNode, VNode]
```

### 题目 2：实现 createElement

```javascript
/**
 * 要求：
 * 1. 根据 vnode.type 创建真实 DOM
 * 2. 设置属性
 * 3. 处理子节点
 * 4. 建立 vnode.el 和真实 DOM 的关联
 */

function createElement(vnode) {
  // TODO: 实现
}

// 测试
const vnode = h('div', { class: 'container' }, 'Hello')
const el = createElement(vnode)
console.log(el.tagName)      // 'DIV'
console.log(el.className)    // 'container'
console.log(el.textContent)  // 'Hello'
console.log(vnode.el === el) // true
```

### 题目 3：实现 patch（核心 Diff）

```javascript
/**
 * 要求：
 * 1. 类型不同 → 替换
 * 2. 类型相同 → 比较属性 + 比较子节点
 */

function patch(oldVnode, newVnode, container) {
  // TODO: 实现
}

// 测试场景
// 1. 类型变化
patch(h('div'), h('span'), container)  // div 被替换为 span

// 2. 类型相同
patch(h('div', { id: 'old' }), h('div', { id: 'new' }), container)  // 更新属性
```

## 💡 关键理解

1. **VNode 是描述 DOM 的 JS 对象** — 轻量、可比较
2. **shapeFlag** — 用位运算标记类型，优化判断
3. **同层比较** — 只比较同层节点，复杂度 O(n)

## ✅ 答案参考

<details>

```javascript
function h(type, props, children) {
  let shapeFlag = ShapeFlags.ELEMENT

  if (typeof children === 'string' || typeof children === 'number') {
    shapeFlag |= ShapeFlags.TEXT_CHILDREN
    children = String(children)
  } else if (Array.isArray(children)) {
    shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  return { type, props, children, shapeFlag, el: null }
}

function createElement(vnode) {
  const el = document.createElement(vnode.type)

  // 设置属性
  if (vnode.props) {
    for (const key in vnode.props) {
      el.setAttribute(key, vnode.props[key])
    }
  }

  // 处理子节点
  if (vnode.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = vnode.children
  } else if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    vnode.children.forEach(child => {
      el.appendChild(createElement(child))
    })
  }

  vnode.el = el
  return el
}

function patch(oldVnode, newVnode, container) {
  // 类型不同，直接替换
  if (oldVnode.type !== newVnode.type) {
    container.replaceChild(createElement(newVnode), oldVnode.el)
    return
  }

  // 类型相同，比较属性
  const el = (newVnode.el = oldVnode.el)
  patchProps(oldVnode.props, newVnode.props, el)

  // 比较子节点
  patchChildren(oldVnode, newVnode, el)
}
```

</details>

## 📚 相关源码
- `packages/runtime-core/src/renderer.ts` — 完整渲染器
- `packages/runtime-core/src/createVnode.ts` — VNode 创建
- `packages/shared/src/shapeFlags.ts` — shapeFlag 定义
[← 返回练习列表](../index)
