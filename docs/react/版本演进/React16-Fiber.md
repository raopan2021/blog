# React 16: Fiber 架构

## 📖 本节总结

React 16 是 React 历史上最重要的版本之一，引入了 **Fiber** 架构，使 React 可以实现**增量渲染**和**异步可中断**更新。

---

## 为什么需要 Fiber？

### 旧架构的问题

```
同步渲染的问题：
┌─────────────────────────────┐
│  render() 开始              │
│  ↓                          │
│  创建 Virtual DOM            │
│  ↓                          │
│  Diff 比较                   │
│  ↓                          │
│  渲染到屏幕                  │
│  ↓                          │
│  完成前无法中断              │
└─────────────────────────────┘

如果组件树很大，一次渲染可能需要几十毫秒
用户在此期间的操作会被阻塞
```

### Fiber 的解决方案

```
Fiber 的核心思想：将渲染工作拆分成小单元
每个小单元完成后可以中断，让出主线程

┌─────────────────────────────┐
│  workLoop 开始               │
│  ↓                          │
│  处理第一个 Fiber             │
│  ↓ (可以中断)                │
│  处理第二个 Fiber             │
│  ↓ (可以中断)                │
│  处理第三个 Fiber             │
│  ↓                          │
│  ...                         │
└─────────────────────────────┘
```

---

## Fiber 数据结构

```javascript
// Fiber 节点的结构
const fiber = {
  // 标识
  type: 'div',           // 组件类型
  key: null,             // React Key

  // 树结构
  return: fiber,        // 父节点
  child: fiber,          // 第一个子节点
  sibling: fiber,        // 下一个兄弟节点

  // 工作单元
  pendingProps: {},       // 新的 props
  memoizedProps: {},     // 上一次的 props
  memoizedState: {},    // 上一次的状态

  // 链表结构
  firstEffect: fiber,    // 第一个有副作用的子节点
  nextEffect: fiber,     // 下一个有副作用的节点
  lastEffect: fiber,     // 最后一个有副作用的节点

  // 状态
  effectTag: 'UPDATE',  // 副作用类型
  alternate: fiber,      // 双缓冲：另一个 fiber
}
```

---

## 双缓冲技术

```javascript
// React 使用双缓冲技术避免频繁创建/销毁 DOM

// current 是屏幕上显示的 fiber 树
// workInProgress 是正在构建的新 fiber 树

// 当 workInProgress 完成时
// 直接将 workInProgress 赋值给 current
// 替换整个树

fiber.alternate = workInProgress
current = workInProgress
```

---

## Fiber 的工作阶段

### 阶段一：Render / Reconciliation（可中断）

```javascript
// 这个阶段可以被打断
function workLoop() {
  while (nextUnitOfWork && !shouldYield()) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
}

// shouldYield() 检查是否需要让出主线程
function shouldYield() {
  return deadline !== null && getCurrentTime() >= deadline
}
```

### 阶段二：Commit（不可中断）

```javascript
// 这个阶段必须一次性完成
function commitRoot(root) {
  // 插入/删除/更新 DOM
  // 调用所有有副作用的 fiber 的 effect
}
```

---

## 副作用（Effect）

```javascript
// Fiber 中的副作用类型
const EffectTags = {
  PLACEMENT: '插入',      // 新增节点
  DELETION: '删除',      // 删除节点
  UPDATE: '更新',         // 更新节点
  REF: 'ref',            // ref 操作
}

// useEffect 对应的 effect
fiber.effectTag = 'UPDATE'
fiber.callback = effectFunction
```

---

## 错误边界

### 什么是错误边界？

React 16 引入了错误边界概念，用于捕获子组件树的 JavaScript 错误。

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染显示错误 UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误日志
    console.error('Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>出错了</h1>
    }
    return this.props.children
  }
}

// 使用
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

---

## Portal

### 将子组件渲染到其他 DOM 节点

```javascript
// React 16 引入 Portal
const Modal = ({ children }) => {
  return ReactDOM.createPortal(
    children,
    document.getElementById('modal-root')
  )
}

// 使用
<Modal>
  <div>模态框内容</div>
</Modal>
```

---

## 总结

| 特性 | 说明 |
|------|------|
| Fiber 架构 | 将渲染工作拆分成小单元，可中断 |
| 双缓冲 | 避免频繁创建/销毁 DOM |
| 副作用链表 | 高效管理生命周期副作用 |
| 错误边界 | 捕获子组件树的错误 |
| Portal | 渲染到其他 DOM 节点 |
