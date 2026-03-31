# 模块一：Vue 项目框架

> 理解 Monorepo 架构，搭建我们的 Vue 源码学习环境

## 📍 配套源码

项目中已包含完整的 Vue3 源码学习项目：
```
projects/vue3-source/2024vue3-lesson-master/
├── pnpm-workspace.yaml    # pnpm workspace 配置
├── packages/
│   ├── reactivity/        # 响应式模块
│   ├── runtime-core/      # 运行时核心
│   ├── runtime-dom/       # DOM 运行时
│   └── compiler-core/     # 编译核心
```

## 📖 本节总结

**Monorepo** = Mono（单一）+ Repository（仓库），一个仓库管理多个独立的包。

**pnpm workspace** 是高效的依赖管理方案，Vue3 源码就是用它组织的。

### 核心文件
```
pnpm-workspace.yaml    # 声明包的目录位置
packages/
├── reactivity/        # 响应式模块
├── runtime-core/      # 运行时核心
└── ...
```

### 关键概念
| 概念 | 说明 |
|------|------|
| Monorepo | 单一仓库管理多包 |
| pnpm workspace | 高效的包管理工具 |
| 作用域包名 | `@vue-learn/xxx` 格式 |

---

## 本模块内容

1. [Monorepo 实战：用 pnpm workspace 搭建 Vue 源码学习项目](./monorepo实战)

## 知识点预览

- **Monorepo** — 单一代码仓库管理多个包
- **pnpm workspace** — 高效的依赖管理方案
- **项目结构设计** — 合理的模块划分

---

[→ 下一节：Monorepo 实战](./monorepo实战)
