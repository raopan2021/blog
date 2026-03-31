# useState 实现原理

## 📖 本节总结

`useState` 通过**链表**存储状态，每次渲染根据**渲染次数**获取对应的状态。

---

## 数据结构

### Hooks 链表

```javascript
// 每个 useState 创建一个 Hook 节点
const hook = {
  memoizedState: null,  // 保存的状态
  baseQueue: null,      // 基础队列
  queue: null,           // 更新队列
  next: null             // 指向下一个 Hook
}

// fiber.memoizedState 指向第一个 Hook
fiber.memoizedState = firstHook
```

---

## useState 实现

```javascript
function useState(initialState) {
  // 获取当前的 Hook
  const hook = mountWorkInProgressHook()

  // 初始值
  if (typeof initialState === 'function') {
    hook.memoizedState = initialState()
  } else {
    hook.memoizedState = initialState
  }

  // dispatch 函数
  const queue = {
    pending: null,
    dispatch: dispatchAction.bind(null, hook)
  }
  hook.queue = queue

  // setState
  const dispatch = (action) => {
    const nextState = typeof action === 'function'
      ? action(hook.memoizedState)
      : action

    hook.memoizedState = nextState

    // 触发更新
    scheduleUpdate()
  }

  return [hook.memoizedState, dispatch]
}
```

---

## 更新流程

```javascript
// setState(1)
dispatch(1)
       ↓
放入 updateQueue
       ↓
触发 scheduleUpdate
       ↓
重新渲染组件
       ↓
获取到新的状态
```

---

## 批量更新

```javascript
// React 18 自动批量更新
setCount(1)
setName('a')
setAge(25)
// 只触发一次渲染！
```

---

## 总结

| 概念 | 说明 |
|------|------|
| Hooks 链表 | 每个 Hook 连接成链表 |
| memoizedState | 保存状态值 |
| queue | 更新队列 |
| 批量更新 | 合并多次 setState |
