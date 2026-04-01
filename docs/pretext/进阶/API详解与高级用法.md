# API 详解与高级用法

> 从 prepare 到 layoutWithLines，每个 API 的细节与最佳实践

## 核心 API 总览

| API | 用途 | 性能 |
|-----|------|------|
| `prepare()` | 一次性文本预处理 + Canvas 测量 | ~19ms/500条 |
| `layout()` | 计算高度和行数（热路径） | ~0.09ms/500条 |
| `prepareWithSegments()` | 返回分段信息 | ~19ms/500条 |
| `layoutWithLines()` | 获取每行文本内容 | ~0.1ms/500条 |
| `walkLineRanges()` | 遍历行范围（不构建字符串） | ~0.05ms/500条 |
| `layoutNextLine()` | 流式布局下一行 | ~0.01ms/行 |

## prepare() — 一次性预处理

```typescript
function prepare(
  text: string,
  font: string,
  options?: {
    whiteSpace?: 'normal' | 'pre-wrap'
  }
): PreparedText
```

### 参数详解

**`text`**：要测量的文本

```typescript
// 支持多行文本
const prepared = prepare('第一行\n第二行', '16px Inter')

// 支持混合语言
const prepared = prepare('Hello 你好 مرحبا 🚀', '16px Inter')
```

**`font`**：CSS font shorthand 格式（必须与实际渲染一致！）

```typescript
// 常见格式
prepare(text, '16px Inter')
prepare(text, 'bold 16px Inter')
prepare(text, 'italic 16px "Helvetica Neue"')
prepare(text, '12px/1.5 sans-serif') // ❌ line-height 不在这里指定
prepare(text, '16px system-ui') // ✅

// ⚠️ 必须与实际 CSS font 一致
// <div style="font: 16px Inter">text</div>  → prepare(text, '16px Inter')
```

**`options.whiteSpace`**：空格和换行处理

```typescript
// 默认 'normal'
prepare(text, '16px Inter')
// \n → 视为软换行（可断行）
// 多个空格 → 合并成一个

// 'pre-wrap'（保留原始格式）
prepare(text, '16px Inter', { whiteSpace: 'pre-wrap' })
// \n → 强制换行
// \t → 制表符
// 多个空格 → 保留原样
```

### 返回值：PreparedText

```typescript
const prepared: PreparedText = prepare('Hello', '16px Inter')
// 这是一个"不透明句柄"（opaque handle）
// 内部包含：归一化后的文本、字形分段信息、宽度缓存

// ⚠️ 不要手动修改或读取内部属性
// ⚠️ 同一个 prepared 不要复用于不同的 font
```

## layout() — 热路径计算

```typescript
function layout(
  prepared: PreparedText,
  maxWidth: number,
  lineHeight: number
): { height: number; lineCount: number }
```

### 参数详解

**`prepared`**：`prepare()` 返回的句柄

```typescript
const prepared = prepare('Hello World', '16px Inter')
```

**`maxWidth`**：每行最大宽度（像素）

```typescript
// 用容器宽度作为最大宽度
const container = document.getElementById('content')
const width = container.clientWidth
const { height } = layout(prepared, width, 24)
```

**`lineHeight`**：行高（像素）

```typescript
// lineHeight 必须与 CSS line-height 一致
// CSS: line-height: 24px → lineHeight: 24
const { height } = layout(prepared, width, 24)
```

### 返回值详解

```typescript
const { height, lineCount } = layout(prepared, 320, 24)

height    // 段落总高度（px），可用于设置容器高度
lineCount // 总行数
```

## 实战：虚拟列表

这是 Pretext 最常见的应用场景——**精确的虚拟滚动**：

```typescript
import { prepare, layout } from '@chenglou/pretext'

class VirtualList {
  constructor(options) {
    this.items = options.items
    this.itemHeight = options.itemHeight // 预估高度
    this.containerHeight = options.containerHeight
    this.font = options.font
    this.padding = options.padding || 0

    // 预处理所有 item
    this.prepared = this.items.map(item =>
      prepare(item.text, this.font)
    )
  }

  // 计算每个 item 的实际高度（带缓存）
  getItemHeight(index, width) {
    const result = layout(this.prepared[index], width, this.itemHeight)
    return result.height + this.padding * 2
  }

  // 获取可视区域
  getVisibleRange(scrollTop, width) {
    let startIndex = 0
    let offset = 0

    // 找到滚动位置对应的 item
    for (let i = 0; i < this.items.length; i++) {
      const h = this.getItemHeight(i, width)
      if (offset + h > scrollTop) {
        startIndex = i
        break
      }
      offset += h
    }

    // 计算可见数量
    let endIndex = startIndex
    let visibleHeight = 0
    while (endIndex < this.items.length && visibleHeight < this.containerHeight) {
      visibleHeight += this.getItemHeight(endIndex, width)
      endIndex++
    }

    return { startIndex, endIndex, offset }
  }
}
```

## layoutWithLines() — 获取每行内容

```typescript
function layoutWithLines(
  prepared: PreparedText,
  maxWidth: number,
  lineHeight: number
): { lines: Array<{ text: string; width: number }> }
```

### 返回值详解

```typescript
const prepared = prepareWithSegments('Hello 世界', '16px Inter')
const { lines } = layoutWithLines(prepared, 100, 24)

lines[0]  // { text: 'Hello ', width: 50 }  // 英文带空格
lines[1]  // { text: '世界', width: 32 }     // 中文
```

### Canvas 渲染示例

```typescript
const prepared = prepareWithSegments(longText, '18px Inter')
const { lines } = layoutWithLines(prepared, canvas.width, 24)

ctx.font = '18px Inter'
ctx.fillStyle = '#333'

lines.forEach((line, i) => {
  ctx.fillText(line.text, 0, i * 24 + 18) // y = 行高 * 行号 + baseline
})
```

## walkLineRanges() — 低开销遍历

```typescript
function walkLineRanges(
  prepared: PreparedText,
  maxWidth: number,
  callback: (line: { width: number; start: Cursor; end: Cursor }) => void
): void
```

适合**只需要宽度，不需要文本内容**的场景（更省内存）：

```typescript
// 找出最宽的行
let maxWidth = 0
let maxLineCursor = null

walkLineRanges(prepared, 320, (line) => {
  if (line.width > maxWidth) {
    maxWidth = line.width
    maxLineCursor = line
  }
})

console.log(`最宽的行宽度: ${maxWidth}px`)
// 这个值可以用来"shrink-wrap"容器宽度
```

## layoutNextLine() — 流式布局

适合**动态宽度**场景（如文本环绕图片）：

```typescript
let cursor = { segmentIndex: 0, graphemeIndex: 0 }
let y = 0

while (true) {
  // 动态计算当前行宽度
  const width = y < imageBottom ? columnWidth - imageWidth : columnWidth

  const line = layoutNextLine(prepared, cursor, width)
  if (line === null) break // 文本结束

  ctx.fillText(line.text, 0, y)
  cursor = line.end.cursor
  y += lineHeight
}
```

## 性能优化：不要重复 prepare()

```typescript
// ❌ 每次 render 都重新 prepare（浪费）
function render() {
  const prepared = prepare(text, '16px Inter') // 每帧都测一遍！
  const { height } = layout(prepared, width, 24)
  container.style.height = height + 'px'
}

// ✅ 预计算一次，layout() 在 resize 时调用
let prepared = null

function init() {
  prepared = prepare(text, '16px Inter') // 只在初始化时执行一次
}

function onResize() {
  const { height } = layout(prepared, newWidth, 24) // resize 时只做算术
  container.style.height = height + 'px'
}
```

## 总结

| API | 场景 |
|-----|------|
| `layout()` | 只需要高度和行数（虚拟滚动必备） |
| `layoutWithLines()` | 需要渲染每行文本（Canvas/SVG） |
| `walkLineRanges()` | 只关心行宽度，不关心文本内容 |
| `layoutNextLine()` | 文本环绕、分页等流式场景 |
