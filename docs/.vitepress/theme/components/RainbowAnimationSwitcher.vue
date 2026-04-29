<script lang="ts" setup>
import { computed, watch, ref, onMounted } from 'vue'
import RainbowSwitcher from './RainbowSwitcher.vue'

defineProps<{ text?: string, screenMenu?: boolean }>()

// 判断是否为浏览器环境
const inBrowser = typeof window !== 'undefined'
// 检测系统是否开启了减少动画偏好
const reduceMotion = ref(false)
// 动画开关状态，默认开启
const animated = ref(true)

onMounted(() => {
  if (inBrowser) {
    // 读取系统减少动画偏好
    reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // 优先读取 localStorage 用户偏好，若无则跟随系统设置
    const stored = localStorage.getItem('animate-rainbow')
    if (stored !== null) {
      animated.value = stored === 'true'
    } else {
      animated.value = !reduceMotion.value
    }
  }
})

// 切换彩虹动画状态
function toggleRainbow() {
  animated.value = !animated.value
  if (inBrowser) {
    localStorage.setItem('animate-rainbow', String(animated.value))
  }
}

// 监听动画状态，动态控制 html 标签的 class
watch(animated, (anim) => {
  if (!inBrowser) return
  // 默认添加 rainbow class，需要时移除以启用动画
  document.documentElement.classList.add('rainbow')
  if (anim) {
    document.documentElement.classList.remove('rainbow')
  }
}, { immediate: true, flush: 'post' })

// 计算开关按钮的 title 提示
const switchTitle = computed(() => {
  return animated.value
    ? 'Rainbow Animation: Disable rainbow animation'
    : 'Rainbow Animation: Enable rainbow animation'
})
</script>

<template>
  <!-- ClientOnly 确保组件仅在客户端渲染，避免 SSR 时报错 -->
  <ClientOnly>
    <div class="NavScreenRainbowAnimation">
      <RainbowSwitcher
        :title="switchTitle"
        class="RainbowAnimationSwitcher"
        :aria-checked="animated ? 'true' : 'false'"
        @click="toggleRainbow"
      >
        <!-- 非动画状态显示关闭图标 -->
        <span class="i-tabler:rainbow-off non-animated" />
        <!-- 动画状态显示彩虹图标 -->
        <span class="i-tabler:rainbow animated" />
      </RainbowSwitcher>
    </div>
  </ClientOnly>
</template>

<style scoped>
/* 图标默认透明，通过 aria-checked 状态控制显示 */
.animated {
  opacity: 1;
}

.non-animated {
  opacity: 0;
}

.NavScreenRainbowAnimation {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 关闭动画时显示非动画图标 */
.RainbowAnimationSwitcher[aria-checked='false'] .non-animated {
  opacity: 1;
}

/* 开启动画时显示彩虹图标 */
.RainbowAnimationSwitcher[aria-checked='true'] .animated {
  opacity: 1;
}

/* 滑块位置偏移 */
.RainbowAnimationSwitcher[aria-checked='false'] :deep(.RainbowSwitcherCheck) {
  transform: translateX(18px);
}
</style>
