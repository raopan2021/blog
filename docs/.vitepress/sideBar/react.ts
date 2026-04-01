import { type DefaultTheme } from 'vitepress'

export function ReactSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'React 源码解析',
			collapsed: false,
			base: '/react/源码解析/',
			items: [
				{
					text: '模块一：基础概念',
					collapsed: true,
					base: '/react/源码解析/01-基础概念/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: 'JSX 编译原理', link: 'JSX编译原理' },
						{ text: 'Virtual DOM 结构', link: 'VirtualDOM结构' },
					],
				},
				{
					text: '模块二：Fiber 架构',
					collapsed: true,
					base: '/react/源码解析/02-Fiber架构/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: 'Fiber 架构详解', link: 'Fiber架构详解' },
						{ text: '双缓冲与工作循环', link: '双缓冲与工作循环' },
					],
				},
				{
					text: '模块三：调和算法',
					collapsed: true,
					base: '/react/源码解析/03-调和算法/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: 'Diff 算法原理', link: 'Diff算法原理' },
						{ text: 'key 的作用', link: 'key的作用' },
					],
				},
				{
					text: '模块四：Hooks 原理',
					collapsed: true,
					base: '/react/源码解析/04-Hooks原理/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: 'useState 实现原理', link: 'useState实现原理' },
						{ text: 'useEffect 实现原理', link: 'useEffect实现原理' },
						{ text: 'useRef 与性能优化', link: 'useRef与性能优化' },
					],
				},
				{
					text: '模块五：状态管理',
					collapsed: true,
					base: '/react/源码解析/05-状态管理/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: 'Redux 核心原理', link: 'Redux核心原理' },
						{ text: 'Zustand 轻量方案', link: 'Zustand轻量方案' },
					],
				},
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
