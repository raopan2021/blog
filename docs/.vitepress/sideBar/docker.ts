import { type DefaultTheme } from 'vitepress'

export function DockerSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Docker',
			collapsed: false,
			base: '/docker/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: 'Docker 入门', link: 'Docker入门' },
				{ text: '常用命令', link: '常用命令' },
				{ text: '镜像', link: '镜像' },
				{ text: '数据持久化', link: '数据持久化' },
				{ text: '网络', link: '网络' },
				{ text: '命令别名', link: '命令别名' },
			],
		},
		{
			text: 'Docker 部署',
			collapsed: true,
			base: '/docker/',
			items: [
				{ text: 'Nginx', link: 'nginx' },
				{ text: 'MySQL 单实例', link: 'mysql' },
				{ text: 'MySQL 多实例', link: 'mysql2' },
				{ text: 'MongoDB', link: 'mongo' },
				{ text: 'Redis', link: 'redis' },
				{ text: 'Windows Docker Desktop', link: 'windesk' },
			],
		},
	]
}
