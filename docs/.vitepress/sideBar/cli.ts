import { type DefaultTheme } from 'vitepress'

export function CliSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '脚手架的实现',
			link: 'index',
			base: '/cli/',
			items: [
				{ text: '介绍', link: 'index' },
				{ text: 'chalk', link: 'chalk' },
				{ text: 'ora', link: 'ora' },
				{ text: 'figlet', link: 'figlet' },
				{ text: 'fs-extra', link: 'fs-extra' },
				{ text: 'commander', link: 'commander' },
				{ text: 'inquirer', link: 'inquirer' },
				{ text: 'download-git-repo', link: 'download-git-repo' },
				{ text: '脚手架实操', link: 'cli' },
				{ text: '上传到npm', link: 'publish' },
			],
		},
	]
}
