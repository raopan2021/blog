# React 18: 并发渲染

## 📖 本节总结

React 18 引入了**并发渲染**（Concurrent Rendering），让 React 可以**同时准备多个版本的 UI**，大幅提升用户体验。

---

## 并发渲染的核心

### 旧渲染方式

```
渲染是同步的，一次完成

┌────────────────────────┐
│  开始渲染 App           │
│  ↓                     │
│  完成前不能中断          │
│  ↓                     │
│  渲染完成              │
└────────────────────────┘

问题：如果 App 很复杂，用户点击会卡顿
```

### 并发渲染

```
渲染可以中断，可以同时准备多个版本

┌────────────────────────┐
│  开始渲染 App (版本1)   │
│  ↓ 可中断               │
│  用户点击 → 优先级更高   │
│  ↓                     │
│  切换到渲染 (版本2)     │
│  ↓                     │
│  高优先级渲染完成       │
│  ↓                     │
│  切换回 (版本1)         │
│  ↓                     │
│  完成渲染               │
└────────────────────────┘
```

---

## 自动批处理（Automatic Batching）

### 旧行为

```javascript
// React 17: 需要在 setTimeout 或 Promise 中手动处理
setTimeout(() => {
  setCount(1)    // 触发一次渲染
  setName('a')   // 再触发一次渲染
  // 总共触发 2 次渲染！
}, 0)
```

### 新行为

```javascript
// React 18: 自动批处理所有更新
setTimeout(() => {
  setCount(1)    // 批量处理
  setName('a')   // 批量处理
  // 只触发 1 次渲染！
}, 0)
```

---

## 新增 API

### useTransition

```javascript
import { useTransition } from 'react'

function SearchResults() {
  const [isPending, startTransition] = useTransition()

  function handleSearch(query) {
    startTransition(() => {
      // 这个更新会被标记为非紧急
      setResults(search(query))
    })
  }

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending ? <Spinner /> : <Results />}
    </div>
  )
}
```

### useDeferredValue

```javascript
import { useDeferredValue } from 'react'

function SearchInput({ value }) {
  // deferredValue 会延迟更新
  const deferredValue = useDeferredValue(value)

  return (
    <div>
      <input value={value} />
      {/* 慢的搜索结果会延迟渲染 */}
      <SlowSearchResults query={deferredValue} />
    </div>
  )
}
```

### Suspense

```javascript
import { Suspense } from 'react'

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  )
}
```

---

## startTransition

```javascript
// 标记非紧急更新
startTransition(() => {
  setState(newState)  // 可以被打断
})

// 等价于
unstable_startTransition(() => {
  setState(newState)
})
```

---

## 新的 Root API

### 旧 API

```javascript
import ReactDOM from 'react-dom'

ReactDOM.render(<App />, document.getElementById('root'))
```

### 新 API

```javascript
import ReactDOM from 'react-dom/client'

// React 18
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)

// 支持 concurrent 模式
root.render(<App />)  // 自动使用并发渲染
```

---

## 总结

| 特性 | 说明 |
|------|------|
| 并发渲染 | 同时准备多个版本 UI |
| Automatic Batching | 自动批量处理更新 |
| useTransition | 标记非紧急更新 |
| useDeferredValue | 延迟非紧急值 |
| Suspense | 异步加载状态 |
| 新 Root API | createRoot |
