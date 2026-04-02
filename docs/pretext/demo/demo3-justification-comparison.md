# Demo 3：对齐算法对比

> 三种段落对齐算法对比：CSS 浏览器默认、贪心连字符、Knuth-Plass 最优算法

## 展示

<iframe
  src="/blog/pretext-demo/justification-comparison.html"
  width="100%"
  height="700px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#faf8f5;"
  allow="autoplay"
/>

## 代码拆分与实现原理

### 三种算法对比

| 算法 | 实现方式 | 效果 |
|------|---------|------|
| CSS Justify | 浏览器原生 `text-align: justify` | 有"河流"问题 |
| Greedy + Hyphen | 贪心断行 + 音节连字符 | 较好，仍有缺陷 |
| Knuth-Plass | 全局优化动态规划 | 最佳，消除河流 |

### 1. CSS / Greedy（贪心）

```js
// 贪心算法：每行尽可能填词，到行尾断开
function greedyLayout(prepared, maxWidth) {
  const lines = []
  let cursor = { segmentIndex: 0, graphemeIndex: 0 }

  while (true) {
    const line = layoutNextLine(prepared, cursor, maxWidth)
    if (line === null) break

    lines.push({
      text: line.text,
      start: line.start,
      end: line.end
    })

    cursor = line.end
  }

  return lines
}
```

### 2. 连字符（Hyyphenation）

```js
// 音节拆分词典（部分示例）
const HYPHEN_EXCEPTIONS = {
  'typographic': ['ty', 'po', 'graph', 'ic'],
  'comprehension': ['com', 'pre', 'hen', 'sion'],
  // ...
}

// 音节拆分
function hyphenateWord(word) {
  const lower = word.toLowerCase()
  const exc = HYPHEN_EXCEPTIONS[lower]
  if (exc) {
    // 从词典返回音节数组
    return exc
  }
  // 前缀/后缀规则...
  return [word]
}

// 应用连字符处理
const hyphenated = words.map(word => {
  const parts = hyphenateWord(word)
  return parts.join('\u00AD') // 软连字符 (U+00AD)
}).join('')
```

### 3. Knuth-Plass 最优算法

```js
// 核心：动态规划找最小糟糕度
function optimalLayout(prepared, maxWidth) {
  const segs = prepared.segments
  const widths = prepared.widths
  const n = segs.length

  // 1. 收集所有可能的断点
  const breakCandidates = [{ segIndex: 0 }]
  for (let i = 0; i < n; i++) {
    if (text === '\u00AD') breakCandidates.push({ segIndex: i + 1, isSoftHyphen: true })
    else if (text.trim().length === 0) breakCandidates.push({ segIndex: i + 1 })
  }

  // 2. 糟糕度函数（badness）
  function lineBadness(info, isLastLine) {
    if (isLastLine) return 0
    if (info.spaceCount <= 0) {
      const slack = maxWidth - info.wordWidth
      return slack < 0 ? 1e8 : slack * slack * 10 // 惩罚太满的行
    }

    // 计算均匀间距与标准间距的偏差
    const justifiedSpace = (maxWidth - info.wordWidth) / info.spaceCount
    const ratio = (justifiedSpace - NORMAL_SPACE_W) / NORMAL_SPACE_W
    const badness = ratio * ratio * ratio * 1000

    // 河流惩罚
    const riverExcess = justifiedSpace / NORMAL_SPACE_W - 1.5
    const riverPenalty = riverExcess > 0 ? 5000 : 0

    return badness + riverPenalty
  }

  // 3. 动态规划
  const dp = new Array(numCandidates).fill(1 / 0)
  const prev = new Array(numCandidates).fill(-1)
  dp[0] = 0

  for (let j = 1; j < numCandidates; j++) {
    for (let i = j - 1; i >= 0; i--) {
      const info = getLineInfo(i, j)
      const bad = lineBadness(info, j === numCandidates - 1)
      if (dp[i] + bad < dp[j]) {
        dp[j] = dp[i] + bad
        prev[j] = i
      }
    }
  }

  // 4. 回溯重建最优解
  const breaks = []
  let cur = numCandidates - 1
  while (cur > 0) {
    breaks.push(cur)
    cur = prev[cur]
  }
  breaks.reverse()
}
```

### 质量指标计算

```js
// 计算对齐质量指标
function computeMetrics(allLines) {
  let totalDev = 0
  let maxDev = 0
  let rivers = 0

  for (const paraLines of allLines) {
    for (const line of paraLines) {
      if (line.isLast) continue

      const spaceWidth = (line.maxWidth - line.wordWidth) / line.spaceCount
      const deviation = Math.abs(spaceWidth - NORMAL_SPACE_W) / NORMAL_SPACE_W

      totalDev += deviation
      maxDev = Math.max(maxDev, deviation)

      // 检测"河流"（间距过大的空白）
      if (spaceWidth > NORMAL_SPACE_W * 1.5) rivers++
    }
  }

  return {
    avgDeviation: totalDev / count,
    maxDeviation: maxDev,
    riverCount: rivers,
    lineCount: allLines.reduce((sum, p) => sum + p.length, 0)
  }
}
```

## 总结

Justification Compared 深入展示了 Knuth-Plass 算法的实现：

| 特性 | 说明 |
|------|------|
| 糟糕度函数 | 衡量行的不完美程度 |
| 河流惩罚 | 特别惩罚形成"河流"的间距 |
| 动态规划 | O(n²) 找全局最优解 |
| 连字符辅助 | 减少剩余空间，降低糟糕度 |

**核心 API**：`walkLineRanges()` — 遍历所有行范围，计算质量指标

## 拓展：封装可复用的对齐工具

```ts
interface JustificationOptions {
  font: string
  lineHeight: number
  hyphenate?: boolean
}

interface LineMetrics {
  text: string
  wordWidth: number
  spaceCount: number
  badness: number
  isLastLine: boolean
}

class ParagraphJustifier {
  private prepared: any
  private options: JustificationOptions
  private NORMAL_SPACE_W: number

  constructor(text: string, options: JustificationOptions) {
    this.options = options

    // 测量标准空格宽度
    const measureCanvas = document.createElement('canvas')
    const ctx = measureCanvas.getContext('2d')!
    ctx.font = options.font
    this.NORMAL_SPACE_W = ctx.measureText(' ').width

    // 预处理
    const processedText = options.hyphenate
      ? this.hyphenate(text)
      : text
    this.prepared = prepareWithSegments(processedText, options.font)
  }

  /**
   * 贪心布局
   */
  greedyLayout(maxWidth: number): LineMetrics[] {
    const lines: LineMetrics[] = []
    let cursor = { segmentIndex: 0, graphemeIndex: 0 }

    while (true) {
      const line = layoutNextLine(this.prepared, cursor, maxWidth)
      if (!line) break

      const metrics = this.computeLineMetrics(line, maxWidth, lines.length === 0)
      lines.push(metrics)
      cursor = line.end.cursor
    }

    return lines
  }

  /**
   * Knuth-Plass 最优布局
   */
  optimalLayout(maxWidth: number): LineMetrics[] {
    // 完整实现见 Demo 代码...
    return this.knuthPlass(maxWidth)
  }

  /**
   * 渲染对齐文本到 Canvas
   */
  renderToCanvas(ctx: CanvasRenderingContext2D, maxWidth: number, algorithm: 'greedy' | 'optimal'): void {
    const lines = algorithm === 'greedy'
      ? this.greedyLayout(maxWidth)
      : this.optimalLayout(maxWidth)

    let y = 0
    ctx.font = this.options.font
    ctx.textBaseline = 'top'

    for (const line of lines) {
      if (line.isLast) {
        // 最后一行左对齐
        ctx.fillText(line.text, 0, y)
      } else {
        // 非最后一行两端对齐
        this.renderJustifiedLine(ctx, line, maxWidth, y)
      }
      y += this.options.lineHeight
    }
  }

  /**
   * 质量评估
   */
  evaluate(lines: LineMetrics[]): { avgDeviation: number; riverCount: number } {
    let totalDev = 0
    let rivers = 0
    let count = 0

    for (const line of lines) {
      if (line.isLast) continue
      if (line.spaceCount <= 0) continue

      const justifiedSpace = (maxWidth - line.wordWidth) / line.spaceCount
      const deviation = Math.abs(justifiedSpace - this.NORMAL_SPACE_W) / this.NORMAL_SPACE_W
      totalDev += deviation
      count++

      if (justifiedSpace > this.NORMAL_SPACE_W * 1.5) rivers++
    }

    return {
      avgDeviation: count > 0 ? totalDev / count : 0,
      riverCount: rivers
    }
  }

  private hyphenate(text: string): string {
    // 简化的连字符实现
    return text
  }

  private computeLineMetrics(line: any, maxWidth: number, isFirst: boolean): LineMetrics {
    // 计算行的各项指标
    return { text: line.text, wordWidth: 0, spaceCount: 0, badness: 0, isLastLine: false }
  }

  private knuthPlass(maxWidth: number): LineMetrics[] {
    // 完整的 Knuth-Plass 实现
    return []
  }

  private renderJustifiedLine(ctx: CanvasRenderingContext2D, line: LineMetrics, maxWidth: number, y: number): void {
    if (line.spaceCount <= 0) {
      ctx.fillText(line.text, 0, y)
      return
    }

    const justifiedSpace = (maxWidth - line.wordWidth) / line.spaceCount
    const words = line.text.split(' ')
    let x = 0

    for (let i = 0; i < words.length; i++) {
      ctx.fillText(words[i], x, y)
      if (i < words.length - 1) {
        x += ctx.measureText(words[i]).width + justifiedSpace
      }
    }
  }
}
```
