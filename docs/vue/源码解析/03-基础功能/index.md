# 模块三：基础功能

> 理解 Vue 组件的创建、挂载与生命周期管理

## 📍 配套源码

```
packages/runtime-core/src/
├── component.ts      # createComponentInstance、setupComponent
└── apiLifecycle.ts   # 生命周期钩子实现
```

## 📖 本节总结

**组件实例**：Vue 在内部创建组件实例对象，存储组件的状态、方法、生命周期等。

### 核心流程
```
createComponentInstance()  → 创建实例
     ↓
initProps()               → 初始化 props
     ↓
setupComponent()          → 执行 setup()
     ↓
setupState()             → 合并状态
```

## 知识点预览
- **组件实例** — Vue 组件的内部表示，包含状态、方法、生命周期等
- **setup** — Vue3 新增的组合式 API 入口
- **生命周期钩子** — created、mounted、updated、unmounted 等的执行时机
- **组件挂载流程** — 从 vnode 到真实 DOM 的转变

## 本节内容
1. [组件实例创建](./组件实例创建)
2. [生命周期钩子实现](./生命周期钩子)
