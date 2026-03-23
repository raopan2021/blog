import { type DefaultTheme } from 'vitepress'

export function ThreeSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Three.js',
			link: 'index',
			base: '/three/',
			items: [
				{ text: '首页', link: 'index' },
				{
					text: '基础篇',
					collapsed: false,
					base: '/three/',
					items: [
						{ text: '01 入门：场景、相机、渲染器', link: '01-入门' },
						{ text: '02 几何体与材质', link: '02-几何体与材质' },
						{ text: '03 光照与阴影', link: '03-光照与阴影' },
					],
				},
				{
					text: '进阶篇',
					collapsed: false,
					base: '/three/',
					items: [
						{ text: '04 纹理与贴图', link: '04-纹理与贴图' },
						{ text: '05 相机与控制器', link: '05-相机与控制器' },
						{ text: '06 动画', link: '06-动画' },
						{ text: '07 加载 3D 模型', link: '07-加载模型' },
					],
				},
				{
					text: '高级篇',
					collapsed: true,
					base: '/three/',
					items: [
						{ text: '08 后期处理', link: '08-后期处理' },
						{ text: '09 物理与交互', link: '09-物理与交互' },
					],
				},
				{
					text: '项目实战',
					collapsed: false,
					base: '/three/',
					items: [
						{ text: '10 项目实战一：3D 卡片展示', link: '10-项目实战一3D卡片展示' },
						{ text: '11 项目实战二：汽车展示网站', link: '11-项目实战二汽车展示网站' },
					],
				},
			],
		},
	]
}
