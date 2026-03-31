# 模块五：性能优化

> 理解虚拟 DOM 的概念、Diff 算法的核心逻辑，以及 Vue 的编译时优化技巧

## 📍 配套源码

本模块配套源码位置：
```
projects/vue3-source/2024vue3-lesson-master/
└── packages/
    ├── runtime-core/src/renderer.ts    # 渲染器核心
    ├── runtime-dom/src/                # DOM 操作实现
    └── shared/src/patchFlags.ts        # Patch Flags 定义
```

## 📖 本节总结

**虚拟 DOM**：用 JS 对象描述 DOM，跨平台、可批量更新。

**Diff 算法**：同层比较，复杂度 O(n)，通过 key 优化复用。

### 核心概念
| 概念 | 说明 |
|------|------|
| 虚拟 DOM | 用 JS 对象描述 DOM |
| VNode | 虚拟节点的数据结构 |
| createElement | 根据 VNode 创建真实 DOM |
| patch | 比较新旧 VNode，找出差异 |
| key | 优化复用，避免状态错乱 |
| Patch Flags | 编译时标记，运行时精确更新 |

### 配套源码
```
packages/runtime-core/src/
├── renderer.ts    # 渲染器核心
├── createVnode.ts # VNode 创建
packages/runtime-dom/src/    # DOM 操作实现
packages/shared/src/
├── patchFlags.ts  # Patch Flags 定义
└── shapeFlags.ts  # Shape Flags 定义
```

## 本模块内容
1. [虚拟 DOM 与 Diff 算法](./虚拟DOM与Diff算法)
## 知识点预览
- **虚拟 DOM** — 用 JS 对象描述真实 DOM，跨平台更方便
- **Diff 算法** — 比较新旧虚拟 DOM，找出最小更新量
- **patch** — 将变化应用到真实 DOM
- **编译时优化** — static props hoisting、cache handler 等
