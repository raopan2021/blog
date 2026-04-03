<template>
  <div class="stats-section">
    <div class="filters">
      <div class="filter-group">
        <span class="filter-label">品牌:</span>
        <button v-for="b in brandOptions" :key="b.value" class="filter-btn"
          :class="[b.cls, { active: brandFilter === b.value }]" @click="$emit('brandChange', b.value)">{{ b.label }}</button>
      </div>

      <div class="filter-group">
        <span class="filter-label">价格区间:</span>
        <div class="price-slider-wrap">
          <input type="range" class="price-slider" min="0" max="10000" step="100"
            :value="localMin" @input="updateMin($event.target.value)" />
          <span class="slider-val">{{ localMin }} 元</span>
          <span class="filter-label">~</span>
          <input type="range" class="price-slider" min="0" max="10000" step="100"
            :value="localMax" @input="updateMax($event.target.value)" />
          <span class="slider-val">{{ localMax >= 10000 ? '不限' : localMax + ' 元' }}</span>
        </div>
      </div>

      <div class="filter-group">
        <input class="search-input" :value="searchText" placeholder="搜索显卡型号..."
          @input="$emit('searchChange', $event.target.value)" />
      </div>

      <div class="filter-group">
        <span class="filter-count">筛选出 <strong>{{ filteredCount }}</strong> / 共 <strong>{{ totalCount }}</strong> 张显卡</span>
      </div>

      <div class="avg-change-inner">
        <span class="avg-change-value">{{ avgChange >= 0 ? '+' : '' }}{{ avgChange.toLocaleString() }}</span>
        <span class="avg-change-unit">元</span>
        <span class="avg-change-label">{{ latestMonth }}每张显卡均价变化</span>
        <span class="avg-change-sub" :class="avgChange >= 0 ? 'up' : 'down'">
          {{ avgChange >= 0 ? '▲ 上涨中' : '▼ 下降中' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  totalCount: Number,
  filteredCount: Number,
  avgChange: Number,
  brandFilter: String,
  priceRange: String,
  searchText: String,
  latestMonth: String,
})

const emit = defineEmits(['brandChange', 'priceChange', 'searchChange'])

const localMin = ref(0)
const localMax = ref(10000)

function updateMin(val) {
  localMin.value = parseInt(val)
  if (localMin.value >= localMax.value) localMin.value = localMax.value - 100
  emit('priceChange', `custom:${localMin.value}-${localMax.value}`)
}

function updateMax(val) {
  localMax.value = parseInt(val)
  if (localMax.value <= localMin.value) localMax.value = localMin.value + 100
  emit('priceChange', `custom:${localMin.value}-${localMax.value}`)
}

watch(() => props.priceRange, (val) => {
  if (!val || !val.startsWith('custom:')) {
    localMin.value = 0
    localMax.value = 10000
  }
})

const brandOptions = [
  { value: '', label: '全部', cls: '' },
  { value: 'NVIDIA', label: 'NVIDIA', cls: 'nvidia' },
  { value: 'AMD', label: 'AMD', cls: 'amd' },
  { value: 'Intel', label: 'Intel', cls: 'intel' },
]
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.stats-section { margin-bottom: 24px; }

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

.filter-label { font-size: 13px; color: $text-muted; white-space: nowrap; }

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

.filter-count {
  font-size: 13px;
  color: $text-muted;
  padding: 4px 12px;
  background: rgba($accent-blue, 0.1);
  border: 1px solid rgba($accent-blue, 0.25);
  border-radius: 20px;

  strong { color: $accent-blue; font-weight: 600; }
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

.price-slider-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-slider {
  width: 120px;
  height: 4px;
  accent-color: $accent-blue;
  cursor: pointer;
}

.slider-val {
  font-size: 12px;
  color: $accent-blue;
  min-width: 60px;
  white-space: nowrap;
}

.avg-change-inner {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.avg-change-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.avg-change-unit { font-size: 14px; font-weight: 600; color: $text-secondary; }

.avg-change-label {
  font-size: 13px;
  color: $text-muted;
  margin-left: 4px;
}

.avg-change-sub {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 10px;

  &.up { background: rgba($accent-red, 0.15); color: $accent-red; }
  &.down { background: rgba($accent-green, 0.15); color: $accent-green; }
}

@media (max-width: 768px) {
  .filters { gap: 12px; }
  .price-slider { width: 80px; }
}
</style>
