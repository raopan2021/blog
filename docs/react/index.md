# React

> 深入理解 React 核心原理：Fiber 架构、Hooks、并发模式

## 📚 快速导航

### 基础入门
- [环境搭建与开发工具](./basic/development)
- [TSX 语法入门](./basic/tsx)
- [React 简介](./basic/introduce)

### 核心概念
- [组件基础](./components/base)
- [组件通信](./components/communication)
- [受控与非受控组件](./components/controlled)
- [高阶组件 HOC](./components/hoc)
- [Portal 端口](./components/createPortal)
- [Suspense 异步加载](./components/suspense)
- [组件实践](./components/practice)

### Hooks
- [useState](./hooks/useState)
- [useEffect](./hooks/useEffect)
- [useRef](./hooks/useRef)
- [useContext](./hooks/useContext)
- [useReducer](./hooks/useReducer)
- [useCallback](./hooks/useCallback)
- [useMemo](./hooks/useMemo)
- [useImperativeHandle](./hooks/useImperativeHandle)
- [useLayoutEffect](./hooks/useLayoutEffect)
- [useTransition](./hooks/useTransition)
- [useDeferredValue](./hooks/useDeferredValue)
- [useId](./hooks/useId)
- [useSyncExternalStore](./hooks/useSyncExternalStore)
- [useDebugValue](./hooks/useDebugValue)
- [useInsertionEffect](./hooks/useInsertionEffect)
- [useImmer](./hooks/useImmer)
- [自定义 Hooks](./hooks/custom)

### 路由
- [React Router 入门](./router/router)
- [路由安装](./router/install)
- [路由模式](./router/mode)
- [声明式导航](./router/nav)
- [编程式导航](./router/operation)
- [路由参数](./router/params)
- [懒加载](./router/lazy)
- [Error Boundary](./router/boundary)
- **Hooks**: [useNavigate](./router/hooks/useNavigate) | [useLocation](./router/hooks/useLocation) | [useParams](./router/hooks/useParams) | [useSearchParams](./router/hooks/useSearchParams) | [useNavigation](./router/hooks/useNavigation) | [useLoaderData](./router/hooks/useLoaderData) | [useActionData](./router/hooks/useActionData) | [useSubmit](./router/hooks/useSubmit) | [useRouteError](./router/hooks/useRouteError)
- **APIs**: [Link](./router/apis/link) | [NavLink](./router/apis/navlink) | [redirect](./router/apis/redirect) | [await](./router/apis/await) | [Meta](./router/apis/meta) | [ScrollRestoration](./router/apis/scrollRestoration)

### 状态管理
- [Zustand 入门](./zustand/install)
- [Zustand 状态管理](./zustand/state)
- [Zustand 订阅](./zustand/subscribe)
- [Zustand 中间件](./zustand/middleware)
- [Zustand 简化写法](./zustand/simplify)

### CSS 方案
- [CSS Modules](./css/css-modules)
- [CSS-in-JS](./css/css-in-js)
- [Atomic CSS](./css/css-atomic)

### 构建工具
- [Babel](./tools/babel)
- [SWC](./tools/swc)

### 原理剖析
- [Virtual DOM](./principle/vdom)
- [requestIdleCallback](./principle/requestidlecallback)

### 常见问题
- [React 常见问题与解决方案](./qa)

### 面试题
- [React 核心面试题](./interview)

### 常用库
- [React 常用库](./libraries)

---

## 📖 课程大纲

### React 版本演进

- React 16: Fiber 架构
- React 17: 过渡版本
- React 18: 并发渲染
- React 19: Server Components

### React 源码解析

- 模块一：基础概念（JSX编译、Virtual DOM）
- 模块二：Fiber 架构（Fiber详解、双缓冲）
- 模块三：调和算法（Diff原理、key作用）
- 模块四：Hooks原理（useState、useEffect、useRef）
- 模块五：状态管理（Redux、Zustand）
