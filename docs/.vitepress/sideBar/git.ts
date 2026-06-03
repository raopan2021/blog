import { type DefaultTheme } from 'vitepress'

export function GitSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'git',
      link: 'index',
      base: '/git/',
      items: [
        { text: '基本操作', link: 'index' },
        { text: '本地分支清理', link: 'clear' },
        { text: '提交规范', link: 'git 提交规范' },
        { text: '多仓库提交', link: '多仓库提交' },
        { text: 'gitblit部署', link: 'gitblit部署' },
      ],
    },
  ]
}
