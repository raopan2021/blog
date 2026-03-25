import { type DefaultTheme } from 'vitepress'

export function AlgorithmSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
				text: '算法',
				collapsed: false,
				base: '/algorithm/',
				items: [
				],
			},
			{
				text: '排序算法',
				collapsed: true,
				base: '/algorithm/',
				items: [
					{ text: '冒泡排序', link: '冒泡排序' },
					{ text: '选择排序', link: '选择排序' },
					{ text: '插入排序', link: '插入排序' },
					{ text: '归并排序', link: '归并排序' },
					{ text: '计数排序', link: '计数排序' },
					{ text: '基数排序', link: '基数排序' },
				],
			},
			{
				text: '数据结构',
				collapsed: true,
				base: '/algorithm/',
				items: [
					{ text: '数组', link: '数组' },
					{ text: '链表', link: '链表' },
					{ text: '栈与队列', link: '栈与队列' },
					{ text: '哈希表', link: '哈希表' },
					{ text: '二叉树', link: '二叉树' },
				],
			},
			{
				text: '算法思想',
				collapsed: true,
				base: '/algorithm/',
				items: [
					{ text: '动态规划', link: '动态规划' },
				],
			},
	]
}
