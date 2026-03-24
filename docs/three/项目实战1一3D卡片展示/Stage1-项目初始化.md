# Stage 1：项目初始化与依赖安装

本Stage介绍项目的创建、Vite 初始化、安装 Three.js 依赖以及目录结构说明。

## 效果目标

创建基础的 Three.js 项目，实现页面加载、Canvas 画布初始化。

## 创建项目

```bash
# 创建项目目录
mkdir 3d-card-showcase
cd 3d-card-showcase

# 初始化 package.json（选择 "module" 类型）
pnpm init

# 安装 Three.js 和 Vite
pnpm add three
pnpm add -D vite vite-plugin-singlefile
```

## package.json 配置

```json
{
  "name": "3d-card-showcase",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "three": "^0.170.0"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "vite-plugin-singlefile": "^2.3.2"
  }
}
```

## vite.config.js 配置

使用 `vite-plugin-singlefile` 将所有资源打包进单个 HTML 文件：

```js
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
```

## index.html 入口文件

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>3D 卡片展示 - Three.js</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        overflow: hidden;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        font-family: 'Segoe UI', sans-serif;
      }
      canvas {
        display: block;
      }
      #info {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        pointer-events: none;
      }
    </style>
  </head>
  <body>
    <canvas id="canvas"></canvas>
    <div id="info">👆 点击卡片翻转 | 🖱️ 悬浮鼠标控制角度</div>
    <script type="module" src="./src/main.js"></script>
  </body>
</html>
```

## 目录结构

```
3d-card-showcase/
├── index.html              # 入口 HTML
├── package.json           # 依赖配置
├── vite.config.js         # Vite 构建配置
├── public/                # 公共资源（本项目为空）
└── src/
    └── main.js            # 主逻辑（后续各 Stage 逐步完善）
```

## 运行项目

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本（生成 dist/index.html）
pnpm build
```

## 下一步

下一 Stage 将实现 Three.js 的场景、相机和渲染器的初始化。

