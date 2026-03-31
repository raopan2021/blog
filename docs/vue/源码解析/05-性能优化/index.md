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

## 本模块内容

1. [虚拟 DOM 与 Diff 算法](./虚拟DOM与Diff算法)

## 知识点预览

- **虚拟 DOM** — 用 JS 对象描述真实 DOM，跨平台更方便
- **Diff 算法** — 比较新旧虚拟 DOM，找出最小更新量
- **patch** — 将变化应用到真实 DOM
- **编译时优化** — static props hoisting、cache handler 等

---

[→ 下一节：虚拟 DOM 与 Diff 算法](./虚拟DOM与Diff算法)
