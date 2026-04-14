# React 核心面试题

> 常见 React 面试题整理，按难度分类

## ⭐ 基础题

### 1. React 是什么？有什么特点？

React 是 Facebook 开源的 UI 库，主要特点：

- **组件化**: UI 拆分为独立可复用的组件
- **虚拟 DOM**: 减少真实 DOM 操作，提升性能
- **单向数据流**: 数据从父组件流向子组件
- **声明式**: 描述 UI 状态，React 负责更新 DOM
- **Hooks**: 函数组件可以使用状态和生命周期

### 2. Virtual DOM 是什么？如何工作？

虚拟 DOM 是真实 DOM 的 JavaScript 对象表示。

**工作流程**:
1. 状态变化 → 创建新的虚拟 DOM 树
2. Diff 算法 → 对比新旧虚拟 DOM
3. 批量更新 → 只更新变化的部分到真实 DOM

**优势**: 减少直接 DOM 操作，跨平台能力（React Native）

### 3. JSX 是什么？为什么需要它？

JSX 是 JavaScript 的语法扩展，允许在 JS 中写 HTML 风格代码：

```tsx
// JSX
const element = <h1 className="title">Hello</h1>

// 编译后
const element = React.createElement('h1', { className: 'title' }, 'Hello')
```

JSX 让 UI 代码更直观，语法糖，最终被 Babel 编译为 `React.createElement` 调用。

### 4. React 组件种类？

| 类型 | 说明 | 特点 |
|------|------|------|
| 函数组件 | 普通函数 | 简单，React 16.8+ 支持 Hooks |
| 类组件 | 继承 React.Component | 有 state/lifecycle，已不推荐 |
| 高阶组件 HOC | 接收组件返回新组件 | 扩展组件逻辑，装饰者模式 |
| Render Props | 接收 render prop 的组件 | 共享逻辑 |

### 5. state 和 props 区别？

| | state | props |
|--|-------|-------|
| 用途 | 组件内部状态 | 父组件传递的数据 |
| 可变性 | 可通过 setState 修改 | 只读，不可修改 |
| 触发渲染 | 是 | 父组件更新时 |

### 6. setState 是同步还是异步？

**React 18 之前**: 在合成事件和生命周期中是异步的，在 setTimeout / 原生事件中是同步。

**React 18+**: 所有 setState 都是异步批处理的。

```tsx
// 异步批处理
setState(() => ({ count: 1 }))
console.log(count) // 仍是旧值

// 需要用 useEffect 监听
useEffect(() => {
  console.log(count) // 最新的值
}, [count])
```

---

## ⭐⭐ 中级题

### 7. useEffect 的依赖数组

```tsx
// 不传 - 每次渲染后都执行
useEffect(() => {})

// 空数组 - 只执行一次（类似 componentDidMount）
useEffect(() => {}, [])

// 有依赖 - 依赖变化时执行
useEffect(() => {}, [dep1, dep2])
```

### 8. useMemo vs useCallback

| Hook | 用途 | 返回值 |
|------|------|--------|
| `useMemo` | 缓存计算结果 | 缓存的值 |
| `useCallback` | 缓存函数引用 | 缓存的函数 |

```tsx
// useMemo - 缓存expensive计算
const sortedList = useMemo(() => 
  [...list].sort(), [list]
)

// useCallback - 缓存函数，避免子组件不必要渲染
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

### 9. React.memo、useMemo、useCallback 区别？

| API | 作用 | 缓存什么 |
|-----|------|---------|
| `React.memo` | 高阶组件 | 整个组件是否需要重渲染 |
| `useMemo` | Hook | 计算结果 |
| `useCallback` | Hook | 函数引用 |

### 10. useRef 用途？

1. **DOM 引用**: 访问 DOM 元素
2. **可变值**: 存储不需要触发渲染的值（定时器 ID 等）
3. **保持引用**: 组件生命周期内保持同一引用

```tsx
// DOM 引用
const inputRef = useRef(null)
useEffect(() => inputRef.current?.focus(), [])

// 可变值（不触发重渲染）
const timerRef = useRef(null)
timerRef.current = setInterval(() => {}, 1000)
```

### 11. React 事件处理

```tsx
// ❌ 类组件中 this 问题
class Button extends Component {
  handleClick() {
    this.setState({}) // this 是 undefined
  }
  render() {
    <button onClick={this.handleClick}>点击</button>
  }
}

// ✅ 方法1：bind
<button onClick={this.handleClick.bind(this)}>

// ✅ 方法2：箭头函数
handleClick = () => {}

// ✅ 方法3：函数组件（无 this 问题）
const Button = () => {
  return <button onClick={handleClick}>点击</button>
}
```

### 12. 受控组件 vs 非受控组件

| | 受控组件 | 非受控组件 |
|--|---------|-----------|
| 数据来源 | React state | DOM 自身 |
| 状态更新 | onChange + setState | ref 直接读取 |
| 适用场景 | 表单验证、实时校验 | 简单表单、第三方库集成 |

```tsx
// 受控组件
const Controlled = () => {
  const [value, setValue] = useState('')
  return <input value={value} onChange={e => setValue(e.target.value)} />
}

// 非受控组件
const Uncontrolled = () => {
  const inputRef = useRef(null)
  return <input ref={inputRef} defaultValue="hello" />
}
```

### 13. React 事件合成（SyntheticEvent）

React 在 DOM 事件上封装了合成事件，提供跨浏览器一致的事件行为：
- 事件委托到 root 或 document
- 自动管理 `e.stopPropagation()` 和 `e.preventDefault()`
- 事件池：事件对象被复用，异步访问属性

---

## ⭐⭐⭐ 高级题

### 14. Fiber 架构是什么？

React 16 引入的新的调和引擎，将渲染工作拆分为小单元（Fiber），可中断和恢复：

- **双缓冲**: 同时维护 current 和 workInProgress 两棵 Fiber 树
- **优先级**: 用户交互 > 动画 > 后台数据更新
- **时间切片**: 每帧预留 5ms 给 JS 执行，避免卡顿

### 15. Diff 算法原理

React 对比新旧虚拟 DOM 的策略：

1. **Tree Diff**: 分层对比，只比较同层级节点
2. **Component Diff**: 
   - 相同类型 → 递归对比 children
   - 不同类型 → 替换整个组件
3. **Element Diff**: 
   - 同一层级的多个子元素，通过 `key` 识别移动/删除/新增

### 16. key 的作用？

key 帮助 React 识别哪些元素改变了，从而最小化 DOM 操作：

```tsx
// ❌ 用 index 作为 key（列表重排时会产生 bug）
items.map((item, i) => <Item key={i} {...item} />)

// ✅ 用唯一 id
items.map(item => <Item key={item.id} {...item} />)
```

### 17. React 渲染流程

```
JSX → createElement → React Element (Virtual DOM)
       ↓
  Component Render
       ↓
  setState / Props Change
       ↓
  Reconsiliation (Diff)
       ↓
  Commit (更新 DOM)
```

### 18. React 18 新特性

| 特性 | 说明 |
|------|------|
| Automatic Batching | setState 自动批量处理 |
| Concurrent Rendering | 并发渲染，可中断 |
| useId | 生成唯一 ID |
| useTransition | 标记非紧急更新 |
| useDeferredValue | 延迟值更新 |
| Suspense for SSR | 服务端流式渲染 |
| Strict Mode 更新 | 开发环境双重渲染 |

### 19. useSyncExternalStore 用途？

React 18 用于订阅外部数据源的 Hook：

```tsx
// 订阅 store
const state = useSyncExternalStore(
  subscribe,    // 订阅函数
  getSnapshot,  // 获取快照
  getServerSnapshot // 服务端快照
)
```

Redux、Zustand 等状态管理库都用它来连接 React。

### 20. HOC vs Render Props vs Custom Hooks

| 模式 | 特点 | 适用场景 |
|------|------|---------|
| HOC | 接收组件返回新组件，层层嵌套（wrapper hell） | 横向关注点分离 |
| Render Props | 组件接收 render prop 回调 | 逻辑复用 |
| Custom Hooks | Hook 提取逻辑 | 有状态的逻辑复用 |

```tsx
// HOC
const withUser = (Component) => (props) => <UserContext.Consumer>{user => <Component {...props} user={user} />}</UserContext.Consumer>

// Render Props
<MouseTracker render={mouse => <Cat mouse={mouse} />} />

// Custom Hook（推荐）
const useUser = () => useContext(UserContext)
const user = useUser()
```

### 21. Redux 工作流程

```
Action (描述做什么)
  ↓
dispatch (发送 action)
  ↓
Reducer (纯函数，计算新 state)
  ↓
Store (存储 state)
  ↓
Subscribe (订阅更新)
  ↓
UI 更新
```

核心原则：单一数据源、state 只读、使用纯函数Reducer。

### 22. React 与 Vue 区别

| | React | Vue |
|--|-------|-----|
| 模板 | JSX（JS 扩展） | SFC（单文件组件） |
| 数据绑定 | 单向数据流 | 双向绑定可选 |
| 状态管理 | Redux/Zustand | Vuex/Pinia |
| 生态 | 更灵活，社区更大 | 更规范，上手更容易 |
| 灵活性 | 高（很多选择） | 中（官方提供方案） |

### 23. 如何避免闭包陷阱？

```tsx
// ❌ 闭包捕获旧值
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1) // count 永远是 0
  }, 1000)
  return () => clearInterval(timer)
}, [])

// ✅ 函数式更新
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1)
  }, 1000)
  return () => clearInterval(timer)
}, [])

// ✅ 或使用 ref
useEffect(() => {
  const countRef = useRef(0)
  const timer = setInterval(() => {
    countRef.current += 1
  }, 1000)
  return () => clearInterval(timer)
}, [])
```

### 24. SSR vs CSR vs SSG

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| CSR | 客户端渲染，首屏慢 SEO 差 | SPA、管理后台 |
| SSR | 服务端渲染，首屏快 SEO 好 | 电商、内容网站 |
| SSG | 构建时生成静态页 | 博客、文档 |

### 25. React 性能优化手段

1. `React.memo` 避免不必要的子组件渲染
2. `useMemo` 缓存计算结果
3. `useCallback` 缓存回调函数
4. `key` 使用稳定唯一 ID
5. `code splitting` + `lazy loading`
6. 列表渲染使用虚拟滚动
7. 避免匿名函数和对象字面量
8. 状态提升到最小范围
