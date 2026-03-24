<script setup lang="ts">
import { nextTick, provide, ref } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

import { ElBacktop } from 'element-plus'

const { isDark } = useData()

// 上一次的主题状态，用于动画判断
let previousDark = isDark.value

const enableTransitions = () =>
	'startViewTransition' in document &&
	window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
	if (!enableTransitions()) {
		isDark.value = !isDark.value
		return
	}

	// 计算从点击位置扩展到屏幕边缘的圆
	const radius = Math.hypot(
		Math.max(x, innerWidth - x),
		Math.max(y, innerHeight - y),
	)
	const from = `circle(0px at ${x}px ${y}px)`
	const to = `circle(${radius}px at ${x}px ${y}px)`

	// 切换前是亮色，动画是扩大效果
	// 切换前是暗色，动画是缩小效果
	const expanding = !previousDark
	const clipPath = expanding ? [from, to] : [to, from]

	await document.startViewTransition(async () => {
		previousDark = isDark.value
		isDark.value = !isDark.value
		await nextTick()
	}).ready

	// 动画目标取决于当前主题（切换后的主题）
	// 切换后是暗色 → ::view-transition-new 动画（暗色在前面）
	// 切换后是亮色 → ::view-transition-old 动画（亮色在前面）
	const pseudoElement = isDark.value
		? '::view-transition-new(root)'
		: '::view-transition-old(root)'

	document.documentElement.animate(
		{ clipPath: isDark.value ? to : from },
		{
			duration: 500,
			easing: 'ease-out',
			pseudoElement,
		},
	)

	previousDark = isDark.value
})
</script>

<template>
	<Layout>
		<template #doc-after>
			<el-backtop :right="100" :bottom="100" />
		</template>
	</Layout>
</template>

<style>
/* 禁用 View Transitions 默认动画，由 JS 自定义 clipPath 动画替代 */
::view-transition-old(root),
::view-transition-new(root) {
	animation: none;
	mix-blend-mode: normal;
	pointer-events: none;
}

/* 旧页面（切换前）在下层，新页面（切换后）在上层 */
::view-transition-old(root) {
	z-index: 1;
}
::view-transition-new(root) {
	z-index: 9999;
}
</style>
