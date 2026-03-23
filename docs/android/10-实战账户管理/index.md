# 10 - 实战：账户管理功能

本章节以"添加账户"功能为例，完整走一遍从 ViewModel → Repository → UI 的实现流程。

<!-- more -->

## 功能需求

1. 点击 FAB 显示添加账户对话框
2. 输入用户名和 Token
3. 支持粘贴板内容自动识别
4. 保存前校验（用户名/Token 不能重复）
5. 保存后立即查询额度并显示
6. 支持编辑已有账户

## 整体流程

```
用户点击 FAB
    ↓
ViewModel.showAddDialog()
    ↓
UI 响应 showAddDialog = true，显示对话框
    ↓
用户输入，点击保存
    ↓
ViewModel.saveAccount(username, token)
    ↓
校验 → Repository.saveAccount()
    ↓
查询额度 → QuotaService.queryQuota()
    ↓
更新 UI 状态 → _uiState.update { it.copy(accounts = updated) }
    ↓
对话框关闭
```

## 1. 对话框 UI

```kotlin
@Composable
fun AddEditAccountDialog(
    editingAccount: UserAccount?,     // null = 添加模式
    saveError: String?,
    onDismiss: () -> Unit,
    onSave: (String, String) -> Boolean  // 返回是否保存成功
) {
    var username by remember { mutableStateOf(editingAccount?.username ?: "") }
    var token by remember { mutableStateOf(editingAccount?.token ?: "") }
    var pasteContent by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(if (editingAccount != null) "编辑账户" else "添加账户")
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                // 用户名输入
                OutlinedTextField(
                    value = username,
                    onValueChange = { username = it },
                    label = { Text("用户名") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                // Token 输入
                OutlinedTextField(
                    value = token,
                    onValueChange = { token = it },
                    label = { Text("Token (API Key)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                HorizontalDivider()

                // 粘贴板识别区域
                Text(
                    "从剪贴板识别",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.primary
                )

                OutlinedTextField(
                    value = pasteContent,
                    onValueChange = { pasteContent = it },
                    label = { Text("粘贴内容（支持识别 API Key 和账户）") },
                    minLines = 3,
                    maxLines = 6,
                    modifier = Modifier.fillMaxWidth()
                )

                FilledTonalButton(
                    onClick = {
                        if (pasteContent.isNotEmpty()) {
                            doRecognize(pasteContent)  // 识别逻辑
                        }
                    },
                    enabled = pasteContent.isNotEmpty(),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Search, null, Modifier.size(16.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("识别")
                }

                // 错误提示
                if (saveError != null) {
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.errorContainer
                        )
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.Warning,
                                null,
                                tint = MaterialTheme.colorScheme.error,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(Modifier.width(8.dp))
                            Text(saveError)
                        }
                    }
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = {
                    val ok = onSave(username, token)
                    if (ok) onDismiss()
                },
                enabled = username.isNotBlank() && token.isNotBlank()
            ) {
                Text("保存")
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

## 2. 剪贴板内容识别

```kotlin
/**
 * 从剪贴板文本自动识别账户信息
 * 支持格式：
 * API Key：sk-xxxx
 * 账户：username
 */
private fun parseAccountFromClipboard(text: String): Pair<String, String>? {
    if (text.isBlank()) return null

    // 提取 API Key（支持 "API Key：" 或 "API Key: "）
    val apiKey = Regex("""API Key[：:]\s*(\S+)""")
        .find(text)?.groupValues?.get(1)
        ?: return null

    // 提取账户名
    val username = Regex("""账户[：:]\s*(\S+)""")
        .find(text)?.groupValues?.get(1)
        ?: return null

    return Pair(username, apiKey)
}

private fun doRecognize(text: String) {
    val result = parseAccountFromClipboard(text)
    if (result != null) {
        username = result.first
        token = result.second
        // 记录到日志
        LogBuffer.logResponse(
            logType = "账户识别",
            username = "账户识别",
            requestBody = text,
            success = true,
            responseCode = 200,
            responseMessage = "识别成功",
            responseBody = "用户名：${result.first}，Token：${result.second}"
        )
    } else {
        LogBuffer.logResponse(
            logType = "账户识别",
            username = "账户识别",
            requestBody = text,
            success = false,
            responseCode = 0,
            responseMessage = "识别失败",
            responseBody = "",
            errorMessage = "无法识别：请确保包含「API Key」和「账户」字段"
        )
    }
}
```

## 3. ViewModel 保存逻辑

```kotlin
fun saveAccount(username: String, token: String): Boolean {
    val trimmedUsername = username.trim()
    val trimmedToken = token.trim()

    // ════════════════════════════════════════════════
    //  业务校验
    // ════════════════════════════════════════════════
    val others = _uiState.value.accounts.filter {
        it.account.id != _uiState.value.editingAccount?.id
    }

    when {
        others.any { it.account.username == trimmedUsername } -> {
            _uiState.update { it.copy(saveError = "用户名「$trimmedUsername」已存在") }
            return false
        }
        others.any { it.account.token == trimmedToken } -> {
            _uiState.update { it.copy(saveError = "Token 已存在（不可重复添加同一账户）") }
            return false
        }
    }

    // ════════════════════════════════════════════════
    //  保存到 DataStore
    // ════════════════════════════════════════════════
    viewModelScope.launch {
        val existingAccount = _uiState.value.editingAccount
        val account = UserAccount(
            id = existingAccount?.id ?: quotaService.generateAccountId(),
            username = trimmedUsername,
            token = trimmedToken,
            createdAt = existingAccount?.createdAt ?: System.currentTimeMillis()
        )

        repository.saveAccount(account)
        dismissDialog()

        // ════════════════════════════════════════════════
        //  立即查询新账户的额度
        // ════════════════════════════════════════════════
        val result = quotaService.queryQuota(account)
        val newAwq = AccountWithQuota(
            account = account,
            quota = result.getOrNull(),
            error = result.exceptionOrNull()?.message,
            lastUpdated = System.currentTimeMillis()
        )

        // 更新列表
        val currentAccounts = _uiState.value.accounts.toMutableList()
        val existingIndex = currentAccounts.indexOfFirst { it.account.id == account.id }
        if (existingIndex >= 0) {
            currentAccounts[existingIndex] = newAwq
        } else {
            currentAccounts.add(newAwq)
        }

        _uiState.update { it.copy(accounts = currentAccounts) }
    }

    return true
}
```

## 4. MainScreen 中组装

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    viewModel: MainViewModel,
    onNavigateToSettings: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    var showAddDialog by remember { mutableStateOf(false) }

    // 监听 editingAccount 变化，自动显示编辑对话框
    LaunchedEffect(uiState.editingAccount) {
        if (uiState.editingAccount != null) {
            showAddDialog = true
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("API 额度助手") })
        },
        floatingActionButton = {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                SmallFloatingActionButton(
                    onClick = onNavigateToSettings,
                    containerColor = MaterialTheme.colorScheme.secondaryContainer
                ) {
                    Icon(Icons.Default.Settings, "设置")
                }
                SmallFloatingActionButton(
                    onClick = { viewModel.refreshAllQuotas(force = true) },
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                ) {
                    Icon(Icons.Default.Refresh, "刷新")
                }
                FloatingActionButton(onClick = { showAddDialog = true }) {
                    Icon(Icons.Default.Add, "添加账户")
                }
            }
        }
    ) { paddingValues ->
        Box(modifier = Modifier.padding(paddingValues)) {
            when {
                uiState.isLoading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                uiState.accounts.isEmpty() -> {
                    EmptyState(modifier = Modifier.align(Alignment.Center))
                }
                else -> {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(uiState.accounts, key = { it.account.id }) { awq ->
                            AccountCard(
                                accountWithQuota = awq,
                                onEdit = { viewModel.showEditDialog(awq.account) },
                                onDelete = { viewModel.deleteAccount(awq.account.id) },
                                onRefresh = { viewModel.refreshAccountManually(awq.account) }
                            )
                        }
                    }
                }
            }

            // 顶部刷新进度条
            if (uiState.isRefreshing) {
                LinearProgressIndicator(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.TopCenter)
                )
            }
        }
    }

    // ════════════════════════════════════════════════
    //  添加/编辑对话框
    // ════════════════════════════════════════════════
    if (showAddDialog) {
        AddEditAccountDialog(
            editingAccount = uiState.editingAccount,
            saveError = uiState.saveError,
            onDismiss = {
                showAddDialog = false
                viewModel.dismissDialog()
            },
            onSave = { username, token ->
                val ok = viewModel.saveAccount(username, token)
                if (ok) showAddDialog = false
            }
        )
    }
}
```

## 5. 删除确认对话框

```kotlin
@Composable
fun AccountCard(
    accountWithQuota: AccountWithQuota,
    onEdit: () -> Unit,
    onDelete: () -> Unit,
    onRefresh: () -> Unit
) {
    var showDeleteConfirm by remember { mutableStateOf(false) }

    Card(...) {
        // ... 卡片内容 ...

        // 操作按钮
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End
        ) {
            TextButton(onClick = onRefresh) { Text("刷新") }
            TextButton(onClick = onEdit) { Text("编辑") }
            TextButton(onClick = { showDeleteConfirm = true }) { Text("删除") }
        }
    }

    // ════════════════════════════════════════════════
    //  删除二次确认
    // ════════════════════════════════════════════════
    if (showDeleteConfirm) {
        AlertDialog(
            onDismissRequest = { showDeleteConfirm = false },
            title = { Text("确认删除") },
            text = {
                Text("确定要删除账户 ${accountWithQuota.account.username} 吗？")
            },
            confirmButton = {
                TextButton(onClick = {
                    onDelete()
                    showDeleteConfirm = false
                }) {
                    Text("删除", color = MaterialTheme.colorScheme.error)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteConfirm = false }) {
                    Text("取消")
                }
            }
        )
    }
}
```

## 完整数据流图

```
用户输入 "张三" / "sk-xxx"
         ↓
    saveAccount()
         ↓
    ┌─────────────────────────────────────┐
    │ 校验逻辑（同步）                       │
    │  - trim() 去空格                     │
    │  - 检查重复用户名                     │
    │  - 检查重复 Token                    │
    └───────────────┬─────────────────────┘
                    ↓ 校验通过
    ┌─────────────────────────────────────┐
    │ ViewModelScope.launch {}            │
    │ （开启协程，不阻塞 UI）                │
    └───────────────┬─────────────────────┘
                    ↓
         repository.saveAccount()
                    ↓
         DataStore.edit {} （异步写入磁盘）
                    ↓
         quotaService.queryQuota()
                    ↓
         HttpURLConnection 请求
                    ↓
         _uiState.update { it.copy(accounts = updated) }
                    ↓
         UI 响应式重组（自动更新）
                    ↓
         对话框关闭（dismissDialog）
```

