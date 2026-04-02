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

import DemoCard from '../../components/DemoCard.vue'

<DemoCard :demos="[
  { title: '对齐算法', desc: '三种段落对齐算法对比', link: '/blog/pretext-demo/justification.html', tag: 'justification' },
  { title: '聊天气泡', desc: '精确高度的气泡布局', link: '/blog/pretext-demo/bubbles.html', tag: 'bubbles' },
  { title: '动态布局', desc: '障碍物感知的文本绕流', link: '/blog/pretext-demo/dynamic-layout.html', tag: 'dynamic-layout' },
  { title: '字体测量', desc: '精确的行高与段落高度', link: '/blog/pretext-demo/typography.html', tag: 'typography' },
  { title: '手风琴', desc: '预先计算的高度动画', link: '/blog/pretext-demo/accordion.html', tag: 'accordion' },
]" />

## 在线演示

::: info 在线 Demo 说明
参考官方 chenglou.me/pretext 设计风格：羊皮纸配色、衬线标题、克制动效
:::

### Demo 1：对齐算法 — 三种段落布局对比

<iframe
  src="/blog/pretext-demo/justification.html"
  width="100%"
  height="580px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f1ea;"
  allow="autoplay"
/>

### Demo 2：聊天气泡 — 精确高度的气泡布局

<iframe
  src="/blog/pretext-demo/bubbles.html"
  width="100%"
  height="540px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f7f5;"
  allow="autoplay"
/>

### Demo 3：动态布局 — 障碍物感知的文本绕流

<iframe
  src="/blog/pretext-demo/dynamic-layout.html"
  width="100%"
  height="580px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f1ea;"
  allow="autoplay"
/>

### Demo 4：字体测量 — 精确的行高与段落高度

<iframe
  src="/blog/pretext-demo/typography.html"
  width="100%"
  height="540px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f1ea;"
  allow="autoplay"
/>

### Demo 5：手风琴 — 预先计算的高度动画

<iframe
  src="/blog/pretext-demo/accordion.html"
  width="100%"
  height="540px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f1ea;"
  allow="autoplay"
/>

## 相关资源

- [Pretext 官方仓库](https://github.com/chenglou/pretext)
- [在线 Demo](https://chenglou.me/pretext/)
