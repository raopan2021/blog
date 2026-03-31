# Virtual DOM 结构

## 📖 本节总结

Virtual DOM 是 React 的核心概念，用 JavaScript 对象描述真实的 DOM 结构。

---

## React Element

### 基本结构

```javascript
const element = {
  type: 'div',
  props: {
    className: 'container',
    children: 'Hello World'
  },
  key: null,
  ref: null
}
```

### 嵌套结构

```javascript
const element = {
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: { children: 'Title' }
      },
      {
        type: 'p',
        props: { children: 'Content' }
      }
    ]
  }
}
```

---

## 组件的 Virtual DOM

### 函数组件

```javascript
function App() {
  return {
    type: 'div',
    props: {
      children: 'Hello'
    }
  }
}
```

### 类组件

```javascript
class App extends React.Component {
  render() {
    return {
      type: 'div',
      props: {
        children: 'Hello'
      }
    }
  }
}
```

---

## Fiber 节点

### Fiber 结构

```javascript
const fiber = {
  // 标识
  type: 'div',
  key: null,

  // 树结构
  return: parentFiber,    // 父节点
  child: childFiber,       // 第一个子节点
  sibling: nextSibling,    // 下一个兄弟节点

  // 工作单元
  pendingProps: {},
  memoizedProps: {},
  memoizedState: {},

  // 链表
  firstEffect: fiber,
  nextEffect: fiber,
  lastEffect: fiber,

  // 状态
  effectTag: 'UPDATE',
  alternate: workInProgress
}
```

---

## 总结

| 概念 | 说明 |
|------|------|
| React Element | 描述 UI 的 JS 对象 |
| Virtual DOM | React Element 的集合 |
| Fiber | 工作单元，用于增量渲染 |
