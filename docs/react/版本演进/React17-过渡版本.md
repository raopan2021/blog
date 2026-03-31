# React 17: 过渡版本

## 📖 本节总结

React 17 没有新特性，主要是**为 React 18 的并发模式做铺垫**，包括新的 JSX 转换和事件委托改进。

---

## 新的 JSX 转换

### 旧转换（需要引入 React）

```javascript
// 需要手动引入 React
import React from 'react'

function App() {
  return React.createElement('div', null, 'Hello')
}
```

### 新转换（自动引入）

```javascript
// 不需要手动引入 React
// 编译器自动转换
function App() {
  return <div>Hello</div>
}

// 编译后
import { jsx as _jsx } from 'react/jsx-runtime'

function App() {
  return _jsx('div', { children: 'Hello' })
}
```

### React 17 的新特性

```javascript
// jsx-runtime 自动导入，不需要 React
// Fragment 不再需要导入
function App() {
  return <>Hello World</>
}
```

---

## 事件委托改进

### 旧行为

```javascript
// React 16: 事件绑定到 root 节点
const root = document.getElementById('root')
ReactDOM.render(<App />, root)

// 点击事件冒泡到 root，React 再派发
```

### 新行为

```javascript
// React 17: 事件绑定到挂载的容器
<div id="root"></div>
<div id="modal-root"></div>

// 每个 root 有自己的事件委托
// 减少跨 root 的事件干扰
```

---

## 移除 React 依赖

### 开始弃用

```javascript
// React 17 标记为 deprecated，但还能用
import React from 'react'

// 官方推荐使用新的导入方式
import { useState } from 'react'  // ✅ 推荐
import React, { useState } from 'react'  // ⚠️ 不推荐
```

---

## 副作用清理时机改进

```javascript
// React 17 改变了 useEffect 的清理时机
// 在组件卸载前同步清理，而不是异步

useEffect(() => {
  const subscription = subscribe()
  return () => subscription.unsubscribe()  // 卸载前清理
})
```

---

## 总结

| 特性 | 说明 |
|------|------|
| 新 JSX 转换 | 自动导入 jsx-runtime |
| 事件委托 | 绑定到挂载容器 |
| 移除 React 依赖 | 不需要手动导入 React |
| 副作用清理 | 同步清理改进 |
