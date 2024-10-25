import { type DefaultTheme } from 'vitepress'

export function MarkdownSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Markdown',
			link: 'index',
			base: '/markdown/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: 'markdownlint常见错误提示速查', link: 'lint' },
			],
		},
	]
}
