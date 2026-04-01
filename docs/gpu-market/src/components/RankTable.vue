<template>
  <div class="card">
    <div class="card-header">
      <span class="card-title">🏆 显卡跑分排行榜（Time Spy，RTX 5060 = 100%）</span>
      <div class="view-toggle">
        <button
          v-for="opt in sortOptions"
          :key="opt.value"
          class="view-btn"
          :class="{ active: rankSort === opt.value }"
          @click="$emit('sortChange', opt.value)"
        >{{ opt.label }}</button>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:40px;color:#475569">#</th>
            <th>显卡型号</th>
            <th>品牌</th>
            <th>显存</th>
            <th>TDP</th>
            <th>跑分</th>
            <th>性能%</th>
            <th>3月价格</th>
            <th>3月涨幅</th>
            <th>性价比</th>
            <th>能耗比</th>
            <th>翻车风险</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(gpu, idx) in gpus" :key="gpu.name">
            <td style="color:#475569">{{ idx + 1 }}</td>
            <td class="name-cell">{{ gpu.name }}</td>
            <td><span :class="'brand-' + gpu.brand.toLowerCase()">{{ gpu.brand }}</span></td>
            <td style="color:#94a3b8">{{ gpu.vram }}</td>
            <td style="color:#94a3b8">{{ gpu.tdp }}W</td>
            <td style="color:#fbbf24;font-weight:700">{{ gpu.score.toLocaleString() }}</td>
            <td style="color:#a78bfa">{{ gpu.performance_pct }}%</td>
            <td class="price">¥{{ getLatestPrice(gpu).toLocaleString() }}</td>
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
defineProps({
  gpus: Array,
  rankSort: String,
})

defineEmits(['sortChange'])

const sortOptions = [
  { value: 'score', label: '按跑分' },
  { value: 'price', label: '按价格' },
  { value: 'efficiency', label: '按能效' },
]

function getLatestPrice(gpu) {
  return gpu.prices['2026年3月'] || gpu.prices['2026年2月'] || gpu.prices['2026年1月'] || gpu.prices['2025年12月'] || 0
}

function getChange(gpu) {
  const c = gpu.changes['2026年3月']
  if (!c && c !== 0) return '-'
  return (c > 0 ? '+' : '') + c
}

function changeBadgeClass(gpu) {
  const c = gpu.changes['2026年3月']
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
