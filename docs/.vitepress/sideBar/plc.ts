import { type DefaultTheme } from 'vitepress'

export function PLCSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '基础入门',
			collapsed: false,
			base: '/plc/基础入门/',

		},
		{
			text: '西门子系列',
			collapsed: false,
			base: '/plc/西门子/',

		},
		{
			text: '三菱系列',
			collapsed: false,
			base: '/plc/三菱/',

		},
		{
			text: 'ABB 系列',
			collapsed: false,
			base: '/plc/ABB/',

		},
		{
			text: '专题实战',
			collapsed: false,
			base: '/plc/专题/',

		},
	]
}
