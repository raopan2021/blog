<script setup lang="ts">
import { nextTick, provide, ref, computed, h } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

import { ElBacktop } from 'element-plus'

const { isDark } = useData()
const route = useRoute()

// 判断是否为 Three.js 实战篇的最后一页
const isThreeLastPage = computed(() => {
  return route.path.includes('/three/') && route.path.endsWith('/总结')
})

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 1000,
      easing: 'ease',
      fill: 'forwards',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})

// 自定义 PrevNext 组件
const PrevNext = () => {
	if (isThreeLastPage.value) {
		return h('div', {
			class: 'prev-next-page',
			style: 'display: flex; justify-content: space-between; gap: 1rem; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--vp-c-divider);'
		}, [
			h('a', {
				href: '/blog/three/项目实战2一汽车展示网站/Stage11-交互与完整流程',
				class: 'vp-pager-link prev',
				style: 'flex: 1; padding: 0.75rem 1rem; background: var(--vp-c-bg-soft); border-radius: 8px; text-decoration: none; transition: background 0.2s;',
			}, [
				h('span', { style: 'display: block; font-size: 0.75rem; color: var(--vp-c-text-2); margin-bottom: 0.25rem;' }, '← 上一篇'),
				h('span', { style: 'display: block; font-weight: 600; color: var(--vp-c-text-1);' }, 'Stage11：交互与完整流程'),
			]),
			h('a', {
				href: '/blog/three/01-入门',
				class: 'vp-pager-link next',
				style: 'flex: 1; padding: 0.75rem 1rem; background: var(--vp-c-bg-soft); border-radius: 8px; text-decoration: none; text-align: right; transition: background 0.2s;',
			}, [
				h('span', { style: 'display: block; font-size: 0.75rem; color: var(--vp-c-text-2); margin-bottom: 0.25rem;' }, '下一篇 →'),
				h('span', { style: 'display: block; font-weight: 600; color: var(--vp-c-brand-1);' }, '基础篇 01：入门'),
			]),
		])
	}
	return null
}
</script>

<template>
	<Layout>
		<template #doc-after>
			<el-backtop :right="100" :bottom="100" />
		</template>

		<template #doc-footer>
			<component :is="PrevNext" v-if="isThreeLastPage" />
			<slot v-else name="doc-footer" />
		</template>
	</Layout>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>
