import { type DefaultTheme } from 'vitepress'

export function PretextSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Pretext 文本布局',
			collapsed: false,
			base: '/pretext/',
			items: [
				{
					text: '模块一：基础',
					collapsed: true,
					base: '/pretext/基础/',
					items: [
						{ text: 'Pretext 快速入门', link: 'Pretext快速入门' },
					],
				},
				{
					text: '模块二：实现原理',
					collapsed: true,
					base: '/pretext/实现原理/',
					items: [
						{ text: 'Canvas 文本测量原理', link: 'Canvas文本测量原理' },
						{ text: '字形分段与 Unicode 处理', link: '字形分段与Unicode处理' },
						{ text: '换行算法与粘合规则', link: '换行算法与粘合规则' },
					],
				},
				{
					text: '模块三：进阶',
					collapsed: true,
					base: '/pretext/进阶/',
					items: [
						{ text: 'API 详解与高级用法', link: 'API详解与高级用法' },
						{ text: '实战技巧与性能优化', link: '实战技巧与性能优化' },
					],
				},
				{
					text: '模块四：Demo 项目',
					collapsed: true,
					base: '/pretext/demo/',
					items: [
						{ text: '综合演示', link: '综合演示' },
					],
				},
			],
		},
	]
}
