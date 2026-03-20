import { type DefaultTheme } from 'vitepress'

export function AndroidSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Android',
			base: '/android/',
			items: [
				{ text: 'API 额度助手开发笔记', link: '项目开发笔记' },
			],
		},
	]
}
