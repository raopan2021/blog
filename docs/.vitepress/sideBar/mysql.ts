import { type DefaultTheme } from 'vitepress'

export function MysqlSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'mysql',
			link: 'index',
			base: '/mysql/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: 'mysql安装配置', link: 'mysql安装配置' },
			],
		},
	]
}
