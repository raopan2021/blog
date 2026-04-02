# Demo 5：Shrinkwrap 对比

> CSS fit-content vs Pretext 精确 shrinkwrap — 找到多行文本的最小宽度

## 展示

<iframe
  src="/blog/pretext-demo/shrinkwrap-showdown.html"
  width="100%"
  height="650px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#faf8f5;"
  allow="autoplay"
/>

## 代码拆分与实现原理

### 问题：CSS 无法精确 Shrinkwrap

```css
/* CSS fit-content 的问题 */
.chat-bubble {
  width: fit-content;      /* 以最长行宽度为基准 */
  max-width: 80%;          /* 限制最大宽度 */
}

/* 结果：短行也会撑满容器，产生"浪费"的空白 */
```

**CSS 只知道"最长行宽度"**，无法找到"恰好容纳所有行的最小宽度"。

### Pretext 的解决方案：二分查找

```js
import { prepareWithSegments, walkLineRanges } from "./pretext.js"

/**
 * Pretext shrinkwrap：找到恰好容纳所有行的最小宽度
 */
function shrinkwrap(prepared, maxWidth) {
  // 1. 确定目标行数
  let targetLineCount = 0
  let widestLine = 0

  walkLineRanges(prepared, maxWidth, (line) => {
    targetLineCount++
    widestLine = Math.max(widestLine, line.width)
  })

  if (targetLineCount <= 1) {
    return { width: Math.ceil(widestLine), lineCount: targetLineCount }
  }

  // 2. 二分查找最小宽度
  let lo = 1
  let hi = Math.ceil(widestLine)

  while (lo < hi) {
    const mid = lo + hi >>> 1
    let count = 0

    walkLineRanges(prepared, mid, () => {
      count++
    })

    // 如果这个宽度能容纳目标行数，说明可以更窄
    if (count <= targetLineCount) {
      hi = mid
    } else {
      lo = mid + 1
    }
  }

  return { width: lo, lineCount: targetLineCount }
}
```

### walkLineRanges API

```js
/**
 * 遍历所有行，返回每行的宽度
 * 不做实际布局，只测量 —— 比 layoutNextLine 更快
 */
walkLineRanges(prepared, maxWidth, (line) => {
  // line.width: 当前行宽度
  // line.start: 起始位置
  // line.end: 结束位置
})
```

### CSS vs Pretext 对比

```js
// CSS 方案（浪费空间）
cssBubble.style.width = 'fit-content'
const cssActualWidth = cssBubble.offsetWidth  // 读取 DOM！

// Pretext 方案（精确）
const { width: shrinkWidth } = shrinkwrap(prepared, contentMaxWidth)
pretextBubble.style.width = shrinkWidth + 'px'  // 无 DOM 读取

// 计算浪费的空间
const cssWaste = cssContentWidth - shrinkWidth
// → 红色条纹标记浪费的区域
```

### 完整对比逻辑

```js
function updateBubbles(chatWidth) {
  const maxBubbleWidth = Math.floor(chatWidth * 0.8)
  const contentMaxWidth = maxBubbleWidth - PADDING * 2

  for (const bubble of bubbles) {
    // 1. CSS 方案
    cssBubble.style.maxWidth = maxBubbleWidth + 'px'
    cssBubble.style.width = 'fit-content'
    const cssActualWidth = cssBubble.offsetWidth  // DOM 读取！

    // 2. Pretext 方案
    const { width: shrinkWidth } = shrinkwrap(b.prepared, contentMaxWidth)
    pretextBubble.style.width = Math.min(maxBubbleWidth, shrinkWidth + PADDING * 2) + 'px'

    // 3. 计算浪费
    const cssWaste = cssContentWidth - shrinkWidth
    if (cssWaste > 2) {
      // 显示红色条纹
      wasteStripe.style.width = cssWaste + 'px'
    }
  }
}
```

## 总结

Shrinkwrap Showdown 展示了 Pretext 的一个独特能力：**找到多行文本的精确最小宽度**。

| 方案 | 方法 | 精度 | DOM 读取 |
|------|------|------|---------|
| CSS fit-content | 以最长行为准 | 不精确，有浪费 | 可选 |
| Pretext 二分查找 | 找恰好容纳的最小宽度 | 100% 精确 | 零 |

**核心 API**：`walkLineRanges()` — 遍历行范围进行测量，比 `layoutNextLine` 更轻量

## 拓展：封装可复用的 Shrinkwrap 组件

```ts
interface ShrinkwrapOptions {
  font: string
  lineHeight: number
  padding?: number
}

interface Bubble {
  id: string
  text: string
  prepared: any
}

class ShrinkwrapBubbles {
  private bubbles: Bubble[]
  private options: ShrinkwrapOptions
  private containerWidth: number

  constructor(bubbles: Array<{ id: string; text: string }>, options: ShrinkwrapOptions) {
    this.options = { padding: 12, ...options }
    this.bubbles = bubbles.map(b => ({
      ...b,
      prepared: prepareWithSegments(b.text, options.font)
    }))
  }

  /**
   * 计算单条消息的 shrinkwrap 宽度
   */
  shrinkwrap(prepared: any, maxWidth: number): number {
    // 确定目标行数
    let targetLineCount = 0
    let widestLine = 0

    walkLineRanges(prepared, maxWidth, (line) => {
      targetLineCount++
      widestLine = Math.max(widestLine, line.width)
    })

    if (targetLineCount <= 1) {
      return Math.ceil(widestLine)
    }

    // 二分查找
    let lo = 1
    let hi = Math.ceil(widestLine)

    while (lo < hi) {
      const mid = lo + hi >>> 1
      let count = 0

      walkLineRanges(prepared, mid, () => {
        count++
      })

      if (count <= targetLineCount) {
        hi = mid
      } else {
        lo = mid + 1
      }
    }

    return lo
  }

  /**
   * 渲染所有气泡
   */
  render(containerWidth: number, container: HTMLElement): void {
    this.containerWidth = containerWidth
    const maxBubbleWidth = Math.floor(containerWidth * 0.8)
    const contentMaxWidth = maxBubbleWidth - (this.options.padding! * 2)

    container.innerHTML = ''

    for (const bubble of this.bubbles) {
      const shrinkWidth = this.shrinkwrap(bubble.prepared, contentMaxWidth)
      const bubbleWidth = Math.min(maxBubbleWidth, shrinkWidth + this.options.padding! * 2)

      const div = document.createElement('div')
      div.className = 'bubble'
      div.style.cssText = `
        max-width: ${maxBubbleWidth}px;
        width: ${bubbleWidth}px;
        padding: ${this.options.padding}px;
        font: ${this.options.font};
        line-height: ${this.options.lineHeight}px;
      `
      div.textContent = bubble.text
      container.appendChild(div)
    }
  }

  /**
   * 更新容器宽度（响应式）
   */
  updateWidth(newWidth: number, container: HTMLElement): void {
    this.render(newWidth, container)
  }

  /**
   * 添加消息
   */
  addMessage(id: string, text: string): void {
    const prepared = prepareWithSegments(text, this.options.font)
    this.bubbles.push({ id, text, prepared })
  }

  /**
   * 获取浪费空间的统计
   */
  getWasteStats(containerWidth: number): { totalCssWaste: number; totalPretextWaste: number } {
    const maxBubbleWidth = Math.floor(containerWidth * 0.8)
    const contentMaxWidth = maxBubbleWidth - (this.options.padding! * 2)

    let totalCssWaste = 0
    let totalPretextWaste = 0

    for (const bubble of this.bubbles) {
      // CSS fit-content 浪费的空间
      let cssWidest = 0
      walkLineRanges(bubble.prepared, contentMaxWidth, (line) => {
        cssWidest = Math.max(cssWidest, line.width)
      })

      const shrinkWidth = this.shrinkwrap(bubble.prepared, contentMaxWidth)
      totalCssWaste += Math.max(0, cssWidest - shrinkWidth)
      // Pretext 浪费为 0
    }

    return { totalCssWaste, totalPretextWaste }
  }
}

// 使用示例
const bubbles = new ShrinkwrapBubbles(
  [
    { id: '1', text: 'Hey, did you see the new pretext library?' },
    { id: '2', text: 'Yeah! It measures text without the DOM.' },
    { id: '3', text: 'The shrinkwrap feature is wild!' },
  ],
  {
    font: '15px -apple-system, BlinkMacSystemFont, sans-serif',
    lineHeight: 20,
    padding: 12
  }
)

// 初始渲染
bubbles.render(chatContainer.clientWidth, chatContainer)

// 响应式
window.addEventListener('resize', () => {
  bubbles.updateWidth(chatContainer.clientWidth, chatContainer)
})

// 添加新消息
bubbles.addMessage('4', 'New message here!')
```
