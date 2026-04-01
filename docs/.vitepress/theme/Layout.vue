<script setup lang="ts">
import { nextTick, provide, computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme
import { ElBacktop } from 'element-plus'
import FullscreenLayout from './components/FullscreenLayout.vue'

const { isDark, page } = useData()

// 检测 frontmatter 中的 layout 字段
const isFullscreen = computed(() => page.value.frontmatter.layout === 'gpu-market')

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
</script>

<template>
  <!-- gpu-market 页面使用全屏 iframe 布局 -->
  <FullscreenLayout v-if="isFullscreen" src="/blog/gpu-market/index.html" />
  <Layout v-else>
    <template #doc-after>
      <el-backtop :right="100" :bottom="100" />
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
