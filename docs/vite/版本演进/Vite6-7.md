# Vite 6/7

## 📖 本节总结

Vite 6 和 7 在 Vite 5 的基础上进一步**稳定和改进**。

---

## Vite 6

### 更好的依赖解析

```javascript
// Vite 6 改进了依赖解析逻辑
// 更准确地处理复杂的依赖关系
```

### 环境变量改进

```bash
# 更好的环境变量类型支持
VITE_MY_VAR=value
```

### 插件 API 改进

```javascript
// 更好的类型推导
// 改进的插件兼容性
```

---

## Vite 7

### 开发体验优化

```
Vite 7 进一步优化了开发服务器
- 更快的冷启动
- 更好的 HMR
- 改进的错误提示
```

### 构建改进

```
- 更好的代码分割
- 改进的 Rollup 配置
- 更好的 Tree Shaking
```

---

## 常见配置

### 开发服务器

```javascript
export default defineConfig({
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})
```

---

## 迁移

```bash
# 升级到 Vite 7
npm install vite@7
```

---

## 总结

| 版本 | 改进 |
|------|------|
| Vite 6 | 依赖解析、环境变量改进 |
| Vite 7 | 开发体验优化、HMR 改进 |
