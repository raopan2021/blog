# Demo 1：The Editorial Engine

> 多栏编辑布局 — 带可拖拽球体的实时文本重排，60fps 流畅运行，零 DOM 测量

## 展示

<iframe
  src="/blog/pretext-demo/the-editorial-engine.html"
  width="100%"
  height="600px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#0a0a0c;"
  allow="autoplay"
/>

## 代码拆分与实现原理

### 核心架构

```js
import { prepareWithSegments, layoutNextLine } from "./pretext.js"

// 核心思路：将多栏布局拆分为多个独立区域
// 每个区域有自己的可用宽度（考虑障碍物占用的空间）
```

### 多栏文本流式布局

```js
function flowText(prepared, orbs, columns) {
  let cursor = { segmentIndex: 0, graphemeIndex: 0 }
  const lines = []

  while (true) {
    // 1. 确定当前行位置和可用宽度
    const { availableWidth, x } = calculateAvailableSpace(cursor.y, orbs, columns)

    // 2. 使用 layoutNextLine 获取当前行文本
    const line = layoutNextLine(prepared, cursor, availableWidth)
    if (!line || !line.text.trim()) break

    // 3. 渲染文本
    lines.push({ text: line.text, x, y: cursor.y })
    cursor = line.end.cursor
    cursor.y += LINE_HEIGHT

    // 4. 检测障碍物碰撞，跳过被遮挡的区域
    const hitOrb = orbs.find(o => cursor.y > o.y && cursor.y < o.y + o.radius * 2)
    if (hitOrb) {
      cursor.y = hitOrb.y + hitOrb.radius * 2 + GAP
    }
  }
  return lines
}
```

### 60fps 性能保障

```js
// 1. 预处理阶段一次性 prepare
const prepared = prepareWithSegments(fullText, FONT)

// 2. 每帧只做纯算术运算，不触碰 DOM
function renderFrame() {
  // 更新球体位置（由用户拖拽或动画驱动）
  updateOrbPositions()

  // 重新计算文本流（但仍使用缓存的 prepared）
  const lines = flowText(prepared, orbs, columns)

  // Canvas 渲染
  ctx.clearRect(0, 0, width, height)
  lines.forEach(line => ctx.fillText(line.text, line.x, line.y))

  requestAnimationFrame(renderFrame)
}

// 3. 统计 DOM 读取次数（用于展示 Pretext 的零 DOM 特性）
let domReadCount = 0
// 整个渲染循环中，domReadCount 始终为 0
```

### 球体碰撞检测

```js
function calculateAvailableSpace(y, orbs, columns) {
  // 找出当前 y 坐标处所有与文本区域相交的球体
  const intersecting = orbs.filter(orb => {
    const orbTop = orb.y - orb.radius
    const orbBottom = orb.y + orb.radius
    return y > orbTop && y < orbBottom
  })

  if (intersecting.length === 0) {
    return { availableWidth: COLUMN_WIDTH, x: 0 }
  }

  // 找最左边的球体左边缘
  const leftmost = intersecting.reduce((min, o) => Math.min(min, o.x - o.radius), Infinity)
  return { availableWidth: leftmost, x: 0 }
}
```

## 总结

The Editorial Engine 展示了 Pretext 最强大的应用场景之一：**高频重排的实时布局**。

| 特性 | 实现方式 |
|------|---------|
| 零 DOM 测量 | `prepareWithSegments()` 一次性预处理 |
| 60fps 渲染 | `layoutNextLine()` 纯算术运算 |
| 多栏支持 | 分栏计算可用宽度 |
| 障碍物感知 | 球体碰撞检测，动态调整文本流 |

**核心 API**：`layoutNextLine()` — 流式文本布局，允许每行宽度动态变化

## 拓展：封装可复用的多栏文本布局组件

```ts
interface Orb {
  x: number
  y: number
  radius: number
}

interface Column {
  x: number
  width: number
}

interface FlowTextOptions {
  font: string
  lineHeight: number
  columns: Column[]
  gap?: number
}

class MultiColumnTextFlow {
  private prepared: any
  private options: FlowTextOptions

  constructor(text: string, options: FlowTextOptions) {
    this.options = options
    // 预处理文本（一次性）
    this.prepared = prepareWithSegments(text, options.font)
  }

  /**
   * 计算指定 y 坐标处的可用宽度
   */
  private getAvailableSpace(y: number, orbs: Orb[]): { width: number; x: number } {
    const { columns, gap = 8 } = this.options

    // 找出与当前行相交的球体
    const intersecting = orbs.filter(orb => {
      const orbTop = orb.y - orb.radius
      const orbBottom = orb.y + orb.radius
      return y > orbTop && y < orbBottom
    })

    if (intersecting.length === 0) {
      // 无障碍物，使用当前栏宽度
      const col = columns[0] // 简化：使用第一栏
      return { width: col.width, x: col.x }
    }

    // 找最左边的球体
    intersecting.sort((a, b) => (a.x - a.radius) - (b.x - b.radius))
    const leftmost = intersecting[0]
    const availableWidth = leftmost.x - leftmost.radius - this.options.columns[0].x - gap

    return {
      width: Math.max(availableWidth, 50),
      x: this.options.columns[0].x
    }
  }

  /**
   * 流式布局 — 生成所有行
   */
  flow(orbs: Orb[] = []): Array<{ text: string; x: number; y: number }> {
    const { lineHeight } = this.options
    let cursor = { segmentIndex: 0, graphemeIndex: 0 }
    let y = 0
    const lines: Array<{ text: string; x: number; y: number }> = []

    while (true) {
      const { width, x } = this.getAvailableSpace(y, orbs)

      const line = layoutNextLine(this.prepared, cursor, width)
      if (!line || !line.text.trim()) break

      lines.push({ text: line.text, x, y })
      cursor = line.end.cursor
      y += lineHeight

      // 跳过障碍物
      const hitOrb = orbs.find(orb => y > orb.y - orb.radius && y < orb.y + orb.radius)
      if (hitOrb) {
        y = hitOrb.y + hitOrb.radius * 2 + (this.options.gap || 8)
      }

      if (y > 10000) break // 安全限制
    }

    return lines
  }

  /**
   * 渲染到 Canvas
   */
  renderToCanvas(ctx: CanvasRenderingContext2D, orbs: Orb[] = []): void {
    const lines = this.flow(orbs)
    ctx.font = this.options.font
    ctx.textBaseline = 'top'

    lines.forEach(line => {
      ctx.fillText(line.text, line.x, line.y)
    })
  }

  /**
   * 更新文本内容（重新 prepare）
   */
  updateText(text: string): void {
    this.prepared = prepareWithSegments(text, this.options.font)
  }
}

// 使用示例
const layout = new MultiColumnTextFlow(articleText, {
  font: '16px/1.6 Georgia, serif',
  lineHeight: 24,
  columns: [
    { x: 0, width: 300 },
    { x: 320, width: 300 },
    { x: 640, width: 300 }
  ],
  gap: 20
})

// 拖拽球体时实时重排
orbs.forEach(orb => {
  orb.addEventListener('drag', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    layout.renderToCanvas(ctx, orbs)
    drawOrbs(ctx, orbs)
  })
})
```
