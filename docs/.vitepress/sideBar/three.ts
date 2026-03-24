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
					collapsed: false,
					base: '/three/',
					items: [
						{ text: '08 后期处理', link: '08-后期处理' },
						{ text: '09 物理与交互', link: '09-物理与交互' },
					],
				},
				{
					text: '项目实战一：3D 卡片展示',
					collapsed: false,
					link: '项目实战1一3D卡片展示',
					items: [
						{ text: '项目首页', link: '项目实战1一3D卡片展示' },
						{ text: 'Stage1 项目初始化', link: '项目实战1一3D卡片展示/Stage1-项目初始化' },
						{ text: 'Stage2 场景相机渲染器', link: '项目实战1一3D卡片展示/Stage2-场景相机渲染器' },
						{ text: 'Stage3 光照系统', link: '项目实战1一3D卡片展示/Stage3-光照系统' },
						{ text: 'Stage4 Canvas纹理生成', link: '项目实战1一3D卡片展示/Stage4-Canvas纹理生成' },
						{ text: 'Stage5 3D卡片创建', link: '项目实战1一3D卡片展示/Stage5-3D卡片创建' },
						{ text: 'Stage6 鼠标交互', link: '项目实战1一3D卡片展示/Stage6-鼠标交互' },
						{ text: 'Stage7 翻转动画', link: '项目实战1一3D卡片展示/Stage7-翻转动画' },
						{ text: 'Stage8 动画循环', link: '项目实战1一3D卡片展示/Stage8-动画循环' },
						{ text: 'Stage9 响应式与性能', link: '项目实战1一3D卡片展示/Stage9-响应式与性能' },
						{ text: 'Stage10 扩展练习', link: '项目实战1一3D卡片展示/Stage10-扩展练习' },
					],
				},
				{
					text: '项目实战二：汽车展示网站',
					collapsed: false,
					link: '项目实战2一汽车展示网站',
					items: [
						{ text: '项目首页', link: '项目实战2一汽车展示网站' },
						{ text: 'Stage1 项目初始化', link: '项目实战2一汽车展示网站/Stage1-项目初始化' },
						{ text: 'Stage2 入口页面与加载动画', link: '项目实战2一汽车展示网站/Stage2-入口页面与加载动画' },
						{ text: 'Stage3 ThreeJS基础场景', link: '项目实战2一汽车展示网站/Stage3-ThreeJS基础场景' },
						{ text: 'Stage4 资源加载系统', link: '项目实战2一汽车展示网站/Stage4-资源加载系统' },
						{ text: 'Stage5 后处理Bloom发光', link: '项目实战2一汽车展示网站/Stage5-后处理Bloom发光' },
						{ text: 'Stage6 动态环境贴图', link: '项目实战2一汽车展示网站/Stage6-动态环境贴图' },
						{ text: 'Stage7 汽车与展示厅模型', link: '项目实战2一汽车展示网站/Stage7-汽车与展示厅模型' },
						{ text: 'Stage8 GSAP动画系统', link: '项目实战2一汽车展示网站/Stage8-GSAP动画系统' },
						{ text: 'Stage9 加速模式', link: '项目实战2一汽车展示网站/Stage9-加速模式' },
						{ text: 'Stage10 相机抖动', link: '项目实战2一汽车展示网站/Stage10-相机抖动' },
						{ text: 'Stage11 交互与完整流程', link: '项目实战2一汽车展示网站/Stage11-交互与完整流程' },
						{ text: '项目总结', link: '项目实战2一汽车展示网站/总结' },
					],
				},
			],
		},
	]
}
