# Vite 2.x 插件系统

## 📖 本节总结

Vite 2 带来了成熟的**插件系统**，**多框架支持**，以及更好的**Rollup 兼容性**。

---

## 插件系统

### 插件结构

```javascript
// Vite 插件是一个带有特定钩子的对象
export default function myPlugin() {
  return {
    name: 'my-plugin',  // 插件名称

    // 钩子
    options(options) {
      // 处理配置
      return options
    },

    resolveId(id) {
      // 解析模块路径
      if (id === 'virtual-module') {
        return id
      }
    },

    load(id) {
      // 加载模块内容
      if (id === 'virtual-module') {
        return 'export default "virtual module content"'
      }
    },

    transform(code, id) {
      // 转换代码
      return {
        code: transformCode(code),
        map: generateSourceMap()
      }
    },

    configureServer(server) {
      // 配置开发服务器
    },

    buildStart() {
      // 构建开始时调用
    }
  }
}
```

### 使用插件

```javascript
// vite.config.js
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    vue(),
    react()
  ]
})
```

---

## Rollup 兼容性

### Rollup 插件 API

```javascript
// Vite 插件兼容大部分 Rollup 插件 API
export default function myPlugin() {
  return {
    name: 'my-plugin',

    // Rollup 兼容钩子
    resolveId(source, importer) {
      // ...
    },

    load(id) {
      // ...
    },

    transform(code, id) {
      // ...
    }
  }
}
```

---

## @vitejs/plugin-vue

```javascript
// Vue 插件
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({
    template: {
      // 模板编译选项
      compilerOptions: {
        // ...
      }
    }
  })]
})
```

---

## @vitejs/plugin-react

```javascript
// React 插件
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    // Fast Refresh
    include: '**/*.jsx',
    babel: {
      // Babel 配置
    }
  })]
})
```

---

## CSS 支持

```javascript
// Vite 原生支持 CSS
// 无需额外配置

// 支持
// - .css 文件
// - .scss / .sass / .less（需预处理器）
// - CSS Modules
```

### CSS Modules

```css
/* Button.module.css */
.button {
  color: blue;
}
```

```javascript
// 使用
import styles from './Button.module.css'
export default () => <button className={styles.button}>Click</button>
```

---

## 环境变量

```javascript
// .env 文件
VITE_API_URL=https://api.example.com
VITE_VERSION=1.0.0

// 代码中使用
console.log(import.meta.env.VITE_API_URL)
```

---

## 新增特性

### CSS Modules

### JSON 支持

```javascript
// 直接导入 JSON
import data from './data.json'
```

### Web Workers

```javascript
// 直接导入 Web Worker
import Worker from './worker.js?worker'
```

---

## 总结

| 特性 | 说明 |
|------|------|
| 插件系统 | 与 Rollup 兼容 |
| 多框架 | Vue、React、Svelte 等 |
| CSS 支持 | 原生 + Modules + 预处理器 |
| 环境变量 | import.meta.env |
| Rollup 兼容 | 大部分 Rollup 插件可用 |
