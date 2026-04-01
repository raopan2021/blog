import { type DefaultTheme } from 'vitepress'

export function ViteSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Vite 核心原理',
			collapsed: false,
			base: '/vite/核心原理/',

		},
		{
			text: 'Vite 版本演进',
			collapsed: true,
			base: '/vite/版本演进/',

		},
		{
			text: '打包工具对比',
			collapsed: true,
			base: '/build/',

		},
	]
}
