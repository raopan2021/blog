import { type DefaultTheme } from 'vitepress'

// 导入目录内的所有ts文件的函数，并导出
import { AISidebar } from './ai.ts'
import { AlgorithmSidebar } from './algorithms.ts'
import { AndroidSidebar } from './android.ts'
import { BaseSidebar } from './base.ts'
import { CliSidebar } from './cli.ts'
import { CssSidebar } from './css.ts'
import { EngineeringSidebar } from './engineering.ts'
import { H5Sidebar } from './h5.ts'
import { JavaSidebar } from './java.ts'
import { JsSidebar } from './js.ts'
import { LinuxSidebar } from './linux.ts'
import { MarkdownSidebar } from './markdown.ts'
import { DockerSidebar } from './docker.ts'
import { MicroSidebar } from './micro.ts'
import { MysqlSidebar } from './mysql.ts'
import { NetworkSidebar } from './network.ts'
import { NodeSidebar } from './node.ts'
import { PLCSidebar } from './plc.ts'
import { PlanSidebar } from './plan.ts'
import { PoemSidebar } from './poem.ts'
import { PythonSidebar } from './python.ts'
import { ReactSidebar } from './react.ts'
import { RegSidebar } from './reg.ts'
import { SvgSidebar } from './svg.ts'
import { ThreeSidebar } from './three.ts'
import { PretextSidebar } from './pretext.ts'
import { VueSidebar } from './vue.ts'
import { ViteSidebar } from './vite.ts'

export const side = {
  '/algorithm/': { base: '/algorithm/', items: AlgorithmSidebar() },
  '/android/': { base: '/android/', items: AndroidSidebar() },
  '/base/': { base: '/base/', items: BaseSidebar() },
  '/build/': { base: '/build/', items: ViteSidebar() },
  '/cli/': { base: '/cli/', items: CliSidebar() },
  '/css/': { base: '/css/', items: CssSidebar() },
  '/engineering/': { base: '/engineering/', items: EngineeringSidebar() },
  '/h5/': { base: '/h5/', items: H5Sidebar() },
  '/java/': { base: '/java/基础/', items: JavaSidebar() },
  '/python/': { base: '/python/', items: PythonSidebar() },
  '/js/': { base: '/js/', items: JsSidebar() },
  '/markdown/': { base: '/markdown/', items: MarkdownSidebar() },
  '/micro/': { base: '/micro/', items: MicroSidebar() },
  '/mysql/': { base: '/mysql/', items: MysqlSidebar() },
  '/network/': { base: '/network/', items: NetworkSidebar() },
  '/node/': { base: '/node/', items: NodeSidebar() },
  '/plc/': { base: '/plc/', items: PLCSidebar() },
  '/linux/': { base: '/linux/', items: LinuxSidebar() },
  '/docker/': { base: '/docker/', items: DockerSidebar() },
  '/ai/': { base: '/ai/', items: AISidebar() },
  '/react/': { base: '/react/', items: ReactSidebar() },
  '/reg/': { base: '/reg/', items: RegSidebar() },
  '/svg/': { base: '/svg/', items: SvgSidebar() },
  '/three/': { base: '/three/', items: ThreeSidebar() },
  '/vite/': { base: '/vite/', items: ViteSidebar() },
  '/vue/': { base: '/vue/', items: VueSidebar() },
  '/poem/': { base: '/poem/', items: PoemSidebar() },
  '/plan/': { base: '/plan/', items: PlanSidebar() },
  '/pretext/': { base: '/pretext/', items: PretextSidebar() },
}

export function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '前端',
      items: [
        { text: '前端配置', link: '/base/', activeMatch: '/base/' },
        { text: 'HTML5', link: '/h5/', activeMatch: '/h5/' },
        { text: 'CSS 进阶', link: '/css/', activeMatch: '/css/' },
        { text: 'SVG', link: '/svg/', activeMatch: '/svg/' },
        { text: 'JavaScript 进阶', link: '/js/', activeMatch: '/js/' },
        { text: 'Vue', link: '/vue/', activeMatch: '/vue/' },
        { text: 'React', link: '/react/', activeMatch: '/react/' },
        { text: 'Vite', link: '/vite/', activeMatch: '/vite/' },
        { text: 'Markdown', link: '/markdown/', activeMatch: '/markdown/' },
        { text: 'Three.js', link: '/three/', activeMatch: '/three/' },
        { text: 'Pretext', link: '/pretext/', activeMatch: '/pretext/' },
        { text: '工程化', link: '/engineering/', activeMatch: '/engineering/' },
        { text: '脚手架', link: '/cli/', activeMatch: '/cli/' },
        { text: '微前端', link: '/micro/', activeMatch: '/micro/' },
      ],
    },
    {
      text: '移动开发',
      items: [
        { text: 'Android 开发笔记', link: '/android/', activeMatch: '/android/' },
      ],
    },
    {
      text: '后端',
      items: [
        { text: 'NodeJs', link: '/node/', activeMatch: '/node/' },
        { text: 'NestJS', link: '/node/nestjs/', activeMatch: '/node/nestjs/' },
        { text: 'Java', link: '/java/', activeMatch: '/java/' },
        { text: 'Python', link: '/python/', activeMatch: '/python/' },
        { text: 'MySQL', link: '/mysql/', activeMatch: '/mysql/' },
        { text: 'Linux', link: '/linux/', activeMatch: '/linux/' },
        { text: 'Docker', link: '/docker/', activeMatch: '/docker/' },
        { text: '计算机网络', link: '/network/', activeMatch: '/network/' },
      ],
    },
    {
      text: 'PLC 工业自动化',
      items: [
        { text: '基础入门', link: '/plc/基础入门/认识PLC', activeMatch: '/plc/基础入门/' },
        { text: '西门子系列', link: '/plc/西门子/S7-1200快速入门', activeMatch: '/plc/西门子/' },
        { text: '三菱系列', link: '/plc/三菱/FX5U快速入门', activeMatch: '/plc/三菱/' },
        { text: 'ABB 系列', link: '/plc/ABB/ABB-PLC快速入门', activeMatch: '/plc/ABB/' },
        { text: '专题实战', link: '/plc/专题/工业通信专题', activeMatch: '/plc/专题/' },
      ],
    },
    {
      text: '工具 & 其他',
      items: [
        { text: '算法', link: '/algorithm/', activeMatch: '/algorithm/' },
        { text: 'AI 大模型', link: '/ai/', activeMatch: '/ai/' },
        { text: '二手显卡行情', link: '/gpu-market/', activeMatch: '/gpu-market/' },
        { text: '正则表达式', link: '/reg/', activeMatch: '/reg/' },
        { text: '诗词', link: '/poem/', activeMatch: '/poem/' },
        { text: '学习计划', link: '/plan/', activeMatch: '/plan/' },
        { text: '梯子', link: 'TIZI' },
      ],
    },
    {
      text: '友链',
      items: [{ text: 'VitePress', link: 'https://vitepress.dev/zh' }],
    },
  ]
}
