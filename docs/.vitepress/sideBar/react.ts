import { type DefaultTheme } from 'vitepress'

export function ReactSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '基础入门',
			collapsed: false,
			items: [
				{ text: 'React 简介', link: '/react/basic/introduce' },
				{ text: 'TSX 语法入门', link: '/react/basic/tsx' },
				{ text: '环境搭建与开发工具', link: '/react/basic/development' },
			]
		},
		{
			text: '核心概念',
			collapsed: false,
			items: [
				{ text: '组件基础', link: '/react/components/base' },
				{ text: '组件通信', link: '/react/components/communication' },
				{ text: '受控与非受控组件', link: '/react/components/controlled' },
				{ text: '高阶组件 HOC', link: '/react/components/hoc' },
				{ text: 'Portal 端口', link: '/react/components/createPortal' },
				{ text: 'Suspense 异步加载', link: '/react/components/suspense' },
				{ text: '组件实践', link: '/react/components/practice' },
			]
		},
		{
			text: 'Hooks',
			collapsed: true,
			items: [
				{ text: 'useState', link: '/react/hooks/useState' },
				{ text: 'useEffect', link: '/react/hooks/useEffect' },
				{ text: 'useRef', link: '/react/hooks/useRef' },
				{ text: 'useContext', link: '/react/hooks/useContext' },
				{ text: 'useReducer', link: '/react/hooks/useReducer' },
				{ text: 'useCallback', link: '/react/hooks/useCallback' },
				{ text: 'useMemo', link: '/react/hooks/useMemo' },
				{ text: 'useImperativeHandle', link: '/react/hooks/useImperativeHandle' },
				{ text: 'useLayoutEffect', link: '/react/hooks/useLayoutEffect' },
				{ text: 'useTransition', link: '/react/hooks/useTransition' },
				{ text: 'useDeferredValue', link: '/react/hooks/useDeferredValue' },
				{ text: 'useId', link: '/react/hooks/useId' },
				{ text: 'useSyncExternalStore', link: '/react/hooks/useSyncExternalStore' },
				{ text: 'useDebugValue', link: '/react/hooks/useDebugValue' },
				{ text: 'useInsertionEffect', link: '/react/hooks/useInsertionEffect' },
				{ text: 'useImmer', link: '/react/hooks/useImmer' },
				{ text: '自定义 Hooks', link: '/react/hooks/custom' },
			]
		},
		{
			text: 'React Router',
			collapsed: true,
			items: [
				{ text: 'Router 入门', link: '/react/router/router' },
				{ text: '路由安装', link: '/react/router/install' },
				{ text: '路由模式', link: '/react/router/mode' },
				{ text: '声明式导航', link: '/react/router/nav' },
				{ text: '编程式导航', link: '/react/router/operation' },
				{ text: '路由参数', link: '/react/router/params' },
				{ text: '懒加载', link: '/react/router/lazy' },
				{ text: 'Error Boundary', link: '/react/router/boundary' },
				{ text: 'Hooks', link: '/react/router/hooks/useNavigate' },
				{ text: 'API: Link / NavLink', link: '/react/router/apis/link' },
			]
		},
		{
			text: '状态管理',
			collapsed: true,
			items: [
				{ text: 'Zustand 入门', link: '/react/zustand/install' },
				{ text: 'Zustand 状态管理', link: '/react/zustand/state' },
				{ text: 'Zustand 订阅', link: '/react/zustand/subscribe' },
				{ text: 'Zustand 中间件', link: '/react/zustand/middleware' },
				{ text: 'Zustand 简化写法', link: '/react/zustand/simplify' },
			]
		},
		{
			text: 'CSS 方案',
			collapsed: true,
			items: [
				{ text: 'CSS Modules', link: '/react/css/css-modules' },
				{ text: 'CSS-in-JS', link: '/react/css/css-in-js' },
				{ text: 'Atomic CSS', link: '/react/css/css-atomic' },
			]
		},
		{
			text: '构建工具',
			collapsed: true,
			items: [
				{ text: 'Babel', link: '/react/tools/babel' },
				{ text: 'SWC', link: '/react/tools/swc' },
			]
		},
		{
			text: '原理剖析',
			collapsed: true,
			items: [
				{ text: 'Virtual DOM', link: '/react/principle/vdom' },
				{ text: 'requestIdleCallback', link: '/react/principle/requestidlecallback' },
			]
		},
		{
			text: '常见问题与面试',
			collapsed: false,
			items: [
				{ text: '常见问题与解决方案', link: '/react/qa' },
				{ text: '核心面试题', link: '/react/interview' },
			]
		},
		{
			text: '常用库',
			collapsed: true,
			items: [
				{ text: 'React 常用库', link: '/react/libraries' },
			]
		},
		{
			text: 'React 源码解析',
			collapsed: true,
			base: '/react/源码解析/',
			items: [
				{ text: '模块一：基础概念', collapsed: true, base: '/react/源码解析/01-基础概念/', items: [
					{ text: 'JSX 编译原理', link: 'JSX编译原理' },
					{ text: 'Virtual DOM 结构', link: 'VirtualDOM结构' },
				]},
				{ text: '模块二：Fiber 架构', collapsed: true, base: '/react/源码解析/02-Fiber架构/', items: [
					{ text: 'Fiber 架构详解', link: 'Fiber架构详解' },
					{ text: '双缓冲与工作循环', link: '双缓冲与工作循环' },
				]},
				{ text: '模块三：调和算法', collapsed: true, base: '/react/源码解析/03-调和算法/', items: [
					{ text: 'Diff 算法原理', link: 'Diff算法原理' },
					{ text: 'key 的作用', link: 'key的作用' },
				]},
				{ text: '模块四：Hooks 原理', collapsed: true, base: '/react/源码解析/04-Hooks原理/', items: [
					{ text: 'useState 实现原理', link: 'useState实现原理' },
					{ text: 'useEffect 实现原理', link: 'useEffect实现原理' },
					{ text: 'useRef 与性能优化', link: 'useRef与性能优化' },
				]},
				{ text: '模块五：状态管理', collapsed: true, base: '/react/源码解析/05-状态管理/', items: [
					{ text: 'Redux 核心原理', link: 'Redux核心原理' },
					{ text: 'Zustand 轻量方案', link: 'Zustand轻量方案' },
				]},
			],
		},
		{
			text: 'React 版本演进',
			collapsed: true,
			base: '/react/版本演进/',
			items: [
				{ text: 'React 16: Fiber 架构', link: 'React16-Fiber' },
				{ text: 'React 17: 过渡版本', link: 'React17-过渡版本' },
				{ text: 'React 18: 并发渲染', link: 'React18-并发渲染' },
				{ text: 'React 19: Server Components', link: 'React19-ServerComponents' },
			],
		},
	]
}
