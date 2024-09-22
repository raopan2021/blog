import { type DefaultTheme } from 'vitepress'

export function WeekStudySidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '每周学习',
			items: [
				{
					text: '2024',
					link: '2024年度目标',
					collapsed: false,
					base: '/weekStudy/2024/',
					items: [
						{ text: '毛泽东', link: '毛泽东' },
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
						{ text: '其他诗词1', link: '其他诗词1' },
						{ text: 'We Choose to Go to the Moon', link: 'We Choose to Go to the Moon' },
						{ text: '文言文', link: '文言文' },
						{ text: '七夕', link: '七夕' },
					],
				},
			],
		},
	]
}
