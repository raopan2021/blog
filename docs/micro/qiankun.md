# qiankun 乾坤微前端

> qiankun 是阿里团队推出的微前端框架，基于 single-spa 封装，生态成熟

## 特点

- 📦 开箱即用：提供完善的应用注册、加载、隔离机制
- 🔌 技术栈无关：支持 Vue/React/Angular/Vanilla 任意框架
- 🛡️ 样式隔离：确保子应用样式不污染主应用
- 🌐 资源预加载：空闲时预加载子应用资源
- 📱 弹窗遮罩：自动拦截子应用中的 dialog/alert/confirm

## 快速开始

### 安装

```bash
pnpm add qiankun
```

### 主应用配置

```js
// main.js
import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
  {
    name: 'vue-app',
    entry: '//localhost:8080',
    container: '#subapp-container',
    activeRule: '/vue',
    props: {
      // 传递给子应用的数据
    }
  }
])

start()
```

## 与 micro-app 对比

| 特性 | qiankun | micro-app |
|------|---------|--------|
| 隔离方式 | JS Sandbox + CSS Module | Web Component |
| 通信方式 | GlobalState | window 通信 |
| 预加载 | 支持 | 支持 |
| 弹窗处理 | 自动 | 需配置 |

详见官方文档：https://qiankun.umijs.org/
