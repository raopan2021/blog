# Pretext 文本布局

> 不触碰 DOM 的精确文本测量与多行布局

## 简介

Pretext 是由 chenglou（ReScript 作者）开发的一个纯 JavaScript/TypeScript 库，专注于**多行文本的精确测量与布局**。

核心解决的问题：**传统 DOM 测量（如 `getBoundingClientRect`、`offsetHeight`）会触发布局回流（layout reflow），这是浏览器中最昂贵的操作之一**。

## 学习路径

### 介绍
- [使用方法](./介绍/使用方法) — 快速上手、核心 API 使用
- [原理](./介绍/原理) — Canvas 测量、Knuth-Plass 算法、Unicode 处理

### Demo 演示

| Demo | 名称 | 说明 |
|------|------|------|
| 1 | [The Editorial Engine](./demo/demo1-editorial-engine) | 多栏布局 + 可拖拽障碍物，60fps 实时重排 |
| 2 | [Fluid Smoke](./demo/demo2-fluid-smoke) | 粒子系统映射为 ASCII 艺术 |
| 3 | [Justification Compared](./demo/demo3-justification-comparison) | 三种对齐算法对比：CSS、贪心、Knuth-Plass |
| 4 | [Variable Typographic ASCII](./demo/demo4-variable-typographic-ascii) | 多字重比例字体宽度测量 |
| 5 | [Shrinkwrap Showdown](./demo/demo5-shrinkwrap-showdown) | CSS fit-content vs Pretext 精确 shrinkwrap |

## 在线演示

::: info 在线 Demo 说明
Demo 来自 [somnai-dreams/pretext-demos](https://github.com/somnai-dreams/pretext-demos)
:::

### Demo 1：The Editorial Engine

<iframe
  src="/blog/pretext-demo/the-editorial-engine.html"
  width="100%"
  height="600px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#0a0a0c;"
  allow="autoplay"
/>

### Demo 2：Fluid Smoke

<iframe
  src="/blog/pretext-demo/fluid-smoke.html"
  width="100%"
  height="600px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#06060a;"
  allow="autoplay"
/>

### Demo 3：Justification Compared

<iframe
  src="/blog/pretext-demo/justification-comparison.html"
  width="100%"
  height="700px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#faf8f5;"
  allow="autoplay"
/>

### Demo 4：Variable Typographic ASCII

<iframe
  src="/blog/pretext-demo/variable-typographic-ascii.html"
  width="100%"
  height="500px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#0a0a12;"
  allow="autoplay"
/>

### Demo 5：Shrinkwrap Showdown

<iframe
  src="/blog/pretext-demo/shrinkwrap-showdown.html"
  width="100%"
  height="650px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#faf8f5;"
  allow="autoplay"
/>

## 相关资源

- [Pretext 官方仓库](https://github.com/chenglou/pretext)
- [在线 Demo](https://chenglou.me/pretext/)
- [社区 Demo 集合](https://github.com/somnai-dreams/pretext-demos)
