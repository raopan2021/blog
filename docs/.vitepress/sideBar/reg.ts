import { type DefaultTheme } from 'vitepress'

export function RegSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '正则表达式',
			collapsed: false,
			base: '/reg/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: '正则入门', link: '入门' },
				{ text: '正则基础', link: '正则基础' },
				{ text: '正则进阶', link: '正则进阶' },
			],
		},
	]
}
