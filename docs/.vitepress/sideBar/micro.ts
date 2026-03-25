import { type DefaultTheme } from 'vitepress'

export function MicroSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '微前端',
			link: 'index',
			base: '/micro/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: '京东 micro-app', link: 'micro-app' },
				{ text: '阿里 Qiankun 乾坤', link: 'qiankun' },
				{ text: '字节 Wujie 无界', link: 'wujie' },
				{ text: '字节 Garfish', link: 'garfish' },
			],
		},
	]
}
