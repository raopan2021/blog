import { type DefaultTheme } from 'vitepress'

export function ThreeSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Three.js',
			link: 'index',
			base: '/three/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: '引入 Three.js', link: '引入three' },
			],
		},
	]
}
