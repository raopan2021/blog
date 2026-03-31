# useEffect 实现原理

## 📖 本节总结

`useEffect` 通过**副作用链表**管理回调，在 commit 阶段执行。

---

## 数据结构

### Effect 节点

```javascript
const effect = {
  tag: 'UPDATE',           // 副作用类型
  create: () => {},         // 回调函数
  destroy: () => {},         // 清理函数
  deps: [],                 // 依赖数组
  next: null               // 指向下一个 Effect
}
```

### 副作用类型

```javascript
const Hooks = {
  'INSERTION': '插入',
  'UPDATE': '更新',
  'DELETION': '删除'
}
```

---

## useEffect 实现

```javascript
function useEffect(create, deps) {
  // 创建 Effect
  const effect = {
    tag: 'UPDATE',
    create: create,
    destroy: undefined,
    deps: deps,
    next: null
  }

  // 添加到链表
  if (!fiber.updateQueue) {
    fiber.updateQueue = effect
  } else {
    // 链接到现有队列
  }

  // 在 commit 阶段执行
  scheduleCallback(() => {
    // 执行 create
    effect.create()
  })
}
```

---

## 执行时机

### commit 阶段

```javascript
function commitRoot(root) {
  // 1. commitBeforeMutationEffects
  // 2. commitMutationEffects
  // 3. commitLayoutEffects

  // useEffect 在 commitLayoutEffects 中执行
  commitLayoutEffects(root)
}
```

### 清理函数

```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('effect')
  }, 1000)

  // 返回清理函数
  return () => {
    clearTimeout(timer)
  }
})
```

---

## 依赖检测

```javascript
// 依赖变化时，才执行 effect
if (oldDeps === newDeps) {
  // 依赖没变，跳过
  return
}

// 依赖变了，执行 cleanup + effect
effect.destroy?.()
effect.create()
```

---

## 总结

| 概念 | 说明 |
|------|------|
| Effect | 包含回调和清理函数的对象 |
| 链表 | 多个 Effect 链接在一起 |
| commit 阶段 | 在 DOM 渲染后执行 |
| 清理函数 | 下一个 effect 执行前调用 |
