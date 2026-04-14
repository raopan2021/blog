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
          <div class="ep-slider" ref="sliderRef">
            <div class="ep-slider__track" @click="onTrackClick">
              <div class="ep-slider__runway"></div>
              <div class="ep-slider__bar" :class="{ active: isCustomActive }" :style="barStyle"></div>
            </div>
            <div
              class="ep-slider__button-wrap"
              :style="{ left: minPercent + '%' }"
              @mousedown.prevent="startDrag('min', $event)"
              @touchstart.prevent="startDrag('min', $event)"
            >
              <div class="ep-slider__button" :class="{ dragging: dragging === 'min' }">
                <div class="ep-slider__tooltip" v-if="hoverMin || dragging === 'min'">{{ sliderMin === 0 ? '最低' : sliderMin + '元' }}</div>
              </div>
            </div>
            <div
              class="ep-slider__button-wrap"
              :style="{ left: maxPercent + '%' }"
              @mousedown.prevent="startDrag('max', $event)"
              @touchstart.prevent="startDrag('max', $event)"
            >
              <div class="ep-slider__button" :class="{ dragging: dragging === 'max' }">
                <div class="ep-slider__tooltip" v-if="hoverMax || dragging === 'max'">{{ sliderMax >= 10000 ? '最高' : sliderMax + '元' }}</div>
              </div>
            </div>
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
const sliderRef = ref(null)

function getPercent(clientX) {
  const track = sliderRef.value?.querySelector('.ep-slider__track')
  if (!track) return 0
  const rect = track.getBoundingClientRect()
  const x = clientX - rect.left
  return Math.max(0, Math.min(1, x / rect.width))
}

function startDrag(which, event) {
  dragging.value = which
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', stopDrag)
}

function onDrag(event) {
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const percent = getPercent(clientX)
  const val = Math.round(percent * 10000 / 100) * 100

  if (dragging.value === 'min') {
    const min = Math.min(val, sliderMax.value - 100)
    sliderMin.value = Math.max(0, min)
    emit('priceChange', `custom:${sliderMin.value}-${sliderMax.value >= 10000 ? 10000 : sliderMax.value}`)
  } else if (dragging.value === 'max') {
    const max = Math.max(val, sliderMin.value + 100)
    sliderMax.value = Math.min(10000, max)
    emit('priceChange', `custom:${sliderMin.value}-${sliderMax.value >= 10000 ? 10000 : sliderMax.value}`)
  }
}

function stopDrag() {
  dragging.value = ''
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

function onTrackClick(event) {
  const clientX = event.clientX
  const percent = getPercent(clientX)
  const val = Math.round(percent * 10000 / 100) * 100
  // Move nearest handle
  const dMin = Math.abs(val - sliderMin.value)
  const dMax = Math.abs(val - sliderMax.value)
  if (dMin < dMax) {
    sliderMin.value = Math.min(val, sliderMax.value - 100)
  } else {
    sliderMax.value = Math.max(val, sliderMin.value + 100)
  }
  emit('priceChange', `custom:${sliderMin.value}-${sliderMax.value >= 10000 ? 10000 : sliderMax.value}`)
}

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
  cursor: grab;
}

.ep-slider__button {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #4b5563;
  transition: border-color 0.15s, box-shadow 0.15s;
  position: relative;

  &.dragging {
    border-color: #3b82f6;
    cursor: grabbing;
  }

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(#3b82f6, 0.2);
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
