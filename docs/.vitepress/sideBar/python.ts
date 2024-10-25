import { type DefaultTheme } from 'vitepress'

export function PythonSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Python',
			link: 'index',
			base: '/python/',
			items: [
				{ text: '介绍', link: 'index' },
				{ text: '虚拟环境工具 pyenv', link: 'pyenv' },
				{ text: 'conda', link: 'conda' },
			],
		},
	]
}
