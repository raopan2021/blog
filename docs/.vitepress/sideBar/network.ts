import { type DefaultTheme } from 'vitepress'

export function NetworkSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '计算机网络',
			base: '/network/',
			items: [
				{ text: '计算机网络概述', link: '计算机网络' },
				{ text: 'TCP/IP 分层管理', link: 'TCPIP分层管理' },
				{ text: 'TCP 与 UDP', link: 'TCP与UDP' },
				{ text: 'TCP 三次握手和四次挥手', link: 'TCP三次握手和四次挥手' },
				{ text: 'HTTP 与 HTTPS', link: 'http与https' },
			],
		},
	]
}
