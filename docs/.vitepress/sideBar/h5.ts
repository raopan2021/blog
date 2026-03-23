import { type DefaultTheme } from 'vitepress'

export function H5Sidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'H5 与 HTML',
			link: 'index',
			base: '/h5/',
			items: [
				{ text: '首页', link: 'index' },
				{ text: 'DOCTYPE 的作用', link: 'DOCTYPE的作用' },
				{ text: 'H5 新增特性', link: 'h5新增特性' },
				{ text: 'meta 标签', link: 'meta标签' },
				{ text: 'script 标签 defer 与 async', link: 'script标签中的defer和async' },
				{ text: 'src 和 href 的区别', link: 'src和href的区别' },
			],
		},
	]
}
