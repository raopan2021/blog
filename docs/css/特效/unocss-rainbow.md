# UnoCSS 彩虹主题设置

## 效果展示

博客主题色会随着彩虹动画不断渐变切换，从青色→蓝色→紫色→粉色→橙色→黄色→绿色→青色，形成完整的彩虹色循环。导航栏右侧提供开关控制，用户可随时启用/禁用动画效果。

## 实现原理

利用 CSS `@keyframes` 动画逐帧更新 VitePress 的品牌色 CSS 变量，实现主题色的平滑过渡。

### 核心色值变量

VitePress 使用 6 个品牌色变量组成完整色阶：

```scss
--vp-c-brand-1      // 主色（彩虹动画的基准色）
--vp-c-brand-light  // 浅色
--vp-c-brand-lighter // 更浅色
--vp-c-brand-dark   // 深色
--vp-c-brand-darker // 更深色
--vp-c-brand-next   // 下一个主色（用于渐变过渡）
```

### 关键帧动画

通过 80 个关键帧（0% ~ 100%，每 1.25% 一帧）实现彩虹色平滑过渡：

::: code-group
<<< @/.vitepress/theme/style/rainbow.scss
:::

<style>
/* code-group 代码块容器 - 固定高度，内部滚动 */
.vp-code-group .blocks {
  max-height: 600px !important;
  overflow-y: auto;
}
</style>

## 在 VitePress 中使用

### 组件说明

::: info RainbowSwitcher.vue

自定义的开关组件，替代 VitePress 默认的 VPSwitch 样式：
:::

::: info RainbowAnimationSwitcher.vue

带动画图标的开关控制组件：

- 使用 `i-tabler:rainbow` 和 `i-tabler:rainbow-off` 图标
- 读取 `localStorage` 持久化用户偏好
- 检测 `prefers-reduced-motion` 辅助功能设置
- 通过 `aria-checked` 实现无障碍支持

:::

::: code-group

<<< @/.vitepress/theme/components/RainbowSwitcher.vue [RainbowSwitcher.vue]

<<< @/.vitepress/theme/components/RainbowAnimationSwitcher.vue [RainbowAnimationSwitcher.vue]

:::

### 主题配置

在 `.vitepress/theme/index.ts` 中导入样式并注册组件：

```ts
import RainbowAnimationSwitcher from './components/RainbowAnimationSwitcher.vue'

export default {
  enhanceApp({ app }) {
    app.component('RainbowAnimationSwitcher', RainbowAnimationSwitcher)
  },
}
```

### 导航栏集成

在 `.vitepress/sideBar/_index.ts` 的导航配置中添加开关组件：

```ts
export function nav(): DefaultTheme.NavItem[] {
  return [
    // ... 其他导航项
    {
      text: '',
      component: 'RainbowAnimationSwitcher',
    },
  ]
}
```

## 在 Vue 项目中使用

核心文件：`RainbowSwitcher.vue`、`RainbowAnimationSwitcher.vue`、`rainbow.scss`

1. **引入样式**：在入口文件或全局样式中引入 `rainbow.scss`
2. **使用组件**：

```vue
<template>
  <ClientOnly>
    <RainbowAnimationSwitcher />
  </ClientOnly>
</template>

<script setup>
import { ClientOnly } from 'vitepress'
import RainbowAnimationSwitcher from './components/RainbowAnimationSwitcher.vue'
</script>
```

## 在 React 项目中使用

在 React 中需要自行实现开关逻辑，无法直接使用 Vue 组件：

```tsx
// RainbowToggle.tsx
import { useState, useEffect } from 'react'

export function RainbowToggle() {
  // 读取用户偏好，默认开启动画
  const [animated, setAnimated] = useState(() => {
    const stored = localStorage.getItem('animate-rainbow')
    if (stored !== null) return stored === 'true'
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    // 控制 html 标签的 rainbow class
    document.documentElement.classList.toggle('rainbow', !animated)
    localStorage.setItem('animate-rainbow', String(animated))
  }, [animated])

  return (
    <button
      className='VPSwitch'
      onClick={() => setAnimated(!animated)}
      aria-checked={animated}
    >
      <span className='RainbowSwitcherCheck'>
        <span className={animated ? 'i-tabler:rainbow' : 'i-tabler:rainbow-off'} />
      </span>
    </button>
  )
}
```

**CSS 部分**需要单独提取 `rainbow.scss` 中的内容，并在全局样式中引入：

```scss
// rainbow.scss
:root {
  animation: rainbow 20s linear infinite;
}

html.rainbow {
  animation: none !important;
}
```

## 用户偏好持久化

组件会检测并遵循用户的辅助功能偏好：

1. **系统偏好**：检测 `prefers-reduced-motion: reduce` 自动禁用动画
2. **用户选择**：将偏好存储在 `localStorage.animate-rainbow`，刷新后保持

```ts
onMounted(() => {
  const stored = localStorage.getItem('animate-rainbow')
  if (stored !== null) {
    animated.value = stored === 'true'
  } else {
    animated.value = !reduceMotion.value
  }
})
```

## 禁用动画

当用户关闭动画时，会在 `<html>` 元素上添加 `rainbow` class：

```scss
html:not(.rainbow) {
  --vp-c-brand-1: #00a98e;
  // ... 其他变量保持静态
  animation: none !important;
}
```

## 相关文件

| 文件     | 路径                                                                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 彩虹样式 | [rainbow.scss](https://github.com/raopan2021/blog/blob/main/docs/.vitepress/theme/style/rainbow.scss)                                      |
| 开关组件 | [RainbowSwitcher.vue](https://github.com/raopan2021/blog/blob/main/docs/.vitepress/theme/components/RainbowSwitcher.vue)                   |
| 动画控制 | [RainbowAnimationSwitcher.vue](https://github.com/raopan2021/blog/blob/main/docs/.vitepress/theme/components/RainbowAnimationSwitcher.vue) |
