import { type DefaultTheme } from 'vitepress'

export function PLCSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'PLC 编程',
			collapsed: false,
			base: '/plc/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: '01-认识PLC', link: '01-认识PLC' },
				{ text: '02-PLC硬件基础', link: '02-PLC硬件基础' },
				{ text: '03-编程语言基础', link: '03-编程语言基础' },
				{ text: '04-西门子S7-1200快速入门', link: '04-西门子S7-1200快速入门' },
				{ text: '05-三菱FX5U快速入门', link: '05-三菱FX5U快速入门' },
				{ text: '06-常用功能与实战', link: '06-常用功能与实战' },
			],
		},
	]
}
