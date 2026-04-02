<template>
  <div class="card">
    <div class="card-header">
      <div class="header-left">
        <span class="card-title">📋 完整数据（逐月价格明细）</span>
        <span class="card-count">{{ filteredCount }} / {{ totalCount }} 张</span>
      </div>
      <span style="font-size:12px;color:#64748b">Time Spy 跑分 · 性价比 = 跑分÷价格 · 能耗比 = 跑分÷TDP</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th title="显卡型号">型号</th>
            <th title="NVIDIA / AMD / Intel">品牌</th>
            <th title="显存容量">显存</th>
            <th title="热设计功耗（瓦特）">TDP</th>
            <th title="3DMark Time Spy 分数，衡量GPU综合性能">跑分 ↕</th>
            <th title="相对RTX 5060(13619分)的性能百分比">性能%</th>
            <!-- 动态月份表头 -->
            <th
              v-for="month in months"
              :key="month"
              :title="`${month}二手价格（元）`"
            >{{ month.replace('年', '年').replace('月', '月') }}</th>
            <!-- 涨幅列：显示最新月份的涨跌幅 -->
            <th :title="`${latestMonth}相比${prevMonth}的变化（+涨/-跌）`">{{ latestMonth }}涨幅</th>
            <th title="跑分÷价格，≥7绿/5-7蓝/3-5黄/<3红">性价比</th>
            <th title="跑分÷TDP，数值越大越省电">能耗比</th>
            <th title="基于架构/矿卡历史评估，★越多翻车概率越高">翻车风险</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="gpu in gpus" :key="gpu.name">
            <td class="name-cell">{{ gpu.name }}</td>
            <td><span :class="'brand-' + gpu.brand.toLowerCase()">{{ gpu.brand }}</span></td>
            <td style="color:#94a3b8">{{ gpu.vram }}</td>
            <td style="color:#94a3b8">{{ gpu.tdp }}W</td>
            <td style="color:#fbbf24">{{ gpu.score.toLocaleString() }}</td>
            <td style="color:#a78bfa">{{ gpu.performance_pct }}%</td>
            <!-- 动态月份价格列 -->
            <td v-for="month in months" :key="month" class="price">{{ fmtPrice(gpu.prices[month]) }}</td>
            <!-- 涨幅列 -->
            <td><span :class="changeBadgeClass(gpu)">{{ getChange(gpu) }}</span></td>
            <td :class="costPerfClass(gpu.cost_perf)">{{ gpu.cost_perf || '-' }}</td>
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
import { computed } from 'vue'

const props = defineProps({
  gpus: Array,
  months: Array,
  filteredCount: Number,
  totalCount: Number,
})

// 计算最新月份（用于涨幅列）和上一个月
const latestMonth = computed(() => {
  if (!props.months || props.months.length === 0) return ''
  return props.months[props.months.length - 1]
})

const prevMonth = computed(() => {
  if (!props.months || props.months.length < 2) return ''
  return props.months[props.months.length - 2]
})

function fmtPrice(v) { return v ? '¥' + v.toLocaleString() : '-' }

function getChange(gpu) {
  const c = gpu.changes[latestMonth.value]
  if (!c && c !== 0) return '-'
  return (c > 0 ? '+' : '') + c
}

function changeBadgeClass(gpu) {
  const c = gpu.changes[latestMonth.value]
  if (!c && c !== 0) return 'change-badge flat'
  return c > 0 ? 'change-badge up' : c < 0 ? 'change-badge down' : 'change-badge flat'
}

function costPerfClass(v) {
  if (!v) return ''
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
</style>
