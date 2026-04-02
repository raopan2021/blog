import { type DefaultTheme } from 'vitepress'

export function PretextSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Pretext 文本布局',
			collapsed: false,
			base: '/pretext/',
			items: [
				{
					text: '介绍',
					collapsed: false,
					base: '/pretext/介绍/',
					items: [
						{ text: '使用方法', link: '使用方法' },
						{ text: '原理', link: '原理' },
					],
				},
				{
					text: 'Demo 演示',
					collapsed: false,
					base: '/pretext/demo/',
					items: [
						{ text: '对齐算法', link: 'demo1-justification' },
						{ text: '聊天气泡', link: 'demo2-bubbles' },
						{ text: '动态布局', link: 'demo3-dynamic-layout' },
						{ text: '字体测量', link: 'demo4-typography' },
						{ text: '手风琴', link: 'demo5-accordion' },
					],
				},
			],
		},
	]
}
