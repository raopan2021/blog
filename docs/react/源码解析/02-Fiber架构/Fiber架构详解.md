# Fiber 架构详解

## 📖 本节总结

Fiber 是 React 16 引入的新架构，将渲染工作拆分成小单元，可中断、可恢复。

---

## 为什么需要 Fiber？

### 同步渲染的问题

```
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

问题：组件树很大时，可能需要几十毫秒
用户在此时的操作会被阻塞
```

### Fiber 的解决方案

```
┌─────────────────────────────┐
│  workLoop 开始               │
│  ↓                          │
│  处理第一个 Fiber            │
│  ↓ (可中断)                  │
│  处理第二个 Fiber            │
│  ↓ (可中断)                  │
│  ...                         │
│  如果有更高优先级任务         │
│  ↓                          │
│  让出主线程                  │
│  ↓                          │
│  处理高优先级任务             │
│  ↓                          │
│  恢复之前的 Fiber            │
└─────────────────────────────┘
```

---

## Fiber 节点结构

```javascript
const fiber = {
  // 标识
  type: 'div',           // 标签类型
  key: null,             // React Key

  // 树结构
  return: fiber,         // 父节点
  child: fiber,           // 第一个子节点
  sibling: fiber,         // 下一个兄弟节点

  // 工作单元
  pendingProps: {},       // 新的 props
  memoizedProps: {},     // 上一次的 props
  memoizedState: {},    // 上一次的状态

  // 副作用链表
  firstEffect: fiber,    // 第一个有副作用的子节点
  nextEffect: fiber,     // 下一个有副作用的节点
  lastEffect: fiber,     // 最后一个有副作用的节点

  // 状态
  effectTag: 'UPDATE',  // 副作用类型
  alternate: fiber,       // 双缓冲：另一个 fiber
}
```

---

## 副作用类型

```javascript
const EffectTags = {
  PLACEMENT: '插入',      // 新增节点
  DELETION: '删除',      // 删除节点
  UPDATE: '更新',         // 更新节点
  REF: 'ref',            // ref 操作
}
```

---

## 总结

| 概念 | 说明 |
|------|------|
| Fiber | 新的工作单元 |
| 可中断 | 让出主线程处理高优先级 |
| 增量渲染 | 分多次完成渲染 |
| 副作用链表 | 高效管理生命周期 |
