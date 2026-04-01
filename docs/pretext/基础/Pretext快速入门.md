# Pretext 快速入门

> 不触碰 DOM 的精确文本测量与多行布局库

## Pretext 是什么？

**Pretext** 是由 chenglou（ReScript 作者）开发的一个纯 JavaScript/TypeScript 库，专注于**多行文本的精确测量与布局**。

核心解决的问题：**传统 DOM 测量（如 `getBoundingClientRect`、`offsetHeight`）会触发布局回流（layout reflow），这是浏览器中最昂贵的操作之一**。

Pretext 通过预计算 + Canvas 测量，实现**零 DOM 访问的文本高度预测**，可用于：
- 虚拟滚动/列表（无需猜测高度）
- Masonry 瀑布流布局
- 文本环绕浮动元素（如图片旁边文字）
- AI 生成文本时预判布局高度
- 防止文本加载时的布局抖动（CLS 优化）

## 核心原理

```
传统方式（回流）：
用户输入 → DOM 更新 → 浏览器重新布局 → 读取高度 → 再次布局

Pretext 方式（零回流）：
用户输入 → Canvas 预计算 → 纯算术运算 → 直接获取高度
```

## 安装

```bash
npm install @chenglou/pretext
# 或
pnpm add @chenglou/pretext
```

## 快速上手

### 场景一：测量段落高度（最常用）

```ts
import { prepare, layout } from '@chenglou/pretext'

// prepare() 做一次性工作：归一化空格、分段、应用粘合规则、用 Canvas 测量
const prepared = prepare('AGI 春天到了.开始了 🚀', '16px Inter')

// layout() 是热路径：纯算术运算，不触碰 DOM！
const { height, lineCount } = layout(prepared, textWidth, 20)
// height: 段落总高度
// lineCount: 行数
```

### 场景二：渲染到 Canvas

```ts
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

const prepared = prepareWithSegments('AGI 春天到了.开始了 🚀', '18px "Helvetica Neue"')
const { lines } = layoutWithLines(prepared, 320, 26) // 320px 最大宽度，26px 行高

for (let i = 0; i < lines.length; i++) {
  ctx.fillText(lines[i].text, 0, i * 26)
}
```

### 场景三：文本环绕浮动元素

```ts
let cursor = { segmentIndex: 0, graphemeIndex: 0 }
let y = 0

while (true) {
  // 浮动图片下方的行更宽
  const width = y < image.bottom ? columnWidth - image.width : columnWidth
  const line = layoutNextLine(prepared, cursor, width)
  if (line === null) break
  ctx.fillText(line.text, 0, y)
  cursor = line.end
  y += 26
}
```

## 性能数据

在当前版本的基准测试中：
- `prepare()` 对 500 条文本的批量处理约 **19ms**（一次性）
- `layout()` 对同样批量处理约 **0.09ms**（可反复调用）

## 支持的文本特性

- ✅ 所有主流语言（中文、阿拉伯文、希伯来文等）
- ✅ Emoji 混合
- ✅ 混合方向文本（RTL + LTR）
- ✅ 浏览器特定quirks自动处理

## 总结

| 特性 | 说明 |
|------|------|
| `prepare()` | 一次性文本分析 + Canvas 测量，返回不透明句柄 |
| `layout()` | 根据最大宽度和行高计算文本高度，纯算术不触 DOM |
| `layoutWithLines()` | 获取所有行的文本，可渲染到 Canvas/SVG |
| `walkLineRanges()` | 遍历行范围，获取宽度和光标位置 |
| `layoutNextLine()` | 流式布局，适合文本环绕场景 |
