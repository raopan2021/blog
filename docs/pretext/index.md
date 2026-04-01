# Pretext 文本布局

> 不触碰 DOM 的精确文本测量与多行布局

---

## 📚 课程大纲

### 模块一：基础

- [Pretext 快速入门](./基础/Pretext快速入门)

### 模块二：实现原理

- [Canvas 文本测量原理](./实现原理/Canvas文本测量原理)
- [字形分段与 Unicode 处理](./实现原理/字形分段与Unicode处理)
- [换行算法与粘合规则](./实现原理/换行算法与粘合规则)

### 模块三：进阶

- [API 详解与高级用法](./进阶/API详解与高级用法)
- [实战技巧与性能优化](./进阶/实战技巧与性能优化)

### 模块四：Demo 项目

- [综合演示](./demo/综合演示)

---

## 🎯 学习目标

1. **理解 Pretext 解决的问题** — DOM 回流与文本测量
2. **掌握核心 API** — prepare / layout / layoutWithLines
3. **理解实现原理** — Canvas + Unicode 分段
4. **具备实战能力** — 虚拟滚动、文本环绕等场景应用

---

## 📂 配套资源

- [Pretext 官方仓库](https://github.com/chenglou/pretext)
- [在线 Demo](https://chenglou.me/pretext/)
- [社区 Demo 集合](https://somnai-dreams.github.io/pretext-demos/)

---

## 🧪 在线演示

::: info 在线 Demo 说明
参考官方 chenglou.me/pretext 设计风格：羊皮纸配色、衬线标题、克制动效
:::

### Demo 1：Justification — 三种段落对齐算法对比

<iframe
  src="/blog/pretext-demo/justification.html"
  width="100%"
  height="500px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f1ea;"
  allow="autoplay"
/>

### Demo 2：Accordion — 手风琴展开高度预测

<iframe
  src="/blog/pretext-demo/accordion.html"
  width="100%"
  height="420px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f1ea;"
  allow="autoplay"
/>

### Demo 3：Bubbles — 聊天气泡精确高度

<iframe
  src="/blog/pretext-demo/bubbles.html"
  width="100%"
  height="420px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f7f5;"
  allow="autoplay"
/>

### Demo 4：Dynamic Layout — 障碍物感知文本绕流

<iframe
  src="/blog/pretext-demo/dynamic-layout.html"
  width="100%"
  height="480px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f1ea;"
  allow="autoplay"
/>

### Demo 5：Typography — 字体大小精确行高测量

<iframe
  src="/blog/pretext-demo/typography.html"
  width="100%"
  height="420px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f1ea;"
  allow="autoplay"
/>

### Demo 6：Rich Text — 内联元素混合布局

<iframe
  src="/blog/pretext-demo/rich-text.html"
  width="100%"
  height="420px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f1ea;"
  allow="autoplay"
/>

---

## 📂 更多 Demo

| Demo | 文件 | 说明 |
|------|------|------|
| 瀑布流 | [masonry2.html](/blog/pretext-demo/masonry2.html) | Canvas 绘制，真实高度瀑布流 |
| 综合演示 | [index.html](/blog/pretext-demo/) | Textarea / Canvas / 虚拟列表 / 文本环绕 |
| 智能截断 | [truncation.html](/blog/pretext-demo/truncation.html) | 二分查找精确截断位置 |
| 通知系统 | [notification.html](/blog/pretext-demo/notification.html) | 自动撑开高度的 toast |
