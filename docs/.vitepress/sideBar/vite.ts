import { type DefaultTheme } from 'vitepress'

export function ViteSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Vite 核心原理',
			collapsed: false,
			base: '/vite/核心原理/',
			items: [
				{ text: 'Vite 原理', link: 'Vite原理' },
			],
		},
		{
			text: 'Vite 版本演进',
			collapsed: true,
			base: '/vite/版本演进/',
			items: [
				{ text: 'Vite 1.x 青铜器时代', link: 'Vite1-青铜器' },
				{ text: 'Vite 2.x 插件系统', link: 'Vite2-插件系统' },
				{ text: 'Vite 3/4 稳定发展', link: 'Vite3-4稳定发展' },
				{ text: 'Vite 5.x', link: 'Vite5' },
				{ text: 'Vite 6/7', link: 'Vite6-7' },
				{ text: 'Vite 8.x Rolldown', link: 'Vite8' },
			],
		},
		{
			text: '打包工具对比',
			collapsed: true,
			base: '/build/',
			items: [
				{ text: 'Webpack', link: 'Webpack' },
				{ text: 'Rollup', link: 'Rollup' },
				{ text: 'Rolldown', link: 'Rolldown' },
				{ text: '其他工具对比', link: '其他工具' },
			],
		},
	]
}
