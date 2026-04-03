<template>
  <div class="card">
    <div class="card-header">
      <span class="card-count">{{ gpus.length }} 张</span>
      <div class="view-toggle">
        <button
          v-for="s in sortOptions"
          :key="s.value"
          class="view-btn"
          :class="{ active: rankSort === s.value }"
          @click="toggleSort(s.value)"
        >
          {{ s.label }}
          <template v-if="rankSort === s.value">
            <span v-if="sortOrder === 'asc'" class="order-arrow asc">▲</span>
            <span v-else class="order-arrow desc">▼</span>
          </template>
        </button>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th title="显卡型号">型号</th>
            <th title="NVIDIA / AMD / Intel">品牌</th>
            <th title="显存容量">显存</th>
            <th title="热设计功耗（瓦特）">TDP</th>
            <th title="3DMark Time Spy 分数">跑分 ↕</th>
            <th title="相对RTX 5060(13619分)的性能百分比">性能%</th>
            <th
              v-for="month in displayMonths"
              :key="month"
              :title="`${month}二手价格（元）`"
            >{{ month }}</th>
            <th title="跑分÷价格，≥7绿/5-7蓝/3-5黄/<3红">性价比</th>
            <th title="跑分÷TDP，数值越大越省电">能耗比</th>
            <th title="基于架构/矿卡历史评估，★越多翻车概率越高">翻车风险</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="gpu in sortedGpus" :key="gpu.name">
            <td :class="'name-cell brand-color-' + gpu.brand.toLowerCase()">{{ gpu.name }}</td>
            <td><span :class="'brand-' + gpu.brand.toLowerCase()">{{ gpu.brand }}</span></td>
            <td style="color:#94a3b8">{{ gpu.vram }}</td>
            <td style="color:#94a3b8">{{ gpu.tdp }}W</td>
            <td style="color:#fbbf24">{{ gpu.score.toLocaleString() }}</td>
            <td style="color:#a78bfa">{{ gpu.performance_pct }}%</td>
            <td v-for="month in displayMonths" :key="month"
              :class="priceCellClass(gpu, month)"
              :style="priceCellStyle(gpu, month)"
              v-html="priceCellText(gpu, month)">
            </td>
            <td :class="costPerfClass(gpu)">{{ costPerfValue(gpu) }}</td>
            <td style="color:#22d3ee">{{ gpu.efficiency || '-' }}</td>
            <td v-html="renderStars(gpu.stars)"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="page-info">共 {{ gpus.length }} 张显卡</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  allGpus: Array,
  months: Array,
  brandFilter: String,
  priceRange: String,
  searchText: String,
  latestMonth: String,
})

const rankSort = ref('score') // 默认按跑分
const sortOrder = ref('desc') // 默认降序

function toggleSort(value) {
  if (rankSort.value === value) {
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  } else {
    rankSort.value = value
    sortOrder.value = 'desc' // 切换维度时重置为降序
  }
}

const sortOptions = [
  { value: 'score', label: '按跑分' },
  { value: 'price', label: '按价格' },
  { value: 'efficiency', label: '按能效' },
]

// 默认显示最近6个月
const displayMonths = computed(() => {
  if (!props.months || props.months.length === 0) return []
  return props.months.slice(-6)
})

const gpus = computed(() => {
  let list = [...props.allGpus]
  if (props.brandFilter) list = list.filter(g => g.brand === props.brandFilter)
  if (props.priceRange) {
    list = list.filter(g => {
      const p = g.prices[props.latestMonth] || 0
      if (props.priceRange === '0-1000') return p < 1000
      if (props.priceRange === '1000-2000') return p >= 1000 && p < 2000
      if (props.priceRange === '2000-3000') return p >= 2000 && p < 3000
      if (props.priceRange === '3000-4000') return p >= 3000 && p < 4000
      if (props.priceRange === '4000-5000') return p >= 4000 && p < 5000
      if (props.priceRange === '5000+') return p >= 5000
      const m = props.priceRange.match(/^custom:(\d+)-(\d+)$/)
      if (m) {
        const min = parseInt(m[1]) || 0
        const max = parseInt(m[2]) || 0
        return (min === 0 || p >= min) && (max === 0 || p <= max)
      }
      return true
    })
  }
  if (props.searchText) {
    const kw = props.searchText.toLowerCase()
    list = list.filter(g => g.name.toLowerCase().includes(kw))
  }
  return list
})

function fmtPrice(v) { return v ? v.toLocaleString() : '-' }

function getMonthPrice(gpu, month) { return gpu.prices[month] || 0 }

function priceCellClass(gpu, month) {
  const priceValues = displayMonths.value
    .map(m => gpu.prices[m])
    .filter(p => p && p > 0)
  if (priceValues.length < 2) return 'price-default'
  const maxPrice = Math.max(...priceValues)
  const minPrice = Math.min(...priceValues)
  const current = gpu.prices[month]
  if (current === maxPrice) return 'price-high'
  if (current === minPrice) return 'price-low'
  return 'price-default'
}

function priceCellStyle(gpu, month) {
  return {}
}

function priceCellText(gpu, month) {
  const price = gpu.prices[month]
  if (!price) return '-'
  const idx = displayMonths.value.indexOf(month)
  let text = price.toLocaleString()
  // Compare with previous month in display order
  if (idx > 0) {
    const prevMonth = displayMonths.value[idx - 1]
    const prevPrice = gpu.prices[prevMonth]
    if (prevPrice && prevPrice > 0 && price > prevPrice) {
      text += ' <span class="trend-up">▲</span>'
    } else if (prevPrice && prevPrice > 0 && price < prevPrice) {
      text += ' <span class="trend-down">▼</span>'
    }
  }
  return text
}

function costPerfValue(gpu) {
  const price = gpu.prices[props.latestMonth]
  if (!price) return '-'
  const cp = gpu.score / price
  return cp.toFixed(2)
}

function costPerfClass(gpu) {
  const price = gpu.prices[props.latestMonth]
  if (!price) return ''
  const v = gpu.score / price
  if (v >= 7) return 'cp-green'
  if (v >= 5) return 'cp-blue'
  if (v >= 3) return 'cp-yellow'
  return 'cp-red'
}

function renderStars(stars) {
  if (!stars && stars !== 0) return '-'
  const full = Math.max(0, Math.min(5, Math.round(stars)))
  const empty = 5 - full
  return '<span style="color:#fbbf24">' + '★'.repeat(full) + '</span><span style="color:#334155">' + '☆'.repeat(empty) + '</span>'
}

const sortedGpus = computed(() => {
  const list = [...gpus.value]
  const asc = sortOrder.value === 'asc' ? 1 : -1
  if (rankSort.value === 'score') {
    list.sort((a, b) => (b.score - a.score) * asc)
  } else if (rankSort.value === 'price') {
    list.sort((a, b) => ((b.prices[props.latestMonth] || 0) - (a.prices[props.latestMonth] || 0)) * asc)
  } else if (rankSort.value === 'efficiency') {
    list.sort((a, b) => ((b.efficiency || 0) - (a.efficiency || 0)) * asc)
  }
  return list
})
</script>

<style lang="scss" scoped>
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-count {
  padding: 2px 10px;
  background: rgba(#60a5fa, 0.12);
  border: 1px solid rgba(#60a5fa, 0.3);
  border-radius: 20px;
  font-size: 11px;
  color: #60a5fa;
  font-weight: 600;
}

th[title] { cursor: help; }

.name-cell {
  font-weight: 600;
  &.brand-color-nvidia { color: #77b255; }
  &.brand-color-amd { color: #e43c39; }
  &.brand-color-intel { color: #60a5fa; }
  &.brand-color-other { color: #a78bfa; }
}

.view-toggle {
  display: flex;
  gap: 4px;
}

.view-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #2d3748;
  background: #141824;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover { color: #fff; border-color: #3b82f6; }
  &.active { background: #1e40af; border-color: #3b82f6; color: #fff; }
}

.order-arrow {
  font-size: 10px;
  line-height: 1;
  &.asc { color: #ef4444; }
  &.desc { color: #22c55e; }
}

.price-default { color: #94a3b8; }
.price-high { color: #ef4444; font-weight: 600; }
.price-low { color: #22c55e; font-weight: 600; }
.trend-up { color: #ef4444 !important; }
.trend-down { color: #22c55e !important; }
</style>
