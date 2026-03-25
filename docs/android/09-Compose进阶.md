# 09 - Compose 进阶

## 页面切换动画

本项目使用 `AnimatedContent` 实现丝滑的页面切换效果，不同页面有不同的进入/退出动画。

<!-- more -->

### AnimatedContent

```kotlin
@Composable
fun MainActivity.Content() {
    var currentScreen by remember { mutableStateOf("main") }

    AnimatedContent(
        targetState = currentScreen,
        transitionSpec = {
            // 配置动画
            val duration = 400
            val easing = CubicBezierEasing(0.4f, 0f, 0.2f, 1f)

            when (targetState) {
                "main" -> {
                    // 进入 main：从左边滑入 + 缩放
                    (slideInHorizontally(
                        animationSpec = tween(duration, easing = easing),
                        initialOffsetX = { -it }  // 从左边来
                    ) + fadeIn(tween(duration, easing = easing))
                    + scaleIn(tween(duration, easing = easing), initialScale = 0.92f))
                        .togetherWith(
                            slideOutHorizontally(
                                animationSpec = tween(duration, easing = easing),
                                targetOffsetX = { it }  // 向右滑出
                            ) + fadeOut(tween(duration, easing = easing))
                            + scaleOut(tween(duration, easing = easing), targetScale = 1.08f)
                        )
                }
                "settings" -> {
                    // 进入 settings：从右边滑入 + 缩放
                    (slideInHorizontally(
                        animationSpec = tween(duration, easing = easing),
                        initialOffsetX = { it }  // 从右边来
                    ) + fadeIn(tween(duration, easing = easing))
                    + scaleIn(tween(duration, easing = easing), initialScale = 0.88f))
                        .togetherWith(
                            slideOutHorizontally(
                                animationSpec = tween(duration, easing = easing),
                                targetOffsetX = { -it / 3 }  // 向左滑出（不完全退出）
                            ) + fadeOut(tween(duration, easing = easing))
                            + scaleOut(tween(duration, easing = easing), targetScale = 0.95f)
                        )
                }
                else -> fadeIn() togetherWith fadeOut()
            }
        },
        modifier = Modifier.fillMaxSize(),
        label = "screen_transition"
    ) { screen ->
        when (screen) {
            "main" -> MainScreen(...)
            "settings" -> SettingsScreen(...)
            "logs" -> LogScreen(...)
        }
    }
}
```


### 动画参数说明

| 参数 | 作用 |
|------|------|
| `slideInHorizontally` | 水平滑入 |
| `fadeIn` / `fadeOut` | 淡入淡出 |
| `scaleIn` / `scaleOut` | 缩放 |
| `tween(duration)` | 动画时长 |
| `CubicBezierEasing` | 缓动曲线（类似 CSS `cubic-bezier`） |
| `togetherWith` | 并行执行多个动画 |
| `initialOffsetX: { -it }` | `it` = 屏幕宽度，负数 = 从左/上 |

## LaunchedEffect 副作用

`LaunchedEffect` 用于在 Composable 中执行副作用（一次性操作或持续运行的任务）：

```kotlin
@Composable
fun ResetCountdown(resetTime: String) {
    var countdown by remember { mutableStateOf("") }

    // ════════════════════════════════════════════════
    //  LaunchedEffect：启动协程，跟随 Composable 生命周期
    //  key1 = 依赖项，变化时重新执行
    // ════════════════════════════════════════════════
    LaunchedEffect(resetTime) {
        while (true) {
            countdown = calculateCountdown(resetTime)
            delay(1000)  // 每秒更新一次
        }
    }

    if (countdown.isNotEmpty()) {
        Text("距重置: $countdown")
    }
}

// 相对时间（刷新）
@Composable
fun RelativeTimeText(timestamp: Long, prefix: String = "") {
    var relativeTime by remember { mutableStateOf(formatRelativeTime(timestamp)) }

    LaunchedEffect(timestamp) {
        while (true) {
            relativeTime = formatRelativeTime(timestamp)
            delay(1000)
        }
    }

    Text("$prefix$relativeTime")
}

// 一次性副作用（没有 while 循环）
LaunchedEffect(userId) {
    // userId 变化时执行，类似 useEffect(() => { ... }, [userId])
    viewModel.loadUser(userId)
}
```


### LaunchedEffect vs remember

```kotlin
// remember：记住值，跨重组保持
val name by remember { mutableStateOf("张三") }

// LaunchedEffect：启动协程
LaunchedEffect(Unit) {
    // 组件首次创建时执行
    val job = launch { /* 异步任务 */ }
    onDispose { job.cancel() }  // 组件销毁时取消
}

// rememberEffect：组合两者
val viewModel = remember { ViewModel() }
```


## Material3 主题

### 颜色主题

```kotlin
// Color.kt
val Purple80 = Color(0xFFD0BCFF)
val PurpleGrey80 = Color(0xFFCCC2DC)
val Pink80 = Color(0xFFEFB8C8)

val Purple40 = Color(0xFF6650a4)
val PurpleGrey40 = Color(0xFF625b71)
val Pink40 = Color(0xFF7D5260)

// Theme.kt
@Composable
fun ApiQuotaHelperTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),  // 跟随系统
    content: @Composable () -> Unit
) {
    // 颜色方案：深色/浅色自动切换
    val colorScheme = when {
        darkTheme -> darkColorScheme(
            primary = Purple80,
            secondary = PurpleGrey80,
            tertiary = Pink80
        )
        else -> lightColorScheme(
            primary = Purple40,
            secondary = PurpleGrey40,
            tertiary = Pink40
        )
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
```


### 在 UI 中使用主题

```kotlin
@Composable
fun MyComponent() {
    // 使用 MaterialTheme 提供的颜色
    val primaryColor = MaterialTheme.colorScheme.primary
    val errorColor = MaterialTheme.colorScheme.error

    // 使用主题中的文字样式
    val titleStyle = MaterialTheme.typography.titleLarge
    val bodyStyle = MaterialTheme.typography.bodyMedium

    Column {
        Text("标题", style = titleStyle)
        Text("正文内容", style = bodyStyle)
        Text("错误提示", color = errorColor)
    }
}
```


## 动态主题切换

```kotlin
@Composable
fun MainActivity.setContent() {
    val repository = remember { AccountRepository(context) }
    val viewModel: MainViewModel = viewModel { MainViewModel(repository, QuotaService()) }
    val uiState by viewModel.uiState.collectAsState()

    // ════════════════════════════════════════════════
    //  主题根据 DataStore 中的设置动态切换
    // ════════════════════════════════════════════════
    ApiQuotaHelperTheme(darkTheme = uiState.settings.darkMode) {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background  // 自动响应主题
        ) {
            // ...
        }
    }
}
```


## SwipeToDismiss 滑动删除

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SwipeToDeleteCard(
    entry: LogBuffer.LogEntry,
    onCopy: () -> Unit,
    onDelete: () -> Unit
) {
    val dismissState = rememberSwipeToDismissBoxState(
        confirmValueChange = { value ->
            // value = SwipeToDismissBoxValue.EndToStart（左滑）
            if (value == SwipeToDismissBoxValue.EndToStart) {
                onDelete()
                true  // 确认删除
            } else {
                false
            }
        }
    )

    SwipeToDismissBox(
        state = dismissState,
        backgroundContent = {
            // 左滑时显示的背景
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFFF44336).copy(alpha = 0.2f))
                    .padding(horizontal = 20.dp),
                contentAlignment = Alignment.CenterEnd
            ) {
                Icon(
                    Icons.Default.Delete,
                    contentDescription = "删除",
                    tint = Color(0xFFF44336)
                )
            }
        },
        content = {
            // 实际内容
            LogEntryCardContent(entry = entry, onCopy = onCopy)
        },
        enableDismissFromStartToEnd = false,  // 只允许左滑
        enableDismissFromEndToStart = true
    )
}
```


## FilterChip 筛选标签

```kotlin
Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.spacedBy(8.dp)
) {
    FilterChip(
        selected = selectedLogType == null,
        onClick = { selectedLogType = null },
        label = { Text("全部") }
    )

    logTypes.forEach { type ->
        FilterChip(
            selected = selectedLogType == type,
            onClick = {
                selectedLogType = if (selectedLogType == type) null else type
            },
            label = { Text(type) }
        )
    }
}
```


## BackHandler 处理返回键

```kotlin
@Composable
fun BackHandler(onBack: () -> Unit) {
    val activity = LocalContext.current as? ComponentActivity
    val backDispatcher = activity?.onBackPressedDispatcher

    DisposableEffect(Unit) {
        val callback = object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                onBack()
            }
        }
        backDispatcher?.addCallback(callback)
        onDispose { }
    }
}

// 在 MainActivity 中使用
BackHandler {
    when (currentScreen) {
        "main" -> moveTaskToBack(true)     // 退出应用
        "settings" -> currentScreen = "main"
        "logs" -> currentScreen = "settings"
    }
}
```


## 响应式状态栏

```kotlin
// 在 MainActivity 中开启沉浸式
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()  // Compose 自带方法，适配刘海屏

        setContent {
            // Compose 内容
        }
    }
}
```


