import { type DefaultTheme } from 'vitepress'

export function AISidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'AI 大模型',
			collapsed: false,
			base: '/ai/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: 'AI 大模型入门', link: 'AI大模型入门' },
				{ text: '提示词工程', link: '提示词工程' },
				{ text: 'Claude 调用指南', link: 'Claude调用指南' },
				{ text: 'Ollama 本地部署', link: 'ollama' },
			],
		},
	]
}
