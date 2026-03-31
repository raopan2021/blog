# Vue 源码解析

> 从零开始，深入理解 Vue3 的核心实现原理

## 📚 课程总结
本系列教程通过**理论 + 实战**的方式，带你从源码角度理解 Vue3 的设计思想。
### 模块一：项目框架
::: details 点击展开
- Monorepo 架构介绍
- pnpm workspace 配置
- 搭建自己的 Vue 源码学习项目
:::
### 模块二：响应式基础
::: details 点击展开
- 理解 ref 和 reactive
- 响应式系统的核心：Proxy
- 依赖收集与触发
:::
### 模块三：基础功能
::: details 点击展开
- 组件实例的创建过程
- 生命周期钩子的实现
- 模板编译入门
:::
### 模块四：响应式深入
::: details 点击展开
- Proxy 与 Reflect 深度解析
- effect 与 computed 原理
- watch 的实现机制
:::
### 模块五：性能优化
::: details 点击展开
- 虚拟 DOM 的概念
- Diff 算法的核心逻辑
- 编译时优化技巧
:::
### 模块六：手写 Vue3 实战
::: details 点击展开
- 7 个练习题，手写实现核心功能
- 配套完整源码对照
:::
### 模块七：Vue2/3 响应式对比
::: details 点击展开
- defineProperty vs Proxy
- Vue2 响应式的局限
- 为什么 Vue3 选择 Proxy
:::
### 模块八：Vue3 版本演进
::: details 点击展开
- Vue 3.0 初版特性
- Vue 3.2 script setup 语法糖
- Vue 3.4 性能飞跃
:::
## 🎯 学习目标
1. **理解 Vue3 的核心响应式系统** — 掌握 Proxy、Effect、Watch 的原理
2. **了解组件挂载与更新流程** — 从 template 到真实 DOM 的转变
3. **掌握性能优化思路** — 虚拟 DOM、懒加载、computed 缓存
4. **具备阅读源码的能力** — 遇到问题能追根溯源
## 📂 配套源码
项目中已附带完整的 Vue3 源码学习项目，位于：
```
projects/vue3-source/2024vue3-lesson-master/
├── packages/
│   ├── reactivity/src/         # 响应式系统完整源码
│   │   ├── effect.ts           # ReactiveEffect、trackEffect、triggerEffects
│   │   ├── reactive.ts         # reactive、createReactiveObject
│   │   ├── ref.ts              # RefImpl、toRef、toRefs、proxyRefs
│   │   ├── computed.ts          # ComputedRefImpl
│   │   ├── baseHandler.ts       # Proxy Handler
│   │   └── reactiveEffect.ts    # 依赖创建和管理
│   ├── runtime-core/src/        # 运行时核心
│   │   ├── component.ts         # 组件实例创建、setupComponent
│   │   ├── renderer.ts          # 渲染器、mountElement、patchElement
│   │   ├── scheduler.ts         # 任务调度、queueJob
│   │   └── apiLifecycle.ts      # 生命周期钩子
│   ├── runtime-dom/src/         # DOM 特定实现
│   └── shared/src/              # 共享工具、patchFlags
```
## 💡 适合人群
- 有一定 Vue 开发经验，想深入理解内部原理
- 对前端框架设计感兴趣的同学
- 准备面试或想要提升架构能力的前端工程师
## 📖 学习建议
1. **按顺序学习** — 每个模块都建立在前一个模块的基础上
2. **理论结合代码** — 每章都提供简化的实现代码和真实源码对照
3. **动手练习** — 模块六的练习题，尝试自己实现后再看答案
4. **不懂就查** — 配合源码项目，边学边看实际代码
Let's Go! 🚀
