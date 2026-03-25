import { type DefaultTheme } from 'vitepress'

export function BaseSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '前端配置',
			link: 'index',
			base: '/base/',
			items: [
				{ text: 'git', link: 'git' },
				{ text: 'nvm', link: 'nvm' },
				{ text: 'pnpm', link: 'pnpm' },
				{ text: 'Vite 项目体积优化', link: 'Vite项目体积优化' },
				{ text: 'axios 封装', link: 'axios/index' },
			],
		},
	]
}
