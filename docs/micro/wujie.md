# wujie 无界微前端

> wujie 是字节跳动推出的微前端框架，采用降级 iframe 方案

## 特点

- ⚡ 性能好：采用 iframe 降级方案，兼容性更强
- 🛡️ 沙箱隔离：支持 JS 和 CSS 隔离
- 🔌 插件化：提供丰富的生命周期钩子
- 🌐 通信简单：基于 props 的双向通信
- 📱 无感刷新：支持子应用热更新

## 快速开始

### 安装

```bash
pnpm add wujie
```

### 主应用配置

```vue
<template>
  <WujieVue width="100%" height="100%" name="vue-app" url="http://localhost:8080" />
</template>

<script setup>
import { setupApp, preloadApp } from 'wujie'

// 预加载
setupApp({
  name: 'vue-app',
  url: 'http://localhost:8080'
})

preloadApp({ name: 'vue-app' })
</script>
```

## 与其他方案对比

| 特性 | qiankun | micro-app | wujie |
|------|---------|-----------|-------|
| 隔离级别 | JS+CSS | Web Component | JS+CSS |
| 性能 | 中 | 高 | 高 |
| 兼容性 | 中 | 高 | 最高（iframe降级）|
| 弹窗处理 | 自动 | 需配置 | 自动 |

详见官方文档：https://wujie-micro.github.io/
