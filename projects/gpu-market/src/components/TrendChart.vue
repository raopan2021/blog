<template>
  <div class="trend-layout">
    <div class="card chart-card">
      <div class="card-header">
        <span class="card-title">📈 价格走势（近{{ months.length }}个月）</span>
        <span style="font-size:12px;color:#64748b">展示筛选结果 · 最多8张</span>
      </div>
      <div class="card-body">
        <div id="trendChart" ref="chartRef"></div>
      </div>
    </div>

    <div class="card selector-card">
      <div class="card-header">
        <span class="card-title">🖱️ 选择对比显卡</span>
        <span style="font-size:12px;color:#64748b">已选 {{ selectedGpuNames.length }}/8</span>
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
  else { if (list.length >= 8) list.shift(); list.push(name) }
  emit('update:selectedGpuNames', list)
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
  const palette = ['#60a5fa', '#f87171', '#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#38bdf8', '#fb923c']

  const series = props.selectedGpuNames.map((name, i) => {
    const gpu = props.gpus.find(g => g.name === name)
    if (!gpu) return null
    return {
      name,
      type: 'line',
      smooth: true,
      data: mons.map(m => gpu.prices[m] || null),
      lineStyle: { color: palette[i % palette.length], width: 2 },
      itemStyle: { color: palette[i % palette.length] },
      connectNulls: true,
    }
  }).filter(Boolean)

  chartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0' },
      formatter: params => {
        let html = `<div style="font-weight:600;margin-bottom:6px">${params[0].axisValue}</div>`
        params.forEach(p => {
          if (p.value !== null) {
            html += `<div style="display:flex;justify-content:space-between;gap:16px"><span style="color:${p.color}">${p.seriesName}</span><span style="font-weight:600">¥${Number(p.value).toLocaleString()}</span></div>`
          }
        })
        return html
      }
    },
    legend: { bottom: 0, textStyle: { color: '#94a3b8', fontSize: 12 }, itemWidth: 16 },
    grid: { top: 10, right: 80, bottom: 50, left: 60 },
    xAxis: { type: 'category', data: mons, axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#94a3b8' } },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: {
        color: '#64748b',
        formatter: v => '¥' + (v >= 1000 ? v / 1000 + 'k' : v)
      },
    },
    series,
  }, true)
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
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

#trendChart {
  width: 100%;
  height: 420px;
}

@media (max-width: 1024px) {
  .trend-layout {
    grid-template-columns: 1fr;
  }
}
</style>
