# 项目研发笔记：API 额度助手

本文档记录 **API 额度助手** 项目的完整研发过程，包括需求分析、技术选型、架构设计、迭代优化等。

<!-- more -->

## 📋 项目概述

### 背景需求

日常使用多个 API 服务时，每个服务的额度管理分散在不同平台，查询不便。期望有一个**统一入口**，能：

- 一键查看所有账户的 API 额度
- 支持多个账户管理（添加、编辑、删除）
- 本地持久化存储
- 暗黑模式支持
- 网络请求日志记录

### 核心功能

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 多账户管理 | 添加/编辑/删除 API 账户 | P0 |
| 额度查询 | 一键刷新所有账户额度 | P0 |
| 本地持久化 | DataStore 存储账户信息 | P0 |
| 暗黑模式 | 跟随系统或手动切换 | P1 |
| 请求日志 | 记录每次 API 请求详情 | P1 |
| 自动重试 | 失败自动重试 3 次 | P1 |
| 版本检测 | GitHub API 检测最新版本 | P2 |

## 🏗️ 技术选型

### 为什么用 Kotlin + Jetpack Compose？

| 方案 | 优点 | 缺点 |
|------|------|------|
| **Kotlin + Compose** | 现代声明式 UI、Google 主推、语法简洁 | 学习曲线较陡 |
| Java + XML | 学习资源多、生态成熟 | 代码繁琐、状态管理复杂 |
| Flutter | 跨平台、性能好 | 需要学 Dart、Native 集成复杂 |
| React Native | 前端同学容易上手 | 性能不如原生 |

**选择理由**：
1. Jetpack Compose 是 Google 官方推荐的 UI 框架，代表未来方向
2. Kotlin 语言简洁、安全，适合 Android 开发
3. Compose 的声明式理念与 Vue Composition API 类似，前端同学容易上手

### 核心依赖

```kotlin
// build.gradle.kts（根目录）
plugins {
    id("com.android.application") version "8.3.2"
    id("org.jetbrains.kotlin.android") version "2.0.0"
    id("com.google.devtools.ksp") version "2.0.0-1.0.21"
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.0"
    id("org.jetbrains.kotlin.plugin.serialization") version "2.0.0"
}
```

```kotlin
// app/build.gradle.kts
dependencies {
    // Compose BOM 统一版本管理
    val composeBom = platform("androidx.compose:compose-bom:2024.02.00")
    implementation(composeBom)

    // Core
    implementation("androidx.core:core-ktx:1.12.0")

    // ViewModel + StateFlow
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.7.0")

    // Compose UI
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.animation:animation")

    // DataStore 持久化
    implementation("androidx.datastore:datastore-preferences:1.0.0")

    // JSON 序列化
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2")
}
```

### 架构模式：MVVM

```
┌──────────────────────────────────────────────────────┐
│                        UI 层                          │
│              MainScreen.kt（Compose UI）              │
│         观察 viewModel.uiState，自动重组 UI            │
└────────────────────────────┬─────────────────────────┘
                             │ 观察 StateFlow
┌────────────────────────────▼─────────────────────────┐
│                    ViewModel 层                        │
│              MainViewModel.kt                          │
│    管理 MainUiState，处理业务逻辑，调用 Repository       │
└────────────────────────────┬─────────────────────────┘
                             │ 调用
┌────────────────────────────▼─────────────────────────┐
│                   Repository 层                       │
│            AccountRepository.kt                        │
│       封装 DataStore，对外提供 Flow 数据流             │
└────────────────────────────┬─────────────────────────┘
                             │ 读写
┌────────────────────────────▼─────────────────────────┐
│                   DataStore 层                         │
│              preferences DataStore                     │
│         以 JSON 字符串存储复杂对象                      │
└──────────────────────────────────────────────────────┘
```

## 📐 目录结构设计

```
api_quota_helper/
├── app/
│   └── src/main/
│       ├── kotlin/com/apiapp/api_quota_helper/
│       │   ├── MainActivity.kt        # 入口，页面路由
│       │   ├── MainScreen.kt          # 主页面 UI
│       │   ├── MainViewModel.kt       # 主页面 ViewModel
│       │   ├── SettingsScreen.kt      # 设置页面
│       │   ├── LogScreen.kt           # 日志页面
│       │   ├── data/
│       │   │   ├── model/
│       │   │   │   └── Models.kt      # 数据模型
│       │   │   ├── repository/
│       │   │   │   └── AccountRepository.kt  # 数据仓库
│       │   │   └── service/
│       │   │       ├── QuotaService.kt      # API 请求
│       │   │       └── LogBuffer.kt         # 日志缓冲
│       │   └── ui/theme/
│       │       ├── Color.kt
│       │       ├── Type.kt
│       │       └── Theme.kt
│       └── res/                      # 资源文件
├── build.gradle.kts                  # 根构建配置
├── settings.gradle.kts               # 项目设置
└── gradle.properties                # Gradle 属性
```

## 🔄 迭代过程

### v1.0.1 - 初始版本

**目标**：完成基本框架搭建，实现账户列表展示

**完成内容**：
- 项目初始化，配置 Compose 环境
- 数据模型定义（UserAccount、QuotaData）
- Repository + DataStore 基础封装
- MainScreen 静态 UI 展示

**代码示例** - 初始版本的 MainScreen：

```kotlin
@Composable
fun MainScreen() {
    val accounts = remember { mutableStateOf<List<UserAccount>>(emptyList()) }

    Column(modifier = Modifier.fillMaxSize()) {
        accounts.value.forEach { account ->
            Text(account.username)
        }
    }
}
```

### v1.0.5 - 添加账户功能

**目标**：实现添加账户对话框

**完成内容**：
- AddAccountDialog 组件
- 表单校验（用户名/Token 不能为空）
- 调用 Repository 保存

**学到的经验**：
- Compose 的状态提升（state hoisting）很重要
- 对话框应该作为函数参数接收状态，而不是自己管理

### v1.0.10 - 网络请求

**目标**：对接 API，实现额度查询

**完成内容**：
- QuotaService 网络请求封装
- HttpURLConnection + Coroutines
- 重试机制（最多 3 次）
- 错误处理和日志记录

**代码示例** - 带重试的网络请求：

```kotlin
suspend fun queryQuota(account: UserAccount): Result<QuotaData> {
    var lastException: Exception? = null

    repeat(3) { attempt ->
        try {
            // 发起请求...
            if (success) return Result.success(data)
        } catch (e: Exception) {
            lastException = e
            if (attempt < 2) delay(1000) // 重试
        }
    }

    return Result.failure(lastException ?: Exception("请求失败"))
}
```

### v1.0.15 - 状态管理重构

**目标**：规范化 MVVM 架构

**完成内容**：
- MainUiState 状态类定义
- MainViewModel 管理所有业务逻辑
- StateFlow 驱动 UI 自动更新

**重构前 vs 重构后**：

```kotlin
// ❌ 重构前：Screen 管理状态（混乱）
@Composable
fun MainScreen() {
    var accounts by remember { mutableStateOf<List>(emptyList()) }
    var isLoading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    // 业务逻辑也在 Screen 里...
}

// ✅ 重构后：ViewModel 管理状态（清晰）
@Composable
fun MainScreen(viewModel: MainViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    // UI 只负责渲染，逻辑都在 ViewModel
}
```

### v1.0.20 - UI 优化

**目标**：提升用户体验

**完成内容**：
- 卡片式账户展示
- 颜色指示额度状态（绿/蓝/红）
- 进度条可视化
- 加载状态动画

**卡片颜色逻辑**：

```kotlin
val statusColor = when {
    remainingPercent > 50 -> Color(0xFF4CAF50) // 绿色
    remainingPercent > 20 -> Color(0xFF2196F3) // 蓝色
    else -> Color(0xFFF44336) // 红色
}
```

### v1.0.25 - 编辑/删除功能

**目标**：完整的 CRUD 操作

**完成内容**：
- 编辑对话框复用（添加/编辑共用）
- 删除二次确认
- 编辑时自动填充表单

**学到的经验**：
- 编辑和添加可以共用一个对话框，通过 `editingAccount` 是否为 null 区分
- 删除一定要有确认，防止误操作

### v1.0.30 - 设置页面

**目标**：主题切换、刷新间隔配置

**完成内容**：
- SettingsScreen 页面
- PickerColumn 滚动选择器
- 主题实时切换
- 设置持久化

### v1.0.35 - 日志系统

**目标**：记录所有网络请求

**完成内容**：
- LogBuffer 单例管理日志
- ConcurrentLinkedQueue 存储
- 日志页面展示
- SwipeToDelete 滑动删除

**LogBuffer 设计**：

```kotlin
object LogBuffer {
    private val logs = ConcurrentLinkedQueue<LogEntry>()

    fun logResponse(...) {
        val entry = LogEntry(...)
        logs.offer(entry)
        while (logs.size > 50) logs.poll() // 最多50条
    }

    fun getAll(): List<LogEntry> = logs.toList().reversed()
}
```

### v1.0.40 - GitHub 版本检测

**目标**：自动检测更新

**完成内容**：
- 调用 GitHub API 获取最新 release
- 版本号比较算法
- 下载 APK 并安装

### v1.0.45 - APK 优化

**目标**：减小安装包体积

**优化措施**：
1. 只打包 arm64-v8a 架构
2. 启用 R8 压缩
3. 使用 Compose BOM 统一版本
4. 自定义 Icons2 替代 Material Icons

**优化效果**：15MB → 2.6MB

### v1.0.50 - 文档完善

**目标**：沉淀技术文档

**完成内容**：
- 编写 13 章完整的开发文档
- 补充常见问题 FAQ
- 添加与前端概念的对比说明

## 🎯 开发心得

### 1. 架构设计

- **MVVM 是银弹**：UI 只负责渲染，ViewModel 处理所有逻辑
- **Repository 模式**：封装数据操作，对外提供干净的接口
- **单向数据流**：状态只能从 ViewModel → UI，不能反向

### 2. Compose 最佳实践

- **状态提升**：把状态放到需要它的最顶层组件
- **副作用处理**：网络请求、文件操作用 `LaunchedEffect`
- **key 帮助更新**：列表用稳定的 key 帮助 Compose 高效重组

### 3. 性能优化

- **惰性加载**：LazyColumn 只渲染可见项
- **减少重组**：用 `derivedStateOf` 避免不必要的 UI 更新
- **APK 优化**：架构过滤 + R8 + BOM 管理依赖

### 4. 与前端对比

| Android | 前端（Vue） | 说明 |
|---------|-------------|------|
| @Composable | `<template>` + `<script setup>` | UI 声明 |
| StateFlow | ref()/reactive() | 响应式状态 |
| ViewModel | Pinia/Vuex | 状态管理 |
| DataStore | localStorage | 本地持久化 |
| Coroutines | async/await | 异步编程 |
| Repository | Store + API Service | 数据层封装 |

## 📚 参考资料

- [Android 官方文档](https://developer.android.com/develop)
- [Jetpack Compose Codelab](https://developer.android.com/codelabs/jetpack-compose-basics)
- [Kotlin 官方文档](https://kotlinlang.org/docs/getting-started.html)
- [Material3 设计指南](https://m3.material.io/)

## 🚀 未来规划

- [ ] Widget 小组件开发
- [ ] 账户额度告警通知
- [ ] 数据导出/导入功能
- [ ] 多语言支持（中/英）

---

*文档持续更新中，欢迎提出建议！*
