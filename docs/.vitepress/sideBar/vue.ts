import { type DefaultTheme } from 'vitepress'

export function VueSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Vue',
			link: 'index',
			base: '/vue/',
			items: [
				{
					text: 'Vue 基础',
					collapsed: false,
					base: '/vue/',
					items: [
						{ text: '首页', link: 'index' },
						{ text: 'NProgress 进度条', link: 'NProgress进度条' },
						{ text: 'SPA 单页面的理解与优缺点', link: 'SPA单页面的理解优缺点' },
						{ text: 'computed & watch', link: 'computed和watch' },
						{ text: 'data 为什么是函数', link: 'data为什么是函数' },
						{ text: 'Vue 项目优化', link: 'Vue项目优化' },
						{ text: 'Vue 的优缺点', link: 'Vue的优缺点' },
						{ text: '生命周期', link: '生命周期' },
						{ text: '虚拟 DOM', link: '虚拟DOM' },
						{ text: '强制更新视图', link: '强制更新视图' },
						{ text: 'v-if 与 v-show', link: 'v_if_show' },
						{ text: 'nextTick', link: 'nextTick' },
						{ text: 'mixins', link: 'mixins' },
						{ text: 'slot 插槽', link: 'slot插槽' },
						{ text: 'transition', link: 'transition' },
						{ text: 'router 传参', link: 'router传参' },
						{ text: 'router 钩子函数', link: 'router钩子函数' },
						{ text: '上传文件到后台', link: '上传文件到后台' },
						{ text: '下载静态文件', link: '下载静态文件' },
						{ text: '页面跳转动画', link: '页面跳转动画' },
					],
				},
				{
					text: 'Vue2.7 模板',
					collapsed: true,
					base: '/vue/vue2/',
					items: [
						{ text: 'Vue 2.7 + Vite 模板', link: 'index' },
						{ text: 'Vite 基础配置', link: 'vite' },
						{ text: 'Css 样式处理', link: 'css' },
						{ text: 'stylelint CSS 代码检查', link: 'stylelint' },
						{ text: 'axios 封装及接口管理', link: 'axios' },
						{ text: 'eslint 代码格式化', link: 'eslint' },
						{ text: 'husky 代码提交前脚本', link: 'husky' },
						{ text: 'commitlint 提交信息校验', link: 'commitlint' },
					],
				},
				{
					text: 'ElementUI',
					collapsed: true,
					base: '/vue/element-ui/',
					items: [
						{ text: '导航菜单 navMenu', link: '导航菜单navMenu' },
						{ text: '按钮 button', link: '按钮button' },
						{ text: '下拉框 select', link: '下拉框select' },
						{ text: '弹窗 dialog 可拖拽', link: '弹窗dialog可拖拽' },
						{ text: '弹窗 dialog 双击放大拖拽拉伸', link: '弹窗dialog双击放大拖拽拉伸' },
						{ text: '日期时间选择器', link: '日期时间选择器' },
						{ text: '翻页 pagination', link: '翻页pagination' },
						{ text: '表格', link: '表格' },
					],
				},
				{
					text: 'vue组件',
					collapsed: true,
					base: '/vue/other/',
					items: [
						{ text: 'PDF 预览', link: 'vue-pdf' },
						{ text: 'Vue.Draggable 拖拽插件', link: 'vueDraggable' },
					],
				},
			],
		},
	]
}
