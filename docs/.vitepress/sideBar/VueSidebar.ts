import { type DefaultTheme } from 'vitepress'

export function VueSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Vue',
			link: '/',
			base: '/vue/',
			items: [
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
