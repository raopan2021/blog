<script setup lang="ts">
import { nextTick, provide, onMounted } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme
import { ElBacktop } from 'element-plus'

const { isDark } = useData()

// 注入彩虹渐变动画样式到 head（确保最高优先级）
onMounted(() => {
  const style = document.createElement('style')
  style.id = 'rainbow-hero-styles'
  style.textContent = `
    /* Hero 名字彩虹渐变 - 最高优先级注入 */
    .VPHome .VPHero .clip,
    .VPHome .VPHero .name {
      background: linear-gradient(
        135deg,
        #bd34fe 0%,
        #41d1ff 20%,
        #6bcb77 40%,
        #ffd93d 60%,
        #ff6b6b 80%,
        #bd34fe 100%
      ) !important;
      background-size: 400% 400% !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      color: transparent !important;
      background-position: 0% 50% !important;
      animation: rainbowFlow 5s linear infinite !important;
    }

    .dark .VPHome .VPHero .clip,
    .dark .VPHome .VPHero .name {
      background: linear-gradient(
        135deg,
        #e879f9 0%,
        #67e8f9 20%,
        #86efac 40%,
        #fde047 60%,
        #fca5a5 80%,
        #e879f9 100%
      ) !important;
    }

    /* 副标题 shimmer */
    .VPHome .VPHero .text {
      background: linear-gradient(90deg, #41d1ff, #bd34fe, #ffd93d) !important;
      background-size: 200% 200% !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      color: transparent !important;
      animation: textShimmer 4s ease infinite !important;
    }

    .dark .VPHome .VPHero .text {
      background: linear-gradient(90deg, #67e8f9, #e879f9, #fde047) !important;
    }

    @keyframes rainbowFlow {
      0% { background-position: 0% 50%; }
      100% { background-position: 400% 50%; }
    }

    @keyframes textShimmer {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
  `
  document.head.appendChild(style)
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
      duration: 500,
      easing: 'ease',
      fill: 'forwards',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
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
