# Demo 1：对齐算法

> 三种段落对齐算法的对比：CSS 默认、贪心连字符、Knuth-Plass

## 展示

<iframe
  src="/blog/pretext-demo/justification.html"
  width="100%"
  height="580px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f1ea;"
  allow="autoplay"
/>

## 代码拆分与实现原理

### 核心代码结构

```ts
import { prepare, layout } from '@chenglou/pretext'

// 1. 预处理文本
const prepared = prepare(text, '15px/1.7 Georgia, serif')

// 2. 计算高度和行数
const result = layout(prepared, width, lineHeight)
const { height, lineCount } = result
```

### 三种对齐算法对比

**CSS Justify**
```css
.text {
  text-align: justify;  /* 浏览器自动拉伸词间间距 */
  word-spacing: 0;      /* 重置默认间距 */
}
```
- 优点：简单，浏览器原生支持
- 缺点：窄列下容易产生"河流"（空白通道），间距不均匀

**贪心算法**
```ts
function greedyWrap(text: string, width: number, fontSize: number): string[] {
  const charWidth = fontSize * 0.55  // 估算字符宽度
  const maxChars = Math.floor(width / charWidth) - 1
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    if ((line + ' ' + word).trim().length <= maxChars) {
      line = (line + ' ' + word).trim()
    } else {
      if (line) lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}
```
- 优点：实现简单，速度快
- 缺点：没有全局优化，每行独立计算

**Knuth-Plass 算法**
- 核心概念：**糟糕度（badness）** 函数，衡量行的不完美程度
- 目标：最小化所有行的总糟糕度
- 方法：动态规划寻找最优断行点
- 效果：有效消除"河流"，间距分布均匀

## 总结

| 算法 | 效果 | 性能 | 实现难度 |
|------|------|------|---------|
| CSS Justify | 一般，有河流问题 | 最快（浏览器） | 无需实现 |
| Greedy | 中等 | 快 | 简单 |
| Knuth-Plass | 最好 | 中等 | 复杂 |

本 demo 展示了 Pretext 如何实现 Knuth-Plass 算法，通过对比三种方式帮助理解不同算法的视觉效果差异。

## 拓展：封装可复用的对齐工具

```ts
/**
 * 段落对齐工具
 * 支持三种对齐模式：left, greedy, knuth-plass
 */
class ParagraphAligner {
  private prepared: any
  private lineHeight: number

  constructor(font: string) {
    this.font = font
    this.lineHeight = this.parseLineHeight(font)
  }

  private parseLineHeight(font: string): number {
    const match = font.match(/\/([\d.]+)/)
    return match ? parseFloat(match[1]) : 1.5
  }

  /**
   * 测量段落高度
   */
  measure(text: string, maxWidth: number): { height: number; lineCount: number } {
    const prepared = prepare(text, this.font)
    return layout(prepared, maxWidth, this.lineHeight)
  }

  /**
   * CSS Justify 模式（浏览器原生）
   */
  renderWithCSSJustify(element: HTMLElement, text: string, maxWidth: number): void {
    element.style.textAlign = 'justify'
    element.style.wordSpacing = '0'
    element.style.width = maxWidth + 'px'
    element.textContent = text
  }

  /**
   * 贪心算法模式
   */
  renderWithGreedy(element: HTMLElement, text: string, maxWidth: number): void {
    const fontSize = parseFloat(this.font)
    const lines = this.greedyWrap(text, maxWidth, fontSize)
    element.textContent = lines.join('\n')
  }

  /**
   * Knuth-Plass 模式（使用 Pretext）
   */
  renderWithKnuthPlass(element: HTMLElement, text: string, maxWidth: number): void {
    const prepared = prepare(text, this.font)
    const { lines } = layoutWithLines(prepared, maxWidth, this.lineHeight)
    element.textContent = lines.map(l => l.text).join('\n')
  }

  private greedyWrap(text: string, width: number, fontSize: number): string[] {
    const charWidth = fontSize * 0.55
    const maxChars = Math.floor(width / charWidth) - 1
    const words = text.split(/\s+/)
    const lines: string[] = []
    let line = ''

    for (const word of words) {
      if ((line + ' ' + word).trim().length <= maxChars) {
        line = (line + ' ' + word).trim()
      } else {
        if (line) lines.push(line)
        line = word
      }
    }
    if (line) lines.push(line)
    return lines
  }
}

// 使用示例
const aligner = new ParagraphAligner('15px/1.7 Georgia, serif')
const { height } = aligner.measure('这是一段测试文本', 400)
aligner.renderWithKnuthPlass(document.getElementById('output'), '这是一段测试文本', 400)
```

**使用方式**：
```ts
// 初始化
const aligner = new ParagraphAligner('16px/1.8 Inter, sans-serif')

// 测量高度（用于虚拟列表等需要总高度的场景）
const { height, lineCount } = aligner.measure(myText, containerWidth)

// 渲染到元素（三种模式可选）
aligner.renderWithKnuthPlass(element, myText, containerWidth)
```
