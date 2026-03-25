import { type DefaultTheme } from 'vitepress'

export function MarkdownSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Markdown',
			link: 'index',
			base: '/markdown/',
			items: [
				
				{ text: 'markdownlint 常见错误速查', link: 'lint' },
				{ text: 'md 文件注册为 vue 组件', link: 'md文件注册为vue组件' },
				{ text: 'md 文件批量注册为 vue 组件', link: 'md文件批量注册为vue组件' },
				{ text: 'md 超链接打开新标签页', link: 'md超链接打开新标签页' },
				{ text: '高亮代码', link: '高亮代码' },
			],
		},
	]
}
