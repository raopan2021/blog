import { type DefaultTheme } from 'vitepress'

export function PLCSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '基础入门',
			collapsed: false,
			base: '/plc/基础入门/',
			items: [
				{ text: '认识PLC', link: '认识PLC' },
				{ text: 'PLC硬件组成', link: 'PLC硬件组成' },
				{ text: 'PLC接线详解', link: 'PLC接线详解' },
				{ text: '梯形图基础', link: '梯形图基础' },
				{ text: '结构化文本基础', link: '结构化文本基础' },
				{ text: '功能块与顺序控制', link: '功能块与顺序控制' },
				{ text: '定时器与计数器', link: '定时器与计数器' },
			],
		},
		{
			text: '西门子系列',
			collapsed: true,
			base: '/plc/西门子/',
			items: [
				{ text: 'S7-200 快速入门', link: 'S7-200快速入门' },
				{ text: 'S7-1200 快速入门', link: 'S7-1200快速入门' },
				{ text: 'S7-1500 快速入门', link: 'S7-1500快速入门' },
				{ text: 'TIA Portal 使用技巧', link: 'TIA-Portal使用技巧' },
			],
		},
		{
			text: '三菱系列',
			collapsed: true,
			base: '/plc/三菱/',
			items: [
				{ text: 'FX5U 快速入门', link: 'FX5U快速入门' },
				{ text: 'Q系列快速入门', link: 'Q系列快速入门' },
			],
		},
		{
			text: 'ABB 系列',
			collapsed: true,
			base: '/plc/ABB/',
			items: [
				{ text: 'ABB PLC 快速入门', link: 'ABB-PLC快速入门' },
			],
		},
		{
			text: '专题实战',
			collapsed: true,
			base: '/plc/专题/',
			items: [
				{ text: '高速计数器与编码器', link: '高速计数器与编码器' },
				{ text: '模拟量与PID控制', link: '模拟量与PID控制' },
				{ text: '工业通信专题', link: '工业通信专题' },
				{ text: '变频器控制实战', link: '变频器控制实战' },
			],
		},
	]
}
