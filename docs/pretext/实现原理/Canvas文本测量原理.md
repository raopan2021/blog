# Canvas 文本测量原理

> 浏览器自己的字体引擎作为"ground truth"，Pretext 是如何借助它实现精确测量的？

## 为什么不用 DOM？

`getBoundingClientRect()`、`offsetHeight` 等 DOM 测量方法的问题：

1. **强制触发布局回流**（Layout Reflow）— 浏览器需要重新计算整个渲染树
2. **同步操作** — 主线程阻塞，用户界面卡顿
3. **不可靠** — 受到 CSS 样式、伪元素、内容回流的影响

```javascript
// 传统方式：触发布局回流的"元凶"
const height = element.getBoundingClientRect().height
const width = element.offsetWidth
```

## Pretext 的解法：Canvas 测量

核心思路：**用 Canvas 的 `measureText()` 来测量字符宽度，用预计算躲避 DOM**。

### Canvas measureText 的原理

```javascript
// Canvas 的 measureText 不触发布局回流！
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

ctx.font = '16px Inter'
const metrics = ctx.measureText('Hello 世界 🚀')

console.log(metrics.width) // 文本总宽度（像素）
```

为什么 Canvas `measureText` 不触发回流？
- 因为它**只读取字体度量信息**，不涉及渲染树的重计算
- 字体引擎（HarfBuzz/FreeType）在 JavaScript 调用前就已经准备好了字形宽度表

## Pretext 的测量流程

```
文本输入
  ↓
1. 归一化处理（Normalization）
  - 合并多个空格
  - 处理换行符
  ↓
2. 字形分段（Grapheme Segmentation）
  - 按"用户感知字符"切割
  - 处理 Emoji、组合字符
  ↓
3. Canvas 预测量
  - 对每个字形/字素组测宽
  - 缓存测量结果
  ↓
4. 预计算完成（Opaque Handle）
  - 返回 prepared 对象
  - 后续 layout() 只做算术运算
```

## 预计算 vs 实时计算

```typescript
// ❌ 每次输入都测量（慢）
element.style.height = measureText(input) + 'px'

// ✅ 预计算一次，后续纯算术（快）
const prepared = prepare(input, '16px Inter')
// ... resize 时只调 layout()
element.style.height = layout(prepared, width, 20).height + 'px'
```

## Canvas 测量精度问题

### 问题一：Canvas 字体与 CSS 字体不一致

```typescript
// CSS: '16px Inter'
// Canvas: '16px Inter'
// 两者必须完全一致！

const prepared = prepare(text, '16px Inter') // ✅
const prepared = prepare(text, '16px  Inter') // ✅ 多个空格？浏览器会trim
const prepared = prepare(text, '16px "Helvetica Neue"') // ✅ 加引号
```

### 问题二：Canvas 字体加载

```typescript
// 如果字体还没加载完就测量，会用 fallback 字体，宽度就不准了！

// 正确做法：等待字体加载
document.fonts.ready.then(() => {
  const prepared = prepare(text, '16px Inter')
  // 现在测量是准确的
})
```

### 问题三：不同浏览器的 measureText 差异

现代浏览器（Chrome/Firefox/Safari）的 `measureText` 结果基本一致，但有细微差异。Pretext 内部做了浏览器quirks处理。

## 性能对比

| 方法 | DOM 回流 | 耗时（500条文本） | 可缓存 |
|------|---------|-----------------|--------|
| `getBoundingClientRect()` | ✅ 每次 | ~500ms+ | ❌ |
| `offsetHeight` | ✅ 每次 | ~400ms+ | ❌ |
| `Canvas measureText` | ❌ | ~19ms | ✅ |

## 总结

| 步骤 | 作用 |
|------|------|
| Canvas `measureText` | 读取字体度量，不触发布局 |
| 预计算（`prepare`） | 一次性测量所有字形宽度并缓存 |
| 纯算术（`layout`） | 用缓存数据计算换行，零 DOM 访问 |
