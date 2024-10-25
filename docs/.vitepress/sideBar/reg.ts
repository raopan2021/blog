import { type DefaultTheme } from 'vitepress'

export function RegSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '正则表达式',
			items: [{ text: '入门', link: '入门' }],
		},
	]
}
