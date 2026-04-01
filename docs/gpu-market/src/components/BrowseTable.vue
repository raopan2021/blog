<template>
  <div class="card">
    <div class="card-header">
      <span class="card-title">📋 完整数据（逐月价格明细）</span>
      <span style="font-size:12px;color:#64748b">共 {{ gpus.length }} 张</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>显卡型号</th>
            <th>品牌</th>
            <th>显存</th>
            <th>TDP</th>
            <th>跑分</th>
            <th>2025年12月</th>
            <th>2026年1月</th>
            <th>2026年2月</th>
            <th>2026年3月</th>
            <th>3月涨幅</th>
            <th>翻车风险</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="gpu in gpus" :key="gpu.name">
            <td class="name-cell">{{ gpu.name }}</td>
            <td><span :class="'brand-' + gpu.brand.toLowerCase()">{{ gpu.brand }}</span></td>
            <td style="color:#94a3b8">{{ gpu.vram }}</td>
            <td style="color:#94a3b8">{{ gpu.tdp }}W</td>
            <td style="color:#fbbf24">{{ gpu.score.toLocaleString() }}</td>
            <td class="price">{{ fmtPrice(gpu.prices['2025年12月']) }}</td>
            <td class="price">{{ fmtPrice(gpu.prices['2026年1月']) }}</td>
            <td class="price">{{ fmtPrice(gpu.prices['2026年2月']) }}</td>
            <td class="price">{{ fmtPrice(gpu.prices['2026年3月']) }}</td>
            <td><span :class="changeBadgeClass(gpu)">{{ getChange(gpu) }}</span></td>
            <td v-html="renderStars(gpu.stars)"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="page-info">共 {{ gpus.length }} 张显卡</div>
  </div>
</template>

<script setup>
defineProps({ gpus: Array })

function fmtPrice(v) { return v ? '¥' + v.toLocaleString() : '-' }
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
function renderStars(stars) {
  if (!stars && stars !== 0) return '-'
  const full = Math.max(0, Math.min(5, Math.round(stars)))
  const empty = 5 - full
  return '<span style="color:#fbbf24">' + '★'.repeat(full) + '</span><span style="color:#334155">' + '☆'.repeat(empty) + '</span>'
}
</script>
