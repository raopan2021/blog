import { type DefaultTheme } from 'vitepress'

export function MysqlSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'MySQL',
			collapsed: false,
			base: '/mysql/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: '安装配置', link: 'mysql安装配置' },
				{ text: 'SQL 基础', link: 'SQL基础' },
				{ text: '索引', link: '索引' },
				{ text: '事务', link: '事务' },
			],
		},
	]
}
