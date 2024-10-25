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
		},
	]
}
