// import mdFootnote from 'markdown-it-footnote'
// import mdTaskList from 'markdown-it-task-lists'
import { createRequire } from 'module'
import { defineConfig } from 'vitepress'
import { nav, side } from './sideBar/_index.ts'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')

const config = defineConfig({
	vite: {
		plugins: [],
		css: {
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler', // or 'modern'
				},
			},
		},
	},
	base: '/blog/',
	lang: 'zh-CN',
	// 网站标题，左上角以及meta标题
	title: 'FrontEnd',
	description: '我的blog',
	cleanUrls: true,
	// 是否忽略死链
	ignoreDeadLinks: true,
	// 最后更新于 开关
	lastUpdated: true,
	head: [
		// ['link', { rel: 'icon', type: 'image/svg+xml', href: '/vitepress-logo-mini.svg' }],
		['link', { rel: 'icon', type: 'image/png', href: '/vitepress-logo-mini.png' }],
		['meta', { name: 'theme-color', content: '#5f67ee' }],
		['meta', { name: 'og:type', content: 'website' }],
		['meta', { name: 'og:locale', content: 'en' }],
		['meta', { name: 'og:site_name', content: 'VitePress' }],
		['meta', { name: 'og:image', content: 'https://vitepress.dev/vitepress-og.jpg' }],
		['script', { 'src': 'https://cdn.usefathom.com/script.js', 'data-site': 'AZBRSFGG', 'data-spa': 'auto', 'defer': '' }],
	],
	// markdown配置
	markdown: {
		// math: true,
		lineNumbers: true,
		container: {
			tipLabel: '提示',
			warningLabel: '警告',
			dangerLabel: '危险',
			infoLabel: '信息',
			detailsLabel: '详细信息',
		},
		config: (md) => {
			// md.use(mdFootnote)
			// md.use(mdTaskList)
		},
	},
	//  主题配置
	themeConfig: {
		logo: { src: '/vitepress-logo-mini.svg', width: 24, height: 24 },
		lastUpdated: {
			text: '最近更新时间',
			formatOptions: {
				dateStyle: 'short',
				timeStyle: 'medium',
			},
		},
		darkModeSwitchLabel: '主题',
		sidebarMenuLabel: '菜单',
		returnToTopLabel: '回到顶部',
		langMenuLabel: '多语言',
		externalLinkIcon: true,
		// 显示层级
		outline: { level: 'deep', label: '当前页' },
		siteTitle: 'Home',
		// 上一页下一页文本
		docFooter: { prev: '上一篇', next: '下一篇' },
		// 社交媒体跳转
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/raopan2021/blog' },
			// 自定义icon
			{
				icon: {
					svg: '<svg t="1703941582641" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1437" width="32" height="32"><path d="M793.6 450.56H460.8c-10.24 0-25.6 15.36-25.6 25.6v66.56c0 15.36 15.36 25.6 25.6 25.6h209.92c15.36 0 25.6 15.36 25.6 25.6v20.48c0 46.08-40.96 81.92-81.92 81.92H348.16c-15.36 0-25.6-15.36-25.6-25.6V399.36C317.44 358.4 358.4 317.44 399.36 317.44h389.12c10.24 0 25.6-15.36 25.6-25.6V230.4c5.12-10.24-10.24-25.6-20.48-25.6H409.6C296.96 204.8 204.8 296.96 204.8 409.6v384c0 10.24 15.36 25.6 25.6 25.6h404.48c102.4 0 184.32-81.92 184.32-184.32V476.16c0-10.24-15.36-25.6-25.6-25.6z" fill="#d81e06" p-id="1438"></path></svg>',
				},
				link: 'https://gitee.com/raopan2021/blog',
			},
		],
		// 每个页面页脚的编辑此页  :path  为当前路由
		editLink: {
			text: '在GitHub上编辑此页',
			pattern: 'https://github.com/raopan2021/blog/edit/main/docs/:path',
		},
		footer: {
			message: 'Released under the MIT License.',
			copyright: 'Copyright © 2018-present raopan 饶盼 base on VitePress ' + pkg.version,
		},
		search: {
			provider: 'local',
			options: {
				translations: {
					button: {
						buttonText: '搜索文档',
						buttonAriaLabel: '搜索文档',
					},
					modal: {
						noResultsText: '无法找到相关结果',
						resetButtonTitle: '清除查询条件',
						footer: {
							selectText: '选择',
							navigateText: '切换',
						},
					},
				},
			},
		},
		nav: nav(), // 顶部导航nav
		sidebar: side, // 侧边栏
	},
})

export default config
