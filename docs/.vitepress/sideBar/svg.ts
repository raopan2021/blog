import { type DefaultTheme } from 'vitepress'

export function SvgSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'SVG学习',
			link: 'index',
			items: [
				{ text: '首页', link: 'index' },
				{
					text: '练习demo',
					collapsed: false,
					base: '/svg/demo/',
					items: [{ text: '进度完成打勾动画', link: '进度完成打勾动画' }],
				},
			],
		},
	]
}
