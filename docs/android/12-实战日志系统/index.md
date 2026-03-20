# 12 - 实战：日志系统

本章实现完整的网络日志系统，包括内存存储、列表展示、滑动删除和日志格式化功能。

<!-- more -->

## 功能需求

1. **内存存储** — 使用 `ConcurrentLinkedQueue` 线程安全存储日志
2. **列表展示** — `LazyColumn` 高性能列表，支持分类筛选
3. **滑动删除** — `SwipeToDismiss` 左滑删除
4. **日志格式化** — 手写 JSON 格式化（无第三方库依赖）
5. **复制功能** — 点击复制日志内容到剪贴板
6. **时间显示** — 相对时间（如"5分钟前"）

## 1. LogBuffer 内存日志

使用 `ConcurrentLinkedQueue` 实现线程安全的内存日志存储：

```kotlin
object LogBuffer {
    // 线程安全队列，最多存储 50 条
    private val logs = ConcurrentLinkedQueue<LogEntry>()
    private const val maxSize = 50

    /**
     * 日志条目
     */
    data class LogEntry(
        val id: Long = System.currentTimeMillis(),  // 唯一 ID，用于删除
        val time: String,           // 格式化时间 "HH:mm:ss"
        val success: Boolean,       // 请求是否成功
        val logType: String,        // 日志类型：额度查询/检查更新/账户识别
        val username: String,       // 关联的用户名
        val requestBody: String,    // 请求体 JSON
        val responseCode: Int,      // HTTP 响应码
        val responseMessage: String, // HTTP 响应消息
        val responseBody: String,   // 响应体 JSON
        val errorMessage: String? = null  // 错误信息
    )

    // ══════════════════════════════════════════════
    //  记录请求（发送时调用）
    // ══════════════════════════════════════════════
    fun logRequest(logType: String, username: String, requestBody: String) {
        val time = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
        add(LogEntry(
            time = time,
            success = false,
            logType = logType,
            username = username,
            requestBody = requestBody,
            responseCode = 0,
            responseMessage = "请求中...",
            responseBody = ""
        ))
    }

    // ══════════════════════════════════════════════
    //  记录响应（收到响应时调用）
    // ══════════════════════════════════════════════
    fun logResponse(
        logType: String,
        username: String,
        requestBody: String,
        success: Boolean,
        responseCode: Int,
        responseMessage: String,
        responseBody: String,
        errorMessage: String? = null
    ) {
        val time = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
        add(LogEntry(
            time = time,
            success = success,
            logType = logType,
            username = username,
            requestBody = requestBody,
            responseCode = responseCode,
            responseMessage = responseMessage,
            responseBody = responseBody,
            errorMessage = errorMessage
        ))
    }

    // ══════════════════════════════════════════════
    //  内部方法
    // ══════════════════════════════════════════════
    private fun add(entry: LogEntry) {
        logs.offer(entry)
        // 超过最大数量时移除最旧的
        while (logs.size > maxSize) {
            logs.poll()
        }
    }

    // 获取所有日志（倒序，最新的在前）
    fun getAll(): List<LogEntry> = logs.toList().reversed()

    // 删除单条
    fun delete(id: Long) {
        logs.removeAll { it.id == id }
    }

    // 清空全部
    fun clear() = logs.clear()

    // 复制时需要的字符串格式
    fun getAsString(entry: LogEntry): String {
        return buildString {
            appendLine("类型: ${entry.logType}")
            appendLine("用户: ${entry.username}")
            appendLine("时间: ${entry.time}")
            appendLine("状态: ${if (entry.success) "成功" else "失败"}")
            appendLine("响应: ${entry.responseCode} ${entry.responseMessage}")
            if (entry.requestBody.isNotEmpty()) {
                appendLine("请求: ${entry.requestBody}")
            }
            if (entry.errorMessage != null) {
                appendLine("错误: ${entry.errorMessage}")
            } else if (entry.responseBody.isNotEmpty()) {
                appendLine("响应: ${entry.responseBody}")
            }
        }
    }
}
```

### ConcurrentLinkedQueue vs 普通 List

```kotlin
// ❌ 普通 List 不是线程安全的
private val logs = mutableListOf<LogEntry>()

// ✅ ConcurrentLinkedQueue 是线程安全的
private val logs = ConcurrentLinkedQueue<LogEntry>()

// 主要区别：
// 1. 多个线程同时访问时不会崩溃
// 2. offer/poll 操作都是原子性的
// 3. 高并发场景下性能比 synchronizedList 更好
```

### object 单例模式

```kotlin
// LogBuffer 是单例，整个应用只有一个实例
object LogBuffer {
    private val logs = ConcurrentLinkedQueue<LogEntry>()
    ...
}

// 使用
LogBuffer.logRequest("额度查询", "张三", jsonBody)
LogBuffer.logResponse("额度查询", "张三", jsonBody, ...)
```

::: tip Kotlin `object` vs Java `static`
Kotlin 的 `object` 就是单例，等价于 Java 中：
```java
public class LogBuffer {
    private static final LogBuffer INSTANCE = new LogBuffer();
    private LogBuffer() {}
    public static LogBuffer getInstance() { return INSTANCE; }
}
```
:::

## 2. JSON 格式化

手写 JSON 格式化器，不依赖 Gson/Jackson（减少 APK 体积）：

```kotlin
private fun formatJson(jsonString: String): String {
    if (jsonString.isEmpty()) return jsonString

    val result = StringBuilder()
    var indent = 0
    var inString = false
    var escape = false
    var prevWasClose = false

    for (char in jsonString) {
        when {
            // 转义字符
            escape -> {
                result.append(char)
                escape = false
                prevWasClose = false
            }
            char == '\\' -> {
                result.append(char)
                escape = true
            }
            // 字符串内部
            inString -> {
                result.append(char)
                if (char == '"' && !escape) {
                    inString = false
                    prevWasClose = false
                }
            }
            char == '"' -> {
                result.append(char)
                inString = true
                prevWasClose = false
            }
            // 对象开始
            char == '{' || char == '[' -> {
                if (!prevWasClose) {
                    result.append('\n')
                    result.append("  ".repeat(indent))
                }
                result.append(char)
                indent++
                prevWasClose = false
            }
            // 对象结束
            char == '}' || char == ']' -> {
                indent--
                if (prevWasClose) {
                    // 连续闭合不换行
                } else {
                    result.append('\n')
                    result.append("  ".repeat(indent))
                }
                result.append(char)
                prevWasClose = true
            }
            // 键值对分隔
            char == ':' -> {
                result.append(char)
                result.append(' ')
                prevWasClose = false
            }
            char == ',' -> {
                result.append(char)
                result.append('\n')
                result.append("  ".repeat(indent))
                prevWasClose = false
            }
            char == ' ' -> {
                // 跳过多余空格
            }
            else -> {
                if (prevWasClose) {
                    result.append('\n')
                    result.append("  ".repeat(indent))
                }
                result.append(char)
                prevWasClose = false
            }
        }
    }
    return result.toString().trim()
}
```

### 格式化效果

```json
// 格式化前
{"id":"1","username":"张三","token":"sk-xxx"}

// 格式化后
{
  "id": "1",
  "username": "张三",
  "token": "sk-xxx"
}
```

## 3. SwipeToDismiss 滑动删除

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SwipeToDeleteCard(
    entry: LogBuffer.LogEntry,
    isSelected: Boolean,
    onSelect: () -> Unit,
    onCopy: () -> Unit,
    onDelete: () -> Unit
) {
    val dismissState = rememberSwipeToDismissBoxState(
        confirmValueChange = { value ->
            // value = SwipeToDismissBoxValue.EndToStart（左滑）
            if (value == SwipeToDismissBoxValue.EndToStart) {
                onDelete()
                true
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
                    Icons2.Delete(),
                    contentDescription = "删除",
                    tint = Color(0xFFF44336)
                )
            }
        },
        content = {
            LogEntryCardContent(
                entry = entry,
                isSelected = isSelected,
                onSelect = onSelect,
                onCopy = onCopy
            )
        },
        enableDismissFromStartToEnd = false,  // 禁用右滑
        enableDismissFromEndToStart = true,   // 启用左滑
        modifier = Modifier.animateContentSize()  // 高度平滑过渡
    )
}
```

## 4. 选中卡片内部滚动

实现"点击卡片选中，选中后才能滚动查看完整内容"：

```kotlin
@Composable
fun LogEntryCardContent(
    entry: LogBuffer.LogEntry,
    isSelected: Boolean,
    onSelect: () -> Unit,
    onCopy: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (entry.success) greenBackground else redBackground
        ),
        onClick = onSelect  // 点击切换选中状态
    ) {
        Column(
            modifier = Modifier
                .padding(8.dp)
                .fillMaxWidth()
                .heightIn(max = 150.dp)  // 最大高度 150dp
                .verticalScroll(
                    rememberScrollState(),
                    enabled = isSelected  // 只有选中时才能滚动
                )
        ) {
            // 日志内容...
        }
    }
}
```

## 5. 分类筛选

```kotlin
@Composable
fun LogScreen(onBack: () -> Unit) {
    var refreshKey by remember { mutableIntStateOf(0) }
    var selectedLogType by remember { mutableStateOf<String?>(null) }

    // 获取日志
    val allLogs = remember(refreshKey) { LogBuffer.getAll() }
    val logs = if (selectedLogType != null) {
        allLogs.filter { it.logType == selectedLogType }
    } else {
        allLogs
    }

    // 获取所有日志类型
    val logTypes = remember(allLogs) {
        allLogs.map { it.logType }.distinct().sorted()
    }

    // 如果当前筛选类型已被删除，重置为"全部"
    LaunchedEffect(allLogs, selectedLogType) {
        if (selectedLogType != null && selectedLogType !in logTypes) {
            selectedLogType = null
        }
    }

    Column {
        // 分类筛选 Chips
        if (logTypes.isNotEmpty()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
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
        }

        // 日志列表
        LazyColumn(...) {
            items(logs, key = { it.id }) { entry ->
                SwipeToDeleteCard(...)
            }
        }
    }
}
```

## 6. 复制到剪贴板

```kotlin
@Composable
fun LogScreen(...) {
    var showCopiedTip by remember { mutableStateOf(false) }

    // 显示复制成功提示
    LaunchedEffect(showCopiedTip) {
        if (showCopiedTip) {
            delay(1500)
            showCopiedTip = false
        }
    }

    // 在 Snackbar 中显示提示
    if (showCopiedTip) {
        Snackbar(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(16.dp)
        ) {
            Text("已复制到剪贴板")
        }
    }
}

// 复制功能
private fun copyToClipboard(context: Context, entry: LogEntry) {
    val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    clipboard.setPrimaryClip(ClipData.newPlainText("log", LogBuffer.getAsString(entry)))
}
```

## 7. 完整数据流

```
网络请求发送
    ↓
QuotaService.queryQuota()
    ↓
LogBuffer.logRequest()  ← 记录请求
    ↓
HttpURLConnection.request
    ↓
LogBuffer.logResponse()  ← 记录响应
    ↓
LogBuffer.logs (ConcurrentLinkedQueue)
    ↓
LogScreen 读取
    ↓
LazyColumn 显示
    ↓
SwipeToDismiss 删除
    ↓
LogBuffer.delete()
```

## 下一章

[构建与发布 →](./13-构建发布)
