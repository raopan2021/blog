import { type DefaultTheme } from 'vitepress'

export function PythonSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
				text: 'Python 入门',
				collapsed: false,
				base: '/python/',
				items: [
					{ text: '首页', link: 'index' },
					{ text: '虚拟环境 pyenv', link: 'pyenv' },
					{ text: 'Conda', link: 'conda' },
				],
			},
			{
				text: 'Python 基础',
				collapsed: true,
				base: '/python/',
				items: [
					{ text: '数据类型与变量', link: '基础-数据类型' },
					{ text: '控制流程', link: '基础-控制流程' },
					{ text: '函数与模块', link: '基础-函数与模块' },
					{ text: '面向对象', link: '基础-面向对象' },
					{ text: '文件操作', link: '基础-文件操作' },
					{ text: '异常处理', link: '基础-异常处理' },
					{ text: '常用内置库', link: '基础-常用内置库' },
				],
			},
			{
				text: 'Python 进阶',
				collapsed: true,
				base: '/python/',
				items: [
					{ text: '装饰器', link: '进阶-装饰器' },
					{ text: '生成器与迭代器', link: '进阶-生成器与迭代器' },
					{ text: '上下文管理器', link: '进阶-上下文管理器' },
					{ text: '异步编程', link: '进阶-异步编程' },
				],
			},
			{
				text: 'Web 开发',
				collapsed: true,
				base: '/python/',
				items: [
					{ text: 'Flask 快速入门', link: 'Flask快速入门' },
					{ text: 'FastAPI 高性能框架', link: 'FastAPI' },
				],
			},
			{
				text: '爬虫与数据',
				collapsed: true,
				base: '/python/',
				items: [
					{ text: 'Requests 网络请求', link: '爬虫-Requests' },
					{ text: 'BeautifulSoup 解析', link: '爬虫-BeautifulSoup' },
					{ text: 'Pandas 数据处理', link: '数据处理-Pandas' },
				],
			},
	]
}
