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

				},
				{
					text: '模块二：Fiber 架构',
					collapsed: true,
					base: '/react/源码解析/02-Fiber架构/',

				},
				{
					text: '模块三：调和算法',
					collapsed: true,
					base: '/react/源码解析/03-调和算法/',

				},
				{
					text: '模块四：Hooks 原理',
					collapsed: true,
					base: '/react/源码解析/04-Hooks原理/',

				},
				{
					text: '模块五：状态管理',
					collapsed: true,
					base: '/react/源码解析/05-状态管理/',

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
