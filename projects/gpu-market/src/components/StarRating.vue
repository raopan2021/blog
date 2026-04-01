<template>
  <span :class="colorClass" v-html="starsHtml"></span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stars: {
    type: Number,
    default: 0
  }
})

const starsHtml = computed(() => {
  const full = Math.max(0, Math.min(5, Math.round(props.stars)))
  const empty = 5 - full
  return '<span style="color:#fbbf24">' + '★'.repeat(full) + '</span><span style="color:#334155">' + '☆'.repeat(empty) + '</span>'
})

const colorClass = computed(() => '')
</script>
