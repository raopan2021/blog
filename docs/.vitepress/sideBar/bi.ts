export function BISidebar() {
  return [
    {
      text: 'BI 介绍',
      collapsed: false,
      items: [
        { text: 'BI 简介与常用工具', link: '/bi/' },
      ]
    },
    {
      text: '帆软 FineReport',
      collapsed: false,
      items: [
        { text: '帆软简介', link: '/帆软/' },
        { text: '帆软开发入门', link: '/帆软/入门' },
        { text: '帆软开发进阶', link: '/帆软/进阶' },
      ]
    },
    {
      text: '永洪 BI',
      collapsed: false,
      items: [
        { text: '永洪简介', link: '/永洪/' },
        { text: '永洪开发入门', link: '/永洪/入门' },
        { text: '永洪开发进阶', link: '/永洪/进阶' },
      ]
    },
    {
      text: '项目实战 Demo',
      collapsed: false,
      items: [
        { text: '帆软报表 Demo', link: '/demo/帆软报表' },
        { text: '永洪看板 Demo', link: '/demo/永洪看板' },
      ]
    },
  ]
}
