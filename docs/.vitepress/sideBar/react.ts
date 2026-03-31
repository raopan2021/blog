import { type DefaultTheme } from 'vitepress'

export function ReactSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'React',
			link: 'index',
			base: '/react/',
			items: [
				{
					text: 'React 源码解析',
					collapsed: false,
					base: '/react/源码解析/',
					items: [
						{ text: '教程总览', link: 'index' },
					],
				},
				{
					text: 'React 版本演进',
					collapsed: false,
					base: '/react/版本演进/',
					items: [
						{ text: 'React 16: Fiber 架构', link: 'React16-Fiber' },
						{ text: 'React 17: 过渡版本', link: 'React17-过渡版本' },
						{ text: 'React 18: 并发渲染', link: 'React18-并发渲染' },
						{ text: 'React 19: Server Components', link: 'React19-ServerComponents' },
					],
				},
			],
		},
	]
}
