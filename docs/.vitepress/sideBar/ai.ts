import { type DefaultTheme } from 'vitepress'

export function AISidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '大模型',
			collapsed: false,
			base: '/ai/',
			items: [
				{ text: 'index', link: 'index' },
				{ text: 'ollama', link: 'ollama' },
			],
		},
	]
}
