import { type DefaultTheme } from 'vitepress'

export function ReactNativeSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '基础入门',
			collapsed: false,
			items: [
				{ text: 'React Native 简介', link: '/react-native/basic/introduce' },
				{ text: '环境搭建 - iOS', link: '/react-native/basic/env-ios' },
				{ text: '环境搭建 - Android', link: '/react-native/basic/env-android' },
				{ text: '项目结构', link: '/react-native/basic/structure' },
			]
		},
		{
			text: '内置组件',
			collapsed: true,
			items: [
				{ text: 'View', link: '/react-native/components/view' },
				{ text: 'Text', link: '/react-native/components/text' },
				{ text: 'Button', link: '/react-native/components/button' },
				{ text: 'Image', link: '/react-native/components/image' },
				{ text: 'ImageBackground', link: '/react-native/components/imageBackground' },
				{ text: 'TextInput', link: '/react-native/components/textInput' },
				{ text: 'Switch', link: '/react-native/components/switch' },
				{ text: 'Modal', link: '/react-native/components/modal' },
				{ text: 'ScrollView', link: '/react-native/components/scrollView' },
				{ text: 'KeyboardAvoidingView', link: '/react-native/components/keyboardAvoidingView' },
			]
		},
		{
			text: 'UI 与布局',
			collapsed: true,
			items: [
				{ text: '样式', link: '/react-native/ui/style' },
				{ text: '布局', link: '/react-native/ui/layout' },
				{ text: '事件处理', link: '/react-native/ui/event' },
				{ text: '动画', link: '/react-native/ui/animate' },
				{ text: '图片', link: '/react-native/ui/image' },
				{ text: '网络请求', link: '/react-native/ui/network' },
			]
		},
		{
			text: '原理与架构',
			collapsed: true,
			items: [
				{ text: '架构原理', link: '/react-native/principle/architecture' },
				{ text: '渲染流程', link: '/react-native/principle/render' },
				{ text: '通信机制', link: '/react-native/principle/communication' },
			]
		},
		{
			text: '构建与发布',
			collapsed: true,
			items: [
				{ text: '发布流程', link: '/react-native/build/publish' },
				{ text: 'iOS 发布', link: '/react-native/build/publish-ios' },
				{ text: 'Android 发布', link: '/react-native/build/publish-android' },
			]
		},
		{
			text: '常见问题与面试',
			collapsed: false,
			items: [
				{ text: '常见问题与解决方案', link: '/react-native/qa' },
				{ text: '核心面试题', link: '/react-native/interview' },
			]
		},
		{
			text: '常用库',
			collapsed: true,
			items: [
				{ text: 'React Native 常用库', link: '/react-native/libraries' },
			]
		},
	]
}
