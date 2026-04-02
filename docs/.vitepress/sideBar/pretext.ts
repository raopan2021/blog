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
						{ text: 'The Editorial Engine', link: 'demo1-editorial-engine' },
						{ text: 'Fluid Smoke', link: 'demo2-fluid-smoke' },
						{ text: 'Justification Compared', link: 'demo3-justification-comparison' },
						{ text: 'Variable Typographic ASCII', link: 'demo4-variable-typographic-ascii' },
						{ text: 'Shrinkwrap Showdown', link: 'demo5-shrinkwrap-showdown' },
					],
				},
			],
		},
	]
}
