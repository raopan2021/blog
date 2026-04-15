import { type DefaultTheme } from 'vitepress'

export function ReactNativeSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '基础入门',
			collapsed: false,
			items: [
				{ text: 'React Native 简介', link: '/basic/introduce' },
				{ text: '环境搭建 - iOS', link: '/basic/env-ios' },
				{ text: '环境搭建 - Android', link: '/basic/env-android' },
				{ text: '项目结构', link: '/basic/structure' },
			]
		},
		{
			text: '内置组件',
			collapsed: true,
			items: [
				{ text: 'View', link: '/components/view' },
				{ text: 'Text', link: '/components/text' },
				{ text: 'Button', link: '/components/button' },
				{ text: 'Image', link: '/components/image' },
				{ text: 'ImageBackground', link: '/components/imageBackground' },
				{ text: 'TextInput', link: '/components/textInput' },
				{ text: 'Switch', link: '/components/switch' },
				{ text: 'Modal', link: '/components/modal' },
				{ text: 'ScrollView', link: '/components/scrollView' },
				{ text: 'KeyboardAvoidingView', link: '/components/keyboardAvoidingView' },
			]
		},
		{
			text: 'UI 与布局',
			collapsed: true,
			items: [
				{ text: '样式', link: '/ui/style' },
				{ text: '布局', link: '/ui/layout' },
				{ text: '事件处理', link: '/ui/event' },
				{ text: '动画', link: '/ui/animate' },
				{ text: '图片', link: '/ui/image' },
				{ text: '网络请求', link: '/ui/network' },
			]
		},
		{
			text: '原理与架构',
			collapsed: true,
			items: [
				{ text: '架构原理', link: '/principle/architecture' },
				{ text: '渲染流程', link: '/principle/render' },
				{ text: '通信机制', link: '/principle/communication' },
			]
		},
		{
			text: '构建与发布',
			collapsed: true,
			items: [
				{ text: '发布流程', link: '/build/publish' },
				{ text: 'iOS 发布', link: '/build/publish-ios' },
				{ text: 'Android 发布', link: '/build/publish-android' },
			]
		},
		{
			text: '常见问题与面试',
			collapsed: false,
			items: [
				{ text: '常见问题与解决方案', link: '/qa' },
				{ text: '核心面试题', link: '/interview' },
			]
		},
		{
			text: '常用库',
			collapsed: true,
			items: [
				{ text: 'React Native 常用库', link: '/libraries' },
			]
		},
	]
}
