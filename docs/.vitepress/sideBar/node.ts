import { type DefaultTheme } from 'vitepress'

export function NodeSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Node',
			link: 'index',
			base: '/node/',
			items: [
				// { text: '首页', link: 'index' },
				// { text: 'pnpm', link: 'pnpm' },
				{
					text: 'NestJS',
					link: 'nestjs',
					base: '/node/nestjs/',
					items: [
						{ text: '介绍', link: 'index' },
						{ text: 'nest脚手架', link: 'cli' },
						{ text: 'restful风格', link: 'restful' },
						{
							text: 'restful版本控制',
							link: 'restful-version',
						},
						{ text: 'controller控制器', link: 'controller' },
						{ text: 'providers', link: 'providers' },
						{ text: 'module', link: 'module' },
						{ text: 'svg-captcha验证码', link: 'svg-captcha' },
						{ text: 'session', link: 'session' },
						{ text: '图片上传下载', link: 'upload-pic' },
						{ text: 'swagger文档', link: 'swagger' },
						{
							text: 'apifox导入swagger',
							link: 'apifox导入swagger',
						},
						{ text: '连接mysql', link: 'mysql' },
						{ text: 'Entity实体', link: 'Entity' },
						{ text: 'CRUD', link: 'CRUD' },
						{ text: 'schedule 定时任务', link: 'schedule' },
						{ text: 'os模块', link: 'os' },
					],
				},
			],
		},
	]
}
