import { type DefaultTheme } from 'vitepress'

export function BaseSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '前端配置',
			items: [
				{
					text: '环境',
					collapsed: false,
					base: '/base/',
					items: [
						{ text: '首页', link: 'index' },
						{ text: 'git', link: 'git' },
						{ text: 'nvm', link: 'nvm' },
						{ text: 'pnpm', link: 'pnpm' },
						{ text: 'Vite项目体积优化', link: 'Vite项目体积优化' },
					],
				},
			],
		},
	]
}
