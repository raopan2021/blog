# Demo 3：动态布局

> 障碍物感知文本布局：点击画布添加障碍物，文字自动绕流

## 展示

<iframe
  src="/blog/pretext-demo/dynamic-layout.html"
  width="100%"
  height="580px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f1ea;"
  allow="autoplay"
/>

## 代码拆分与实现原理

### 核心：layoutNextLine 流式布局

```ts
import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext'

// layoutNextLine 是流式 API，每行宽度可以动态变化
function flowTextAround(prepared, obstacles, columnWidth, lineHeight, startY) {
  let cursor = { segmentIndex: 0, graphemeIndex: 0 }
  let y = startY
  const lines = []

  while (true) {
    // 计算当前行可用宽度
    const obsInRow = obstacles
      .filter(o => o.y + o.h > y && o.y < y + lineHeight)
      .sort((a, b) => a.x - b.x) // 按 x 排序

    let availableWidth = columnWidth
    if (obsInRow.length > 0) {
      availableWidth = obsInRow[0].x // 障碍物左边缘之前的宽度
    }

    if (availableWidth <= 0) break

    // 关键：每行调用 layoutNextLine，cursor 自动前进
    const line = layoutNextLine(prepared, cursor, availableWidth)
    if (!line || line.text.trim() === '') break

    lines.push({ text: line.text, y, x: 0 })
    cursor = line.end.cursor
    y += lineHeight

    // 跳过障碍物
    const hitObs = obstacles.find(o => y >= o.y - 2 && y <= o.y + o.h + 2)
    if (hitObs) {
      y = hitObs.y + hitObs.h + 6
    }

    if (y > maxY) break
  }

  return lines
}
```

### 完整绘制逻辑

```ts
function draw() {
  ctx.clearRect(0, 0, cw, ch)
  ctx.fillStyle = '#fffdf8'
  ctx.fillRect(0, 0, cw, ch)

  const prepared = prepareWithSegments(text, font)
  let cursor = { segmentIndex: 0, graphemeIndex: 0 }
  let y = 30
  const margin = 30

  ctx.font = font
  ctx.fillStyle = '#201b18'
  ctx.textBaseline = 'top'

  while (true) {
    // 找当前行的障碍物
    const obsInRow = obstacles.filter(o => o.y + o.h > y && o.y < y + lineH)
    obsInRow.sort((a, b) => a.x - b.x)

    let availableX = margin
    let availableW = cw - margin * 2

    // 第一障碍物决定宽度
    if (obsInRow.length > 0 && obsInRow[0].x < cw - margin) {
      availableW = obsInRow[0].x - availableX - 8
    }

    if (availableW <= 0) break

    const line = layoutNextLine(prepared, cursor, availableW)
    if (!line || line.text.trim() === '') break

    ctx.fillText(line.text, availableX, y)
    cursor = line.end.cursor
    y += lineH

    // 障碍物换行
    const hitObs = obstacles.find(o => y >= o.y - 2 && y <= o.y + o.h + 2)
    if (hitObs) {
      y = hitObs.y + hitObs.h + 6
    }

    if (y > ch - 30) break
  }

  // 绘制障碍物...
}
```

## 总结

本 demo 展示了 Pretext 最强大的功能之一：**流式布局**。

- **核心 API**：`layoutNextLine()` 允许每行宽度不同
- **应用场景**：文本环绕图片、杂志式布局、自定义排版
- **性能优势**：整个绘制过程不触发任何 DOM 回流

## 拓展：封装可复用的文本绕流组件

```ts
interface Obstacle {
  x: number
  y: number
  w: number
  h: number
}

interface FlowTextOptions {
  font: string
  lineHeight: number
  margin: number
  columnWidth: number
  gap?: number // 与障碍物的间距
}

class FlowTextRenderer {
  private text: string
  private options: FlowTextOptions

  constructor(text: string, options: FlowTextOptions) {
    this.text = text
    this.options = { gap: 6, ...options }
  }

  /**
   * 渲染文本到 Canvas，绕开障碍物
   */
  renderToCanvas(ctx: CanvasRenderingContext2D, obstacles: Obstacle[]): void {
    const { font, lineHeight, margin, columnWidth, gap } = this.options
    const prepared = prepareWithSegments(this.text, font)

    let cursor = { segmentIndex: 0, graphemeIndex: 0 }
    let y = margin

    ctx.font = font
    ctx.textBaseline = 'top'

    while (true) {
      // 计算当前行可用区域
      const { availableX, availableW } = this.calculateAvailableArea(y, lineHeight, obstacles)

      if (availableW <= 0) break

      const line = layoutNextLine(prepared, cursor, availableW)
      if (!line || line.text.trim() === '') break

      ctx.fillText(line.text, availableX, y)
      cursor = line.end.cursor
      y += lineHeight

      // 检查是否遇到障碍物，需要换行
      const hitObs = this.getObstacleAtY(y, obstacles)
      if (hitObs) {
        y = hitObs.y + hitObs.h + (gap || 6)
      }

      if (y > ctx.canvas.height - margin) break
    }
  }

  /**
   * 测量文本总高度
   */
  measureHeight(obstacles: Obstacle[] = []): number {
    const { lineHeight, margin, columnWidth } = this.options
    const prepared = prepareWithSegments(this.text, font)
    let cursor = { segmentIndex: 0, graphemeIndex: 0 }
    let y = margin
    let lineCount = 0

    while (true) {
      const { availableW } = this.calculateAvailableArea(y, lineHeight, obstacles)

      if (availableW <= 0) break

      const line = layoutNextLine(prepared, cursor, availableW)
      if (!line || line.text.trim() === '') break

      cursor = line.end.cursor
      y += lineHeight
      lineCount++

      const hitObs = this.getObstacleAtY(y, obstacles)
      if (hitObs) {
        y = hitObs.y + hitObs.h + 6
      }

      if (y > 10000) break // 安全限制
    }

    return y + margin
  }

  private calculateAvailableArea(y: number, lineHeight: number, obstacles: Obstacle[]) {
    const { margin, columnWidth, gap } = this.options
    const obsInRow = obstacles
      .filter(o => o.y + o.h > y && o.y < y + lineHeight)
      .sort((a, b) => a.x - b.x)

    if (obsInRow.length > 0 && obsInRow[0].x < columnWidth - margin) {
      return {
        availableX: margin,
        availableW: obsInRow[0].x - margin - (gap || 6)
      }
    }

    return {
      availableX: margin,
      availableW: columnWidth - margin * 2
    }
  }

  private getObstacleAtY(y: number, obstacles: Obstacle[]): Obstacle | null {
    return obstacles.find(o => y >= o.y - 2 && y <= o.y + o.h + 2) || null
  }
}

// 使用示例
const renderer = new FlowTextRenderer(textContent, {
  font: '14px/1.7 Georgia, serif',
  lineHeight: 23.8,
  margin: 30,
  columnWidth: 760,
  gap: 8
})

// 渲染到 Canvas
renderer.renderToCanvas(ctx, obstacles)

// 测量需要的总高度（用于滚动条）
const totalHeight = renderer.measureHeight(obstacles)
```

**应用场景**：
- 图片旁边环绕文字
- 杂志式复杂排版
- 广告位感知的文章布局
- 动态插入浮动元素后的文本重排
