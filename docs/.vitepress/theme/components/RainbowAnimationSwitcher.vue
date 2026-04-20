<script lang="ts" setup>
import { computed, watch, ref, onMounted } from 'vue'
import RainbowSwitcher from './RainbowSwitcher.vue'

defineProps<{ text?: string, screenMenu?: boolean }>()

const inBrowser = typeof window !== 'undefined'
const reduceMotion = ref(false)
const animated = ref(true)

onMounted(() => {
  if (inBrowser) {
    reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stored = localStorage.getItem('animate-rainbow')
    if (stored !== null) {
      animated.value = stored === 'true'
    } else {
      animated.value = !reduceMotion.value
    }
  }
})

function toggleRainbow() {
  animated.value = !animated.value
  if (inBrowser) {
    localStorage.setItem('animate-rainbow', String(animated.value))
  }
}

watch(animated, (anim) => {
  if (!inBrowser) return
  document.documentElement.classList.add('rainbow')
  if (anim) {
    document.documentElement.classList.remove('rainbow')
  }
}, { immediate: true, flush: 'post' })

const switchTitle = computed(() => {
  return animated.value
    ? 'Rainbow Animation: Disable rainbow animation'
    : 'Rainbow Animation: Enable rainbow animation'
})
</script>

<template>
  <ClientOnly>
    <div class="NavScreenRainbowAnimation">
      <RainbowSwitcher :title="switchTitle" class="RainbowAnimationSwitcher" :aria-checked="animated ? 'true' : 'false'"
        @click="toggleRainbow">
        <span class="i-tabler:rainbow-off non-animated" />
        <span class="i-tabler:rainbow animated" />
      </RainbowSwitcher>
    </div>
  </ClientOnly>
</template>

<style scoped>
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

.RainbowAnimationSwitcher[aria-checked='false'] .non-animated {
  opacity: 1;
}

.RainbowAnimationSwitcher[aria-checked='true'] .animated {
  opacity: 1;
}

.RainbowAnimationSwitcher[aria-checked='false'] :deep(.RainbowSwitcherCheck) {
  transform: translateX(18px);
}
</style>
