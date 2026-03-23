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
				{ text: '锁机制', link: '锁机制' },
				{ text: '性能优化', link: '性能优化' },
			],
		},
	]
}
