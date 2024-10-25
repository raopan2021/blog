import { type DefaultTheme } from 'vitepress'

export function JavaSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Java',
			link: 'index',
			base: '/java/基础/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: 'jdk与环境变量', link: 'jdk与环境变量' },
				{ text: 'idea与配置', link: 'idea' },
				{ text: 'maven', link: 'maven' },
				{ text: 'SpringBoot', link: 'SpringBoot' },
			],
		},
	]
}
