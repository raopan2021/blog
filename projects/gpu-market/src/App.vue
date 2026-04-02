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
      :latest-month="latestMonth"
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
      :latest-month="latestMonth"
      @sort-change="rankSort = $event"
    />

    <!-- 数据浏览 -->
    <BrowseTable
      v-if="view === 'browse'"
      :gpus="filteredGpus"
      :months="months"
      :filtered-count="filteredGpus.length"
      :total-count="gpus.length"
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
import { ref, computed } from 'vue'
import Header from './components/Header.vue'
import StatsBar from './components/StatsBar.vue'
import RankTable from './components/RankTable.vue'
import BrowseTable from './components/BrowseTable.vue'
import AboutSection from './components/AboutSection.vue'
import { gpus, months } from './data.js'

const view = ref('rank')
const brandFilter = ref('')
const priceRange = ref('')
const searchText = ref('')
const rankSort = ref('score')

// 最新月份（用于显示价格、涨幅等）
const latestMonth = computed(() => {
  if (!months || months.length === 0) return ''
  return months[months.length - 1]
})

// 上一个月份（用于计算涨幅）
const prevMonth = computed(() => {
  if (!months || months.length < 2) return ''
  return months[months.length - 2]
})

// 获取显卡的最新可用价格
function getLatestPrice(gpu) {
  if (!latestMonth.value) return 0
  return gpu.prices[latestMonth.value] || 0
}

const filteredGpus = computed(() => {
  let list = [...gpus]
  if (brandFilter.value) list = list.filter(g => g.brand === brandFilter.value)
  if (priceRange.value) {
    list = list.filter(g => {
      const p = getLatestPrice(g)
      if (priceRange.value === '0-1000') return p < 1000
      if (priceRange.value === '1000-2000') return p >= 1000 && p < 2000
      if (priceRange.value === '2000-3000') return p >= 2000 && p < 3000
      if (priceRange.value === '3000-4000') return p >= 3000 && p < 4000
      if (priceRange.value === '4000-5000') return p >= 4000 && p < 5000
      if (priceRange.value === '5000+') return p >= 5000
      const custom = priceRange.value.match(/^custom:(\d+)-(\d+)$/)
      if (custom) {
        const min = parseInt(custom[1]) || 0
        const max = parseInt(custom[2]) || 0
        const above = min === 0 || p >= min
        const below = max === 0 || p <= max
        return above && below
      }
      return true
    })
  }
  if (searchText.value) {
    const kw = searchText.value.toLowerCase()
    list = list.filter(g => g.name.toLowerCase().includes(kw))
  }
  return list
})

const avgChangePerGpu = computed(() => {
  if (!filteredGpus.value.length) return 0
  const total = filteredGpus.value.reduce((sum, g) => {
    const c = g.changes[latestMonth.value]
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

function switchView(v) {
  view.value = v
}
</script>
