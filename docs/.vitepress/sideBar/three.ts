import { type DefaultTheme } from 'vitepress'

export function ThreeSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Three.js',
			base: '/three/',
			items: [
				{ text: '引入 Three.js', link: '引入three' },
			],
		},
	]
}
