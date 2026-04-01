import { type DefaultTheme } from 'vitepress'

export function VueSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Vue 源码解析',
			collapsed: false,
			base: '/vue/源码解析/',
			items: [
				{
					text: '教程总览',
					link: 'index'
				},
				{
					text: '模块一：项目框架',
					collapsed: true,
					base: '/vue/源码解析/01-项目框架/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: 'Monorepo 实战', link: 'monorepo实战' },
					],
				},
				{
					text: '模块二：响应式基础',
					collapsed: true,
					base: '/vue/源码解析/02-响应式基础/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: '响应式系统入门', link: '响应式系统入门' },
						{ text: '依赖收集与触发', link: '依赖收集与触发' },
					],
				},
				{
					text: '模块三：基础功能',
					collapsed: true,
					base: '/vue/源码解析/03-基础功能/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: '组件实例创建', link: '组件实例创建' },
						{ text: '生命周期钩子', link: '生命周期钩子' },
					],
				},
				{
					text: '模块四：响应式深入',
					collapsed: true,
					base: '/vue/源码解析/04-响应式深入/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: 'Proxy 深度解析', link: 'Proxy深度解析' },
						{ text: 'effect 与 watch', link: 'effect与watch' },
					],
				},
				{
					text: '模块五：性能优化',
					collapsed: true,
					base: '/vue/源码解析/05-性能优化/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: '虚拟 DOM 与 Diff 算法', link: '虚拟DOM与Diff算法' },
					],
				},
				{
					text: '模块六：手写 Vue3 实战',
					collapsed: true,
					base: '/vue/源码解析/06-手写Vue3实战/',
					items: [
						{ text: '练习总览', link: 'index' },
						{ text: '练习 01：实现响应式系统', link: 'exercise/ex01-reactive' },
						{ text: '练习 02：理解 Proxy receiver', link: 'exercise/ex02-proxy-receiver' },
						{ text: '练习 03：最长递增子序列 LIS', link: 'exercise/ex03-lis' },
						{ text: '练习 04：任务调度器', link: 'exercise/ex04-scheduler' },
						{ text: '练习 05：实现计算属性', link: 'exercise/ex05-computed' },
						{ text: '练习 06：实现 watch', link: 'exercise/ex06-watch' },
						{ text: '练习 07：虚拟 DOM 与 Diff', link: 'exercise/ex07-vnode-diff' },
					],
				},
				{
					text: '模块七：Vue2/3 响应式对比',
					collapsed: true,
					base: '/vue/源码解析/07-vue2-3-reactive/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: '响应式原理对比', link: '响应式原理对比' },
						{ text: 'defineProperty vs Proxy', link: 'defineProperty对比Proxy' },
						{ text: 'Vue2 响应式的局限', link: 'Vue2响应式的局限' },
					],
				},
				{
					text: '模块八：Vue3 版本演进',
					collapsed: true,
					base: '/vue/源码解析/08-vue3-versions/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: 'Vue3.0 初版特性', link: 'Vue3.0特性' },
						{ text: 'Vue3.1 渲染器优化', link: 'Vue3.1优化' },
						{ text: 'Vue3.2 响应式提升', link: 'Vue3.2响应式提升' },
						{ text: 'Vue3.3 泛型组件', link: 'Vue3.3泛型组件' },
						{ text: 'Vue3.4 性能飞跃', link: 'Vue3.4性能飞跃' },
						{ text: 'Vue3.5 更强性能', link: 'Vue3.5更强性能' },
					],
				},
				{
					text: '模块九：Slots 插槽原理',
					collapsed: true,
					base: '/vue/源码解析/09-Slots插槽原理/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: '插槽编译原理', link: '插槽编译原理' },
						{ text: '作用域插槽实现', link: '作用域插槽实现' },
					],
				},
				{
					text: '模块十：指令系统',
					collapsed: true,
					base: '/vue/源码解析/10-指令系统/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: '指令编译原理', link: '指令编译原理' },
						{ text: 'v-model 实现原理', link: 'v-model实现原理' },
						{ text: '自定义指令', link: '自定义指令' },
					],
				},
				{
					text: '模块十一：内置组件',
					collapsed: true,
					base: '/vue/源码解析/11-内置组件/',
					items: [
						{ text: '模块概览', link: 'index' },
						{ text: 'KeepAlive 缓存组件', link: 'KeepAlive原理' },
						{ text: 'Transition 动画过渡', link: 'Transition原理' },
						{ text: 'Teleport 传送门', link: 'Teleport原理' },
					],
				},
			],
		},
		{
			text: 'Vue 面试题',
			collapsed: true,
			base: '/vue/',
			items: [
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
			text: 'Vue 组件',
			collapsed: true,
			base: '/vue/other/',
			items: [
				{ text: 'PDF 预览', link: 'vue-pdf' },
				{ text: 'Vue.Draggable 拖拽插件', link: 'vueDraggable' },
			],
		},
	]
}
