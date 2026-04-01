<template>
  <div class="trend-layout">
    <!-- 图表区 -->
    <div class="card chart-card">
      <div class="card-header">
        <div class="header-left">
          <span class="card-title">📈 价格走势（近{{ months.length }}个月）</span>
          <span class="card-count">{{ filteredCount }} / {{ totalCount }} 张</span>
        </div>
        <span style="font-size:12px;color:#64748b">筛选全部展示</span>
      </div>
      <div class="card-body">
        <div id="trendChart" ref="chartRef"></div>
      </div>
    </div>

    <!-- 显卡选择器（全部显卡列表） -->
    <div class="card selector-card">
      <div class="card-header">
        <div class="header-left">
          <span class="card-title">🖱️ 选择对比显卡</span>
          <span class="card-count">{{ selectedGpuNames.length }} / {{ totalCount }} 张</span>
        </div>
        <div style="display:flex;gap:8px">
          <button class="filter-btn" @click="selectAll" style="font-size:11px;padding:3px 8px">全选</button>
          <button class="filter-btn" @click="clearAll" style="font-size:11px;padding:3px 8px">清空</button>
        </div>
      </div>
      <div class="card-body" style="padding:8px">
        <div class="gpu-list">
          <div
            v-for="gpu in gpus"
            :key="gpu.name"
            class="gpu-item"
            :class="{ selected: selectedGpuNames.includes(gpu.name) }"
            @click="toggleGpu(gpu.name)"
          >
            <div class="gpu-item-left">
              <span class="gpu-item-name">{{ gpu.name }}</span>
              <span class="gpu-item-score">{{ gpu.score.toLocaleString() }}分 · {{ gpu.brand }}</span>
            </div>
            <span class="gpu-item-price">¥{{ getLatestPrice(gpu).toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  gpus: Array,
  months: Array,
  selectedGpuNames: Array,
  filteredCount: Number,
  totalCount: Number,
  priceRange: { type: String, default: '' },
})

const emit = defineEmits(['update:selectedGpuNames'])

const chartRef = ref(null)
let chartInstance = null

function getLatestPrice(gpu) {
  return gpu.prices['2026年3月'] || gpu.prices['2026年2月'] || gpu.prices['2026年1月'] || gpu.prices['2025年12月'] || 0
}

function toggleGpu(name) {
  const list = [...props.selectedGpuNames]
  const idx = list.indexOf(name)
  if (idx >= 0) list.splice(idx, 1)
  else list.push(name)
  emit('update:selectedGpuNames', list)
}

function selectAll() {
  emit('update:selectedGpuNames', props.gpus.map(g => g.name))
}

function clearAll() {
  emit('update:selectedGpuNames', [])
}

function initChart() {
  if (!chartRef.value) return
  if (chartInstance) { chartInstance.dispose(); chartInstance = null }
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function buildSeries(mons) {
  const palette = [
    '#60a5fa','#f87171','#34d399','#fbbf24','#a78bfa',
    '#f472b6','#38bdf8','#fb923c','#4ade80','#f97316',
    '#e879f9','#22d3ee','#facc15','#2dd4bf','#fb7185',
  ]

  const gpuNames = props.selectedGpuNames
  const n = gpuNames.length

  // 计算每个 GPU 的最终价格，用于标签垂直错开
  const finalPrices = gpuNames.map(name => {
    const gpu = props.gpus.find(g => g.name === name)
    return gpu ? (getLatestPrice(gpu)) : 0
  })

  // 计算标签垂直偏移：价格接近的相邻 GPU 错开
  const offsets = new Array(n).fill(0)
  const OFFSET_PIXELS = 22  // 每级错开的像素数
  const PRICE_PROXIMITY_THRESHOLD = 0.08  // 价格差距 < 8% 认为是接近
  for (let i = 1; i < n; i++) {
    const maxPrice = Math.max(finalPrices[i], finalPrices[i - 1])
    if (maxPrice === 0) continue
    const proximity = Math.abs(finalPrices[i] - finalPrices[i - 1]) / maxPrice
    if (proximity < PRICE_PROXIMITY_THRESHOLD) {
      offsets[i] = offsets[i - 1] + 1
    } else {
      offsets[i] = Math.max(0, offsets[i - 1] - 1)
    }
  }

  return gpuNames.map((name, i) => {
    const gpu = props.gpus.find(g => g.name === name)
    if (!gpu) return null
    const color = palette[i % palette.length]
    const rawData = mons.map(m => gpu.prices[m] ?? null)

    let lastIdx = -1
    for (let k = rawData.length - 1; k >= 0; k--) {
      if (rawData[k] != null) { lastIdx = k; break }
    }

    return {
      name,
      type: 'line',
      smooth: true,
      data: rawData,
      lineStyle: { color, width: 1.5 },
      itemStyle: { color },
      connectNulls: true,
      emphasis: { lineStyle: { width: 3 } },
      label: {
        show: true,
        position: 'right',
        formatter: function(p) {
          if (p.dataIndex !== lastIdx || p.value == null) return ''
          return `${name}  ¥${Number(p.value).toLocaleString()}`
        },
        fontSize: 11,
        color,
        offset: [0, offsets[i] * -OFFSET_PIXELS],
      },
    }
  }).filter(Boolean)
}

function calcChartHeight() {
  const lineCount = props.selectedGpuNames.length
  return Math.max(500, lineCount * 55 + 80)
}

function updateChart() {
  if (!chartInstance || !chartRef.value) return
  const mons = props.months
  const gpuNames = props.selectedGpuNames

  // 如果没有选择GPU，显示空状态
  if (!gpuNames || gpuNames.length === 0) {
    chartInstance.clear()
    chartInstance.setOption({
      title: {
        text: '请在右侧选择要对比的显卡',
        left: 'center',
        top: 'center',
        textStyle: { color: '#64748b', fontSize: 14 }
      },
      series: []
    })
    return
  }

  const series = buildSeries(mons)
  // 先设置容器高度，然后resize让chart适应
  const chartHeight = calcChartHeight()
  chartRef.value.style.height = chartHeight + 'px'
  chartInstance.resize({ height: chartHeight })

  // 动态 right padding
  const maxLabelLen = gpuNames.reduce((m, n) => Math.max(m, n.length), 0)
  const rightPad = Math.max(180, maxLabelLen * 13 + 80)

  chartInstance.setOption({
    backgroundColor: 'transparent',
    animation: true,
    title: { show: false },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0' },
      formatter: params => {
        if (!params.length) return ''
        let html = `<div style="font-weight:700;margin-bottom:6px;font-size:13px">${params[0].axisValue}</div>`
        params.forEach(p => {
          if (p.value != null) {
            html += `<div style="display:flex;justify-content:space-between;gap:20px;margin:2px 0"><span style="color:${p.color}">● ${p.seriesName}</span><span style="font-weight:600">¥${Number(p.value).toLocaleString()}</span></div>`
          }
        })
        return html
      }
    },
    legend: { show: false },
    grid: { top: 20, right: rightPad, bottom: 40, left: 80, containLabel: true },
    xAxis: {
      type: 'category',
      data: mons,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8', fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#64748b', fontSize: 11, formatter: v => '¥' + (v >= 1000 ? v / 1000 + 'k' : v) },
    },
    series,
  }, { notMerge: true })
}

let resizeHandler = null

// 价格筛选变化时重绘图表（Y轴范围、图表高度）
watch(() => props.priceRange, () => {
  if (chartInstance) updateChart()
})

// GPU 选择变化时重绘图表
watch(() => [props.selectedGpuNames, props.gpus], () => {
  if (chartInstance) updateChart()
}, { deep: false })

onMounted(() => {
  setTimeout(initChart, 50)
  resizeHandler = () => chartInstance && chartInstance.resize()
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
  if (chartInstance) { chartInstance.dispose(); chartInstance = null }
})

defineExpose({ updateChart, initChart })
</script>

<style lang="scss" scoped>
.trend-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
}

#trendChart {
  width: 100%;
  height: 600px;
  transition: height 0.3s;
}

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

.filter-btn {
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid #2d3748;
  background: #141824;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #60a5fa; color: #60a5fa; }
}

@media (max-width: 1024px) {
  .trend-layout { grid-template-columns: 1fr; }
}
</style>
