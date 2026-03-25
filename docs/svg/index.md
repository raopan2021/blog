# SVG 矢量图形

> SVG 是一种基于 XML 的矢量图形格式，用于在 Web 中绘制矢量图形

## 📚 目录

- [SVG Demo](./demo/) - 实战示例
- [进度完成打勾动画](./demo/进度完成打勾动画) - 交互动画示例

## 为什么使用 SVG

- **可缩放**：无限缩放不失真，适合各种屏幕
- **文件小**：相比位图，文件体积更小
- **可编辑**：纯文本格式，可用代码编辑
- **可交互**：支持 CSS 和 JavaScript 操作
- **搜索引擎友好**：文本内容可被搜索引擎索引

## 基础语法

```svg
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 圆形 -->
  <circle cx="100" cy="100" r="80" fill="#ff6b6b" />

  <!-- 矩形 -->
  <rect x="50" y="50" width="100" height="100" fill="#4ecdc4" />

  <!-- 直线 -->
  <line x1="0" y1="0" x2="200" y2="200" stroke="#333" stroke-width="2" />

  <!-- 路径 -->
  <path d="M 10 10 L 100 100 L 10 100 Z" fill="#ffe66d" />
</svg>
```

## 常用图形

### 基础图形

| 元素 | 说明 | 关键属性 |
|------|------|---------|
| `<rect>` | 矩形 | x, y, width, height, rx, ry |
| `<circle>` | 圆形 | cx, cy, r |
| `<ellipse>` | 椭圆 | cx, cy, rx, ry |
| `<line>` | 直线 | x1, y1, x2, y2 |
| `<polyline>` | 折线 | points="x1,y1 x2,y2 ..." |
| `<polygon>` | 多边形 | points="x1,y1 x2,y2 ..." |
| `<path>` | 路径 | d（最强大） |

### 矩形示例

```svg
<!-- 圆角矩形 -->
<rect x="10" y="10" width="100" height="60" rx="10" ry="10" fill="#4285f4" />

<!-- 无填充只描边 -->
<rect x="10" y="10" width="100" height="60" fill="none" stroke="#333" stroke-width="2" />
```

### 圆形和椭圆

```svg
<circle cx="50" cy="50" r="40" fill="#ff6b6b" />
<ellipse cx="100" cy="50" rx="60" ry="30" fill="#4ecdc4" />
```

### 路径 path

`d` 属性支持多种命令：

| 命令 | 说明 | 示例 |
|------|------|------|
| M x y | 移动到 | `M 10 10` |
| L x y | 直线到 | `L 100 100` |
| H x | 水平线 | `H 200` |
| V y | 垂直线 | `V 200` |
| C x1 y1,x2 y2,x y | 三次贝塞尔 | `C 20,50 50,50 80,80` |
| Q x1 y1,x y | 二次贝塞尔 | `Q 50,0 100,50` |
| A rx ry,rot,large,sweep,x y | 圆弧 | `A 50 50 0 0 1 100 100` |
| Z | 闭合路径 | `Z` |

```svg
<!-- 绘制心形 -->
<path d="M 100 180
         A 50 50 0 0 1 100 80
         A 50 50 0 0 1 100 180
         Q 50 130 100 80
         Z"
      fill="#ff6b6b" />
```

## 常用样式属性

### 填充与描边

```svg
<rect fill="#ff6b6b" stroke="#333" stroke-width="2" />
<circle fill="none" stroke="#4ecdc4" stroke-width="3" />
```

### 透明度

```svg
<rect fill="#ff6b6b" opacity="0.5" />
<circle fill="#4ecdc4" fill-opacity="0.5" stroke-opacity="0.8" />
```

### 线条样式

```svg
<!-- stroke-linecap: butt | round | square -->
<!-- stroke-linejoin: miter | round | bevel -->
<!-- stroke-dasharray: 虚线 -->
<line stroke-dasharray="5,5" stroke-linecap="round" />
```

### 渐变

```svg
<defs>
  <!-- 线性渐变 -->
  <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#ff6b6b" />
    <stop offset="100%" stop-color="#4ecdc4" />
  </linearGradient>

  <!-- 径向渐变 -->
  <radialGradient id="radialGradient">
    <stop offset="0%" stop-color="#ffe66d" />
    <stop offset="100%" stop-color="#ff6b6b" />
  </radialGradient>
</defs>

<!-- 使用渐变 -->
<rect fill="url(#myGradient)" width="200" height="100" />
```

### 滤镜效果

```svg
<defs>
  <filter id="myBlur">
    <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
  </filter>

  <!-- 阴影 -->
  <filter id="dropShadow">
    <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.3"/>
  </filter>
</defs>

<rect filter="url(#dropShadow)" width="100" height="100" fill="#ff6b6b" />
```

## 裁剪与遮罩

```svg
<defs>
  <clipPath id="circleClip">
    <circle cx="50" cy="50" r="40" />
  </clipPath>
</defs>

<!-- 被裁剪的图片 -->
<image href="photo.jpg" clip-path="url(#circleClip)" width="100" height="100" />
```

## 文本

```svg
<text x="50" y="50" font-family="Arial" font-size="16" fill="#333">
  Hello SVG
</text>

<!-- 文字居中 -->
<text x="100" y="50" text-anchor="middle" font-size="20">
  居中文字
</text>
```

## 变形

```svg
<!-- 平移 -->
<rect transform="translate(10, 20)" />

<!-- 旋转 -->
<rect transform="rotate(45, 50, 50)" />

<!-- 缩放 -->
<rect transform="scale(1.5)" />

<!-- 组合变形 -->
<rect transform="translate(10,10) rotate(45) scale(1.2)" />
```

## 在 HTML 中使用

```html
<!-- 直接嵌入 -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="#ff6b6b" />
</svg>

<!-- 作为图片引用 -->
<img src="icon.svg" alt="图标" width="100" height="100" />

<!-- CSS 背景 -->
<div style="background-image: url('icon.svg');"></div>
```

## 动画

### SMIL 动画

```svg
<!-- 淡入 -->
<circle r="0" opacity="0">
  <animate attributeName="r" from="0" to="50" dur="1s" fill="freeze" />
  <animate attributeName="opacity" from="0" to="1" dur="1s" fill="freeze" />
</circle>

<!-- 旋转 -->
<rect>
  <animateTransform attributeName="transform" type="rotate"
    from="0 50 50" to="360 50 50" dur="2s" repeatCount="indefinite" />
</rect>
```

### CSS 动画

```css
.circle {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

## 实用技巧

### 响应式 SVG

```svg
<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
  <circle cx="50" cy="50" r="40" fill="#ff6b6b" />
</svg>
```

### 图标制作技巧

1. 使用 `<symbol>` 和 `<use>` 复用图形
2. 统一 viewBox 便于缩放
3. 尽量使用单色，便于 CSS 控制

```svg
<defs>
  <symbol id="icon-home" viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </symbol>
</defs>

<use href="#icon-home" width="24" height="24" fill="currentColor" />
```

### 优化 SVG 文件

1. 移除无用节点和属性
2. 合并路径
3. 使用简写路径命令
4. 避免使用滤镜（性能开销大）
