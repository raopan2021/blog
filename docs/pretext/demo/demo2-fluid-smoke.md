# Demo 2：Fluid Smoke

> 全屏流体模拟 — 以等宽字体 ASCII 艺术渲染

## 展示

<iframe
  src="/blog/pretext-demo/fluid-smoke.html"
  width="100%"
  height="600px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#06060a;"
  allow="autoplay"
/>

## 代码拆分与实现原理

### 核心架构

```
Canvas 隐藏层：粒子系统模拟流体
     ↓
ASCII 可见层：文本字符渲染
     ↓
字符根据亮度值选择（10 级透明度）
```

### 双层 Canvas 结构

```html
<!-- 隐藏层：粒子模拟 -->
<canvas id="sim" style="display:none"></canvas>

<!-- 可见层：ASCII 渲染 -->
<div id="art"></div>
```

### 亮度采样与字符映射

```js
// 采样粒子系统的亮度值
function sampleBrightness(x, y, simCanvas) {
  const ctx = simCanvas.getContext('2d')
  const pixel = ctx.getImageData(x, y, 1, 1).data
  // 计算亮度（0-255）
  return (pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114)
}

// 根据亮度选择字符和透明度
function getCharAndClass(brightness) {
  const level = Math.floor(brightness / 25.5) // 0-10 级
  const chars = ' .:-=+*#%@' // 从暗到亮的字符
  return {
    char: chars[Math.min(level, chars.length - 1)],
    class: `a${level + 1}` // a1 - a10 透明度类
  }
}
```

### ASCII 渲染（Pretext 测量宽度）

```js
// 关键：使用 Pretext 测量字符宽度以保持对齐
import { prepare } from "./pretext.js"

function renderASCII(frame, artContainer, charWidth, charHeight) {
  const rows = []

  for (let y = 0; y < simCanvas.height; y += charHeight) {
    let row = ''
    for (let x = 0; x < simCanvas.width; x += charWidth) {
      const brightness = sampleBrightness(x, y, simCanvas)
      const { char } = getCharAndClass(brightness)
      row += char
    }

    // 测量行宽度确保对齐
    const prepared = prepare(row, FONT)
    const { width } = layout(prepared, 10000, charHeight)

    rows.push({
      text: row,
      measuredWidth: width
    })
  }

  // 渲染到 DOM
  artContainer.innerHTML = rows.map(r =>
    `<div class="r ${r.class}">${r.text}</div>`
  ).join('')
}
```

### Pretext 的作用

```js
// Pretext 确保每个字符宽度一致（Georgia 是比例字体）
// 如果直接用 canvas.fillText，各字符宽度不同会导致行错位

// 使用 Pretext 测量：
const prepared = prepare(rowText, `${charSize}px Georgia`)
const { width } = layout(prepared, Infinity, charHeight)

// 然后用 monospace 渲染（确保等宽）
ctx.font = `${charSize}px monospace`
ctx.fillText(rowText, x, y)
```

## 总结

Fluid Smoke 展示了 Pretext 与 Canvas 粒子系统的结合：

| 模块 | 技术 |
|------|------|
| 流体模拟 | 粒子系统 + Canvas 像素采样 |
| 字符映射 | 亮度 → 透明度级别 → ASCII 字符 |
| 宽度对齐 | Pretext 测量 Georgia 比例字体宽度 |
| 性能 | requestAnimationFrame 60fps |

**核心问题**：比例字体各字符宽度不同，无法直接用于 ASCII 艺术。解决方案是先用 Pretext 测量出每行宽度，再用等宽字体渲染。

## 拓展：封装可复用的 ASCII 粒子系统

```ts
interface ParticleSystem {
  particles: Particle[]
  width: number
  height: number
}

interface ASCIIRendererOptions {
  fontSize: number
  fontFamily: string
  chars?: string
  antialias?: boolean
}

class ASCIIRenderer {
  private simCanvas: HTMLCanvasElement
  private simCtx: CanvasRenderingContext2D
  private particleSystem: ParticleSystem
  private options: ASCIIRendererOptions
  private charWidth: number
  private charHeight: number

  constructor(width: number, height: number, options: ASCIIRendererOptions) {
    this.options = {
      chars: ' .:-=+*#%@',
      antialias: true,
      ...options
    }

    // 创建隐藏的模拟 Canvas
    this.simCanvas = document.createElement('canvas')
    this.simCanvas.width = width
    this.simCanvas.height = height
    this.simCtx = this.simCanvas.getContext('2d')!

    // 测量字符尺寸
    const { fontSize, fontFamily } = this.options
    this.simCtx.font = `${fontSize}px ${fontFamily}`
    const metrics = this.simCtx.measureText('M')
    this.charWidth = metrics.width
    this.charHeight = fontSize * 1.2

    this.particleSystem = { particles: [], width, height }
  }

  /**
   * 添加粒子
   */
  addParticle(x: number, y: number, vx: number, vy: number): void {
    this.particleSystem.particles.push({ x, y, vx, vy })
  }

  /**
   * 更新粒子系统
   */
  update(): void {
    const { particles, width, height } = this.particleSystem

    this.simCtx.fillStyle = 'rgba(6,6,10,0.15)'
    this.simCtx.fillRect(0, 0, width, height)

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy

      // 边界反弹
      if (p.x < 0 || p.x > width) p.vx *= -0.9
      if (p.y < 0 || p.y > height) p.vy *= -0.9

      // 绘制粒子
      this.simCtx.fillStyle = '#c4a35a'
      this.simCtx.beginPath()
      this.simCtx.arc(p.x, p.y, 3, 0, Math.PI * 2)
      this.simCtx.fill()
    }
  }

  /**
   * 采样指定位置的亮度
   */
  private sampleBrightness(x: number, y: number): number {
    const pixel = this.simCtx.getImageData(
      Math.floor(x), Math.floor(y), 1, 1
    ).data
    return pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114
  }

  /**
   * 获取指定亮度对应的字符和样式
   */
  private getCharForBrightness(brightness: number): { char: string; className: string } {
    const { chars } = this.options
    const level = Math.floor((brightness / 255) * (chars.length - 1))
    return {
      char: chars[level],
      className: `a${level + 1}`
    }
  }

  /**
   * 渲染到容器
   */
  render(container: HTMLElement): void {
    const { width, height } = this.particleSystem
    const { fontSize, fontFamily } = this.options
    const cols = Math.ceil(width / this.charWidth)
    const rows = Math.ceil(height / this.charHeight)

    let html = ''

    for (let r = 0; r < rows; r++) {
      let line = ''
      let className = ''

      for (let c = 0; c < cols; c++) {
        const x = c * this.charWidth
        const y = r * this.charHeight
        const brightness = this.sampleBrightness(x, y)
        const { char, className: cls } = this.getCharForBrightness(brightness)
        line += char
        className = cls
      }

      html += `<div class="r ${className}" style="font:${fontSize}px '${fontFamily}'">${line}</div>`
    }

    container.innerHTML = html
  }
}

// 使用示例
const renderer = new ASCIIRenderer(window.innerWidth, window.innerHeight, {
  fontSize: 14,
  fontFamily: 'Georgia, serif'
})

// 添加初始粒子
for (let i = 0; i < 100; i++) {
  renderer.addParticle(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight,
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4
  )
}

// 动画循环
function animate() {
  renderer.update()
  renderer.render(document.getElementById('art')!)
  requestAnimationFrame(animate)
}
animate()
```
