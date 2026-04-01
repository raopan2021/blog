<template>
  <div class="stats-section">
    <!-- 第一行：两个统计卡片 -->
    <div class="stats-bar">
      <div class="stat-card stat-primary">
        <div class="stat-inner">
          <div class="stat-value">{{ filteredCount }}</div>
          <div class="stat-label">当前筛选收录显卡</div>
        </div>
      </div>
      <div class="stat-card" :class="avgChange >= 0 ? 'up' : 'down'">
        <div class="stat-inner">
          <div class="stat-value" :class="avgChange >= 0 ? 'up-num' : 'down-num'">
            {{ avgChange >= 0 ? '+' : '' }}{{ avgChange.toLocaleString() }} 元
          </div>
          <div class="stat-label">3月每张显卡平均价格变化</div>
          <div class="stat-sub" :class="avgChange >= 0 ? 'up-text' : 'down-text'">
            {{ avgChange >= 0 ? '▲ 均价上涨中' : '▼ 均价下降中' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 第二行：筛选栏 + 收录显卡总数 -->
    <div class="filters">
      <div class="filter-group filter-brand">
        <span class="filter-label">品牌:</span>
        <button
          v-for="b in brandOptions"
          :key="b.value"
          class="filter-btn"
          :class="[b.cls, { active: brandFilter === b.value }]"
          @click="$emit('brandChange', b.value)"
        >{{ b.label }}</button>
      </div>
      <div class="filter-group filter-price">
        <span class="filter-label">价格:</span>
        <button
          v-for="p in priceOptions"
          :key="p.value"
          class="filter-btn"
          :class="{ active: priceRange === p.value }"
          @click="$emit('priceChange', p.value)"
        >{{ p.label }}</button>
      </div>
      <div class="filter-group filter-search">
        <input
          class="search-input"
          :value="searchText"
          placeholder="搜索显卡型号..."
          @input="$emit('searchChange', $event.target.value)"
        >
      </div>
      <div class="filter-group filter-total">
        <span class="filter-total-badge">共 {{ totalCount }} 张</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalCount: Number,
  filteredCount: Number,
  avgChange: Number,
  brandFilter: String,
  priceRange: String,
  searchText: String,
})

defineEmits(['brandChange', 'priceChange', 'searchChange'])

const brandOptions = [
  { value: '', label: '全部', cls: '' },
  { value: 'NVIDIA', label: 'NVIDIA', cls: 'nvidia' },
  { value: 'AMD', label: 'AMD', cls: 'amd' },
  { value: 'Intel', label: 'Intel', cls: 'intel' },
]

const priceOptions = [
  { value: '', label: '全部' },
  { value: '0-1000', label: '0~1k' },
  { value: '1000-2000', label: '1k~2k' },
  { value: '2000-3000', label: '2k~3k' },
  { value: '3000+', label: '3k+' },
]
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.stats-section {
  margin-bottom: 24px;
}

.stats-bar {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 16px;
  margin-bottom: 12px;
}

.stat-card {
  background: $bg-secondary;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: 20px 24px;
  transition: border-color 0.2s;

  &:hover { border-color: $accent-blue; }
}

.stat-primary {
  display: flex;
  align-items: center;
}

.stat-inner {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  background: linear-gradient(90deg, $accent-blue, $accent-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.up-num { color: $accent-red; background: none; -webkit-text-fill-color: $accent-red; }
.down-num { color: $accent-green; background: none; -webkit-text-fill-color: $accent-green; }

.stat-label {
  font-size: 13px;
  color: $text-muted;
}

.stat-sub {
  font-size: 12px;
  margin-top: 2px;
}

.up-text { color: $accent-red; }
.down-text { color: $accent-green; }

// Filters
.filters {
  background: $bg-secondary;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: 12px 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 13px;
  color: $text-muted;
  white-space: nowrap;
}

.filter-btn {
  padding: 5px 12px;
  border-radius: $radius-sm;
  border: 1px solid $border-color;
  background: $bg-tertiary;
  color: $text-secondary;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: $accent-blue; color: $accent-blue; }
  &.active { background: #1e40af; border-color: #3b82f6; color: #fff; }
  &.nvidia.active { background: #3d6b27; border-color: #4d8b31; }
  &.amd.active { background: #a52a2a; border-color: #c4322e; }
  &.intel.active { background: #004c8f; border-color: #0065b8; }
}

.search-input {
  padding: 7px 12px;
  border-radius: $radius-sm;
  border: 1px solid $border-color;
  background: $bg-tertiary;
  color: $text-primary;
  font-size: 13px;
  outline: none;
  width: 180px;
  transition: border-color 0.2s;

  &:focus { border-color: $accent-blue; }
  &::placeholder { color: $text-muted; }
}

.filter-total {
  margin-left: auto;
}

.filter-total-badge {
  padding: 5px 12px;
  background: rgba($accent-blue, 0.1);
  border: 1px solid rgba($accent-blue, 0.3);
  border-radius: 20px;
  font-size: 12px;
  color: $accent-blue;
  font-weight: 600;
}

@media (max-width: 768px) {
  .stats-bar { grid-template-columns: 1fr; }
  .filters { gap: 12px; }
}
</style>
