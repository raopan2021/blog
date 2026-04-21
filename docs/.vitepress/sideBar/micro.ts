import { type DefaultTheme } from 'vitepress'

export function MicroSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '微前端概论',
			collapsed: false,
			base: '/micro/',
			items: [
				{ text: '首页', link: 'index' },
			]
		},
		{
			text: '框架对比',
			collapsed: true,
			base: '/micro/',
			items: [
				{ text: '微前端是什么', link: 'index#什么是微前端' },
				{ text: '核心价值', link: 'index#核心价值' },
				{ text: '主流方案对比', link: 'index#主流方案对比' },
				{ text: '基础架构', link: 'index#基础架构' },
				{ text: '通信机制对比', link: 'index#通信机制对比' },
				{ text: '选型建议', link: 'index#选型建议' },
				{ text: '常见问题', link: 'index#常见问题' },
			]
		},
		{
			text: '🟠 字节 Wujie 无界',
			collapsed: false,
			base: '/micro/',
			items: [
				{ text: 'Wujie 特点', link: 'wujie#wujie-特点' },
				{ text: '主应用构建', link: 'wujie#主应用构建' },
				{ text: '子应用构建', link: 'wujie#子应用构建' },
				{ text: 'WujieVue 使用', link: 'wujie#主应用使用-wujievue' },
				{ text: 'setupApp 预加载', link: 'wujie#setupapp-预加载配置' },
				{ text: '子应用通信', link: 'wujie#子应用通信' },
				{ text: '降级模式', link: 'wujie#降级模式' },
				{ text: '生命周期', link: 'wujie#生命周期' },
				{ text: '常见问题', link: 'wujie#常见问题' },
				{ text: '部署', link: 'wujie#部署' },
			]
		},
		{
			text: '🔵 京东 micro-app',
			collapsed: false,
			base: '/micro/',
			items: [
				{ text: '主应用构建', link: 'micro-app#主应用构建' },
				{ text: '子应用构建', link: 'micro-app#子应用构建' },
				{ text: '建立关联', link: 'micro-app#建立关联' },
				{ text: '进阶操作', link: 'micro-app#进阶操作' },
				{ text: '生命周期', link: 'micro-app#生命周期' },
				{ text: '渲染优化', link: 'micro-app#渲染优化' },
				{ text: '数据通信', link: 'micro-app#数据通信' },
				{ text: '常见问题', link: 'micro-app#常见问题' },
				{ text: '部署', link: 'micro-app#部署' },
			]
		},
		{
			text: '🟢 阿里 Qiankun 乾坤',
			collapsed: false,
			base: '/micro/',
			items: [
				{ text: '主应用构建', link: 'qiankun#主应用构建' },
				{ text: '子应用构建', link: 'qiankun#子应用构建' },
				{ text: 'React18 子应用', link: 'qiankun#子应用①-react18' },
				{ text: 'Vue2 子应用', link: 'qiankun#子应用②-vue2' },
				{ text: 'Vue3 子应用', link: 'qiankun#子应用③-vue3' },
				{ text: '主子应用通信', link: 'qiankun#主应用子应用通信' },
				{ text: '样式隔离', link: 'qiankun#样式隔离' },
				{ text: '常见问题', link: 'qiankun#常见问题' },
				{ text: '部署', link: 'qiankun#部署' },
			]
		},
		{
			text: '🟣 字节 Garfish',
			collapsed: false,
			base: '/micro/',
			items: [
				{ text: 'Garfish 简介', link: 'garfish' },
				{ text: '主应用构建', link: 'garfish#主应用构建' },
				{ text: '子应用接入', link: 'garfish#子应用接入' },
				{ text: '通信机制', link: 'garfish#通信机制' },
				{ text: '路由隔离', link: 'garfish#路由隔离' },
				{ text: '部署', link: 'garfish#部署' },
			]
		},
		{
			text: '⚡ Module Federation',
			collapsed: false,
			base: '/micro/',
			items: [
				{ text: 'Module Federation 简介', link: 'module-federation' },
				{ text: '与微前端框架对比', link: 'module-federation#与微前端框架对比' },
				{ text: '@module-federation/vite', link: 'module-federation#module-federationvite' },
				{ text: '快速开始', link: 'module-federation#快速开始' },
				{ text: '远程应用配置', link: 'module-federation#远程应用配置' },
				{ text: '主机应用配置', link: 'module-federation#主机应用配置' },
				{ text: '消费远程模块', link: 'module-federation#消费远程模块' },
				{ text: '共享依赖', link: 'module-federation#共享依赖' },
				{ text: '类型支持', link: 'module-federation#类型支持' },
				{ text: '部署', link: 'module-federation#部署' },
			]
		},
		{
			text: '📚 进阶话题',
			collapsed: true,
			base: '/micro/',
			items: [
				{ text: '沙箱隔离原理', link: 'index#常见问题' },
				{ text: '样式隔离方案', link: 'index#常见问题' },
				{ text: '通信机制详解', link: 'index#通信机制对比' },
				{ text: '路由处理', link: 'index#常见问题' },
			]
		},
		{
			text: '🚀 部署运维',
			collapsed: true,
			base: '/micro/',
			items: [
				{ text: 'Docker 部署', link: 'index#部署' },
				{ text: 'Nginx 配置', link: 'index#常见问题' },
				{ text: '静态资源处理', link: 'index#常见问题' },
			]
		},
	]
}
