<template>
  <div class="stats-section">
    <!-- 筛选栏 -->
    <div class="filters">
      <div class="filter-group">
        <span class="filter-label">品牌:</span>
        <button
          v-for="b in brandOptions"
          :key="b.value"
          class="filter-btn"
          :class="[b.cls, { active: brandFilter === b.value }]"
          @click="$emit('brandChange', b.value)"
        >{{ b.label }}</button>
      </div>
      <div class="filter-group">
        <span class="filter-label">价格:</span>
        <button
          v-for="p in priceOptions"
          :key="p.value"
          class="filter-btn"
          :class="{ active: priceRange === p.value }"
          @click="$emit('priceChange', p.value)"
        >{{ p.label }}</button>
      </div>
      <div class="filter-group">
        <input
          class="search-input"
          :value="searchText"
          placeholder="搜索显卡型号..."
          @input="$emit('searchChange', $event.target.value)"
        >
      </div>
    </div>

    <!-- 平均价格变化（筛选行下方） -->
    <div class="avg-change-card" :class="avgChange >= 0 ? 'up' : 'down'">
      <div class="avg-change-inner">
        <span class="avg-change-value">{{ avgChange >= 0 ? '+' : '' }}{{ avgChange.toLocaleString() }}</span>
        <span class="avg-change-unit">元</span>
        <span class="avg-change-label">3月每张显卡平均价格变化</span>
        <span class="avg-change-sub" :class="avgChange >= 0 ? 'up' : 'down'">
          {{ avgChange >= 0 ? '▲ 均价上涨中' : '▼ 均价下降中' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
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

.filters {
  background: $bg-secondary;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: 12px 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
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

.avg-change-card {
  background: $bg-secondary;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avg-change-inner {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.avg-change-value {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.up .avg-change-value { color: $accent-red; }
.down .avg-change-value { color: $accent-green; }

.avg-change-unit {
  font-size: 18px;
  font-weight: 600;
  color: $text-secondary;
}

.avg-change-label {
  font-size: 15px;
  color: $text-muted;
  margin-left: 8px;
}

.avg-change-sub {
  font-size: 13px;
  font-weight: 500;
  margin-left: 8px;
  padding: 2px 10px;
  border-radius: 12px;

  &.up { background: rgba($accent-red, 0.15); color: $accent-red; }
  &.down { background: rgba($accent-green, 0.15); color: $accent-green; }
}

@media (max-width: 768px) {
  .filters { gap: 12px; }
}
</style>
