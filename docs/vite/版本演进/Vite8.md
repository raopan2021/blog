# Vite 8

## 📖 本节总结

Vite 8 是 Vite 的重要版本，带来了 **Rolldown 集成**，生产构建速度大幅提升。

---

## 核心改进

### Rolldown 集成

```
Vite 8 使用 Rolldown 作为生产构建工具

Rolldown: Rust 编写的打包工具
- 接近 esbuild 的速度
- 兼容 Rollup 插件 API

效果: 生产构建速度提升 5-10 倍
```

### 为什么是 Rolldown？

```
Vite 开发服务器: 使用 Esbuild（快）
Vite 生产构建: 之前用 Rollup（慢）

Rolldown: Rust 重写的 Rollup
- 用 Rust 的速度
- 保持 Rollup 的 API

Vite 8 = 开发快 + 生产也快
```

---

## Rolldown vs Rollup

| 特性 | Rollup | Rolldown |
|------|--------|----------|
| 语言 | JavaScript | Rust |
| 速度 | 中等 | 极快 |
| API | 完整 | 兼容 Rollup |
| 插件 | Rollup 插件 | 兼容 |

---

## 开发体验

### 开发服务器保持不变

```
Vite 8 的开发服务器继续使用 Esbuild
- 毫秒级冷启动
- 快速的 HMR
```

### 生产构建使用 Rolldown

```javascript
// vite.config.js
export default defineConfig({
  build: {
    // Vite 8 自动使用 Rolldown
    // 不需要额外配置
  }
})
```

---

## 迁移指南

### 从 Vite 7 升级

```bash
npm install vite@8
```

### 主要变化

| 变化 | 说明 |
|------|------|
| 生产构建 | 使用 Rolldown |
| 速度 | 生产构建 5-10x 提升 |
| 插件 | 兼容 Rollup 插件 |

---

## 性能对比

| 场景 | Vite 7 | Vite 8 | 提升 |
|------|---------|---------|------|
| 冷启动 | 快 | 更快 | 10% |
| HMR | 快 | 更快 | 5% |
| 生产构建 | 中等 | 极快 | 5-10x |

---

## 总结

| 特性 | 说明 |
|------|------|
| Rolldown | Rust 重写的打包工具 |
| 速度 | 生产构建 5-10x 提升 |
| 兼容性 | 兼容 Rollup 插件 |
| 开发体验 | 保持 Vite 一贯的快速 |
