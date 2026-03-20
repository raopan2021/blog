# Android 开发笔记

> 本系列基于 **API 额度助手** 实战项目，从零开始记录 Android 原生开发全过程。

<!-- more -->

## 📖 文档目录

| 章节 | 内容 | 难度 |
|------|------|------|
| [项目概览](./01-项目概览) | 项目介绍、技术栈对比表 | ⭐ |
| [环境搭建](./02-环境搭建) | JDK、Android SDK、Gradle 安装配置 | ⭐ |
| [项目结构](./03-项目结构) | 目录结构、构建配置详解 | ⭐ |
| [数据模型](./04-数据模型) | Kotlin 数据类、序列化 | ⭐⭐ |
| [持久化](./05-持久化) | DataStore + Repository 模式 | ⭐⭐ |
| [状态管理](./06-状态管理) | ViewModel + StateFlow | ⭐⭐ |
| [网络请求](./07-网络请求) | Coroutines + HttpURLConnection | ⭐⭐⭐ |
| [Compose 基础](./08-Compose基础) | @Composable、State、布局组件 | ⭐⭐ |
| [Compose 进阶](./09-Compose进阶) | 动画、主题、Material3 | ⭐⭐⭐ |
| [实战：账户管理](./10-实战账户管理) | 完整功能模块实现 | ⭐⭐⭐ |
| [构建与发布](./11-构建发布) | 签名、APK 优化、打包发布 | ⭐⭐ |

## 🏗️ 项目技术栈

```
┌─────────────────────────────────────────────────────┐
│                    UI 层                             │
│           Jetpack Compose + Material3               │
├─────────────────────────────────────────────────────┤
│                 状态管理层                           │
│          ViewModel + StateFlow + Coroutines         │
├─────────────────────────────────────────────────────┤
│                  数据层                             │
│         Repository 模式 + DataStore                 │
├─────────────────────────────────────────────────────┤
│                  网络层                             │
│          HttpURLConnection + JSON                   │
└─────────────────────────────────────────────────────┘
```

## 📂 项目地址

- **GitHub**: https://github.com/raopan2021/api_quota_helper
- **Blog 文档**: https://raopan2021.github.io/blog/android/

## 🎯 学习路径建议

```
第1步 → 环境搭建（JDK + Android SDK）
第2步 → 项目结构（跑通项目，了解目录）
第3步 → 数据模型（Kotlin 数据类）
第4步 → Compose 基础（写 UI）
第5步 → 状态管理（ViewModel + StateFlow）
第6步 → 持久化（DataStore）
第7步 → 网络请求（API 调用）
第8步 → Compose 进阶（动画、主题）
第9步 → 实战（完整功能）
第10步 → 构建发布
```

## 🔗 参考资料

| 资源 | 说明 |
|------|------|
| [Android 官方文档](https://developer.android.com/develop) | Android 开发权威指南 |
| [Jetpack Compose Codelab](https://developer.android.com/codelabs/jetpack-compose-basics) | Google 官方 Compose 入门 |
| [Kotlin 官方文档](https://kotlinlang.org/docs/getting-started.html) | Kotlin 语言教程 |
| [Compose 示例项目](https://github.com/android/compose-samples) | Google 官方 Sample |
| [Material3 设计指南](https://m3.material.io/) | Material Design 3 |
| [DataStore 文档](https://developer.android.com/topic/libraries/architecture/datastore) | Google 官方持久化方案 |
| [Google I/O App 源码](https://github.com/google/iosched) | 最佳实践参考 |
