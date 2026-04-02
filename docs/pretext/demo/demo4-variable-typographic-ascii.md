# Demo 4：Variable Typographic ASCII

> 粒子系统映射为 ASCII 艺术 — 根据亮度和宽度选择字符，三种字重 × 斜体对比

## 展示

<iframe
  src="/blog/pretext-demo/variable-typographic-ascii.html"
  width="100%"
  height="500px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#0a0a12;"
  allow="autoplay"
/>

## 代码拆分与实现原理

### 核心思想

```
隐藏 Canvas（粒子模拟）
    ↓
采样每个位置的亮度
    ↓
根据亮度 + 宽度选择字符
    ↓
Georgia 三种字重 × 斜体（共 6 种变体）
    ↓
Pretext 测量每行宽度确保对齐
```

### 多字重字符映射

```js
// 定义 6 种字符变体（3 字重 × 2 样式）
const VARIANTS = [
  { class: 'w3', font: '300 Georgia', description: 'Light' },
  { class: 'w5', font: '500 Georgia', description: 'Regular' },
  { class: 'w8', font: '800 Georgia', description: 'Bold' },
  { class: 'it w3', font: '300 italic Georgia', description: 'Light Italic' },
  { class: 'it w5', font: '500 italic Georgia', description: 'Regular Italic' },
  { class: 'it w8', font: '800 italic Georgia', description: 'Bold Italic' },
]

// 透明度级别
const ALPHA_LEVELS = 10 // a1 - a10
```

### Pretext 测量宽度

```js
import { prepare, layout } from "./pretext.js"

function measureLineWidth(text, font) {
  const prepared = prepare(text, font)
  // layout() 的 width 参数用很大的值，实际宽度由文本决定
  const { width } = layout(prepared, 10000, lineHeight)
  return width
}

// 对比：Proportional vs Monospace
function renderComparison(frameData) {
  const proportionalLines = []
  const monospaceLines = []

  for (let y = 0; y < height; y += charHeight) {
    let propRow = ''
    let monoRow = ''

    for (let x = 0; x < width; x += charWidth) {
      const brightness = sampleBrightness(x, y, frameData)

      // 比例字体：根据亮度 + 宽度选择
      const variant = selectVariant(brightness, frameWidth)
      propRow += variant.char

      // 等宽字体：只用亮度
      monoRow += selectMonoChar(brightness)
    }

    // 关键：测量比例字体行的宽度
    const propWidth = measureLineWidth(propRow, propFont)

    proportionalLines.push({
      text: propRow,
      width: propWidth,
      class: getAlphaClass(brightness)
    })

    monospaceLines.push({
      text: monoRow,
      width: monospaceWidth,
      class: getAlphaClass(brightness)
    })
  }

  // 渲染到 DOM
  renderToDOM(proportionalLines, 'prop-box')
  renderToDOM(monospaceLines, 'mono-box')
}
```

### 字符选择逻辑

```js
// 根据亮度和宽度选择最优字符
function selectVariant(brightness, widthHint) {
  // 1. 根据亮度确定透明度级别
  const alphaLevel = Math.floor(brightness / 255 * (ALPHA_LEVELS - 1))

  // 2. 根据宽度提示（粒子系统密度）选择字重
  // 密度高 → 用粗体；密度低 → 用细体
  let weightIndex
  if (widthHint < lowThreshold) weightIndex = 0 // Light
  else if (widthHint < mediumThreshold) weightIndex = 1 // Regular
  else weightIndex = 2 // Bold

  // 3. 可选：随机添加斜体变化
  const isItalic = Math.random() > 0.7
  const variantIndex = weightIndex + (isItalic ? 3 : 0)

  return {
    char: CHARS[alphaLevel],
    class: VARIANTS[variantIndex].class,
    alphaClass: `a${alphaLevel + 1}`
  }
}
```

## 总结

Variable Typographic ASCII 展示了 Pretext 在**多字重比例字体测量**中的应用：

| 特性 | 实现 |
|------|------|
| Georgia 三字重 | 300 / 500 / 800 |
| 斜体变体 | normal / italic |
| 宽度测量 | Pretext `prepare()` + `layout()` |
| 粒子映射 | 亮度 → 透明度 + 密度 → 字重 |

**核心问题**：比例字体各字符宽度不同，用作文本艺术时需要精确测量每行宽度以保持对齐。Pretext 解决了这个问题。

## 拓展：封装可复用的多字重 ASCII 渲染器

```ts
interface CharVariant {
  char: string
  class: string
  font: string
}

interface ASCIIRendererOptions {
  fontSize: number
  baseFont: string
  weights?: number[]
  includeItalic?: boolean
  alphaLevels?: number
}

class VariableASCIIRenderer {
  private options: ASCIIRendererOptions
  private variants: CharVariant[]
  private charWidth: number
  private charHeight: number

  constructor(options: ASCIIRendererOptions) {
    this.options = {
      weights: [300, 500, 800],
      includeItalic: true,
      alphaLevels: 10,
      ...options
    }

    // 生成所有变体
    this.variants = this.generateVariants()

    // 测量字符尺寸
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    ctx.font = `${options.fontSize}px ${options.baseFont}`
    this.charWidth = ctx.measureText('M').width
    this.charHeight = options.fontSize * 1.2
  }

  /**
   * 生成字符变体表
   */
  private generateVariants(): CharVariant[] {
    const { baseFont, weights, includeItalic } = this.options
    const variants: CharVariant[] = []
    const chars = ' .:-=+*#%@'

    for (const weight of weights!) {
      const font = `${weight} ${baseFont}`
      variants.push({ char: chars[0], class: `w${weight / 100}`, font })

      if (includeItalic) {
        variants.push({
          char: chars[0],
          class: `w${weight / 100} it`,
          font: `${weight} italic ${baseFont}`
        })
      }
    }

    return variants
  }

  /**
   * 根据亮度和宽度选择字符
   */
  selectChar(brightness: number, widthHint: number): CharVariant {
    const { alphaLevels } = this.options

    // 亮度 → 透明度级别
    const alphaIndex = Math.min(
      Math.floor((brightness / 255) * alphaLevels!),
      alphaLevels! - 1
    )

    // 宽度 → 字重索引
    const weightIndex = this.getWeightIndex(widthHint)

    return this.variants[weightIndex]
  }

  /**
   * 获取宽度等级对应的变体索引
   */
  private getWeightIndex(widthHint: number): number {
    const { weights } = this.options

    if (widthHint < 0.33) return 0 // Light
    if (widthHint < 0.66) return 1 // Regular
    return 2 // Bold
  }

  /**
   * 渲染帧到容器
   */
  renderFrame(
    frameData: ImageData,
    container: HTMLElement,
    width: number,
    height: number
  ): void {
    const cols = Math.ceil(width / this.charWidth)
    const rows = Math.ceil(height / this.charHeight)

    let html = ''

    for (let r = 0; r < rows; r++) {
      let line = ''
      let classes: string[] = []

      for (let c = 0; c < cols; c++) {
        const x = c * this.charWidth
        const y = r * this.charHeight

        const brightness = this.sampleBrightness(frameData, x, y)
        const widthHint = this.sampleWidthHint(frameData, x, y)

        const variant = this.selectChar(brightness, widthHint)
        const alphaClass = `a${Math.floor((brightness / 255) * 10) + 1}`

        line += variant.char
        classes.push(variant.class)
        classes.push(alphaClass)
      }

      // 取最常用的类
      const mainClass = this.mostCommon(classes)
      html += `<div class="art-row ${mainClass}">${line}</div>`
    }

    container.innerHTML = html
  }

  private sampleBrightness(frameData: ImageData, x: number, y: number): number {
    const idx = (Math.floor(y) * frameData.width + Math.floor(x)) * 4
    const r = frameData.data[idx]
    const g = frameData.data[idx + 1]
    const b = frameData.data[idx + 2]
    return r * 0.299 + g * 0.587 + b * 0.114
  }

  private sampleWidthHint(frameData: ImageData, x: number, y: number): number {
    // 简化为亮度作为宽度提示
    return this.sampleBrightness(frameData, x, y) / 255
  }

  private mostCommon(arr: string[]): string {
    const counts = new Map<string, number>()
    for (const item of arr) {
      counts.set(item, (counts.get(item) || 0) + 1)
    }
    let maxCount = 0
    let mostCommon = ''
    counts.forEach((count, item) => {
      if (count > maxCount) {
        maxCount = count
        mostCommon = item
      }
    })
    return mostCommon
  }
}
```
