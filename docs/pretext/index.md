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

### 瀑布流布局

<iframe
  src="/blog/projects/pretext-demo/masonry.html"
  width="100%"
  height="480px"
  frameborder="0"
  style="margin-top:20px; border-radius:12px; background:#0f0f1a;"
  allow="autoplay"
/>

### 聊天消息气泡

<iframe
  src="/blog/projects/pretext-demo/chat.html"
  width="100%"
  height="480px"
  frameborder="0"
  style="margin-top:20px; border-radius:12px; background:#0d1117;"
  allow="autoplay"
/>

---

## 📂 更多 Demo

| Demo | 文件 | 说明 |
|------|------|------|
| 综合演示 | [index.html](/blog/projects/pretext-demo/) | Textarea / Canvas / 虚拟列表 / 文本环绕 |
| 瀑布流布局 | [masonry.html](/blog/projects/pretext-demo/masonry.html) | 真实高度瀑布流 |
| 聊天消息气泡 | [chat.html](/blog/projects/pretext-demo/chat.html) | 自动高度气泡 |
| AI 打字机 | [typewriter.html](/blog/projects/pretext-demo/typewriter.html) | 预判高度的流畅打字效果 |
| 智能截断展开 | [truncation.html](/blog/projects/pretext-demo/truncation.html) | 精确截断位置 + 二分查找 |
| 通知提示系统 | [notification.html](/blog/projects/pretext-demo/notification.html) | 自动撑开高度 |
| 代码编辑器行号 | [code-editor.html](/blog/projects/pretext-demo/code-editor.html) | 等宽字体精确对齐 |
| 新闻订阅阅读器 | [newsletter.html](/blog/pretext/projects/pretext-demo/newsletter.html) | 动态列数切换 |
