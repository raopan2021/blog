# 微前端

> 微前端是一种将前端应用拆分为多个独立子应用的架构模式，每个子应用可以独立开发、测试和部署

## 📚 目录

### 框架
- [micro-app](./micro-app.md) - 京东微前端方案
- [qiankun](./qiankun.md) - 阿里乾坤微前端框架
- [wujie](./wujie.md) - 字节跳动微前端框架

## 什么是微前端

微前端（Micro Frontends）借鉴了微服务的思想，将庞大的后端应用拆分为多个独立服务。在前端领域，它将一个大型应用拆分为多个可以独立开发、独立部署的子应用。

## 核心价值

- **技术栈无关**：主应用与子应用可以使用不同的框架
- **独立开发**：各子应用可由不同团队独立开发
- **独立部署**：子应用可独立部署，不影响其他应用
- **增量升级**：可以逐步升级或替换部分模块
- **状态隔离**：各子应用间样式和全局变量相互隔离

## 主流方案对比

| 方案 | 开发方 | 特点 | 侵入性 |
|------|--------|------|--------|
| qiankun | 阿里 | 基于 single-spa，生态成熟 | 较低 |
| micro-app | 京东 | Web Component 隔离 | 低 |
| wujie | 字节 | 降级 iframe，性能好 | 低 |

## 基础架构

```
┌─────────────────────────────────────┐
│            主应用 (Container)        │
│  ┌─────────┐ ┌─────────┐ ┌────────┐  │
│  │ 子应用1 │ │ 子应用2 │ │ 子应用3│  │
│  │ Vue     │ │ React   │ │ jQuery│  │
│  └─────────┘ └─────────┘ └────────┘  │
└─────────────────────────────────────┘
```

## 通用配置

```js
// 主应用 - 注册子应用
import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
  {
    name: 'vue-app',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/vue'
  },
  {
    name: 'react-app',
    entry: '//localhost:3000',
    container: '#container',
    activeRule: '/react'
  }
])

start()
```

## 子应用接入（Vue）

```js
// main.js
import { mount } from './entry'

// 导出生命周期
export async function bootstrap() {
  console.log('子应用初始化')
}

export async function mount(props) {
  mount(props)
}
```

## 样式隔离

```css
/* 子应用样式中添加命名空间 */
.main-app {
  /* 子应用样式 */
  .btn {
    color: #fff;
  }
}
```

## 通信机制

```js
// 主应用 → 子应用
props.onGlobalStateChange((state) => {
  console.log('收到全局状态变更:', state)
})

// 主应用 → 设置状态
props.setGlobalState({ token: 'xxx' })

// 初始化
let init = false
export function render(props) {
  if (!init) {
    init = true
    props.onGlobalStateChange((state) => {
      // 监听状态变化
    }, true)
  }
}
```
