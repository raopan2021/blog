# Stage 4：Canvas 纹理生成

本 Stage 介绍如何使用 Canvas API 程序化生成卡片纹理，无需外部图片。

## 为什么使用 Canvas 纹理？

- **零外部依赖**：不依赖任何图片文件
- **完全可控**：颜色、渐变、文字、布局全部代码控制
- **动态生成**：可以在运行时根据数据生成不同纹理

## Canvas 纹理原理

```js
// 1. 创建 Canvas 元素
const canvas = document.createElement('canvas')
canvas.width = 512
canvas.height = 320

// 2. 获取 2D 上下文
const ctx = canvas.getContext('2d')

// 3. 在 Canvas 上绘制（与普通图片绘制相同）
ctx.fillStyle = 'red'
ctx.fillRect(0, 0, 512, 320)

// 4. 转换为 Three.js 纹理
const texture = new THREE.CanvasTexture(canvas)
```

## 圆角矩形辅助函数

Three.js 的 Canvas 不会自动绘制圆角，需要手动实现：

```js
/**
 * 绘制圆角矩形
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
 * @param {number} x - 左上角 X 坐标
 * @param {number} y - 左上角 Y 坐标
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {number} radius - 圆角半径
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}
```

## 正面纹理生成

```js
function createCardFrontTexture(title, subtitle, gradientStart, gradientEnd, icon) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 320
  const ctx = canvas.getContext('2d')

  // 线性渐变背景
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, gradientStart)
  gradient.addColorStop(1, gradientEnd)

  // 填充圆角矩形
  ctx.fillStyle = gradient
  roundRect(ctx, 0, 0, canvas.width, canvas.height, 20)
  ctx.fill()

  // 顶部装饰线
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(20, 20)
  ctx.lineTo(492, 20)
  ctx.stroke()

  // 居中绘制 emoji 图标
  ctx.font = '80px serif'
  ctx.textAlign = 'center'
  ctx.fillText(icon, canvas.width / 2, 120)

  // 标题
  ctx.font = 'bold 36px sans-serif'
  ctx.fillStyle = 'white'
  ctx.fillText(title, canvas.width / 2, 200)

  // 副标题
  ctx.font = '20px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fillText(subtitle, canvas.width / 2, 240)

  // 底部装饰条
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.fillRect(200, 280, 112, 4)

  return new THREE.CanvasTexture(canvas)
}
```

## 背面纹理生成

```js
function createCardBackTexture(number) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 320
  const ctx = canvas.getContext('2d')

  // 深色背景
  ctx.fillStyle = '#1a1a2e'
  roundRect(ctx, 0, 0, canvas.width, canvas.height, 20)
  ctx.fill()

  // 同心圆装饰
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)'
  ctx.lineWidth = 1
  for (let i = 0; i < 10; i++) {
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, i * 30, 0, Math.PI * 2)
    ctx.stroke()
  }

  // 编号（大字）
  ctx.font = 'bold 80px monospace'
  ctx.fillStyle = 'rgba(0, 255, 255, 0.8)'
  ctx.textAlign = 'center'
  ctx.fillText(number.toString().padStart(2, '0'), canvas.width / 2, canvas.height / 2 + 20)

  // 提示文字
  ctx.font = '16px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('点击翻转回正面', canvas.width / 2, canvas.height - 40)

  return new THREE.CanvasTexture(canvas)
}
```

## 六张卡片的配置

```js
const cardConfigs = [
  { title: 'Mountain', subtitle: '自然风光', icon: '🏔️', front: ['#667eea', '#764ba2'], back: '01' },
  { title: 'Ocean', subtitle: '碧海蓝天', icon: '🌊', front: ['#06b6d4', '#3b82f6'], back: '02' },
  { title: 'Forest', subtitle: '翠绿森林', icon: '🌲', front: ['#10b981', '#059669'], back: '03' },
  { title: 'Sunset', subtitle: '落日余晖', icon: '🌅', front: ['#f59e0b', '#ef4444'], back: '04' },
  { title: 'Galaxy', subtitle: '浩瀚星空', icon: '🌌', front: ['#8b5cf6', '#6366f1'], back: '05' },
  { title: 'Aurora', subtitle: '极光之舞', icon: '🌌', front: ['#14b8a6', '#06b6d4'], back: '06' },
]
```

## 纹理优化

如果纹理模糊，可以尝试：

```js
const texture = new THREE.CanvasTexture(canvas)
texture.minFilter = THREE.LinearFilter  // 线性滤波
texture.magFilter = THREE.LinearFilter
```

