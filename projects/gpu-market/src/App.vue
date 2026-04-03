<template>
  <div class="container">
    <StatsBar
      :total-count="gpus.length"
      :filtered-count="filteredCount"
      :avg-change="avgChangePerGpu"
      :brand-filter="brandFilter"
      :price-range="priceRange"
      :search-text="searchText"
      :latest-month="latestMonth"
      @brand-change="brandFilter = $event"
      @price-change="priceRange = $event"
      @search-change="searchText = $event"
    />

    <BrowseTable
      :all-gpus="gpus"
      :months="months"
      :brand-filter="brandFilter"
      :price-range="priceRange"
      :search-text="searchText"
      :rank-sort="rankSort"
      :latest-month="latestMonth"
      @sort-change="rankSort = $event"
    />

    <AboutSection :gpus="gpus" :months="months" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StatsBar from './components/StatsBar.vue'
import BrowseTable from './components/BrowseTable.vue'
import AboutSection from './components/AboutSection.vue'
import { gpus, months } from './data.js'

const brandFilter = ref('')
const priceRange = ref('')
const searchText = ref('')
const rankSort = ref('score')

const latestMonth = computed(() => {
  if (!months || months.length === 0) return ''
  return months[months.length - 1]
})

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
        return (min === 0 || p >= min) && (max === 0 || p <= max)
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

const filteredCount = computed(() => filteredGpus.value.length)

const avgChangePerGpu = computed(() => {
  if (!filteredGpus.value.length) return 0
  const total = filteredGpus.value.reduce((sum, g) => {
    const c = g.changes[latestMonth.value]
    return sum + (typeof c === 'number' ? c : 0)
  }, 0)
  return Math.round(total / filteredGpus.value.length)
})
</script>
