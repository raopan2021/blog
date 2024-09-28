import { type DefaultTheme } from 'vitepress'

export function AlgorithmSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '算法',
			collapsed: false,
			base: '/algorithm/',
			items: [
				{ text: 'index', link: 'index' },
				{ text: '冒泡排序', link: '冒泡排序' },
				{ text: '选择排序', link: '选择排序' },
				{ text: '插入排序', link: '插入排序' },
				{ text: '归并排序', link: '归并排序' },
				{ text: '计数排序', link: '计数排序' },
				{ text: '基数排序', link: '基数排序' },
			],
		},
	]
}
