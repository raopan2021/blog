# 虚拟 DOM 与 Diff 算法

> 为什么虚拟 DOM 比直接操作真实 DOM 快？Diff 算法如何找出最小更新量？

## 为什么需要虚拟 DOM？

### 直接操作真实 DOM 的问题

```javascript
// ❌ 每次修改都直接操作 DOM，非常慢
function update() {
  document.getElementById('title').innerText = state.title
  document.getElementById('content').innerHTML = state.content
  document.getElementById('footer').style.color = state.color
}

// 问题：
// 1. 每次修改都触发浏览器的重排(Reflow)和重绘(Repaint)
// 2. 无法批量更新
// 3. 无法跨平台（浏览器之外的 DOM）
```

### 虚拟 DOM 的解决思路

```javascript
// ✅ 用 JS 对象描述 DOM 结构
const vnode = {
  type: 'div',
  props: { id: 'app' },
  children: [
    { type: 'h1', children: '标题' },
    { type: 'p', children: '内容' }
  ]
}

// 虚拟 DOM 树：
// div#app
//   ├── h1: "标题"
//   └── p: "内容"

// 修改数据时，先生成新的虚拟 DOM
const newVnode = {
  type: 'div',
  props: { id: 'app' },
  children: [
    { type: 'h1', children: '新标题' },  // 只有这里变了
    { type: 'p', children: '内容' }
  ]
}

// 然后 Diff 算法找出差异，只更新变化的部分
// patch(oldVnode, newVnode) → 只更新 h1 的内容
```

## 虚拟 DOM 的结构

```javascript
/**
 * 虚拟节点（VNode）
 * 用 JS 对象描述一个 DOM 节点
 */

/**
 * 创建文本节点
 */
function createTextVnode(text) {
  return {
    type: 'text',
    content: text
  }
}

/**
 * 创建元素节点
 * @param {string} type - 标签名
 * @param {Object} props - 属性
 * @param {Array} children - 子节点
 * @returns {Object} 虚拟节点
 */
function h(type, props, children = []) {
  return {
    // 节点类型：'div', 'span', 'text', 组件对象
    type: type,

    // 标签特有属性：id, class, style, onClick 等
    props: props || {},

    // 子节点数组
    children: children,

    // 唯一标识，用于 Diff
    key: props?.key,

    // DOM 元素引用（创建后才会有）
    el: null,

    // 组件实例（如果是组件节点）
    component: null
  }
}

// 使用示例
const vnode = h('div', { id: 'app', class: 'container' }, [
  h('h1', { class: 'title' }, 'Hello Vue'),
  h('p', { style: 'color: red' }, '这是一段文字'),
  h('ul', {}, [
    h('li', { key: '1' }, '第一项'),
    h('li', { key: '2' }, '第二项'),
    h('li', { key: '3' }, '第三项')
  ])
])
```

## 创建真实 DOM

```javascript
/**
 * 根据 vnode 创建真实的 DOM 元素
 * @param {Object} vnode - 虚拟节点
 * @returns {Element} 真实 DOM 元素
 */
function createElement(vnode) {
  // 创建真实 DOM 元素
  const el = document.createElement(vnode.type)

  // 设置属性
  if (vnode.props) {
    for (const [key, value] of Object.entries(vnode.props)) {
      // 事件处理
      if (key.startsWith('on')) {
        const eventName = key.slice(2).toLowerCase()
        el.addEventListener(eventName, value)
      }
      // 普通属性
      else {
        el.setAttribute(key, value)
      }
    }
  }

  // 处理子节点
  if (vnode.children) {
    vnode.children.forEach(child => {
      // 如果是字符串，创建文本节点
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child))
      }
      // 如果是 vnode，递归创建
      else {
        el.appendChild(createElement(child))
      }
    })
  }

  // 保存 vnode 和 el 的对应关系
  vnode.el = el

  return el
}

/**
 * 更新属性
 * @param {Element} el - 真实 DOM 元素
 * @param {Object} oldProps - 旧的属性
 * @param {Object} newProps - 新的属性
 */
function updateProps(el, oldProps, newProps) {
  // 新增或修改属性
  for (const [key, value] of Object.entries(newProps || {})) {
    if (oldProps[key] !== value) {
      if (key.startsWith('on')) {
        // 事件
        const eventName = key.slice(2).toLowerCase()
        el.removeEventListener(eventName, oldProps[key])
        el.addEventListener(eventName, value)
      } else {
        // 普通属性
        el.setAttribute(key, value)
      }
    }
  }

  // 删除不再存在的属性
  for (const key of Object.keys(oldProps || {})) {
    if (!(key in newProps)) {
      if (key.startsWith('on')) {
        el.removeEventListener(key.slice(2).toLowerCase(), oldProps[key])
      } else {
        el.removeAttribute(key)
      }
    }
  }
}
```

## Diff 算法核心

**核心思想**：同层比较，只比较有变化的层级。

```
旧的 DOM 树                    新的 DOM 树
    div                          div
   /  \                        /  \
  h1   p          →           h1   p
       |                      /   |
      ul                     ul   span
     / | \
    li li li                / | \
                          li li li li

算法只会比较：
1. div vs div（同层）
2. h1 vs h1（同层）
3. p vs ul（类型变了，整棵子树替换）
4. ul vs ul（同层）
5. li vs li, li vs li, li vs li, (新增一个)
```

### 完整 Diff 实现

```javascript
/**
 * 比较两个 vnode，找出差异并更新
 * @param {Object} oldVnode - 旧的虚拟节点
 * @param {Object} newVnode - 新的虚拟节点
 */
function patch(oldVnode, newVnode) {
  // 1. 类型不同，直接替换整个子树
  if (oldVnode.type !== newVnode.type) {
    const newEl = createElement(newVnode)
    oldVnode.el.parentNode.replaceChild(newEl, oldVnode.el)
    return newEl
  }

  // 2. 类型相同，比较属性
  updateProps(oldVnode.el, oldVnode.props, newVnode.props)

  // 3. 比较子节点
  patchChildren(
    oldVnode.el,
    oldVnode.children,
    newVnode.children
  )

  // 4. 保存 el 引用
  newVnode.el = oldVnode.el

  return newVnode.el
}

/**
 * 比较子节点数组
 */
function patchChildren(el, oldChildren, newChildren) {
  // 情况1：新 children 为空，直接清空
  if (!newChildren || newChildren.length === 0) {
    el.innerHTML = ''
    return
  }

  // 情况2：老 children 为空，直接添加所有新 children
  if (!oldChildren || oldChildren.length === 0) {
    newChildren.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child))
      } else {
        el.appendChild(createElement(child))
      }
    })
    return
  }

  // 情况3：都有 children，执行 Diff
  // 为了简化，这里用简单的方式：key 匹配
  diffChildren(el, oldChildren, newChildren)
}

/**
 * 完整的 Diff 算法（简化版）
 */
function diffChildren(el, oldChildren, newChildren) {
  let oldStartIndex = 0
  let oldEndIndex = oldChildren.length - 1
  let newStartIndex = 0
  let newEndIndex = newChildren.length - 1

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    const oldStart = oldChildren[oldStartIndex]
    const newStart = newChildren[newStartIndex]

    // 使用 key 优化：先尝试 key 匹配
    if (sameKey(oldStart, newStart)) {
      // key 相同，递归比较
      patch(oldStart, newStart)
      oldStartIndex++
      newStartIndex++
    } else {
      // key 不同，尝试头尾匹配
      const oldEnd = oldChildren[oldEndIndex]
      const newEnd = newChildren[newEndIndex]

      if (sameKey(oldEnd, newEnd)) {
        // 尾部匹配
        patch(oldEnd, newEnd)
        oldEndIndex--
        newEndIndex--
      } else if (sameKey(oldStart, newEnd)) {
        // 头尾匹配（移动）
        patch(oldStart, newEnd)
        el.appendChild(oldStart.el)  // 移动到末尾
        oldStartIndex++
        newEndIndex--
      } else {
        // 无法匹配，新增
        const newEl = createElement(newStart)
        el.appendChild(newEl)
        newStartIndex++
      }
    }
  }

  // 处理新增的节点
  while (newStartIndex <= newEndIndex) {
    const newChild = newChildren[newStartIndex]
    el.appendChild(createElement(newChild))
    newStartIndex++
  }

  // 处理删除的节点
  while (oldStartIndex <= oldEndIndex) {
    const oldChild = oldChildren[oldStartIndex]
    oldChild.el.parentNode.removeChild(oldChild.el)
    oldStartIndex++
  }
}

/**
 * 判断两个 vnode 是否有相同的 key
 */
function sameKey(a, b) {
  return a.key === b.key && a.type === b.type
}
```

## 完整的 patch 示例

```javascript
// 初始渲染
const oldVnode = h('div', {}, [
  h('h1', { key: 'title' }, '旧标题'),
  h('p', {}, '旧内容')
])

const container = document.getElementById('app')
container.appendChild(createElement(oldVnode))

// 更新时
const newVnode = h('div', {}, [
  h('h1', { key: 'title' }, '新标题'),  // 复用，只更新内容
  h('span', {}, '新内容'),              // 类型变了，替换节点
])

patch(oldVnode, newVnode)  // 增量更新
```

## key 的作用

**key 是 Diff 算法的优化关键！**

```javascript
// ❌ 没有 key，可能导致性能问题或 bug
// 当列表中间插入新元素时，可能错误复用节点
const vnode1 = h('ul', {}, [
  h('li', {}, 'A'),
  h('li', {}, 'B'),
  h('li', {}, 'C')
])

const vnode2 = h('ul', {}, [
  h('li', {}, 'X'),  // 插入新元素
  h('li', {}, 'A'),
  h('li', {}, 'B'),
  h('li', {}, 'C')
])

// 没有 key：可能把 A 的内容改成 X，然后新建 B、C
// 有 key：通过 key 正确识别 A、B、C 是复用还是新建

// ✅ 有 key，正确复用
const vnode1 = h('ul', {}, [
  h('li', { key: 'a' }, 'A'),
  h('li', { key: 'b' }, 'B'),
  h('li', { key: 'c' }, 'C')
])

const vnode2 = h('ul', {}, [
  h('li', { key: 'x' }, 'X'),  // 新建
  h('li', { key: 'a' }, 'A'),  // 复用
  h('li', { key: 'b' }, 'B'),  // 复用
  h('li', { key: 'c' }, 'C')   // 复用
])
```

## Vue 的编译时优化

### 1. Static Props Hoisting

编译时识别静态属性，不需要每次渲染都重新创建。

```vue
<!-- 模板 -->
<div class="container" data-static="yes">
  <span>{{ dynamic }}</span>
</div>

<!-- 编译后（伪代码） -->
const staticProps = {
  class: 'container',
  'data-static': 'yes'
}

function render() {
  return h('div', staticProps, [  // 复用静态 props
    h('span', null, dynamic.value)
  ])
}
```

### 2. Patch Flags

标记需要动态处理的节点，只做精确更新。

```vue
<!-- 模板 -->
<div>
  <span>{{ name }}</span>           <!-- 只需要更新文本 -->
  <span>{{ count + 1 }}</span>      <!-- 只需要更新文本 -->
  <div :class="cls"></div>          <!-- 只需要更新 class -->
</div>

<!-- 编译后（伪代码） -->
const vnode = {
  type: 'div',
  patchFlags: 1,  // 1 = 需要动态处理 children
  children: [
    { type: 'span', patchFlags: 1, children: name },  // 1 = TEXT
    { type: 'span', patchFlags: 1, children: count.value + 1 },
    { type: 'div', patchFlags: 2, class: cls }  // 2 = CLASS
  ]
}
```

### 3. hoistStatic

将静态节点提升到渲染函数外部，只创建一次。

```vue
<!-- 模板 -->
<div>
  <h1>静态标题</h1>
  <p>静态内容，不会变化</p>
  <span>{{ dynamic }}</span>
</div>

<!-- 编译后 -->
// 静态内容提升到函数外部
const staticVnode1 = h('h1', null, '静态标题')
const staticVnode2 = h('p', null, '静态内容，不会变化')

function render() {
  return h('div', null, [
    staticVnode1,  // 复用
    staticVnode2,  // 复用
    h('span', null, dynamic.value)  // 动态的每次创建
  ])
}
```

## 真实源码对照

以下代码来自 Vue3 源码（`packages/runtime-core/src/renderer.ts`）：

```typescript
// packages/runtime-core/src/renderer.ts
export function createRenderer(renderOptions) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp,
  } = renderOptions;

  const mountElement = (vnode, container, anchor, parentComponent) => {
    const { type, children, props, shapeFlag, transition } = vnode;

    let el = (vnode.el = hostCreateElement(type));

    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, anchor, parentComponent);
    }

    hostInsert(el, container, anchor);
  };

  const patchElement = (n1, n2, container, anchor, parentComponent) => {
    // 比较属性
    patchProps(n1.props, n2.props, el);

    // 比较子节点
    patchChildren(n1, n2, el, anchor, parentComponent);
  };

  // ...更多逻辑
}
```

## 常见问题

### Q: 虚拟 DOM 一定比直接操作 DOM 快吗？

**不一定！** 虚拟 DOM 有自己的开销：
1. 创建 JS 对象需要内存
2. Diff 比较需要计算
3. 首次渲染可能更慢

**虚拟 DOM 的优势**：
1. 批量更新，减少重排重绘
2. 跨平台能力（SSR、小程序）
3. 开发体验好（声明式 UI）

### Q: 为什么 list 渲染要用 key？

```vue
<!-- ❌ 不推荐：不用 key -->
<div v-for="item in items">
  <input />
  {{ item.name }}
</div>

<!-- ✅ 推荐：使用唯一的 key -->
<div v-for="item in items" :key="item.id">
  <input />
  {{ item.name }}
</div>
```

没有 key 时，Vue 会尽量复用节点，可能导致输入框内容错乱。

### Q: Diff 算法的复杂度是多少？

- **简单实现**：O(n³) — 遍历所有可能性
- **Vue3 优化后**：O(n) — 只做同层比较

## 总结

| 概念 | 说明 |
|------|------|
| 虚拟 DOM | 用 JS 对象描述 DOM，跨平台、可批量更新 |
| VNode | 虚拟节点的数据结构 |
| createElement | 根据 VNode 创建真实 DOM |
| patch | 比较新旧 VNode，找出差异 |
| Diff | 同层比较策略，O(n) 复杂度 |
| key | 优化复用，避免状态错乱 |
| Patch Flags | 编译时标记，运行时精确更新 |

---

## 教程总结

恭喜你完成了 Vue 源码解析系列教程！🎉

**我们学到了**：
1. Monorepo 架构与 pnpm workspace
2. 响应式系统：Proxy、track、trigger、computed、watch
3. 组件实例创建与生命周期管理
4. 深度响应式原理与 effect 调度
5. 虚拟 DOM 与 Diff 算法

**下一步建议**：
- 阅读 Vue3 官方源码（https://github.com/vuejs/core）
- 尝试手写一个简化版 Vue
- 深入理解编译器部分（template → render function）

[← 返回模块概览](../index) | [← 上一节：effect 与 watch](../04-响应式深入/effect与watch)
