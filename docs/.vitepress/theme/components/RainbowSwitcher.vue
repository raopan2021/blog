<template>
  <!-- 开关按钮容器，使用 VitePress 默认 VPSwitch 样式 -->
  <button class="VPSwitch" type="button" role="switch">
    <!-- 滑块 -->
    <span class="RainbowSwitcherCheck">
      <!-- 图标插槽，支持自定义图标 -->
      <span v-if="$slots.default" class="icon">
        <slot />
      </span>
    </span>
  </button>
</template>

<style scoped>
/* 开关外层：40x22px 圆角矩形 */
.VPSwitch {
  position: relative;
  border-radius: 11px;
  display: block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  border: 1px solid var(--vp-input-border-color);
  transition: border-color 0.25s !important;
}

/* hover 时边框高亮 */
.VPSwitch:hover {
  border-color: var(--vp-c-brand-1);
}

/* 滑块：18px 圆形，居中放置 */
.RainbowSwitcherCheck {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--vp-c-neutral-inverse);
  box-shadow: var(--vp-shadow-1);
  transition: transform 0.25s !important;
}

/* 图标容器：与滑块同尺寸，覆盖在滑块上方 */
.icon {
  position: relative;
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  overflow: hidden;
}

/* UnoCSS 图标样式：12x12px 居中于容器内 */
.icon :deep([class^='i-']) {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 12px;
  height: 12px;
  background-color: var(--vp-c-brand-1);
}

/* 暗黑模式下图标颜色适配 */
.dark .icon :deep([class^='i-']) {
  color: var(--vp-c-text-1);
  transition: opacity 0.25s !important;
}
</style>
