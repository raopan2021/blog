<template>
  <div class="header">
    <div class="header-inner">
      <div class="logo">🎮 二手显卡行情</div>
      <div class="nav">
        <a
          v-for="item in navItems"
          :key="item.key"
          :class="{ active: view === item.key }"
          @click="$emit('switch', item.key)"
        >{{ item.label }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ view: String })
defineEmits(['switch'])

const navItems = [
  { key: 'rank', label: '🏆 跑分榜' },
  { key: 'browse', label: '📋 数据浏览' },
  { key: 'about', label: 'ℹ️ 关于' },
]
</script>
