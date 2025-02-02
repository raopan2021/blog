import { type DefaultTheme } from 'vitepress'

export function PlanSidebar(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '学习计划',
			items: [
                { text: '2025年度目标及完成情况', link: '2025' },
                { text: '2024年度目标及完成情况', link: '2024' },
            ],
		},
	]
}
