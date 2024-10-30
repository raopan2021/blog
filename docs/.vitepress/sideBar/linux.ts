import { type DefaultTheme } from 'vitepress'

export function LinuxSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Linux',
			link: 'index',
			base: '/linux/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: 'VMware', link: 'VMware' },
				{ text: 'CentOS', link: 'CentOS' },
				{ text: 'ssh', link: 'ssh' },
				{ text: 'yum', link: 'yum' },
				{ text: '端口', link: '端口' },
			],
		},
		{
			text: 'Docker',
			link: 'index',
			base: '/docker/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: '常见命令', link: '常见命令' },
				{ text: '命令别名', link: '命令别名' },
				{ text: '镜像', link: '镜像' },
				{ text: '部署 Nginx', link: 'nginx' },
				{ text: '部署 MySQL', link: 'mysql' },
				{ text: '部署 2个 MySQL', link: 'mysql2' },
				{ text: '部署 MongoDB', link: 'mongo' },
				{ text: '部署 Redis', link: 'redis' },
				{ text: '在windows安装Docker Desktop', link: 'windesk' },
			],
		},
	]
}
