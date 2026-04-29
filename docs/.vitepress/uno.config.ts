import { defineConfig, presetIcons } from 'unocss'

// UnoCSS 配置文件，用于 VitePress 主题的图标预设
export default defineConfig({
  presets: [
    // 图标预设：支持在 Markdown 中使用 :icon-name: 语法引用图标
    presetIcons({
      // 确保图标以 inline-block 形式显示，并与文字垂直对齐
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
})
