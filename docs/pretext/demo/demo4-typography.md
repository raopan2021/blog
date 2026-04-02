# Demo 4：字体测量

> 用 Pretext 精确测量不同字体大小下的行高和段落高度

## 展示

<iframe
  src="/blog/pretext-demo/typography.html"
  width="100%"
  height="540px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f1ea;"
  allow="autoplay"
/>

## 代码拆分与实现原理

### 字体刻度表定义

```ts
interface FontScale {
  label: string      // 显示名称
  size: number       // 字号
  family: string     // 字体族
  color?: string     // 颜色
}

const scales: FontScale[] = [
  { label: 'Display', size: 36, family: 'Georgia, serif', color: '#201b18' },
  { label: 'H1', size: 28, family: 'Georgia, serif', color: '#201b18' },
  { label: 'H2', size: 22, family: 'Georgia, serif', color: '#201b18' },
  { label: 'H3', size: 18, family: 'Helvetica Neue, sans-serif', color: '#201b18' },
  { label: 'Body Large', size: 16, family: 'Helvetica Neue, sans-serif', color: '#201b18' },
  { label: 'Body', size: 14, family: 'Helvetica Neue, sans-serif', color: '#6d645d' },
  { label: 'Caption', size: 12, family: 'Helvetica Neue, sans-serif', color: '#6d645d' },
  { label: 'Small', size: 11, family: 'Helvetica Neue, sans-serif', color: '#6d645d' },
]
```

### 测量不同字号

```ts
function renderScale(width: number) {
  scales.forEach(scale => {
    const font = `${scale.size}px/1.5 ${scale.family}`
    const prepared = prepare(sampleText, font)

    // 核心：使用 Pretext 测量
    const { height, lineCount } = layout(prepared, width - 48, scale.size * 1.5)

    // 渲染到 DOM（仅用于展示，实际不需要）
    const row = document.createElement('div')
    row.innerHTML = `
      <span class="label">${scale.label}</span>
      <span class="text" style="font:${font}">${sampleText}</span>
      <span class="meta">${Math.round(height)}px · ${lineCount}行</span>
    `
    container.appendChild(row)
  })
}
```

### 为什么行高不是 font-size 的倍数？

```
CSS line-height 是推荐值，但实际渲染高度由字体设计决定。
例如：font-size: 16px, line-height: 1.5
→ CSS 期望 24px (16 * 1.5)
→ 实际渲染可能是 25.6px（字体设计上考虑 ascender/descender）
```

Pretext 使用 Canvas `measureText` 读取精确的字形度量，可以准确预测实际渲染高度。

## 总结

本 demo 展示了 Pretext 的**字体测量**能力：

- 精确预测不同字号的实际渲染高度
- 用于：**字体刻度系统**、**响应式 Typography**、**CLS 优化**
- 核心问题：CSS 的 line-height 是近似值，Pretext 给出精确值

## 拓展：封装可复用的字体测量工具

```ts
interface TypographySpec {
  label: string
  size: number
  family: string
  lineHeight?: number
  color?: string
}

interface MeasuredTypography extends TypographySpec {
  measuredHeight: number
  measuredLineCount: number
  actualLineHeight: number
}

class TypographyMeasurer {
  private containerWidth: number
  private cache: Map<string, MeasuredTypography> = new Map()

  constructor(containerWidth: number) {
    this.containerWidth = containerWidth
  }

  /**
   * 测量单个 Typography 规格
   */
  measure(spec: TypographySpec): MeasuredTypography {
    const cacheKey = `${spec.label}-${spec.size}-${spec.family}-${this.containerWidth}`

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const lineHeight = spec.lineHeight || spec.size * 1.5
    const font = `${spec.size}px/${lineHeight} ${spec.family}`

    const prepared = prepare(sampleText, font)
    const { height, lineCount } = layout(prepared, this.containerWidth, lineHeight)

    const result: MeasuredTypography = {
      ...spec,
      measuredHeight: Math.round(height),
      measuredLineCount: lineCount,
      actualLineHeight: height / lineCount
    }

    this.cache.set(cacheKey, result)
    return result
  }

  /**
   * 批量测量字体刻度表
   */
  measureScale(scale: TypographySpec[]): MeasuredTypography[] {
    return scale.map(spec => this.measure(spec))
  }

  /**
   * 更新容器宽度（响应式）
   */
  updateWidth(newWidth: number): void {
    if (newWidth !== this.containerWidth) {
      this.containerWidth = newWidth
      this.cache.clear() // 清除缓存
    }
  }
}

// 响应式 Typography 组件
class ResponsiveTypography {
  private measurer: TypographyMeasurer
  private scale: TypographySpec[]
  private container: HTMLElement

  constructor(container: HTMLElement, scale: TypographySpec[]) {
    this.container = container
    this.scale = scale
    this.measurer = new TypographyMeasurer(container.clientWidth)
  }

  /**
   * 渲染测量结果到 DOM
   */
  render(): void {
    const measured = this.measurer.measureScale(this.scale)

    this.container.innerHTML = measured.map(item => `
      <div class="typo-row">
        <span class="label">${item.label}</span>
        <span class="text" style="
          font-size: ${item.size}px;
          font-family: ${item.family};
          color: ${item.color || 'inherit'};
          line-height: ${item.actualLineHeight}px;
        ">${sampleText}</span>
        <span class="meta">
          ${item.measuredHeight}px · ${item.measuredLineCount}行
        </span>
      </div>
    `).join('')
  }

  /**
   * 响应式更新
   */
  resize(): void {
    this.measurer.updateWidth(this.container.clientWidth)
    this.render()
  }
}

// 使用示例
const typography = new ResponsiveTypography(
  document.getElementById('scale-container'),
  [
    { label: 'Display', size: 36, family: 'Georgia, serif' },
    { label: 'H1', size: 28, family: 'Georgia, serif' },
    { label: 'H2', size: 22, family: 'Georgia, serif' },
    { label: 'Body', size: 15, family: 'Helvetica Neue, sans-serif', color: '#333' },
    { label: 'Caption', size: 12, family: 'Helvetica Neue, sans-serif', color: '#666' },
  ]
)

typography.render()

// 响应式
window.addEventListener('resize', () => typography.resize())
```

**应用场景**：
- 设计系统的 Typography 刻度验证
- 在渲染前预知容器需要的精确高度
- 构建精确的垂直节奏（vertical rhythm）
- CLS 优化：避免文字加载时的布局跳动
