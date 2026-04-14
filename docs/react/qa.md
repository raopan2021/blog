# React 常见问题与解决方案

> 开发中遇到的实际问题及解决方案

## ⚛️ Hooks 相关

### 1. useEffect 死循环

**问题**: `useEffect` 每次渲染都执行，形成死循环。

```tsx
// ❌ 错误：每次渲染都创建新数组
useEffect(() => {
  fetchData(data)
}, [data]) // data 是对象/数组引用

// ✅ 正确：使用 useCallback 或比较值
const memoizedData = useMemo(() => ({ id, name }), [id, name])
useEffect(() => {
  fetchData(memoizedData)
}, [memoizedData])
```

### 2. useState 异步更新

**问题**: setState 后立即读取 state，值未更新。

```tsx
const [count, setCount] = useState(0)

// ❌ 错误
const handleClick = () => {
  setCount(count + 1)
  console.log(count) // 仍是 0
}

// ✅ 正确：使用函数式更新
const handleClick = () => {
  setCount(prev => prev + 1)
}

// ✅ 或使用 useEffect 监听
useEffect(() => {
  console.log(count)
}, [count])
```

### 3. useEffect 依赖项遗漏

**问题**: 闭包陷阱，useEffect 使用了旧的值。

```tsx
const [count, setCount] = useState(0)

// ❌ 错误：定时器闭包了 count = 0
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1) // 始终是 0 + 1
  }, 1000)
  return () => clearInterval(timer)
}, []) // 空依赖，定时器内 count 永远是初始值

// ✅ 正确：函数式更新
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1)
  }, 1000)
  return () => clearInterval(timer)
}, [])
```

### 4. useRef 与 useState 混淆

| 场景 | 推荐 |
|------|------|
| 需要触发重新渲染 | `useState` |
| 存储不需要渲染的值 | `useRef` |
| 定时器 ID、DOM 引用 | `useRef` |
| 缓存计算结果（不渲染） | `useRef` |

```tsx
// useRef 的 current 是可变的，不会触发重新渲染
const timerRef = useRef(null)
const countRef = useRef(0)

timerRef.current = setInterval(() => {
  countRef.current += 1
  // 不会更新 UI
}, 1000)

// 清理
clearInterval(timerRef.current)
```

---

## 🔄 性能优化

### 5. React.memo 失效

**问题**: 父组件更新，子组件不必要的重渲染。

```tsx
// ❌ 错误：每次渲染都创建新对象
const Parent = () => {
  const style = { color: 'red' }
  return <Child style={style} />
}

// ✅ 正确：使用 useMemo
const Parent = () => {
  const style = useMemo(() => ({ color: 'red' }), [])
  return <Child style={style} />
}

// ✅ 或将样式作为子组件 prop
const Parent = () => {
  return <Child><span style={{ color: 'red' }}>text</span></Child>
}
```

### 6. 列表渲染缺少 key

**问题**: 列表没有唯一 key 或使用 index 作为 key。

```tsx
// ❌ 错误
items.map((item, index) => <Item key={index} {...item} />)

// ✅ 正确：使用唯一 ID
items.map(item => <Item key={item.id} {...item} />)
```

### 7. 大列表渲染优化

```tsx
// 使用虚拟列表，只渲染可见区域
import { FixedSizeList } from 'react-window'
import { FlashList } from '@shopify/flash-list'

// FlashList 性能更好
<FlashList
  data={items}
  renderItem={({ item }) => <ListItem item={item} />}
  estimatedItemSize={50}
  keyExtractor={item => item.id}
/>
```

---

## 🏗️ 组件通信

### 8. Props 层层传递（Prop Drilling）

**问题**: 中间层组件不需要某些 props 但必须传递。

```tsx
// ❌ 层层传递
<A><B><C><D data={data} /></C></B></A>

// ✅ 使用 Context
const DataContext = createContext()
const A = () => <DataContext.Provider value={data}><D /></DataContext.Provider>
const D = () => {
  const data = useContext(DataContext)
  return <div>{data}</div>
}

// ✅ 或使用状态管理（Zustand/Redux）
```

### 9. 父子组件方法调用

**问题**: 子组件需要暴露方法给父组件。

```tsx
// ✅ 使用 forwardRef + useImperativeHandle
const Child = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => inputRef.current.value = ''
  }))
  return <input ref={inputRef} />
})

// 父组件
const Parent = () => {
  const childRef = useRef()
  return <Child ref={childRef} />
}
```

---

## 🎨 样式问题

### 10. CSS Modules 类名冲突

**问题**: 不同模块的相同类名样式冲突。

```css
/* Button.module.css */
.button { color: red }

/* 不会冲突，因为会被编译成唯一的类名 */
```

### 11. 动态样式性能

```tsx
// ❌ 每次渲染都创建新对象
<div style={{ color: isActive ? 'red' : 'blue', fontSize: 14 }}>

// ✅ 使用 clsx 或 classnames
<div className={clsx(styles.button, { [styles.active]: isActive })}>

// ✅ 或 tailwind-merge
<div className={twMerge('text-red', isActive && 'text-blue')}>
```

---

## 🔀 路由相关

### 12. React Router 6 路由守卫

```tsx
// 使用 Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" />
  return children
}

// 使用
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### 13. 路由参数变化不更新

```tsx
// useParams 返回的是 URL 字符串，每次路由变化会重新渲染
const { id } = useParams()

// 如果组件没有重新渲染，手动添加 key 强制销毁重建
<Route path="/user/:id" element={<UserProfile key={id} />} />
```

---

## 🧩 TypeScript

### 14. useState 类型推断

```tsx
// ❌ 类型不明确
const [state, setState] = useState(null)

// ✅ 正确指定类型
const [state, setState] = useState<string | null>(null)

// ✅ 使用泛型
interface User {
  name: string
  age: number
}
const [user, setUser] = useState<User | null>(null)
```

### 15. 事件处理器类型

```tsx
// ❌ any 类型
const handleClick = (e) => {
  console.log(e.target.value) // 报错
}

// ✅ 正确类型
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget.value)
}

// ✅ 表单事件
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
}

// ✅ change 事件
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value)
}
```

---

## 🛡️ 错误边界

### 16. 未捕获的异步错误

```tsx
// ❌ 异步错误不会被 ErrorBoundary 捕获
const handleClick = async () => {
  const data = await fetchData() // 错误不会被边界捕获
}

// ✅ 使用 try-catch
const handleClick = async () => {
  try {
    const data = await fetchData()
  } catch (error) {
    // 需要单独的 error state 或 toast 提示
    setError(error.message)
  }
}

// ✅ 或使用 react-error-boundary
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary
  onError={(error, info) => {
    // 上报错误
    logError(error, info)
  }}
  fallback={<FallbackComponent />}
>
  <ComponentThatMayError />
</ErrorBoundary>
```

---

## 🚀 构建与部署

### 17. 动态导入代码分割

```tsx
// ✅ 懒加载组件
const HeavyComponent = lazy(() => import('./HeavyComponent'))

const MyPage = () => (
  <Suspense fallback={<Loading />}>
    <HeavyComponent />
  </Suspense>
)

// ✅ 懒加载路由
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

<Routes>
  <Route path="/dashboard" element={
    <Suspense fallback={<Loading />}><Dashboard /></Suspense>
  } />
</Routes>
```

### 18. 环境变量

```bash
# .env.development / .env.production
VITE_API_URL=https://api.example.com
VITE_APP_VERSION=1.0.0
```

```tsx
// 使用
console.log(import.meta.env.VITE_API_URL)
```
