# 模块二：响应式基础

> 深入理解 Vue3 响应式系统的核心：Proxy、依赖收集、触发更新

## 📍 配套源码

```
packages/reactivity/src/
├── effect.ts        # ReactiveEffect、trackEffect、triggerEffects
├── reactive.ts      # reactive、createReactiveObject
├── baseHandler.ts   # Proxy Handler (get/set)
├── ref.ts           # RefImpl、toRef、toRefs
└── computed.ts      # ComputedRefImpl
```

## 📖 本节总结

**响应式核心**：Vue3 使用 Proxy 代理对象，在 getter 中收集依赖（track），在 setter 中触发更新（trigger）。

### 核心 API
| API | 用途 | 原理 |
|-----|------|------|
| `reactive` | 对象响应式 | Proxy 深层代理 |
| `ref` | 基础类型响应式 | 包装对象 + getter/setter |
| `computed` | 计算属性 | 依赖追踪 + 缓存 |
| `track` | 收集依赖 | 建立 target→key→effects 映射 |
| `trigger` | 触发更新 | 从映射中找到 effects 并执行 |

### 配套源码
```
packages/reactivity/src/
├── effect.ts        # ReactiveEffect、trackEffect、triggerEffects
├── reactive.ts      # reactive、createReactiveObject
├── baseHandler.ts   # Proxy Handler (get/set)
├── ref.ts           # RefImpl、toRef、toRefs
└── computed.ts      # ComputedRefImpl
```

---

## 本模块内容

1. [响应式系统入门：ref 与 reactive](./响应式系统入门)
2. [依赖收集与触发机制](./依赖收集与触发)

## 知识点预览

- **Proxy** — Vue3 响应式的数据劫持方案
- **track / trigger** — 依赖收集与更新的核心函数
- **ref** — 基础类型数据的响应式包装
- **reactive** — 对象类型的响应式转换
- **依赖图** — 理解 targetMap 的结构

---

[→ 下一节：响应式系统入门](./响应式系统入门)
