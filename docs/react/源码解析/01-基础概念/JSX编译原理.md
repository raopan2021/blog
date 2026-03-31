# JSX 编译原理

## 📖 本节总结

JSX 是 React 的语法糖，编译后变成 `React.createElement` 函数调用。

---

## JSX 的转换

### 转换前

```jsx
const element = <div className="greeting">Hello, world!</div>
```

### 转换后

```javascript
const element = React.createElement(
  'div',
  { className: 'greeting' },
  'Hello, world!'
)
```

### createElement 结构

```javascript
React.createElement(
  type,           // 标签名或组件
  props,          // 属性对象
  children        // 子节点
)
```

---

## createElement 的实现

```javascript
function createElement(type, config, children) {
  return {
    type,
    props: {
      ...config,
      children: children
    },
    key: config?.key || null,
    ref: config?.ref || null
  }
}
```

---

## Babel 转换配置

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-react', {
      runtime: 'automatic'  // 自动导入，不需要 React
    }]
  ]
}
```

### 自动导入

```jsx
// 不需要手动导入 React
// Babel 自动导入 jsx-runtime

// 转换前
<div>Hello</div>

// 转换后
import { jsx as _jsx } from 'react/jsx-runtime'
_jsx('div', { children: 'Hello' })
```

---

## 嵌套元素的转换

```jsx
// 转换前
<div>
  <h1>Title</h1>
  <p>Content</p>
</div>

// 转换后
React.createElement(
  'div',
  null,
  React.createElement('h1', null, 'Title'),
  React.createElement('p', null, 'Content')
)
```

---

## 表达式插值

```jsx
// 转换前
<div>{name}</div>

// 转换后
React.createElement('div', null, name)
```

---

## 总结

| 概念 | 说明 |
|------|------|
| JSX | 语法糖 |
| createElement | 创建 React Element |
| Babel | JSX 编译器 |
| jsx-runtime | 自动导入方式 |
