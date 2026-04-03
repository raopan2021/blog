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
          :class="{ active: priceRange === p.value }" @click="applyPreset(p.value)">{{ p.label }}</button>
        <div class="price-slider-wrap">
          <div class="ep-slider">
            <div class="ep-slider__track">
              <div class="ep-slider__runway"></div>
              <div class="ep-slider__bar" :class="{ active: isCustomActive }" :style="barStyle"></div>
              <div class="ep-slider__button-wrap" :style="{ left: minPercent + '%' }">
                <div class="ep-slider__button" @mouseenter="hoverMin = true" @mouseleave="hoverMin = false">
                  <div class="ep-slider__tooltip" v-if="hoverMin">{{ sliderMin === 0 ? '最低' : sliderMin + '元' }}</div>
                </div>
              </div>
              <div class="ep-slider__button-wrap" :style="{ left: maxPercent + '%' }">
                <div class="ep-slider__button" @mouseenter="hoverMax = true" @mouseleave="hoverMax = false">
                  <div class="ep-slider__tooltip" v-if="hoverMax">{{ sliderMax >= 10000 ? '最高' : sliderMax + '元' }}</div>
                </div>
              </div>
            </div>
            <!-- 右把手在下层(z3)，左拖动时禁用 -->
            <input type="range" class="ep-range-input right" :class="{ 'dragging-active': dragging === 'min' }"
              min="0" max="10000" step="100"
              :value="sliderMax" @input="onMaxChange($event.target.value)"
              @mousedown="dragging = 'max'" @mouseup="dragging = ''" @touchstart="dragging = 'max'" @touchend="dragging = ''" />
            <!-- 左把手在上层(z4)，只在拖左把手时启用 -->
            <input type="range" class="ep-range-input left" :class="{ 'dragging-active': dragging !== 'min' }"
              min="0" max="10000" step="100"
              :value="sliderMin" @input="onMinChange($event.target.value)"
              @mousedown="dragging = 'min'" @mouseup="dragging = ''" @touchstart="dragging = 'min'" @touchend="dragging = ''" />
          </div>
          <span class="slider-label">{{ sliderLabel }}</span>
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

const sliderMin = ref(0)
const sliderMax = ref(10000)
const hoverMin = ref(false)
const hoverMax = ref(false)
const dragging = ref('') // 'min' | 'max' | ''

const minPercent = computed(() => (sliderMin.value / 10000) * 100)
const maxPercent = computed(() => (sliderMax.value / 10000) * 100)

const barStyle = computed(() => ({
  left: minPercent.value + '%',
  width: (maxPercent.value - minPercent.value) + '%',
}))

const sliderLabel = computed(() => {
  if (sliderMax.value >= 10000) return `${sliderMin.value}元+`
  return `${sliderMin.value} ~ ${sliderMax.value}元`
})

const isFiltered = computed(() => sliderMin.value > 0 || sliderMax.value < 10000)

const isActivePreset = computed(() => {
  return props.priceRange === '' // only "all" is active when no filter
})

const isCustomActive = computed(() => {
  return props.priceRange.startsWith('custom')
})

function applyPreset(value) {
  const presetMap = {
    '': [0, 10000],
    '0-1000': [0, 1000],
    '1000-2000': [1000, 2000],
    '2000-3000': [2000, 3000],
    '3000-4000': [3000, 4000],
    '4000-5000': [4000, 5000],
    '5000+': [5000, 10000],
  }
  const [min, max] = presetMap[value] || [0, 10000]
  sliderMin.value = min
  sliderMax.value = max
  emit('priceChange', value)
}

function onMinChange(val) {
  const min = parseInt(val)
  sliderMin.value = Math.min(min, sliderMax.value - 100)
  const max = sliderMax.value >= 10000 ? '' : sliderMax.value
  emit('priceChange', `custom:${sliderMin.value}-${max || 10000}`)
}

function onMaxChange(val) {
  const max = parseInt(val)
  sliderMax.value = Math.max(max, sliderMin.value + 100)
  const maxVal = sliderMax.value >= 10000 ? '' : sliderMax.value
  emit('priceChange', `custom:${sliderMin.value}-${maxVal || 10000}`)
}

watch(() => props.priceRange, (val) => {
  if (!val || val === '') {
    sliderMin.value = 0
    sliderMax.value = 10000
  } else {
    const m = val.match(/^custom:(\d+)-(\d+)$/)
    if (m) {
      sliderMin.value = parseInt(m[1])
      sliderMax.value = parseInt(m[2])
    } else {
      applyPreset(val)
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
  gap: 10px;
}

.slider-label {
  font-size: 12px;
  color: #60a5fa;
  min-width: 90px;
  text-align: center;
}

.ep-slider {
  position: relative;
  height: 20px;
  width: 180px;
}

.ep-slider__track {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 6px;
  transform: translateY(-50%);
  z-index: 1;
}

.ep-slider__runway {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: #2d3748;
  border-radius: 3px;
}

.ep-slider__bar {
  position: absolute;
  top: 0;
  height: 6px;
  background: #4b5563;
  border-radius: 3px;
  transition: background 0.2s;

  &.active {
    background: #3b82f6;
  }
}

.ep-slider__button-wrap {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.ep-slider__button {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #4b5563;
  cursor: grab;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  position: relative;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 0 0 4px rgba(#3b82f6, 0.2);
    border-color: #3b82f6;
  }
}

.ep-slider__tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: #1a1f2e;
  border: 1px solid #3b82f6;
  color: #e2e8f0;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #3b82f6;
  }
}

.ep-range-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;

  // 右把手在下层(z3)，正常时可拖动
  &.right { z-index: 3; }

  // 左把手在上层(z4)，正常时禁用（事件透传给右把手）
  &.left {
    z-index: 4;
    pointer-events: none;
  }

  // 左把手：只在拖左把手时启用，其他时候禁用（平时被右把手盖住，不需要事件）
  &.left.dragging-active { pointer-events: auto; }

  // 右把手：只在拖右把手时启用，其他时候禁用（让左把手事件透传）
  &.right.dragging-active { pointer-events: auto; }

  &::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
    cursor: grab;
  }
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
