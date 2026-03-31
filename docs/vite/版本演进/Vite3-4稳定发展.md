# Vite 3/4 稳定发展

## 📖 本节总结

Vite 3 和 4 在稳定 Vite 2 的基础上，**改善了开发体验**、**提升了性能**、**完善了插件生态**。

---

## Vite 3

### 改进的冷启动

```
Vite 2: 冷启动需要解析所有依赖
Vite 3: 预构建缓存，只在必要时重新解析
```

### 新的 CLI

```bash
# Vite 3 改进了命令行输出
vite dev     # 开发
vite build   # 构建
vite preview # 预览
```

### 环境变量增强

```javascript
// .env 文件支持更多格式
VITE_APP_TITLE="My App"
VITE_API_BASE_URL=/api

// import.meta.env 访问
console.log(import.meta.env.VITE_APP_TITLE)
```

---

## Vite 4

### 更好的 TypeScript 支持

```typescript
// vite.config.ts 原生支持
import { defineConfig } from 'vite'

export default defineConfig({
  // TypeScript 配置
  esbuild: {
    target: 'esnext'
  }
})
```

### 改进的 HMR

```
Vite 4 改进了 HMR 的精度
- 组件级别的 HMR
- 样式变更不刷新组件
- 更好的状态保持
```

---

## 常见配置

### 开发服务器

```javascript
export default defineConfig({
  server: {
    port: 3000,           // 端口
    host: true,            // 允许外部访问
    proxy: {               // 代理
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

### 构建配置

```javascript
export default defineConfig({
  build: {
    target: 'esnext',      // 构建目标
    minify: 'terser',      // 压缩工具
    sourcemap: true,       // 生成 sourcemap
    rollupOptions: {       // Rollup 配置
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
})
```

---

## 插件生态

| 插件 | 说明 |
|------|------|
| @vitejs/plugin-vue | Vue 支持 |
| @vitejs/plugin-react | React 支持 |
| vite-plugin-pages | 路由自动生成 |
| vite-plugin-pwa | PWA 支持 |
| vite-plugin WindiCSS | WindiCSS 支持 |

---

## 总结

| 版本 | 改进 |
|------|------|
| Vite 3 | 冷启动优化、新的 CLI |
| Vite 4 | TypeScript 改进、HMR 改进 |
| 通用 | 更好的插件生态 |
