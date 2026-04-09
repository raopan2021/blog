import { type DefaultTheme } from 'vitepress'

export function BuildSidebar(): DefaultTheme.SidebarItem[] {
	return [
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
