import { type DefaultTheme } from 'vitepress'

export function CssSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
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
						{ text: 'flex=1 弹性布局', link: 'flex=1' },
						{ text: 'flex 布局', link: 'flex布局' },
						{ text: 'grid 布局', link: 'grid布局' },
						{ text: 'CSS 初始化', link: 'css初始化' },
						{ text: 'label 标签', link: 'label标签' },
						{ text: 'link 标签与 import 区别', link: 'link标签和import区别' },
						{ text: '图片 alt 与 title 区别', link: '图片alt和title区别' },
					],
				},
				{
					text: 'css属性',
					collapsed: true,
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
					collapsed: true,
					base: '/css/',
					items: [
						{ text: 'UnoCSS 彩虹主题', link: '特效/unocss-rainbow' },
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
				{
					text: '进阶技巧',
					collapsed: true,
					base: '/css/',
					items: [
						{ text: 'CSS3 新特性', link: 'css3新特性' },
						{ text: '0.5px 直线', link: '0.5px的直线' },
						{ text: '滚动条隐藏', link: '滚动条隐藏' },
						{ text: 'Vue 页面切换动画', link: 'vue页面切换动画' },
					],
				},
			],
		},
	]
}
