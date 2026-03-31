# Zustand 轻量方案

## 📖 本节总结

Zustand 是一个轻量级的状态管理库，比 Redux 更简单。

---

## 基本用法

### 创建 Store

```javascript
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  user: null,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setUser: (user) => set({ user }),
}))
```

### 组件中使用

```javascript
function Counter() {
  const { count, increment } = useStore()

  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

---

## 对比 Redux

| 特性 | Redux | Zustand |
|------|-------|---------|
| 配置 | 需要 createStore | create() 一步到位 |
| Boilerplate | 多 | 少 |
| 中间件 | middleware | middleware |
| 订阅 | subscribe | 直接在组件中使用 |
| 性能 | 需要 selector | 自动追踪 |

---

## 异步 Actions

```javascript
const useStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const response = await fetch('/api/users')
    const users = await response.json()
    set({ users })
  }
}))
```

---

## 中间件

```javascript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useStore = create(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 }))
      }),
      { name: 'storage' }
    )
  )
)
```

---

## 总结

| 特性 | 说明 |
|------|------|
| 轻量 | 体积小，API 简单 |
| 无 Provider | 不需要包裹组件 |
| 灵活 | 可以用 middleware 扩展 |
| DevTools | 支持 Redux DevTools |
