import { type DefaultTheme } from 'vitepress'

export function AndroidSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Android 开发笔记',
			link: 'index',
			base: '/android/',
			items: [
				{ text: '首页', link: 'index' },
				{
					text: '第一阶段：入门',
					collapsed: false,
					base: '/android/',
					items: [
						{ text: '01 项目概览', link: '01-项目概览' },
						{ text: '02 环境搭建', link: '02-环境搭建' },
						{ text: '03 项目结构', link: '03-项目结构' },
						{ text: '08 Compose 基础', link: '08-Compose基础' },
					],
				},
				{
					text: '第二阶段：进阶',
					collapsed: false,
					base: '/android/',
					items: [
						{ text: '04 数据模型', link: '04-数据模型' },
						{ text: '05 DataStore 持久化', link: '05-持久化' },
						{ text: '06 ViewModel 与状态管理', link: '06-状态管理' },
						{ text: '07 网络请求', link: '07-网络请求' },
					],
				},
				{
					text: '第三阶段：实战',
					collapsed: false,
					base: '/android/',
					items: [
						{ text: '09 Compose 进阶', link: '09-Compose进阶' },
						{ text: '10 实战：账户管理', link: '10-实战账户管理' },
						{ text: '11 实战：设置页面', link: '11-实战设置页面' },
						{ text: '12 实战：日志系统', link: '12-实战日志系统' },
						{ text: '13 构建与发布', link: '13-构建发布' },
					],
				},
			],
		},
	]
}
