# 手写 Vue3 实战

> 跟着源码手写实现，真正理解 Vue3 的核心原理

## 📂 配套源码

本章节配套完整的 Vue3 源码学习项目：
projects/vue3-source/2024vue3-lesson-master/

## 🎯 练习列表

| 序号 | 题目 | 难度 | 配套源码 |
|------|------|------|----------|
| 01 | [实现响应式系统](./exercise/ex01-reactive) | ⭐⭐ | `packages/reactivity/src/` |
| 02 | [理解 Proxy 的 receiver](./exercise/ex02-proxy-receiver) | ⭐⭐⭐ | `packages/reactivity/src/baseHandler.ts` |
| 03 | [实现最长递增子序列 (LIS)](./exercise/ex03-lis) | ⭐⭐⭐⭐ | `packages/runtime-core/src/seq.ts` |
| 04 | [实现任务调度器](./exercise/ex04-scheduler) | ⭐⭐⭐ | `packages/runtime-core/src/scheduler.ts` |
| 05 | [实现计算属性](./exercise/ex05-computed) | ⭐⭐⭐ | `packages/reactivity/src/computed.ts` |
| 06 | [实现 watch](./exercise/ex06-watch) | ⭐⭐⭐⭐ | `packages/reactivity/src/apiWatch.ts` |
| 07 | [实现虚拟 DOM 与 Diff](./exercise/ex07-vnode-diff) | ⭐⭐⭐⭐ | `packages/runtime-core/src/renderer.ts` |

## 🚀 如何学习
1. **先看配套源码** — 阅读对应的 Vue3 源码文件
2. **理解原理** — 看文档中的原理解析
3. **动手实现** — 根据提示完成练习
4. **对比答案** — 参考源码中的实现方式
## 💡 提示
每个练习都有配套的源码路径，可以在 `2024vue3-lesson-master/` 目录下找到对应的实现。