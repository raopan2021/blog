# Vite 5.x Rolldown

## 📖 本节总结

Vite 5 开始铺垫**使用 Rolldown 作为生产构建工具**，进一步提升构建性能。

---

## 为什么需要 Rolldown？

### 当前问题

```
Vite 开发使用 Esbuild（快）
Vite 生产使用 Rollup（慢，但功能完整）

问题：开发快但生产构建慢
```

### Rolldown 的解决方案

```
Rolldown: 使用 Rust 编写的 Rollup
- 接近 Esbuild 的速度
- 兼容 Rollup 的插件 API

预期：开发体验 = 生产体验
```

---

## Rolldown 简介

### 与 Rollup 的关系

```
Rollup: JavaScript 编写的打包工具
Rolldown: Rust 重写，API 兼容

目标：用 Rust 的速度 + Rollup 的 API
```

### 核心原理

```javascript
// Rolldown 兼容 Rollup 插件
export default {
  name: 'my-plugin',
  resolveId(id) {
    // ...
  },
  load(id) {
    // ...
  },
  transform(code, id) {
    // ...
  }
}
```

---

## Vite 5 的变化

### 默认配置调整

```javascript
// Vite 5 可能调整的默认值
export default defineConfig({
  build: {
    // 可能默认使用 Rolldown
    target: 'esnext'
  }
})
```

### 向后兼容

```
Vite 5 保持与 Vite 4 的兼容性
- 插件 API 不变
- 配置格式不变
- 迁移成本低
```

---

## 性能对比（预期）

| 工具 | 构建速度 |
|------|----------|
| Webpack | 慢 |
| Rollup | 中等 |
| esbuild | 快 |
| Rolldown | 很快（接近 esbuild）|

---

## 总结

| 特性 | 说明 |
|------|------|
| Rolldown | Rust 重写的打包工具 |
| 速度 | 接近 esbuild |
| API | 兼容 Rollup |
| 目标 | 统一开发/生产体验 |
