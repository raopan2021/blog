# Android 开发笔记

> 本系列基于 **API 额度助手** 实战项目，从零开始记录 Android 原生开发全过程。
>
> **前置知识**：了解 JavaScript/Vue 的同学可以直接上手，有编程基础即可。

<!-- more -->

## 🗺️ 学习路径

本教程分为三个阶段，循序渐进：

```
📦 第一阶段：入门（⭐）
   了解项目，跑通环境，掌握 Compose 基础
   
   01-项目概览 → 02-环境搭建 → 03-项目结构 → 04-数据模型 → 05-Compose基础

📦 第二阶段：进阶（⭐⭐）
   掌握核心技能，独立开发功能模块
   
   06-持久化 → 07-状态管理 → 08-网络请求 → 09-Compose进阶

📦 第三阶段：实战（⭐⭐⭐）
   综合运用，完整实现一个功能模块
   
   10-账户管理 → 11-设置页面 → 12-日志系统 → 13-构建发布
```

## 📚 文档目录

### 📗 第一阶段：入门

| 章节 | 内容 | 难度 |
|------|------|------|
| [项目概览](./01-项目概览) | 项目介绍、技术栈、与前端概念的对应关系 | ⭐ |
| [环境搭建](./02-环境搭建) | JDK、Android SDK、Gradle 安装配置 | ⭐ |
| [项目结构](./03-项目结构) | 目录结构、构建配置、文件组织 | ⭐ |
| [数据模型](./04-数据模型) | Kotlin 数据类、@Serializable 序列化、空安全 | ⭐ |
| [Compose 基础](./05-Compose基础) | @Composable、State、布局组件、列表渲染 | ⭐⭐ |

### 📘 第二阶段：进阶

| 章节 | 内容 | 难度 |
|------|------|------|
| [持久化](./06-持久化) | DataStore + Repository 模式、Flow 响应式数据流 | ⭐⭐ |
| [状态管理](./07-状态管理) | ViewModel + StateFlow + Coroutines | ⭐⭐ |
| [网络请求](./08-网络请求) | HttpURLConnection、Coroutines、重试机制、JSON解析 | ⭐⭐ |
| [Compose 进阶](./09-Compose进阶) | 动画、主题切换、LaunchedEffect、SwipeToDismiss | ⭐⭐⭐ |

### 📙 第三阶段：实战

| 章节 | 内容 | 难度 |
|------|------|------|
| [实战：账户管理](./10-实战账户管理) | 添加/编辑/删除账户、对话框、表单校验 | ⭐⭐⭐ |
| [实战：设置页面](./11-实战设置页面) | 主题切换、时间选择器、GitHub 版本检测 | ⭐⭐⭐ |
| [实战：日志系统](./12-实战日志系统) | ConcurrentLinkedQueue、SwipeToDelete、日志格式化 | ⭐⭐⭐ |
| [构建与发布](./13-构建发布) | 签名、APK 优化、R8 混淆、GitHub Actions | ⭐⭐⭐ |

## 🏗️ 项目技术栈

```
┌─────────────────────────────────────────────────────┐
│                    UI 层                             │
│           Jetpack Compose + Material3               │
│         （自定义 Icons2 图标，体积极小 ~20KB）         │
├─────────────────────────────────────────────────────┤
│                 状态管理层                           │
│          ViewModel + StateFlow + Coroutines         │
├─────────────────────────────────────────────────────┤
│                  数据层                             │
│         Repository 模式 + DataStore                  │
├─────────────────────────────────────────────────────┤
│                  网络层                             │
│          HttpURLConnection + org.json               │
└─────────────────────────────────────────────────────┘
```

## 📂 项目地址

- **GitHub**: https://github.com/raopan2021/api_quota_helper
- **Blog 文档**: https://raopan2021.github.io/blog/android/

## 🔗 参考资料

| 资源 | 说明 |
|------|------|
| [Android 官方文档](https://developer.android.com/develop) | Android 开发权威指南 |
| [Jetpack Compose Codelab](https://developer.android.com/codelabs/jetpack-compose-basics) | Google 官方 Compose 入门 |
| [Kotlin 官方文档](https://kotlinlang.org/docs/getting-started.html) | Kotlin 语言教程 |
| [Compose 示例项目](https://github.com/android/compose-samples) | Google 官方 Sample |
| [Material3 设计指南](https://m3.material.io/) | Material Design 3 |
| [Google I/O App 源码](https://github.com/google/iosched) | 最佳实践参考 |

## 💡 与前端概念的对应

如果你有前端（尤其是 Vue）背景，可以这样理解：

| Android 概念 | 前端对应 | 说明 |
|-------------|---------|------|
| Kotlin | TypeScript | 更现代的 Java，带类型推断 |
| Compose | Vue Composition API | 声明式 UI，响应式状态 |
| ViewModel | Vuex/Pinia | 状态管理，与 UI 分离 |
| StateFlow | ref()/reactive() | 响应式状态容器 |
| DataStore | localStorage | 本地持久化 |
| Coroutines | async/await | 异步编程 |
| Material3 | Element Plus | Google 设计系统 |

---

*文档持续更新中，如有疑问欢迎留言讨论。*
