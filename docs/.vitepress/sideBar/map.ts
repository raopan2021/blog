import { type DefaultTheme } from 'vitepress'

export function MapSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '地图组件',
      collapsed: false,
      base: '/map/',
      items: [
        { text: '腾讯地图组件（tlbs-map-vue）使用经验总结', link: 'tenxun' },
      ],
    },
  ]
}
