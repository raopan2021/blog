import { type DefaultTheme } from 'vitepress'

export function EngineeringSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '前端工程化',
			link: 'index',
			base: '/engineering/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: '代码规范简介', link: 'standard' },
				{ text: 'ESLint 基本配置与使用', link: 'eslint' },
				{ text: '代码格式化', link: 'format' },
				{ text: 'Git 提交规范', link: 'git' },
				{ text: '项目规范', link: 'project' },
				{ text: 'UI 及框架规范', link: 'ui' },
			],
		},
	]
}
