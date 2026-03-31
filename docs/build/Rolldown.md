# Rolldown

## 📖 本节总结

Rolldown 是用 **Rust 重写的 Rollup**，目标是提供接近 esbuild 的速度，同时保持 Rollup 的 API 兼容性。

---

## 为什么需要 Rolldown？

### Rollup 的问题

```
Rollup 使用 JavaScript 编写
JavaScript 运行速度慢

构建大型项目可能需要几十秒
```

### Rolldown 的解决方案

```
使用 Rust 重写
Rust 运行速度极快

预期构建速度：接近 esbuild（毫秒级）
```

---

## 核心特点

### 与 Rollup API 兼容

```javascript
// Rolldown 配置与 Rollup 基本相同
export default {
  input: './src/index.js',
  output: {
    file: './dist/bundle.js',
    format: 'es'
  },
  plugins: [
    // Rollup 插件可以直接使用
    vue()
  ]
}
```

### 与 Vite 集成

```javascript
// vite.config.js
export default defineConfig({
  build: {
    // Vite 5 可能默认使用 Rolldown
    rollupOptions: {
      // ...
    }
  }
})
```

---

## 性能对比

| 工具 | 1000 模块构建 | 10000 模块构建 |
|------|---------------|----------------|
| Webpack | ~30s | ~120s |
| Rollup | ~10s | ~60s |
| esbuild | ~0.5s | ~2s |
| Rolldown | ~0.8s | ~3s |
| Turbopack | ~0.3s | ~1.5s |

---

## 状态

```
Rolldown 正在开发中
- 核心功能已完成
- 插件 API 逐步完善
- 预计与 Vite 5 集成
```

---

## 总结

| 特性 | 说明 |
|------|------|
| 语言 | Rust |
| 速度 | 接近 esbuild |
| API | 兼容 Rollup |
| 目标 | 统一开发/生产构建 |
