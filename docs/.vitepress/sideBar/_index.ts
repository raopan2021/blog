import { type DefaultTheme } from 'vitepress'

// 导入目录内的所有ts文件的函数，并导出
import { AlgorithmSidebar } from './Algorithm.ts'
import { BaseSidebar } from './BaseSidebar.ts'
import { CliSidebar } from './CliSidebar.ts'
import { CssSidebar } from './CssSidebar.ts'
import { EngineeringSidebar } from './EngineeringSidebar.ts'
import { JavaSidebar } from './JavaSidebar.ts'
import { JsSidebar } from './JsSidebar.ts'
import { LinuxSidebar } from './LinuxSidebar.ts'
import { MarkdownSidebar } from './MarkdownSidebar.ts'
import { MicroSidebar } from './MicroSidebar.ts'
import { MysqlSidebar } from './MysqlSidebar.ts'
import { NodeSidebar } from './NodeSidebar.ts'
import { PythonSidebar } from './PythonSidebar.ts'
import { RegSidebar } from './RegSidebar.ts'
import { SvgSidebar } from './SvgSidebar.ts'
import { VueSidebar } from './VueSidebar.ts'
import { WeekStudySidebar } from './WeekStudySidebar.ts'

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
	'/reg/': { base: '/reg/', items: RegSidebar() },
	'/svg/': { base: '/svg/', items: SvgSidebar() },
	'/vue/': { base: '/vue/vue2/', items: VueSidebar() },
	'/weekStudy/': { base: '/weekStudy/', items: WeekStudySidebar() },
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
				{ text: 'docker', link: '/linux/docker/index', activeMatch: '/linux/docker/' },
			],
		},
		{ text: '算法', link: '/algorithm/index' },
		{
			text: '其他',
			items: [
				{ text: '正则', link: '/reg/入门', activeMatch: '/reg/' },
				{ text: 'SVG学习', link: '/svg/index', activeMatch: '/svg/' },
				{ text: '每周学习', link: '/weekStudy/2024/2024年度目标', activeMatch: '/weekStudy/' },
			],
		},
		{
			text: '梯子',
			link: 'TIZI',
		},
		{
			text: '友链',
			items: [{ text: 'vitepress', link: 'https://vitepress.dev/zh' }],
		},
	]
}
