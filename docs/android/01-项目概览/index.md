# 01 - 项目概览

## 项目简介

**API 额度助手** 是一个 Android 原生应用，用于查询和管理多个 API 账户的套餐额度。

<!-- more -->

### 核心功能

- ✅ **多账户管理** — 添加、编辑、删除 API 账户
- ✅ **实时额度查询** — 一键刷新所有账户额度
- ✅ **自动重试机制** — 失败自动重试 3 次
- ✅ **暗黑模式** — 跟随系统或手动切换
- ✅ **本地持久化** — DataStore 存储，数据不丢失
- ✅ **网络日志** — 详细记录每次请求的请求/响应，支持 JSON 格式化
- ✅ **卡片式 UI** — 颜色指示额度状态（绿/蓝/红）
- ✅ **页面切换动画** — 丝滑的 AnimatedContent 过渡
- ✅ **GitHub 更新检测** — 自动检查最新版本

## 技术栈详解

| 技术 | 版本 | 说明 | 对应前端概念 |
|------|------|------|-------------|
| **Kotlin** | 2.0.0 | Android 主语言，现代、简洁、安全 | 类似 TypeScript |
| **Jetpack Compose** | BOM 2024.02 | 声明式 UI 框架 | 类似 React / Vue Composition API |
| **Material3** | 最新 | Google 设计系统 | 类似 Element Plus / Ant Design |
| **ViewModel** | 2.7.0 | UI 状态管理组件 | 类似 Vuex / Pinia / Redux |
| **StateFlow** | - | 响应式状态流 | 类似 reactive() / ref() |
| **DataStore** | 1.0.0 | 本地键值存储 | 类似 localStorage / IndexedDB |
| **Kotlin Coroutines** | - | 异步编程 | 类似 async/await + Promise |
| **KSP** | 2.0.0-1.0.21 | 注解处理器 | 类似 Babel 插件 |

## Kotlin vs JavaScript 对比

```kotlin
// Kotlin：类型推断 + 空安全
val name: String = "API Helper"
val count: Int? = null  // 可空类型
val length = name?.length ?: 0  // 安全调用 + Elvis

// 对比 JavaScript
const name = "API Helper"
const count = null
const length = name?.length ?? 0  // 原生也支持可选链
```

```kotlin
// Kotlin：数据类，自动生成 equals/hashCode/copy/toString
data class UserAccount(
    val id: String,
    val username: String,
    val token: String,
    val createdAt: Long = System.currentTimeMillis()
)

// 对比 JavaScript（需要自己写或用库）
class UserAccount {
    constructor(id, username, token, createdAt = Date.now()) {
        this.id = id
        this.username = username
        this.token = token
        this.createdAt = createdAt
    }
    // 手写方法...
}
```

## Compose vs Vue 对比

```kotlin
// Compose：声明式 UI
@Composable
fun MainScreen(viewModel: MainViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    
    Column {
        Text("账户数量: ${uiState.accounts.size}")
        Button(onClick = { viewModel.refreshAllQuotas() }) {
            Text("刷新")
        }
    }
}

// 对比 Vue Composition API
// <template>
//   <div>
//     <p>账户数量: {{ uiState.accounts.length }}</p>
//     <button @click="viewModel.refreshAllQuotas()">刷新</button>
//   </div>
// </template>
```

## 架构模式：MVVM

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
│                   DataStore 层                        │
│              preferences DataStore                     │
│         以 JSON 字符串存储复杂对象                      │
└──────────────────────────────────────────────────────┘
```

::: tip 为什么用 MVVM？
- **UI 逻辑分离**：ViewModel 专注状态管理，Screen 专注 UI 渲染
- **可测试性**：ViewModel 和 Repository 都可以单独测试
- **响应式**：StateFlow 自动驱动 UI 更新，不用手动刷新
- **生命周期安全**：ViewModel 跟随 Activity/Fragment 生命周期，数据不会因配置变更丢失
:::

## API 接口格式

应用对接 `http://v2api.aicodee.com/chaxun/query` 接口。

**请求：**
```json
{
  "username": "your_username",
  "token": "your_api_key"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "plan_name": "专业版",
    "days_remaining": 25,
    "amount": 100.0,
    "amount_used": 32.5,
    "next_reset_time": "2026/04/01 00:00:00",
    "status": "active"
  }
}
```

## 下一章

[环境搭建 →](./02-环境搭建)
