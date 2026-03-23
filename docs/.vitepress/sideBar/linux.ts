import { type DefaultTheme } from 'vitepress'

export function LinuxSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Linux 基础',
			collapsed: false,
			base: '/linux/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: 'VMware 虚拟机', link: 'VMware' },
				{ text: 'SSH 远程连接', link: 'ssh' },
				{ text: 'yum 包管理器', link: 'yum' },
				{ text: '端口管理', link: '端口' },
				{ text: '一键替换源', link: '一键替换源' },
			],
		},
		{
			text: 'Linux 进阶',
			collapsed: true,
			base: '/linux/',
			items: [
				{ text: 'Shell 脚本编程', link: 'Shell脚本' },
				{ text: '系统资源管理', link: '系统管理' },
				{ text: '防火墙', link: '防火墙' },
			],
		},
	]
}
