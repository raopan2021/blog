# 模块七：Vue2/3 响应式对比

> 深入理解 Vue2 和 Vue3 响应式系统的核心差异

## 📍 配套源码

```
projects/vue3-source/2024vue3-lesson-master/
└── packages/reactivity/src/
    ├── reactive.ts        # Vue3 响应式
    ├── baseHandler.ts    # Proxy Handler
    └── effect.ts         # 依赖追踪
```

## 📖 本模块总结

**核心区别**：Vue2 用 `Object.defineProperty`，Vue3 用 `Proxy`。

| 特性 | Vue2 defineProperty | Vue3 Proxy |
|------|---------------------|-------------|
| 监听新增属性 | ❌ 需 Vue.set | ✅ 原生支持 |
| 监听删除属性 | ❌ 需 Vue.delete | ✅ 原生支持 |
| 数组索引监听 | ⚠️ 需 hack | ✅ 原生支持 |
| 深层对象 | ⚠️ 需递归 | ✅ 自动递归 |
| 性能 | 需遍历所有 key | 按需代理 |

## 本模块内容
1. [响应式原理对比](./响应式原理对比)
2. [defineProperty vs Proxy](./defineProperty对比Proxy)
3. [Vue2 响应式的局限](./Vue2响应式的局限)
