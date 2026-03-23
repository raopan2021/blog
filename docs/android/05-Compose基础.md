# 05 - Compose 基础

## 声明式 UI 简介

传统 Android 开发（XML）是这样的：

```xml
<!-- 1. 定义布局 XML -->
<LinearLayout>
    <TextView android:id="@+id/countText" />
    <Button android:id="@+id/incrementBtn" />
</LinearLayout>

<!-- 2. 在 Activity 中操作 -->
val countText: TextView = findViewById(R.id.countText)
val incrementBtn: Button = findViewById(R.id.incrementBtn)

incrementBtn.setOnClickListener {
    count++
    countText.text = count.toString()  // 手动更新 UI
}
```

声明式 UI（Compose）不需要手动同步状态：

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }  // 状态

    Column {
        Text("计数: $count")     // UI 自动响应 count 变化
        Button(onClick = { count++ }) {
            Text("增加")
        }
    }
}
```

<!-- more -->

## @Composable 注解

所有 Compose UI 组件都要用 `@Composable` 注解标记：

```kotlin
@Composable
fun Greeting(name: String) {
    Text("Hello, $name!")
}

// Composable 函数可以被其他 Composable 调用
@Composable
fun UserCard(user: User) {
    Card {
        Column {
            Greeting(user.name)
            Text(user.email)
        }
    }
}
```

::: tip 命名规范
Composable 函数首字母大写（像类名一样），因为它们代表 UI"组件"。
:::

## State 状态管理

Compose 的核心：UI 是状态的函数。

```kotlin
@Composable
fun Counter() {
    // ════════════════════════════════════════════════
    //  remember：跨重组（recomposition）保持状态
    //  mutableStateOf：状态变化时自动触发 UI 重建
    // ════════════════════════════════════════════════

    var count by remember { mutableStateOf(0) }  // Int 类型
    var text by remember { mutableStateOf("") }  // String 类型
    var enabled by remember { mutableStateOf(true) }  // Boolean 类型

    Column {
        Text("Count: $count")
        Button(onClick = { count++ }) { Text("+1") }
        Button(onClick = { count = 0 }) { Text("Reset") }

        // OutlinedTextField：输入框
        OutlinedTextField(
            value = text,
            onValueChange = { text = it },  // 输入变化时更新状态
            label = { Text("输入内容") }
        )
    }
}
```

### `by` 委托语法

```kotlin
// 完整写法
var count by remember { mutableStateOf(0) }

// 等价于
val count by remember { mutableStateOf(0) }
// 读取
val currentCount = count.value
// 修改
count.value++

// 注意： Composabl 函数参数不能是 var，只能是 val
// 如果需要"可变"参数，用 State 包装
@Composable
fun MyComponent(countState: State<Int>) {
    Text("${countState.value}")
}
```

## 布局组件

Compose 的布局系统只有三个核心组件，其他都是基于它们的组合：

### Column（垂直布局）

```kotlin
@Composable
fun MyColumn() {
    Column(
        modifier = Modifier
            .fillMaxWidth()      // 宽度撑满
            .padding(16.dp),      // 内边距
        horizontalAlignment = Alignment.CenterHorizontally,  // 水平居中
        verticalArrangement = Arrangement.spacedBy(8.dp)    // 子元素间距
    ) {
        Text("第一行")
        Text("第二行")
        Text("第三行")
    }
}
```

### Row（水平布局）

```kotlin
@Composable
fun MyRow() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,  // 两端对齐
        verticalAlignment = Alignment.CenterVertically     // 垂直居中
    ) {
        Text("左侧")
        Text("中间")
        Text("右侧")
    }
}
```

### Box（层叠布局）

```kotlin
@Composable
fun MyBox() {
    Box(modifier = Modifier.fillMaxSize()) {
        // 底层
        Text("背景文字", modifier = Modifier.align(Alignment.Center))
        // 顶层
        Icon(Icons.Default.Add, contentDescription = null,
             modifier = Modifier.align(Alignment.TopEnd))
    }
}
```

### 常用修饰符速查

| Modifier | 作用 | 类似 CSS |
|----------|------|---------|
| `.padding(16.dp)` | 内边距 | `padding: 16px` |
| `.padding(start, top, end, bottom)` | 四边分别设置 | `padding: top right bottom left` |
| `.fillMaxWidth()` | 宽度撑满 | `width: 100%` |
| `.fillMaxSize()` | 宽高都撑满 | `width: 100%; height: 100%` |
| `.size(48.dp)` | 固定宽高 | `width: 48px; height: 48px` |
| `.background(Color.Red)` | 背景色 | `background: red` |
| `.clickable { }` | 点击事件 | `onclick` |
| `.border(1.dp, Color.Black)` | 边框 | `border: 1px solid black` |
| `.clip(RoundedCornerShape(8.dp))` | 裁剪圆角 | `border-radius: 8px` |

## 图标：Icons vs Icons2

本项目使用自定义 `Icons2` 图标系统，而非标准的 Material Icons。

### 为什么不用 Icons.Default？

标准 Material Icons 需要依赖 `material-icons-extended` 库，仅此一项就会增加 **2-3MB** APK 体积。本项目使用自定义 vector drawable 图标，总计仅 **~20KB**。

### Icons2 使用方式

```kotlin
// ❌ 标准 Material Icons（体积大）
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add

Icon(Icons.Default.Add, contentDescription = "添加")

// ✅ 本项目自定义 Icons2（体积小）
import com.apiapp.api_quota_helper.ui.Icons2

Icon(Icons2.Add(), contentDescription = "添加")
```

### Icons2 实现原理

```kotlin
object Icons2 {
    // 每个图标都是一个 Composable 函数，返回 Painter
    @Composable
    fun Refresh(): Painter = painterResource(R.drawable.ic_refresh)
    
    @Composable
    fun Settings(): Painter = painterResource(R.drawable.ic_settings)
    
    @Composable
    fun Add(): Painter = painterResource(R.drawable.ic_add)
    
    // ... 其他图标
}

// 使用时像函数一样调用
Icon(painter = Icons2.Add(), contentDescription = "添加")
```

### vector drawable 图标文件

图标存放在 `app/src/main/res/drawable/` 目录下：

```xml
<!-- ic_add.xml 示例 -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FF000000"
        android:pathData="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
</vector>
```

::: tip 图标体积优化技巧
如果你的应用只需要少量图标，自定义 vector drawable 是很好的选择：
1. 从 [Material Icons](https://fonts.google.com/icons) 下载 SVG
2. 用 Android Studio 转换为 vector drawable（File → New → Vector Asset）
3. 放入 `res/drawable/` 目录
4. 在 Icons2 中注册

这样可以避免引入整个图标库，大大减小 APK 体积。
:::

## 列表渲染

### LazyColumn（高性能列表）

```kotlin
@Composable
fun AccountList(accounts: List<AccountWithQuota>) {
    // LazyColumn = RecyclerView，但写法像 v-for
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),         // 内容内边距
        verticalArrangement = Arrangement.spacedBy(12.dp)  // 元素间距
    ) {
        // items：渲染列表
        items(
            items = accounts,
            key = { it.account.id }  // key 帮助 Compose 高效更新
        ) { awq ->
            AccountCard(
                accountWithQuota = awq,
                onEdit = { ... },
                onDelete = { ... }
            )
        }

        // 也可以用 lambda 形式
        items(accounts, key = { it.account.id }) { awq ->
            AccountCard(...)
        }
    }
}
```

::: tip 为什么用 LazyColumn？
普通 Column 会一次性创建所有子元素。LazyColumn 只创建屏幕上可见的元素（+缓冲），滚动时动态复用，大列表性能差异巨大。
:::

## Scaffold 脚手架

Scaffold 提供常见的 Material Design 布局结构：

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(viewModel: MainViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {                                    // 顶部 AppBar
            TopAppBar(
                title = { Text("API 额度助手") },
                actions = {
                    IconButton(onClick = { ... }) {
                        Icon(Icons.Default.Settings, "设置")
                    }
                }
            )
        },
        floatingActionButton = {                     // 悬浮按钮
            FloatingActionButton(onClick = { ... }) {
                Icon(Icons.Default.Add, "添加")
            }
        }
    ) { paddingValues ->                            // 内容区域（自动处理 TopBar 遮挡）
        // 必须使用 paddingValues 防止内容被遮挡
        Box(modifier = Modifier.padding(paddingValues)) {
            // 内容...
        }
    }
}
```

## 卡片 Card

```kotlin
@Composable
fun AccountCard(
    accountWithQuota: AccountWithQuota,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row {
                    Icon(Icons.Default.AccountCircle, null)
                    Spacer(Modifier.width(12.dp))
                    Text(
                        accountWithQuota.account.username,
                        style = MaterialTheme.typography.titleMedium
                    )
                }

                // 状态标签
                if (quota != null) {
                    val statusColor = when {
                        remainingPercent > 50 -> Color(0xFF4CAF50)
                        remainingPercent > 20 -> Color(0xFF2196F3)
                        else -> Color(0xFFF44336)
                    }
                    Surface(
                        color = statusColor.copy(alpha = 0.1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            "${String.format("%.1f", remainingPercent)}%",
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                            color = statusColor
                        )
                    }
                }
            }

            Spacer(Modifier.height(12.dp))

            // 进度条
            LinearProgressIndicator(
                progress = { quota.usedPercentage.coerceIn(0f, 1f) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp)
                    .clip(RoundedCornerShape(4.dp)),
                color = statusColor,
                trackColor = statusColor.copy(alpha = 0.2f)
            )

            Spacer(Modifier.height(12.dp))

            // 操作按钮
            Row(modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End) {
                TextButton(onClick = onEdit) { Text("编辑") }
                TextButton(onClick = onDelete) { Text("删除") }
            }
        }
    }
}
```

## 对话框 AlertDialog

```kotlin
@Composable
fun DeleteConfirmDialog(
    username: String,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("确认删除") },
        text = { Text("确定要删除账户 $username 吗？") },
        confirmButton = {
            TextButton(onClick = {
                onConfirm()
                onDismiss()
            }) {
                Text("删除", color = MaterialTheme.colorScheme.error)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("取消")
            }
        }
    )
}
```

## 组件通信

子组件通过**回调函数**向父组件传递事件：

```kotlin
// 父组件
@Composable
fun Parent() {
    var selectedId by remember { mutableStateOf<String?>(null) }

    Column {
        items(accounts) { account ->
            AccountCard(
                account = account,
                onSelect = { id -> selectedId = id }  // 传递回调
            )
        }
    }

    // 显示详情
    if (selectedId != null) {
        DetailDialog(id = selectedId!!, onDismiss = { selectedId = null })
    }
}

// 子组件
@Composable
fun AccountCard(
    account: Account,
    onSelect: (String) -> Unit  // 接收回调函数
) {
    Card(onClick = { onSelect(account.id) }) {  // 调用回调
        Text(account.name)
    }
}
```

