# 11 - 实战：设置页面

本章完整实现设置页面的功能，包括主题切换、时间选择器和 GitHub 版本检测。

<!-- more -->

## 功能需求

1. **主题切换** — 暗黑模式/明亮模式即时切换
2. **刷新间隔设置** — 时:分:秒 三级选择器
3. **查看日志** — 跳转到日志页面
4. **版本信息** — 显示当前版本号、作者
5. **检查更新** — 调用 GitHub API 检测最新版本，支持下载更新

## 整体架构

```
SettingsScreen
├── 主题设置（Switch 开关）
├── 定时刷新设置（PickerColumn x3）
├── 调试入口（Button → LogScreen）
├── 关于信息（Card 显示版本）
└── 更新检查（Card + Button）
```

## 1. PickerColumn 时间选择器

这是一个可复用的滚动选择器组件，使用 `ExposedDropdownMenuBox` 实现：

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PickerColumn(
    value: Int,              // 当前值
    range: IntRange,         // 可选范围，如 0..59
    onValueChange: (Int) -> Unit,  // 值变化回调
    label: @Composable () -> Unit  // 标签，如 { Text("分") }
) {
    var expanded by remember { mutableStateOf(false) }

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it }  // 点击展开/收起
    ) {
        OutlinedTextField(
            value = value.toString().padStart(2, '0'),  // 补零显示，如 "05"
            onValueChange = {},    // 只读，用户不能直接输入
            readOnly = true,
            label = label,
            trailingIcon = {
                ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded)
            },
            modifier = Modifier
                .menuAnchor()      // 必须加，否则下拉菜单位置不对
                .width(100.dp),
            singleLine = true,
            textStyle = LocalTextStyle.current.copy(
                textAlign = TextAlign.Center  // 文字居中
            )
        )

        // 下拉菜单选项
        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            range.forEach { item ->
                DropdownMenuItem(
                    text = {
                        Text(
                            text = item.toString().padStart(2, '0'),
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )
                    },
                    onClick = {
                        onValueChange(item)
                        expanded = false
                    },
                    contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding
                )
            }
        }
    }
}
```

### 使用示例

```kotlin
Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.Center
) {
    // 小时选择器
    PickerColumn(
        value = intervalHours,
        range = 0..23,
        onValueChange = { intervalHours = it },
        label = { Text("时") }
    )
    Spacer(modifier = Modifier.width(8.dp))
    // 分钟选择器
    PickerColumn(
        value = intervalMinutes,
        range = 0..59,
        onValueChange = { intervalMinutes = it },
        label = { Text("分") }
    )
    Spacer(modifier = Modifier.width(8.dp))
    // 秒选择器
    PickerColumn(
        value = intervalSeconds,
        range = 0..59,
        onValueChange = { intervalSeconds = it },
        label = { Text("秒") }
    )
}
```

::: tip ExposedDropdownMenu vs 普通 DropdownMenu
`ExposedDropdownMenu`（展开式下拉菜单）的特点：
- 点击后才显示选项
- 当前选中值显示在 TextField 中
- 适合需要显示当前值 + 快速切换的场景

普通 `DropdownMenu` 是绝对定位的弹出菜单，适合右键菜单等场景。
:::

## 2. 主题切换

使用 `Switch` 组件，配合 `updateDarkMode` 回调：

```kotlin
Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.SpaceBetween,
    verticalAlignment = Alignment.CenterVertically
) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
            painter = if (settings.darkMode) Icons2.DarkMode() else Icons2.LightMode(),
            contentDescription = null
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text("暗黑模式")
    }
    Switch(
        checked = settings.darkMode,
        onCheckedChange = onDarkModeChange  // 回调给 ViewModel 处理
    )
}
```

ViewModel 中的处理：

```kotlin
fun updateDarkMode(enabled: Boolean) {
    viewModelScope.launch {
        val newSettings = _uiState.value.settings.copy(darkMode = enabled)
        repository.saveSettings(newSettings)  // 持久化保存
        _uiState.update { it.copy(settings = newSettings) }  // 更新内存状态
    }
}
```

## 3. 刷新间隔自动保存

使用 `LaunchedEffect` 监听选择器值的变化，自动保存到 DataStore：

```kotlin
var intervalHours by remember { mutableIntStateOf(settings.refreshIntervalSeconds / 3600) }
var intervalMinutes by remember { mutableIntStateOf((settings.refreshIntervalSeconds % 3600) / 60) }
var intervalSeconds by remember { mutableIntStateOf(settings.refreshIntervalSeconds % 60) }

// 当任何一个值变化时，自动保存
LaunchedEffect(intervalHours, intervalMinutes, intervalSeconds) {
    val totalSeconds = intervalHours * 3600 + intervalMinutes * 60 + intervalSeconds
    if (totalSeconds > 0) {
        onRefreshIntervalChange(totalSeconds)
    }
}
```

::: warning 为什么要用 LaunchedEffect？
`LaunchedEffect` 会在组价首次创建和依赖项变化时执行。这里的依赖项是三个选择器的值，当用户滚动选择器时，值会变化，`LaunchedEffect` 会重新执行，保存新的间隔设置。

如果不用 `LaunchedEffect`，而是在 `PickerColumn` 的 `onValueChange` 中直接保存，会导致每次选择变化都触发保存（滚动时会触发很多次），影响性能。
:::

## 4. GitHub 版本检测

### API 调用

```kotlin
sealed class ApiResult {
    data class Success(val body: String) : ApiResult()
    data class HttpError(val code: Int, val message: String) : ApiResult()
    data object RateLimited : ApiResult()  // GitHub API 限流
}

suspend fun checkForUpdate(): ApiResult = withContext(Dispatchers.IO) {
    val apiUrl = URL("https://api.github.com/repos/raopan2021/api_quota_helper/releases/latest")
    val conn = apiUrl.openConnection() as HttpURLConnection

    conn.requestMethod = "GET"
    conn.setRequestProperty("Accept", "application/vnd.github+json")
    conn.setRequestProperty("X-GitHub-Api-Version", "2022-11-28")
    conn.connectTimeout = 10000
    conn.readTimeout = 10000

    when (conn.responseCode) {
        200 -> ApiResult.Success(conn.inputStream.bufferedReader().readText())
        403 -> ApiResult.RateLimited
        else -> ApiResult.HttpError(conn.responseCode, conn.responseMessage ?: "")
    }
}
```

### 版本比较逻辑

```kotlin
fun needsUpdate(latestVersion: String, currentVersion: String): Boolean {
    return try {
        // 将版本号分割成数字数组
        val latest = latestVersion.split(".").map { it.toInt() }
        val current = currentVersion.split(".").map { it.toInt() }

        // 补齐长度（[1, 2] vs [1, 2, 0] → [1, 2, 0] vs [1, 2, 0]）
        val size = maxOf(latest.size, current.size)
        val latestPadded = latest + List(size - latest.size) { 0 }
        val currentPadded = current + List(size - current.size) { 0 }

        // 逐位比较
        latestPadded.zip(currentPadded).any { it.first > it.second }
    } catch (e: Exception) {
        // 解析失败时，直接比较字符串
        latestVersion != currentVersion
    }
}

// 使用示例
val needsUpdate = needsUpdate("1.0.58", "1.0.52")  // true
val needsUpdate2 = needsUpdate("1.1.0", "1.0.52")  // true
val needsUpdate3 = needsUpdate("1.0.52", "1.0.52")  // false
```

### 下载并安装 APK

```kotlin
fun downloadAndInstall(context: Context, downloadUrl: String) {
    MainScope().launch {
        try {
            val file = withContext(Dispatchers.IO) {
                val url = URL(downloadUrl)
                val conn = url.openConnection() as HttpURLConnection
                conn.connectTimeout = 30000
                conn.readTimeout = 30000

                // 下载文件
                val fileName = downloadUrl.substringAfterLast("/").ifEmpty { "update.apk" }
                val file = File(context.getExternalFilesDir(null), fileName)
                conn.inputStream.use { input ->
                    FileOutputStream(file).use { output ->
                        input.copyTo(output)
                    }
                }
                file
            }

            // 使用 FileProvider 安装（兼容 Android 7.0+）
            val uri = FileProvider.getUriForFile(
                context,
                "${context.packageName}.provider",
                file
            )
            val intent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(uri, "application/vnd.android.package-archive")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            // 下载失败则跳转到浏览器下载
            context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(downloadUrl)))
        }
    }
}
```

## 5. 完整 SettingsScreen 代码结构

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    settings: AppSettings,
    onDarkModeChange: (Boolean) -> Unit,
    onRefreshIntervalChange: (Int) -> Unit,
    onBack: () -> Unit,
    onShowLogs: () -> Unit
) {
    // 状态定义
    var intervalHours by remember { mutableIntStateOf(settings.refreshIntervalSeconds / 3600) }
    var intervalMinutes by remember { mutableIntStateOf((settings.refreshIntervalSeconds % 3600) / 60) }
    var intervalSeconds by remember { mutableIntStateOf(settings.refreshIntervalSeconds % 60) }

    // 更新检查状态
    var updateInfo by remember { mutableStateOf<UpdateInfo?>(null) }
    var isCheckingUpdate by remember { mutableStateOf(false) }
    var updateCheckError by remember { mutableStateOf<String?>(null) }
    var updateCheckSuccessMsg by remember { mutableStateOf<String?>(null) }

    // 首次进入时检查更新
    LaunchedEffect(Unit) {
        checkForUpdate()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("设置") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons2.ArrowBack(), "返回")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            // 1. 主题设置
            // ...

            // 2. 定时刷新设置
            // ...

            // 3. 调试入口
            Button(onClick = onShowLogs) { ... }

            // 4. 关于卡片
            Card { ... }

            // 5. 更新检查卡片（根据状态显示不同 UI）
            when {
                updateInfo != null -> { /* 发现新版本 */ }
                updateCheckError != null -> { /* 检查失败 */ }
                updateCheckSuccessMsg != null -> { /* 已是最新 */ }
                isCheckingUpdate -> { /* 检查中 */ }
                else -> { /* 初始状态 */ }
            }
        }
    }
}
```

## 6. Activity 中组装

```kotlin
@Composable
fun MainActivity.Content() {
    var currentScreen by remember { mutableStateOf("main") }

    AnimatedContent(
        targetState = currentScreen,
        transitionSpec = { ... },
        modifier = Modifier.fillMaxSize()
    ) { screen ->
        when (screen) {
            "main" -> MainScreen(
                viewModel = viewModel,
                onNavigateToSettings = { currentScreen = "settings" }
            )
            "settings" -> SettingsScreen(
                settings = uiState.settings,
                onDarkModeChange = { viewModel.updateDarkMode(it) },
                onRefreshIntervalChange = { viewModel.updateRefreshInterval(it) },
                onBack = { currentScreen = "main" },
                onShowLogs = { currentScreen = "logs" }
            )
            "logs" -> LogScreen(
                onBack = { currentScreen = "settings" }
            )
        }
    }
}
```

## 下一章

[实战：日志系统 →](./12-实战日志系统)
