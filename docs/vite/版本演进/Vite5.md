# Vite 5

## 📖 本节总结

Vite 5 是 Vite 的重要版本，带来了**Rolldown 集成**、**性能大幅提升**和**更好的开发体验**。

---

## 核心改进

### Rolldown 集成

```
Vite 5 使用 Rolldown 作为生产构建工具

Rolldown: Rust 编写的打包工具
- 接近 esbuild 的速度
- 兼容 Rollup 插件 API

效果: 生产构建速度提升 3-10 倍
```

### Rollup 4 兼容

```javascript
// Vite 5 内置 Rollup 4
// 插件兼容性更好
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      // Rollup 4 的选项都能用
    }
  }
})
```

---

## 破坏性变更

### Node.js 版本要求

```bash
# Vite 5 需要 Node.js 18.18.0+
node --version  # 需要 >= 18.18.0
```

### 移除一些废弃 API

```javascript
// 移除: process.env 替换为 import.meta.env
// 移除: some deprecated options
```

---

## CSS 改进

### 更好的 CSS Source Map

```javascript
// Vite 5 改进了 CSS 的 source map
// 调试更方便
```

### CSS Modules 改进

```css
/* 更好的类型支持 */
```

---

## 依赖预构建

### Rolldown 进行预构建

```javascript
// Vite 5 使用 Rolldown 进行依赖预构建
// 更快、更准确
```

---

## 迁移指南

### 从 Vite 4 升级

```bash
npm install vite@5
```

### 主要变化

| 变化 | 说明 |
|------|------|
| Node.js | 需要 18.18.0+ |
| Rolldown | 用于生产构建 |
| CSS | 更好的 source map |
| 插件 | Rollup 4 兼容 |

---

## 性能对比

| 场景 | Vite 4 | Vite 5 | 提升 |
|------|---------|---------|------|
| 生产构建 | 基准 | 3-10x | 大幅提升 |
| 依赖预构建 | 快 | 更快 | 20-30% |
| 冷启动 | 毫秒 | 更快 | 10-20% |

---

## 总结

| 特性 | 说明 |
|------|------|
| Rolldown | Rust 重写的打包，速度极快 |
| Rollup 4 | 兼容现有插件 |
| CSS 改进 | 更好的 source map |
| Node.js | 需要 18.18.0+ |
| 性能 | 生产构建 3-10x 提升 |
