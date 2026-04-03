<template>
  <div class="stats-section">
    <div class="filters">
      <div class="filter-group">
        <span class="filter-label">品牌:</span>
        <button v-for="b in brandOptions" :key="b.value" class="filter-btn"
          :class="[b.cls, { active: brandFilter === b.value }]" @click="$emit('brandChange', b.value)">{{ b.label }}</button>
      </div>

      <div class="filter-group">
        <span class="filter-label">价格:</span>
        <button v-for="p in priceOptions" :key="p.value" class="filter-btn"
          :class="{ active: priceRange === p.value && !isCustom }" @click="applyPreset(p.value)">{{ p.label }}</button>
        <div class="price-slider-wrap" v-if="isCustom">
          <input type="range" class="price-range" min="0" max="10000" step="100"
            :value="sliderMin" @input="onMinChange($event.target.value)" />
          <span class="range-val">{{ sliderMin === 0 ? '最低' : sliderMin + '元' }}</span>
          <span class="filter-label">~</span>
          <input type="range" class="price-range" min="0" max="10000" step="100"
            :value="sliderMax" @input="onMaxChange($event.target.value)" />
          <span class="range-val">{{ sliderMax >= 10000 ? '最高' : sliderMax + '元' }}</span>
        </div>
      </div>

      <div class="filter-group">
        <input class="search-input" :value="searchText" placeholder="搜索显卡型号..."
          @input="$emit('searchChange', $event.target.value)" />
      </div>

      <div class="filter-group">
        <span class="filter-count">筛选出 <strong>{{ filteredCount }}</strong> / 共 <strong>{{ totalCount }}</strong> 张</span>
      </div>

      <div class="avg-change-inner">
        <span class="avg-change-value">{{ avgChange >= 0 ? '+' : '' }}{{ avgChange.toLocaleString() }}</span>
        <span class="avg-change-unit">元</span>
        <span class="avg-change-label">{{ latestMonth }}均价变化</span>
        <span class="avg-change-sub" :class="avgChange >= 0 ? 'up' : 'down'">
          {{ avgChange >= 0 ? '▲ 上涨' : '▼ 下降' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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

const isCustom = computed(() => props.priceRange && props.priceRange.startsWith('custom:'))

const sliderMin = ref(0)
const sliderMax = ref(10000)

function applyPreset(value) {
  emit('priceChange', value)
}

function onMinChange(val) {
  const min = parseInt(val)
  sliderMin.value = Math.min(min, sliderMax.value - 100)
  emit('priceChange', `custom:${sliderMin.value}-${sliderMax.value}`)
}

function onMaxChange(val) {
  const max = parseInt(val)
  sliderMax.value = Math.max(max, sliderMin.value + 100)
  emit('priceChange', `custom:${sliderMin.value}-${sliderMax.value}`)
}

watch(() => props.priceRange, (val) => {
  if (!val || !val.startsWith('custom:')) {
    sliderMin.value = 0
    sliderMax.value = 10000
  } else {
    const m = val.match(/^custom:(\d+)-(\d+)$/)
    if (m) {
      sliderMin.value = parseInt(m[1])
      sliderMax.value = parseInt(m[2])
    }
  }
}, { immediate: true })

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
  { value: '3000-4000', label: '3k~4k' },
  { value: '4000-5000', label: '4k~5k' },
  { value: '5000+', label: '5k+' },
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

.price-range {
  width: 100px;
  height: 4px;
  accent-color: #60a5fa;
  cursor: pointer;
}

.range-val {
  font-size: 12px;
  color: #60a5fa;
  min-width: 45px;
  text-align: center;
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
.avg-change-label { font-size: 13px; color: $text-muted; margin-left: 4px; }

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
  .price-slider { width: 100px; }
}
</style>
