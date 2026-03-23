import { type DefaultTheme } from 'vitepress'

export function JavaSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Java 基础',
			collapsed: false,
			base: '/java/基础/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: 'JDK 与环境变量', link: 'jdk与环境变量' },
				{ text: 'IDEA 与配置', link: 'idea' },
				{ text: 'Maven 基础', link: 'maven' },
				{ text: 'Maven 进阶', link: 'Maven进阶' },
			],
		},
		{
			text: 'Spring 框架',
			collapsed: true,
			base: '/java/基础/',
			items: [
				{ text: 'Spring 入门', link: 'Spring' },
				{ text: 'SpringMVC', link: 'SpringMVC' },
				{ text: 'SpringBoot', link: 'SpringBoot' },
			],
		},
		{
			text: '持久层',
			collapsed: true,
			base: '/java/基础/',
			items: [
				{ text: 'MyBatis', link: 'MyBatis' },
				{ text: 'Redis 缓存', link: 'Redis' },
			],
		},
	]
}
