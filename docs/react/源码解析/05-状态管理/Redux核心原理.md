# Redux 核心原理

## 📖 本节总结

Redux 是最流行的状态管理方案，核心是**单一数据源**和**不可变状态**。

---

## 核心概念

### 单一数据源

```
┌─────────────────────────────────────┐
│              Store                      │
│  ┌─────────────────────────────────┐ │
│  │        { count: 0 }              │ │
│  │        { user: {} }              │ │
│  │        { posts: [] }             │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
         ↓ dispatch
         ↓ subscribe
    ┌─────────┐
    │  UI 组件  │
    └─────────┘
```

### 不可变状态

```javascript
// ❌ 不要这样修改状态
state.count++

// ✅ 返回新状态
state = { ...state, count: state.count + 1 }
```

---

## Redux 三原则

| 原则 | 说明 |
|------|------|
| 单一数据源 | 整个应用的 state 存在一个 store 中 |
| 状态只读 | 不能直接修改 state，只能通过 action |
| 纯函数修改 | reducer 必须是纯函数 |

---

## 核心 API

### createStore

```javascript
import { createStore } from 'redux'

const store = createStore(reducer, initialState)

store.getState()     // 获取状态
store.dispatch({})   // 分发 action
store.subscribe(() => {})  // 订阅
```

### reducer

```javascript
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 }
    case 'DECREMENT':
      return { ...state, count: state.count - 1 }
    default:
      return state
  }
}
```

### action

```javascript
// Action: 描述要做什么
const increment = { type: 'INCREMENT' }
const decrement = { type: 'DECREMENT' }
const setCount = { type: 'SET_COUNT', payload: 10 }

// Action Creator
const increment = () => ({ type: 'INCREMENT' })
```

---

## 中间件

### applyMiddleware

```javascript
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'

const store = createStore(
  reducer,
  applyMiddleware(logger)
)
```

### 自定义中间件

```javascript
const logger = store => next => action => {
  console.log('before', store.getState())
  next(action)
  console.log('after', store.getState())
}
```

---

## 总结

| 概念 | 说明 |
|------|------|
| Store | 存储状态的地方 |
| Action | 描述行为的对象 |
| Reducer | 根据 action 计算新状态 |
| Dispatch | 分发 action 触发 reducer |
| Subscribe | 订阅状态变化 |
