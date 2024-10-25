import { type DefaultTheme } from 'vitepress'

export function MicroSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '微前端',
			link: 'index',
			base: '/micro/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: 'micro-app', link: 'micro-app' },
			],
		},
	]
}
