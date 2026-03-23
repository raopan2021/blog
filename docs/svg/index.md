# SVG 矢量图形

> SVG 是一种基于 XML 的矢量图形格式，用于在 Web 中绘制矢量图形

## 📚 目录

- [SVG Demo](./demo/) - 实战示例

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
- `<rect>` - 矩形
- `<circle>` - 圆形
- `<ellipse>` - 椭圆
- `<line>` - 直线
- `<polyline>` - 折线
- `<polygon>` - 多边形
- `<path>` - 路径（最强大）

### 渐变
```svg
<defs>
  <linearGradient id="myGradient">
    <stop offset="0%" stop-color="#ff6b6b" />
    <stop offset="100%" stop-color="#4ecdc4" />
  </linearGradient>
</defs>
<rect fill="url(#myGradient)" width="200" height="100" />
```

### 滤镜效果
```svg
<defs>
  <filter id="myBlur">
    <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
  </filter>
</defs>
<rect filter="url(#myBlur)" width="200" height="100" />
```

## 常用属性

| 属性 | 说明 |
|------|------|
| `fill` | 填充色 |
| `stroke` | 边框色 |
| `stroke-width` | 边框宽度 |
| `opacity` | 透明度 |
| `transform` | 变换（旋转、缩放、平移） |
| `viewBox` | 视口坐标 |

## 实用技巧

### 在 HTML 中使用
```html
<!-- 直接嵌入 -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="#ff6b6b" />
</svg>

<!-- 作为图片引用 -->
<img src="icon.svg" alt="图标" />

<!-- CSS 背景 -->
.div {
  background-image: url('icon.svg');
}
```

### 响应式 SVG
```svg
<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
  <circle cx="50" cy="50" r="40" fill="#ff6b6b" />
</svg>
```

### 动画
```svg
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="#ff6b6b">
    <animate attributeName="r" from="20" to="40" dur="1s" repeatCount="indefinite" />
  </circle>
</svg>
```
