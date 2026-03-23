import { type DefaultTheme } from 'vitepress'

export function DockerSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Docker',
			collapsed: false,
			base: '/docker/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: 'MongoDB', link: 'mongo' },
				{ text: 'MySQL', link: 'mysql' },
				{ text: 'MySQL2', link: 'mysql2' },
				{ text: 'Nginx', link: 'nginx' },
				{ text: 'Redis', link: 'redis' },
				{ text: '常见命令', link: '常见命令' },
				{ text: '镜像', link: '镜像' },
				{ text: '命令别名', link: '命令别名' },
			],
		},
	]
}
