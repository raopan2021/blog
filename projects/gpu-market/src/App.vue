<template>
  <Header :view="view" @switch="switchView" />

  <div class="container">
    <StatsBar
      :total-count="gpus.length"
      :filtered-count="filteredGpus.length"
      :avg-change="avgChangePerGpu"
      :brand-filter="brandFilter"
      :price-range="priceRange"
      :search-text="searchText"
      @brand-change="brandFilter = $event"
      @price-change="priceRange = $event"
      @search-change="searchText = $event"
    />

    <!-- 跑分榜 -->
    <RankTable
      v-if="view === 'rank'"
      :gpus="sortedGpus"
      :rank-sort="rankSort"
      @sort-change="rankSort = $event"
    />

    <!-- 价格趋势：始终渲染，图表用 expose 方法刷新 -->
    <TrendChart
      v-if="view === 'trend'"
      ref="trendChartRef"
      :gpus="filteredGpus"
      :months="months"
      :selected-gpu-names="selectedGpuNames"
      @update:selectedGpuNames="selectedGpuNames = $event"
    />

    <!-- 数据浏览 -->
    <BrowseTable
      v-if="view === 'browse'"
      :gpus="filteredGpus"
    />

    <!-- 关于 -->
    <AboutSection
      v-if="view === 'about'"
      :gpus="gpus"
      :months="months"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import Header from './components/Header.vue'
import StatsBar from './components/StatsBar.vue'
import RankTable from './components/RankTable.vue'
import TrendChart from './components/TrendChart.vue'
import BrowseTable from './components/BrowseTable.vue'
import AboutSection from './components/AboutSection.vue'
import { gpus, months } from './data.js'

const view = ref('trend')
const brandFilter = ref('')
const priceRange = ref('')
const searchText = ref('')
const rankSort = ref('score')
const selectedGpuNames = ref(['RTX 5060', 'RX 9070 GRE', 'RTX 4070', 'RX 9060 XT 8G', 'RTX 5070'])
const trendChartRef = ref(null)

const filteredGpus = computed(() => {
  let list = [...gpus]
  if (brandFilter.value) list = list.filter(g => g.brand === brandFilter.value)
  if (priceRange.value) {
    list = list.filter(g => {
      const p = g.prices['2026年3月'] || g.prices['2026年2月'] || g.prices['2026年1月'] || g.prices['2025年12月'] || 0
      if (priceRange.value === '0-1000') return p < 1000
      if (priceRange.value === '1000-2000') return p >= 1000 && p < 2000
      if (priceRange.value === '2000-3000') return p >= 2000 && p < 3000
      if (priceRange.value === '3000+') return p >= 3000
      return true
    })
  }
  if (searchText.value) {
    const kw = searchText.value.toLowerCase()
    list = list.filter(g => g.name.toLowerCase().includes(kw))
  }
  return list
})

// 每张显卡平均价格变化
const avgChangePerGpu = computed(() => {
  if (!filteredGpus.value.length) return 0
  const total = filteredGpus.value.reduce((sum, g) => {
    const c = g.changes['2026年3月']
    return sum + (typeof c === 'number' ? c : 0)
  }, 0)
  return Math.round(total / filteredGpus.value.length)
})

const sortedGpus = computed(() => {
  const list = [...filteredGpus.value]
  if (rankSort.value === 'score') list.sort((a, b) => b.score - a.score)
  else if (rankSort.value === 'price') list.sort((a, b) => getLatestPrice(b) - getLatestPrice(a))
  else if (rankSort.value === 'efficiency') list.sort((a, b) => (b.efficiency || 0) - (a.efficiency || 0))
  return list
})

function getLatestPrice(gpu) {
  return gpu.prices['2026年3月'] || gpu.prices['2026年2月'] || gpu.prices['2026年1月'] || gpu.prices['2025年12月'] || 0
}

function switchView(v) {
  view.value = v
  if (v === 'trend') {
    nextTick(() => {
      nextTick(() => {
        trendChartRef.value?.initChart()
      })
    })
  }
}
</script>
