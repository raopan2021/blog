import type { UserConfig } from 'vitepress'
import { defineConfig, type DefaultTheme } from 'vitepress'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')
import mdFootnote from 'markdown-it-footnote'
import mdTaskList from 'markdown-it-task-lists'

const config = defineConfig({
	vite: {
		plugins: [],
	},
	base: '/blog',
	lang: 'zh-CN',
	// 网站标题，左上角以及meta标题
	title: 'FrontEnd',
	description: '我的blog',
	cleanUrls: true,
	// 是否忽略死链
	ignoreDeadLinks: false,
	// 最后更新于 开关
	lastUpdated: true,
	head: [
		['link', { rel: 'icon', type: 'image/svg+xml', href: '/vitepress-logo-mini.svg' }],
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
		math: true,
		lineNumbers: true,
		container: {
			tipLabel: '提示',
			warningLabel: '警告',
			dangerLabel: '危险',
			infoLabel: '信息',
			detailsLabel: '详细信息',
		},
		config: (md) => {
			md.use(mdFootnote)
			md.use(mdTaskList)
		},
	},
	buildEnd(siteConfig) {
		// console.log(siteConfig)
	},
	transformHead(ctx) {
		// console.log(1111, ctx)
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
		docFooter: { prev: '上一篇', next: '下一篇', },
		// 社交媒体跳转
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/raopan2021/blog' },
			// 自定义icon
			{
				icon: { svg: '<svg t="1703941582641" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1437" width="32" height="32"><path d="M793.6 450.56H460.8c-10.24 0-25.6 15.36-25.6 25.6v66.56c0 15.36 15.36 25.6 25.6 25.6h209.92c15.36 0 25.6 15.36 25.6 25.6v20.48c0 46.08-40.96 81.92-81.92 81.92H348.16c-15.36 0-25.6-15.36-25.6-25.6V399.36C317.44 358.4 358.4 317.44 399.36 317.44h389.12c10.24 0 25.6-15.36 25.6-25.6V230.4c5.12-10.24-10.24-25.6-20.48-25.6H409.6C296.96 204.8 204.8 296.96 204.8 409.6v384c0 10.24 15.36 25.6 25.6 25.6h404.48c102.4 0 184.32-81.92 184.32-184.32V476.16c0-10.24-15.36-25.6-25.6-25.6z" fill="#d81e06" p-id="1438"></path></svg>' },
				link: 'https://gitee.com/raopan2021/blog'
			}
		],
		// 每个页面页脚的编辑此页  :path  为当前路由
		editLink: {
			text: '在GitHub上编辑此页',
			pattern: 'https://github.com/raopan2021/blog/edit/main/docs/:path',
		},
		footer: {
			message: 'Released under the MIT License.',
			copyright: 'Copyright © 2018-present raopan 饶盼    base on VitePress ' + pkg.version,
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
		nav: nav(),	// 顶部导航nav
		sidebar: {	// 侧边导航
			'/vitepress/': { base: '/vitepress/', items: VitePressSidebar() },
			'/css/': { base: '/css/', items: CssSidebar() },
			'/js/': { base: '/js/', items: JsSidebar() },
			'/base/': { base: '/base/', items: BaseSidebar() },
			'/vue/': { base: '/vue/vue2/', items: Vue2Sidebar() },
			'/engineering/': { base: '/engineering/', items: EngineeringSidebar() },
			'/markdown/': { base: '/markdown/', items: MarkdownSidebar() },
			// '/reg/': { base: '/reg/', items: RegSidebar() },
			'/weekStudy/': { base: '/weekStudy/', items: WeekStudySidebar() },
			'/java/': { base: '/java/基础', items: JavaSidebar() },
			'/mysql/': { base: '/mysql/', items: MysqlSidebar() },
		},
	},
})
function nav(): DefaultTheme.NavItem[] {
	return [
		{ text: 'vitepress', link: '/vitepress/what-is-vitepress', activeMatch: '/vitepress/' },
		{ text: '前端配置', link: '/base/index', activeMatch: '/base/' },
		{ text: 'CSS进阶', link: '/css/index', activeMatch: '/css/' },
		{ text: 'JS进阶', link: '/js/index', activeMatch: '/js/' },
		{ text: 'Vue', link: '/vue/vue2/index', activeMatch: '/vue/vue2/' },
		{ text: 'Engineering', link: '/engineering/index', activeMatch: '/engineering/' },
		// { text: '正则', link: '/reg/入门', activeMatch: '/reg/' },
		{ text: '每周学习', link: '/weekStudy/2024/2024年度目标', activeMatch: '/weekStudy/' },
		{ text: 'java', link: '/java/基础/index', activeMatch: '/java/' },
		{ text: 'mysql', link: '/mysql/index', activeMatch: '/mysql/' },
	]
}
function VitePressSidebar(): DefaultTheme.SidebarItem[] {
	// 匹配不同路由，侧边导航有所变化，如果没有多页面需求，可以只写一个数组
	// link 字段以 / 开头，该根目录为 /docs/ 目录
	return [
		{
			text: '介绍',
			collapsed: false, // 初始折叠状态 true 为折叠
			items: [
				{ text: '什么是 VitePress?', link: 'what-is-vitepress' },
				{ text: '快速开始', link: 'getting-started' },
				{ text: '路由', link: 'routing' },
				{ text: '部署', link: 'deploy' },
			],
		},
		{
			text: '编写',
			collapsed: true,
			items: [
				{ text: 'Markdown 基础语法', link: 'markdown-base' },
				{ text: 'Markdown 扩展', link: 'markdown' },
				{ text: '静态资源处理', link: 'asset-handling' },
				{ text: 'Frontmatter', link: 'frontmatter' },
				{ text: '在 Markdown 中 使用 Vue', link: 'using-vue' },
				{ text: '国际化', link: 'i18n' },
			],
		},
		{
			text: '详细配置',
			collapsed: true,
			base: '/vitepress/default-theme-',
			items: [
				{ text: '概览', link: 'config' },
				{ text: '导航栏', link: 'nav' },
				{ text: '侧边栏', link: 'sidebar' },
				{ text: '主页', link: 'home-page' },
				{ text: '页脚', link: 'footer' },
				{ text: '布局', link: 'layout' },
				{ text: '徽标', link: 'badge' },
				{ text: '团队', link: 'team-page' },
				{ text: '上（下）一篇', link: 'prev-next-links' },
				{ text: '编辑链接', link: 'edit-link' },
				{ text: '最近更新时间', link: 'last-updated' },
				{ text: '搜索', link: 'search' },
				{ text: 'Carbon Ads', link: 'carbon-ads' },
			],
		},
		{
			text: '自定义',
			collapsed: true,
			items: [
				{ text: '使用自定义主题', link: 'custom-theme' },
				{ text: '扩展默认主题', link: 'extending-default-theme' },
				{ text: '构建时数据加载', link: 'data-loading' },
				{ text: 'SSR 兼容性', link: 'ssr-compat' },
				{ text: '连接到 CMS', link: 'cms' },
			],
		},
		{
			text: '实验性的',
			collapsed: true,
			items: [
				{ text: 'MPA Mode', link: 'mpa-mode', },
				{ text: 'Sitemap 生成器', link: 'sitemap-generation', },
			],
		},
		{
			text: '其他配置',
			collapsed: true,
			items: [
				{ text: '站点配置', link: 'site-config' },
				{ text: 'Frontmatter 配置', link: 'frontmatter-config' },
				{ text: 'Runtime API', link: 'runtime-api' },
				{ text: 'CLI', link: 'cli' },
			],
		},
		{
			text: '其他非官方自定义',
			collapsed: false,
			items: [
				{ text: '滚动时文字渐入效果', link: '滚动时文字渐入效果', },
				{ text: '使用 Element-Plus', link: 'element-Plus-import' },
				{ text: 'vitepress动画', link: 'vitepress动画' },
			],
		},
	]
}
function BaseSidebar(): DefaultTheme.SidebarItem[] {
	return [{
		text: '前端配置',
		items: [
			{
				text: '环境',
				collapsed: false,
				base: "/base/",
				items: [
					{ text: '首页', link: 'index' },
					{ text: 'git', link: 'git' },
					{ text: 'nvm', link: 'nvm' },
					{ text: 'pnpm', link: 'pnpm' },
					{ text: 'Vite项目体积优化', link: 'Vite项目体积优化' },
				],
			},
		],
	}]
}
function CssSidebar(): DefaultTheme.SidebarItem[] {
	return [{
		text: 'CSS进阶',
		link: 'index',
		items: [
			{ text: '首页', link: 'index' },
			{ text: '清除默认样式', link: 'reset' },
			{
				text: '基础',
				collapsed: false,
				base: '/css/基础/',
				items: [
					{ text: '伪类和伪元素', link: '伪类和伪元素' },
					{ text: '2D-3D转换', link: '2D-3D转换' },
					{ text: 'CSS选择器优先级', link: 'CSS选择器优先级' },
					{ text: '图片格式', link: '图片格式' },
					{ text: '清除浮动', link: '清除浮动' },
					{ text: 'BFC', link: 'BFC' },
				],
			},
			{
				text: 'css属性',
				collapsed: false,
				base: '/css/',
				items: [
					{ text: 'list-style', link: 'list-style' },
					{ text: '字体', link: 'fontFamily' },
					{ text: 'filter 滤镜', link: 'filter' },
					{ text: 'shadow 阴影', link: 'shadow' },
					{ text: 'verticalAlign 图文相对位置', link: 'verticalAlign' },
				],
			},
			{
				text: '特效',
				collapsed: false,
				base: '/css/',
				items: [
					{ text: '文字特效', link: 'textColor' },
					{ text: 'verticalCenter 垂直居中', link: 'verticalCenter' },
					{ text: 'colorfulShadow 彩色阴影', link: 'colorfulShadow' },
					{ text: 'paper 纸张效果', link: 'paper' },
					{ text: 'glass 毛玻璃', link: 'glass' },
					{ text: 'glass 玻璃拟态', link: 'glass2' },
					{ text: 'tab动画', link: 'tab' },
					{ text: '按钮特效', link: 'buttonHover' },
				],
			},
		],
	}]
}
function JsSidebar(): DefaultTheme.SidebarItem[] {
	return [{
		text: 'JS进阶',
		link: 'index',
		items: [
			{ text: '首页', link: 'index' },
			{
				text: 'js基础',
				collapsed: true,
				base: "js/基础/",
				items: [
					{ text: 'index', link: 'index' },
					{ text: 'Dom节点', link: 'Dom节点' },
					{ text: '字符串常用的方法', link: '字符串常用的方法' },
					{ text: '数组常用方法', link: '数组常用方法' },
					{ text: '数组字符串其他方法', link: '数组字符串其他方法' },
					{ text: '类数组', link: '类数组' },
					{ text: 'Math常用的方法', link: 'Math常用的方法' },
					{ text: '浅拷贝与深拷贝', link: '浅拷贝与深拷贝' },
					{ text: '类型转换', link: '类型转换' },
					{ text: '递归', link: '递归' },
					{ text: '函数记忆', link: '函数记忆' },
					{ text: '防抖节流', link: '防抖节流' },
					{ text: '重绘和回流', link: '重绘和回流' },
				],
			},
			{
				text: 'js算法',
				collapsed: true,
				base: "js/算法/",
				items: [
					{ text: 'index', link: 'index' },
					{ text: '冒泡排序', link: '冒泡排序' },
					{ text: '选择排序', link: '选择排序' },
					{ text: '插入排序', link: '插入排序' },
					{ text: '归并排序', link: '归并排序' },
					{ text: '计数排序', link: '计数排序' },
					{ text: '基数排序', link: '基数排序' },
				],
			},
			{
				text: 'js进阶',
				collapsed: true,
				base: "js/进阶/",
				items: [
					{ text: 'index', link: 'index' },
					{ text: '运算符进阶', link: '运算符进阶' },
					{ text: 'js风格指南', link: 'js风格指南' },
					{ text: 'js测试题自测', link: 'js测试题自测' },
					{ text: '油猴脚本', link: '油猴脚本' },
				],
			},
			{
				text: 'js组件',
				collapsed: false,
				base: "js/组件/",
				items: [
					{ text: 'highLight代码高亮组件', link: 'highLight代码高亮组件' },
					{ text: 'sse（对话）', link: 'fetchEventSource' },
				],
			},
		],
	}]
}
function Vue2Sidebar(): DefaultTheme.SidebarItem[] {
	return [{
		text: 'Vue',
		items: [
			{
				text: 'Vue2',
				collapsed: false,
				base: "/vue/vue2/",
				items: [
					{ text: 'Vue 2.7 + Vite 脚手架', link: 'index' },
					{ text: 'Vite 基础配置', link: 'vite' },
					{ text: 'Css 样式处理', link: 'css' },
					{ text: 'stylelint CSS 代码检查', link: 'stylelint' },
					{ text: 'axios 封装及接口管理', link: 'axios' },
					{ text: 'eslint 代码格式化', link: 'eslint' },
					{ text: 'husky 代码提交前脚本', link: 'husky' },
					{ text: 'commitlint 提交信息校验', link: 'commitlint' },
				],
			},
		],
	}]
}
function EngineeringSidebar(): DefaultTheme.SidebarItem[] {
	return [{
		text: '前端工程化',
		link: 'index',
		base: "/engineering/",
		items: [
			{ text: '首页', link: 'index' },
			{ text: '代码规范简介', link: 'standard' },
			{ text: 'ESLint 基本配置与使用', link: 'eslint' },
			{ text: '代码格式化', link: 'format' },
			{ text: 'Git 提交规范', link: 'git' },
			{ text: '项目规范', link: 'project' },
			{ text: 'UI 及框架规范', link: 'ui' },
		],
	}]
}
function MarkdownSidebar(): DefaultTheme.SidebarItem[] {
	return [{
		text: 'Markdown',
		link: 'index',
		base: "/markdown/",
		items: [
			{ text: '首页', link: 'index' },
			{ text: 'markdownlint常见错误提示速查', link: 'lint' },
		],
	}]
}
function RegSidebar(): DefaultTheme.SidebarItem[] {
	return [{
		text: '正则表达式',
		items: [
			{ text: '入门', link: '入门' },
		],
	}]
}
function WeekStudySidebar(): DefaultTheme.SidebarItem[] {
	return [{
		text: '每周学习',
		items: [
			{
				text: '2024',
				link: '2024年度目标',
				collapsed: false,
				base: "/weekStudy/2024/",
				items: [
					{ text: '毛泽东', link: '毛泽东' },
					{ text: '辛弃疾', link: '辛弃疾' },
					{ text: '李清照', link: '李清照' },
					{ text: '苏轼', link: '苏轼' },
					{ text: '王维', link: '王维' },
					{ text: '陆游', link: '陆游' },
					{ text: '孟浩然', link: '孟浩然' },
					{ text: '杜牧', link: '杜牧' },
					{ text: '元稹', link: '元稹' },
					{ text: '其他诗词1', link: '其他诗词1' },
					{ text: 'We Choose to Go to the Moon', link: 'We Choose to Go to the Moon' },
					{ text: '文言文', link: '文言文' },
					{ text: '七夕', link: '七夕' },
				],
			},
		],
	}]
}
function JavaSidebar(): DefaultTheme.SidebarItem[] {
	return [{
		text: 'Java',
		link: 'index',
		base: "/java/基础/",
		items: [
			{ text: '首页', link: 'index' },
			{ text: 'jdk与环境变量', link: 'jdk与环境变量' },
			{ text: 'idea与配置', link: 'idea' },
			{ text: 'maven', link: 'maven' },
			{ text: 'SpringBoot', link: 'SpringBoot' },
		],
	}]
}
function MysqlSidebar(): DefaultTheme.SidebarItem[] {
	return [{
		text: 'mysql',
		link: 'index',
		base: "/mysql/",
		items: [
			{ text: '首页', link: 'index' },
			{ text: 'mysql安装配置', link: 'mysql安装配置' },
		],
	}]
}


export default config;