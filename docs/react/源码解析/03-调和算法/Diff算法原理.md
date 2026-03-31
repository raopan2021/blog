# Diff 算法原理

## 📖 本节总结

React 的 Diff 算法通过**同层对比**和**类型判断**，实现高效的 DOM 更新。

---

## 同层对比

```
旧树                    新树
┌───────┐              ┌───────┐
│   A   │              │   A   │
└───┬───┘              └───┬───┘
    │                          │
┌───┴───┐              ┌───┴───┐
│   B   │              │   C   │
└───────┘              └───────┘

算法：A vs A（相同）→ 比较子节点
      B vs C（不同）→ 替换 B
```

---

## 类型判断

### 类型不同

```javascript
// 类型不同，直接替换
// 卸载旧节点，挂载新节点

if (oldElement.type !== newElement.type) {
  // 替换整个子树
  replaceChild(oldNode, newNode)
}
```

### 类型相同

```javascript
// 类型相同，只更新属性
// 比较子节点

if (oldElement.type === newElement.type) {
  // 更新属性
  updateProps(oldNode, newNode.props)

  // 比较子节点
  reconcileChildren(oldNode.children, newNode.children)
}
```

---

## 复杂度

```
Tree Diff: O(n³) → O(n)
Element Diff: O(n)
Component Diff: O(1)
```

### 优化

| 优化 | 说明 |
|------|------|
| 同层对比 | 只比较同层，不跨层 |
| 列表 Diff | 通过 key 匹配 |
| 组件对比 | 类型不同直接替换 |

---

## 总结

| 策略 | 说明 |
|------|------|
| 同层对比 | 只比较同层节点 |
| 类型不同 | 直接替换子树 |
| 类型相同 | 更新属性 + 递归子节点 |
