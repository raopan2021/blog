# 模块四：响应式深入

> 深入理解 Proxy 的高级特性、Reflect 的作用，以及 effect 与 watch 的实现细节

## 📍 配套源码

```
packages/reactivity/src/
├── effect.ts          # ReactiveEffect 完整实现、DirtyLevels
├── baseHandler.ts     # 13种 Proxy 拦截器完整实现
├── reactiveEffect.ts  # 依赖的创建和管理
└── apiWatch.ts        # watch 源码实现
```

## 本模块内容

1. [Proxy 与 Reflect 深度解析](./Proxy深度解析)
2. [effect 与 watch 原理](./effect与watch)

## 知识点预览

- **Reflect** — 统一的对象操作 API，解决 this 绑定问题
- **Proxy Handler** — getPrototypeOf、setPrototypeOf 等 13 种拦截器
- **惰性响应式** — 深层对象的懒代理
- **effect** — 响应式副作用的核心实现
- **scheduler** — 异步批量更新的调度器
- **watch** — 侦听数据变化的高级封装

---

[→ 下一节：Proxy 与 Reflect 深度解析](./Proxy深度解析)
