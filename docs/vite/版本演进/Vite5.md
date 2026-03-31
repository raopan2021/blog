# Vite 5

## 📖 本节总结

Vite 5 是 Vite 的重要版本，主要改进是**使用 Rolldown 作为生产构建工具**，进一步提升构建性能。

---

## Rolldown 集成

### 为什么使用 Rolldown？

```
Vite 开发使用 Esbuild（快）
Vite 生产使用 Rollup（慢）

Rolldown: 用 Rust 重写的 Rollup
- 接近 Esbuild 的速度
- 兼容 Rollup 的插件 API

Vite 5 目标：统一开发/生产构建体验
```

### Rolldown 状态

```
Rolldown 已集成到 Vite 5
- Rollup 插件可直接使用
- 构建速度大幅提升
- API 完全兼容
```

---

## 重大变化

### 移除 Node.js 14/16 支持

```bash
# Vite 5 需要 Node.js 18+
node --version  # 需要 >= 18
```

### 简化 CSS

```javascript
// Vite 5 改进了 CSS 处理
// 更好的 source map
// 更快的 HMR
```

### 改进的依赖预构建

```javascript
// Vite 5 使用 Rolldown 进行依赖预构建
// 速度更快，结果更准确
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
| Node.js | 需要 18+ |
| Rolldown | 用于生产构建 |
| CSS | 更好的 source map |
| 依赖 | 一些内部依赖更新 |

---

## 性能对比

| 场景 | Vite 4 | Vite 5 | 提升 |
|------|--------|---------|------|
| 开发启动 | 快 | 更快 | 10-20% |
| HMR | 快 | 更快 | 5-10% |
| 生产构建 | 慢 | 很快 | 3-10x |

---

## 总结

| 特性 | 说明 |
|------|------|
| Rolldown | Rust 重写的打包工具 |
| 速度 | 生产构建 3-10 倍提升 |
| 兼容性 | 兼容 Rollup 插件 |
| Node.js | 需要 18+ |
