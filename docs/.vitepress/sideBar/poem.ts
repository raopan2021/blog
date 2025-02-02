import { type DefaultTheme } from 'vitepress'

export function PoemSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '诗词',
			collapsed: false,
			base: '/poem/',
			items: [
				{ text: '毛泽东', link: '毛泽东' },
				{ text: '李白', link: '李白' },
				{ text: '辛弃疾', link: '辛弃疾' },
				{ text: '李清照', link: '李清照' },
				{ text: '苏轼', link: '苏轼' },
				{ text: '白居易', link: '白居易' },
				{ text: '王维', link: '王维' },
				{ text: '陆游', link: '陆游' },
				{ text: '孟浩然', link: '孟浩然' },
				{ text: '杜牧', link: '杜牧' },
				{ text: '元稹', link: '元稹' },
				{ text: '柳永', link: '柳永' },
				{ text: '爱情诗词', link: '爱情诗词' },
				{ text: '其他诗词1', link: '其他诗词1' },
				{ text: '文言文', link: '文言文' },
			],
		},
	]
}
