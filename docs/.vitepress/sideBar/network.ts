import { type DefaultTheme } from 'vitepress'

export function NetworkSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
				text: '计算机网络',
				collapsed: false,
				base: '/network/',
				items: [
					{ text: '首页', link: 'index' },
					{ text: '计算机网络概述', link: '计算机网络' },
					{ text: 'TCP/IP 分层管理', link: 'TCPIP分层管理' },
					{ text: 'TCP 与 UDP', link: 'TCP与UDP' },
					{ text: 'TCP 三次握手四次挥手', link: 'TCP三次握手和四次挥手' },
					{ text: 'HTTP 与 HTTPS', link: 'http与https' },
				],
			},
			{
				text: '网络协议',
				collapsed: true,
				base: '/network/',
				items: [
					{ text: 'DNS 与域名', link: 'DNS与域名' },
					{ text: 'WebSocket 与 SSE', link: 'WebSocket与SSE' },
					{ text: '网络编程基础', link: '网络编程基础' },
				],
			},
	]
}
