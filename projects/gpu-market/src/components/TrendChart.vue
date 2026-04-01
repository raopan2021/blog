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
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  gpus: Array,
  months: Array,
  selectedGpuNames: Array,
  filteredCount: Number,
  totalCount: Number,
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

function updateChart() {
  if (!chartInstance) return
  const mons = props.months
  // 动态颜色池
  const palette = [
    '#60a5fa','#f87171','#34d399','#fbbf24','#a78bfa',
    '#f472b6','#38bdf8','#fb923c','#4ade80','#f97316',
    '#e879f9','#22d3ee','#facc15','#2dd4bf','#fb7185',
  ]

  const series = props.selectedGpuNames.map((name, i) => {
    const gpu = props.gpus.find(g => g.name === name)
    if (!gpu) return null
    const color = palette[i % palette.length]
    const latestPrice = getLatestPrice(gpu)
    return {
      name,
      type: 'line',
      smooth: true,
      data: mons.map(m => gpu.prices[m] || null),
      lineStyle: { color, width: 1.5 },
      itemStyle: { color },
      connectNulls: true,
      emphasis: { lineStyle: { width: 3 } },
      // 折线末端标注型号+价格
      markPoint: undefined,
      // 使用 lineLabel 在折线末端显示
      label: {
        show: true,
        position: 'end',
        formatter: () => `{name|${name}}  ¥${latestPrice.toLocaleString()}`,
        rich: {
          name: { fontSize: 11, color: color, fontWeight: 600, lineHeight: 16 },
        },
        distance: 10,
        fontSize: 11,
        color: color,
      },
    }
  }).filter(Boolean)

  // 动态计算高度：每条线需要一定空间
  const lineCount = props.selectedGpuNames.length
  const baseHeight = 420
  const perLineHeight = 18
  const chartHeight = Math.max(baseHeight, lineCount * perLineHeight + 80)

  if (chartRef.value) chartRef.value.style.height = chartHeight + 'px'

  chartInstance.setOption({
    backgroundColor: 'transparent',
    animation: true,
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0' },
      formatter: params => {
        if (!params.length) return ''
        let html = `<div style="font-weight:700;margin-bottom:6px;font-size:13px">${params[0].axisValue}</div>`
        params.forEach(p => {
          if (p.value !== null && p.value !== undefined) {
            html += `<div style="display:flex;justify-content:space-between;gap:20px;margin:2px 0"><span style="color:${p.color}">● ${p.seriesName}</span><span style="font-weight:600">¥${Number(p.value).toLocaleString()}</span></div>`
          }
        })
        return html
      }
    },
    legend: { show: false }, // 隐藏legend，用lineLabel代替
    grid: { top: 20, right: Math.max(160, props.selectedGpuNames.reduce((max, name) => Math.max(max, name.length * 14 + 80), 160)), bottom: 40, left: 60 },
    xAxis: { type: 'category', data: mons, axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#94a3b8', fontSize: 12 } },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#64748b', fontSize: 11, formatter: v => '¥' + (v >= 1000 ? v / 1000 + 'k' : v) },
    },
    series,
  }, true)

  chartInstance.resize()
}

let resizeHandler = null

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
  height: 420px;
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
