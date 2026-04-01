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
      :filtered-count="filteredGpus.length"
      :total-count="gpus.length"
      @sort-change="rankSort = $event"
    />

    <!-- 价格趋势 -->
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
const trendChartRef = ref(null)

// 默认展示筛选结果前8张（趋势图）
const selectedGpuNames = ref([])

// 初始化 selectedGpuNames 为前8张
function initSelectedGpus() {
  selectedGpuNames.value = filteredGpus.value.slice(0, 8).map(g => g.name)
}

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

// 筛选变化时，更新图表默认选中的 GPU
watch(filteredGpus, (newList) => {
  // 保留已选的，移除已选但不在新列表中的
  const validNames = newList.map(g => g.name)
  selectedGpuNames.value = selectedGpuNames.value.filter(n => validNames.includes(n))
  // 如果不够8个，补充新的
  if (selectedGpuNames.value.length < 8) {
    const extra = newList.filter(g => !selectedGpuNames.value.includes(g.name)).slice(0, 8 - selectedGpuNames.value.length)
    selectedGpuNames.value.push(...extra.map(g => g.name))
  }
  // 刷新图表
  if (view.value === 'trend') {
    nextTick(() => trendChartRef.value?.updateChart())
  }
}, { deep: false })

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
        if (!selectedGpuNames.value.length) initSelectedGpus()
        trendChartRef.value?.initChart()
      })
    })
  }
}

// 初始化
initSelectedGpus()
</script>
