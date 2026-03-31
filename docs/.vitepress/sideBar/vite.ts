import { type DefaultTheme } from 'vitepress'

export function ViteSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Vite',
			link: 'index',
			base: '/vite/',
			items: [
				{
					text: 'Vite 版本演进',
					collapsed: false,
					base: '/vite/版本演进/',
					items: [
						{ text: 'Vite 1.x 青铜器时代', link: 'Vite1-青铜器' },
						{ text: 'Vite 2.x 插件系统', link: 'Vite2-插件系统' },
						{ text: 'Vite 3/4 稳定发展', link: 'Vite3-4稳定发展' },
						{ text: 'Vite 5.x Rolldown', link: 'Vite5-Rolldown' },
					],
				},
			],
		},
		{
			text: '打包工具',
			collapsed: false,
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
