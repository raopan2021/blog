# API 额度助手 - Android 原生开发实战

## 项目概述

这是一个查询 API 套餐额度的 Android 应用，支持多账户管理、实时查询、暗黑模式、网络日志调试等功能。

技术栈：Kotlin + Jetpack Compose + Material3 + ViewModel + DataStore + Kotlin Coroutines

<!-- more -->

## 技术栈

| 技术 | 说明 | 对应前端概念 |
|------|------|-------------|
| Kotlin | Android 主语言 | 类似 TypeScript |
| Jetpack Compose | UI 框架 | 类似 Vue Composition API |
| Material3 | 设计系统 | 类似 Element Plus / Ant Design |
| ViewModel + StateFlow | 状态管理 | 类似 Vuex / Pinia |
| DataStore | 本地持久化 | 类似 localStorage |
| Kotlin Coroutines | 异步编程 | 类似 async/await |

## 项目结构

```
api_quota_helper/
├── app/src/main/kotlin/com/apiapp/api_quota_helper/
│   ├── ApiQuotaApp.kt          # Application 入口（可选）
│   ├── MainActivity.kt         # 主入口，管理页面切换动画
│   ├── data/
│   │   ├── model/Models.kt    # 数据模型
│   │   ├── repository/         # 数据仓库层（DataStore 操作）
│   │   └── service/           # 业务服务（API 请求、日志缓冲）
│   └── ui/
│       ├── MainScreen.kt       # 主页面（账户卡片列表）
│       ├── MainViewModel.kt    # 主页面状态管理
│       ├── SettingsScreen.kt   # 设置页面 + GitHub 更新检测
│       └── theme/              # Compose 主题配置
├── build.gradle.kts            # 根构建配置
└── app/build.gradle.kts        # App 模块构建配置
```

## 架构设计

整体采用 **MVVM**（Model-View-ViewModel）架构，结合 **Repository 模式** 进行数据封装。

```
UI 层（Compose）
    ↓ 观察 StateFlow
ViewModel 层（状态管理、业务逻辑）
    ↓ 调用
Repository 层（数据仓库，封装 DataStore）
    ↓
DataStore（本地持久化）
```

### 分层职责

- **UI 层**：只负责渲染，响应 ViewModel 的状态
- **ViewModel 层**：管理 UI 状态，处理业务逻辑，通过 Coroutines 执行异步操作
- **Repository 层**：封装所有数据操作，对上屏蔽数据来源（可以是 DataStore、API、网络等）
- **Service 层**：具体业务实现，如 HTTP 请求、日志记录

## 核心功能实现

### 1. 数据模型

```kotlin
// 可序列化数据类，用于 DataStore 持久化和 JSON 序列化
@Serializable
data class UserAccount(
    val id: String,          // UUID，用于唯一标识
    val username: String,    // 用户名
    val token: String,       // API Token
    val createdAt: Long = System.currentTimeMillis()
)

// 账户 + 额度信息
@Serializable
data class AccountWithQuota(
    val account: UserAccount,
    val quota: QuotaData? = null,     // 查询到的额度数据
    val error: String? = null,        // 查询失败时的错误信息
    val lastUpdated: Long = 0L        // 最后更新时间戳
)
```

### 2. Repository - DataStore 持久化

使用 Jetpack DataStore 替代 SharedPreferences，支持复杂对象的 JSON 序列化存储：

```kotlin
private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "app_data")

class AccountRepository(private val context: Context) {
    private val json = Json { ignoreUnknownKeys = true }
    private val accountsKey = stringPreferencesKey("accounts")

    // 以 Flow 形式暴露数据，支持自动更新
    val accounts: Flow<List<UserAccount>> = context.dataStore.data.map { prefs ->
        val accountsJson = prefs[accountsKey] ?: "[]"
        json.decodeFromString(accountsJson)
    }

    suspend fun saveAccount(account: UserAccount) {
        context.dataStore.edit { prefs ->
            val current = json.decodeFromString<List<UserAccount>>(prefs[accountsKey] ?: "[]").toMutableList()
            val existing = current.indexOfFirst { it.id == account.id }
            if (existing >= 0) current[existing] = account else current.add(account)
            prefs[accountsKey] = json.encodeToString(current)
        }
    }
}
```

### 3. ViewModel - 状态管理

使用 StateFlow 管理 UI 状态，所有操作在 viewModelScope 中执行：

```kotlin
data class MainUiState(
    val accounts: List<AccountWithQuota> = emptyList(),
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val showAddDialog: Boolean = false,
    val editingAccount: UserAccount? = null,
    val settings: AppSettings = AppSettings()
)

class MainViewModel(
    private val repository: AccountRepository,
    private val quotaService: QuotaService
) : ViewModel() {

    private val _uiState = MutableStateFlow(MainUiState())
    val uiState: StateFlow<MainUiState> = _uiState.asStateFlow()

    init {
        // 初始化时加载数据
        loadAccounts()
    }

    private fun loadAccounts() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            repository.accounts.collect { accounts ->
                // 加载账户后自动查询额度
                refreshAllQuotas()
            }
        }
    }
}
```

### 4. 网络请求 - Coroutines + HttpURLConnection

使用 Kotlin Coroutines 的 `withContext(Dispatchers.IO)` 在 IO 线程执行网络请求，配合重试机制：

```kotlin
suspend fun queryQuota(account: UserAccount): Result<QuotaData> = withContext(Dispatchers.IO) {
    var lastException: Exception? = null

    // 最多重试 3 次
    repeat(3) { attempt ->
        try {
            val url = URL("http://v2api.aicodee.com/chaxun/query")
            val connection = url.openConnection() as HttpURLConnection
            connection.requestMethod = "POST"
            connection.connectTimeout = 15000
            connection.readTimeout = 30000
            connection.setRequestProperty("Content-Type", "application/json")

            // 发送 JSON 请求体
            val jsonBody = JSONObject().apply {
                put("username", account.username)
                put("token", account.token)
            }.toString()

            OutputStreamWriter(connection.outputStream).use { it.write(jsonBody) }

            // 读取响应
            val responseCode = connection.responseCode
            val body = connection.inputStream.bufferedReader().readText()

            if (responseCode == HttpURLConnection.HTTP_OK) {
                val jsonObject = JSONObject(body)
                if (jsonObject.optBoolean("success")) {
                    val data = jsonObject.getJSONObject("data")
                    return@withContext Result.success(QuotaData(
                        amount = data.optDouble("amount"),
                        amount_used = data.optDouble("amount_used"),
                        // ...
                    ))
                }
            }
        } catch (e: Exception) {
            lastException = e
            delay(1000) // 1 秒后重试
        }
    }
    Result.failure(lastException ?: Exception("请求失败"))
}
```

### 5. 日志系统 - ConcurrentLinkedQueue

使用线程安全的 `ConcurrentLinkedQueue` 实现内存日志缓冲，支持按时间倒序、分类筛选：

```kotlin
object LogBuffer {
    private val logs = ConcurrentLinkedQueue<LogEntry>()
    private const val maxSize = 50

    data class LogEntry(...)
    
    fun logRequest(logType: String, username: String, requestBody: String) { ... }
    fun logResponse(...) { ... }
    fun getAll(): List<LogEntry> = logs.toList().reversed()
    fun delete(id: Long) { logs.removeAll { it.id == id } }
    fun clear() = logs.clear()
}
```

### 6. Compose UI - 页面切换动画

使用 `AnimatedContent` 实现丝滑的页面切换动画：

```kotlin
AnimatedContent(
    targetState = currentScreen,
    transitionSpec = {
        when (targetState) {
            "main" -> (slideInHorizontally { -it } + fadeIn() + scaleIn(initialScale = 0.92f))
                .togetherWith(slideOutHorizontally { it } + fadeOut() + scaleOut(targetScale = 1.08f))
            else -> fadeIn() togetherWith fadeOut()
        }
    }
) { screen ->
    when (screen) {
        "main" -> MainScreen(...)
        "settings" -> SettingsScreen(...)
        "logs" -> LogScreen(...)
    }
}
```

### 7. 暗黑模式

通过 DataStore 持久化主题设置，Compose 主题动态切换：

```kotlin
ApiQuotaHelperTheme(darkTheme = uiState.settings.darkMode) {
    Surface(color = MaterialTheme.colorScheme.background) {
        // 整个应用自动响应主题变化
    }
}
```

### 8. GitHub 更新检测

设置页面自动调用 GitHub API 检查最新 release：

```kotlin
val apiUrl = URL("https://api.github.com/repos/raopan2021/api_quota_helper/releases/latest")
val conn = apiUrl.openConnection() as HttpURLConnection
conn.setRequestProperty("Accept", "application/vnd.github+json")

if (conn.responseCode == 200) {
    val json = JSONObject(conn.inputStream.bufferedReader().readText())
    val latestVersion = json.getString("tag_name").removePrefix("v")
    // 对比当前版本，决定是否提示更新
}
```

## 构建配置

### Gradle 版本管理

使用 `gradle.properties` 集中管理版本号：

```properties
# gradle.properties
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
```

### 签名与压缩

Release 构建使用签名配置，并启用 R8 压缩减小 APK 体积：

```kotlin
buildTypes {
    release {
        isMinifyEnabled = true
        isShrinkResources = true
        proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"))
        if (file("api_quota_helper.jks").exists()) {
            signingConfig = signingConfigs.getByName("release")
        }
    }
    debug {
        isMinifyEnabled = true
        isShrinkResources = true
        applicationIdSuffix = ".debug"
    }
}
```

### 只打包 arm64 架构

通过 NDK 过滤器只保留 arm64-v8a，大幅减小 APK 体积：

```kotlin
defaultConfig {
    ndk {
        abiFilters += listOf("arm64-v8a")
    }
}
```

最终 APK 从 15MB 优化到 **2.6MB**。

## 开发环境

- JDK 17+
- Android SDK 35
- Gradle 8.7

本地需要提前安装配置好 Android SDK，参考 [前端开发者入门指南](前端开发者入门指南)

## 总结

这个项目展示了用 Kotlin 开发 Android 应用的完整流程：

1. **Jetpack Compose** 替代传统 XML，声明式 UI 更符合前端开发者的直觉
2. **StateFlow** 管理状态，类似前端响应式编程的体验
3. **Repository 模式** 封装数据操作，分层清晰易于测试
4. **Coroutines** 处理异步，代码比 Promise 更简洁
5. **Material3** 提供现代化设计组件，快速搭建精美 UI

如果你熟悉 Vue 或 React，上手 Compose 其实非常快——核心都是声明式渲染和响应式状态管理。
