import { type DefaultTheme } from 'vitepress'

// 导入目录内的所有ts文件的函数，并导出
import { AISidebar } from './ai.ts'
import { AlgorithmSidebar } from './algorithms.ts'
import { BaseSidebar } from './base.ts'
import { CliSidebar } from './cli.ts'
import { CssSidebar } from './css.ts'
import { EngineeringSidebar } from './engineering.ts'
import { JavaSidebar } from './java.ts'
import { JsSidebar } from './js.ts'
import { LinuxSidebar } from './linux.ts'
import { MarkdownSidebar } from './markdown.ts'
import { MicroSidebar } from './micro.ts'
import { MysqlSidebar } from './mysql.ts'
import { NodeSidebar } from './node.ts'
import { PlanSidebar } from './plan.ts'
import { PoemSidebar } from './poem.ts'
import { PythonSidebar } from './python.ts'
import { RegSidebar } from './reg.ts'
import { SvgSidebar } from './svg.ts'
import { VueSidebar } from './vue.ts'

export const side = {
	// 侧边导航
	'/base/': { base: '/base/', items: BaseSidebar() },
	'/cli/': { base: '/cli/', items: CliSidebar() },
	'/css/': { base: '/css/', items: CssSidebar() },
	'/engineering/': { base: '/engineering/', items: EngineeringSidebar() },
	'/java/': { base: '/java/基础', items: JavaSidebar() },
	'/python/': { base: '/python/', items: PythonSidebar() },
	'/js/': { base: '/js/', items: JsSidebar() },
	'/markdown/': { base: '/markdown/', items: MarkdownSidebar() },
	'/micro/': { base: '/micro/', items: MicroSidebar() },
	'/algorithm/': { base: '/algorithm/', items: AlgorithmSidebar() },
	'/mysql/': { base: '/mysql/', items: MysqlSidebar() },
	'/node/': { base: '/node/', items: NodeSidebar() },
	'/linux/': { base: '/linux/', items: LinuxSidebar() },
	'/docker/': { base: '/docker/', items: LinuxSidebar() },
	'/ai/': { base: '/ai/', items: AISidebar() },
	'/reg/': { base: '/reg/', items: RegSidebar() },
	'/svg/': { base: '/svg/', items: SvgSidebar() },
	'/vue/': { base: '/vue/vue2/', items: VueSidebar() },
	'/poem/': { base: '/poem/', items: PoemSidebar() },
	'/plan/': { base: '/plan/', items: PlanSidebar() },
}

export function nav(): DefaultTheme.NavItem[] {
	return [
		{
			text: '前端',
			items: [
				{ text: '前端配置', link: '/base/index', activeMatch: '/base/' },
				{ text: 'CSS进阶', link: '/css/index', activeMatch: '/css/' },
				{ text: 'JS进阶', link: '/js/index', activeMatch: '/js/' },
				{ text: 'Vue', link: '/vue/index', activeMatch: '/vue/' },
				{ text: '工程化', link: '/engineering/index', activeMatch: '/engineering/' },
				{ text: '脚手架', link: '/cli/index', activeMatch: '/cli/' },
				{ text: '微前端', link: '/micro/index', activeMatch: '/micro/' },
			],
		},
		{
			text: '后端',
			items: [
				{ text: 'Node', link: '/node/index', activeMatch: '/node/' },
				{ text: 'NestJS', link: '/node/nestjs/index', activeMatch: '/node/nestjs/index' },
				{ text: 'java', link: '/java/基础/index', activeMatch: '/java/' },
				{ text: 'python', link: '/python/index', activeMatch: '/python/' },
				{ text: 'mysql', link: '/mysql/index', activeMatch: '/mysql/' },
				{ text: 'linux', link: '/linux/index', activeMatch: '/linux/' },
				{ text: 'docker', link: '/docker/index', activeMatch: '/docker/' },
			],
		},
        { text: '学习计划', link: '/plan/2025', activeMatch: '/plan/' },
		{
			text: '其他',
			items: [
				{ text: '正则', link: '/reg/入门', activeMatch: '/reg/' },
				{ text: 'SVG学习', link: '/svg/index', activeMatch: '/svg/' },
				{ text: '算法', link: '/algorithm/index' },
				{ text: 'AI', link: '/ai/index' },
				{ text: '梯子', link: 'TIZI' },
				{ text: '诗词', link: '/poem/毛泽东', activeMatch: '/poem/' },
			],
		},
		{
			text: '友链',
			items: [{ text: 'vitepress', link: 'https://vitepress.dev/zh' }],
		},
	]
}
