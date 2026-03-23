# 07 - 状态管理

## 什么是 ViewModel？

ViewModel 是 Android Jetpack 组件，专门用于管理 UI 相关的数据。它有两大特点：

1. **生命周期感知** — 屏幕旋转等配置变更不会导致数据丢失
2. **与 UI 分离** — 业务逻辑从 Activity/Fragment 中抽离出来

<!-- more -->

## 为什么需要 ViewModel？

```
❌ 没有 ViewModel：Activity 管理一切
Activity
├── UI 逻辑（按钮显示/隐藏）
├── 业务逻辑（网络请求）
├── 状态（账户列表）
└── 生命周期处理
    → 问题：配置变更时数据丢失，代码臃肿

✅ 有 ViewModel：各司其职
Activity          ViewModel
├── UI 渲染    ←──  uiState
├── 用户点击  ──→  方法调用
                ├── 业务逻辑
                └── 状态管理
                    → 配置变更不丢失，代码清晰
```

## UI 状态（UiState）

UiState 是一个数据类，封装了 UI 需要的所有状态：

```kotlin
// 定义 UI 状态
data class MainUiState(
    val accounts: List<AccountWithQuota> = emptyList(),   // 账户列表
    val isLoading: Boolean = false,                        // 全局加载状态
    val isRefreshing: Boolean = false,                     // 下拉刷新中
    val showAddDialog: Boolean = false,                    // 是否显示添加对话框
    val editingAccount: UserAccount? = null,                // 正在编辑的账户（null = 添加模式）
    val settings: AppSettings = AppSettings(),             // 应用设置
    val saveError: String? = null                          // 保存错误信息
)

// 使用时：所有状态都在一个对象里
val uiState = MainUiState(
    accounts = listOf(...),
    isLoading = false,
    showAddDialog = true,
    ...
)
```

::: tip 一个 UI 状态类的好处
- **统一管理**：所有状态一目了然，不会散落在各处
- **易于调试**：`uiState.isLoading` 一眼就知道加载状态
- **不可变暴露**：外部只能读取，内部才能修改
- **快照**：`UiState` 是数据类，copy 后可临时修改局部状态
:::

## StateFlow

StateFlow 是 Kotlin 协程库提供的响应式状态容器，专门替代 LiveData：

```kotlin
import kotlinx.coroutines.flow.*

// ViewModel 中的写法
class MainViewModel(...) : ViewModel() {

    // MutableStateFlow：内部可写
    private val _uiState = MutableStateFlow(MainUiState())

    // StateFlow：外部只读，不可变
    val uiState: StateFlow<MainUiState> = _uiState.asStateFlow()

    // 修改状态
    fun refreshAllQuotas() {
        _uiState.update { it.copy(isRefreshing = true) }
        // ... 异步操作
        _uiState.update { it.copy(isRefreshing = false) }
    }
}
```

### StateFlow vs LiveData

```kotlin
// LiveData（已过时）
val accounts: LiveData<List<Account>> = ...

// StateFlow（推荐）
val accounts: StateFlow<List<Account>> = ...

// 主要区别：
// 1. LiveData 是 Android 专用的，StateFlow 是 Kotlin 协程库的一部分
// 2. LiveData 自动在主线程观察，StateFlow 需要指定协程上下文
// 3. StateFlow 没有 startObserving()，从 collect() 开始就生效
```

## 完整 ViewModel 实现

```kotlin
package com.apiapp.api_quota_helper.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.apiapp.api_quota_helper.data.model.AccountWithQuota
import com.apiapp.api_quota_helper.data.model.AppSettings
import com.apiapp.api_quota_helper.data.model.UserAccount
import com.apiapp.api_quota_helper.data.repository.AccountRepository
import com.apiapp.api_quota_helper.data.service.QuotaService
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class MainUiState(
    val accounts: List<AccountWithQuota> = emptyList(),
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val showAddDialog: Boolean = false,
    val editingAccount: UserAccount? = null,
    val settings: AppSettings = AppSettings(),
    val saveError: String? = null
)

class MainViewModel(
    private val repository: AccountRepository,
    private val quotaService: QuotaService
) : ViewModel() {

    // ══════════════════════════════════════════════════
    //  状态定义
    // ══════════════════════════════════════════════════
    private val _uiState = MutableStateFlow(MainUiState())
    val uiState: StateFlow<MainUiState> = _uiState.asStateFlow()

    // ══════════════════════════════════════════════════
    //  初始化
    // ══════════════════════════════════════════════════
    init {
        loadAccounts()
        loadSettings()
    }

    // ══════════════════════════════════════════════════
    //  加载账户（观察 Repository 的 Flow）
    // ══════════════════════════════════════════════════
    private fun loadAccounts() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }

            repository.accounts.collect { accounts ->
                val accountsWithQuota = accounts.map { AccountWithQuota(it) }
                _uiState.update {
                    it.copy(
                        accounts = accountsWithQuota,
                        isLoading = false
                    )
                }

                // 有账户时自动查询额度
                if (accounts.isNotEmpty()) {
                    refreshAllQuotas()
                }
            }
        }
    }

    private fun loadSettings() {
        viewModelScope.launch {
            repository.settings.collect { settings ->
                _uiState.update { it.copy(settings = settings) }
            }
        }
    }

    // ══════════════════════════════════════════════════
    //  刷新所有账户额度
    // ══════════════════════════════════════════════════
    fun refreshAllQuotas(force: Boolean = false) {
        viewModelScope.launch {
            _uiState.update { it.copy(isRefreshing = true) }

            val currentAccounts = _uiState.value.accounts
            // force=true 时清空数据，显示加载状态
            val cleared = if (force) {
                currentAccounts.map { it.copy(quota = null, error = null) }
            } else {
                currentAccounts
            }
            _uiState.update { it.copy(accounts = cleared) }

            // 逐个查询额度
            val updated = cleared.map { awq ->
                val result = quotaService.queryQuota(awq.account)
                awq.copy(
                    quota = result.getOrNull(),
                    error = result.exceptionOrNull()?.message,
                    lastUpdated = System.currentTimeMillis()
                )
            }

            _uiState.update { it.copy(accounts = updated, isRefreshing = false) }
        }
    }

    // ══════════════════════════════════════════════════
    //  添加/编辑 账户
    // ══════════════════════════════════════════════════
    fun showAddDialog() {
        _uiState.update { it.copy(showAddDialog = true, editingAccount = null, saveError = null) }
    }

    fun showEditDialog(account: UserAccount) {
        _uiState.update { it.copy(showAddDialog = true, editingAccount = account, saveError = null) }
    }

    fun dismissDialog() {
        _uiState.update { it.copy(showAddDialog = false, editingAccount = null, saveError = null) }
    }

    fun saveAccount(username: String, token: String): Boolean {
        // 校验
        val trimmedUsername = username.trim()
        val trimmedToken = token.trim()

        val others = _uiState.value.accounts.filter {
            it.account.id != _uiState.value.editingAccount?.id
        }

        when {
            others.any { it.account.username == trimmedUsername } -> {
                _uiState.update { it.copy(saveError = "用户名「$trimmedUsername」已存在") }
                return false
            }
            others.any { it.account.token == trimmedToken } -> {
                _uiState.update { it.copy(saveError = "Token 已存在") }
                return false
            }
        }

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

            // 立即刷新新账户的额度
            val result = quotaService.queryQuota(account)
            val newAwq = AccountWithQuota(
                account = account,
                quota = result.getOrNull(),
                error = result.exceptionOrNull()?.message,
                lastUpdated = System.currentTimeMillis()
            )

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

    // ══════════════════════════════════════════════════
    //  删除账户
    // ══════════════════════════════════════════════════
    fun deleteAccount(accountId: String) {
        viewModelScope.launch {
            repository.deleteAccount(accountId)
        }
    }

    // ══════════════════════════════════════════════════
    //  刷新单个账户
    // ══════════════════════════════════════════════════
    fun refreshAccountManually(account: UserAccount) {
        viewModelScope.launch {
            // 先显示加载状态
            val updated = _uiState.value.accounts.map { awq ->
                if (awq.account.id == account.id) {
                    awq.copy(quota = null, error = null)
                } else awq
            }
            _uiState.update { it.copy(accounts = updated) }

            // 再查询
            val result = quotaService.queryQuota(account)
            val finalAccounts = _uiState.value.accounts.map { awq ->
                if (awq.account.id == account.id) {
                    awq.copy(
                        quota = result.getOrNull(),
                        error = result.exceptionOrNull()?.message,
                        lastUpdated = System.currentTimeMillis()
                    )
                } else awq
            }
            _uiState.update { it.copy(accounts = finalAccounts) }
        }
    }

    // ══════════════════════════════════════════════════
    //  设置相关
    // ══════════════════════════════════════════════════
    fun updateDarkMode(enabled: Boolean) {
        viewModelScope.launch {
            val newSettings = _uiState.value.settings.copy(darkMode = enabled)
            repository.saveSettings(newSettings)
            _uiState.update { it.copy(settings = newSettings) }
        }
    }

    fun updateRefreshInterval(minutes: Int) {
        viewModelScope.launch {
            val newSettings = _uiState.value.settings.copy(refreshIntervalMinutes = minutes)
            repository.saveSettings(newSettings)
            _uiState.update { it.copy(settings = newSettings) }
        }
    }
}
```

## _uiState.update 语法

`_uiState.update { it.copy(...) }` 是常用的状态更新模式：

```kotlin
// 传统写法
_uiState.value = _uiState.value.copy(isLoading = true, accounts = newAccounts)

// update 写法（推荐）- 原子操作
_uiState.update { current ->
    current.copy(isLoading = true, accounts = newAccounts)
}

// 更新部分字段
_uiState.update { it.copy(isRefreshing = true) }
_uiState.update { it.copy(isRefreshing = false) }
```

## Compose 中使用 ViewModel

```kotlin
@Composable
fun MainScreen(viewModel: MainViewModel) {
    // collectAsState() 将 StateFlow 转为 Compose 可观察的 State
    val uiState by viewModel.uiState.collectAsState()

    // UI 自动重组（recomposition）
    // 当 uiState.accounts 变化时，只有用到 accounts 的组件会重新渲染
    LazyColumn {
        items(uiState.accounts) { awq ->
            AccountCard(
                accountWithQuota = awq,
                onEdit = { viewModel.showEditDialog(awq.account) },
                onDelete = { viewModel.deleteAccount(awq.account.id) }
            )
        }
    }

    // 显示/隐藏对话框
    if (uiState.showAddDialog) {
        AddEditAccountDialog(
            editingAccount = uiState.editingAccount,
            onSave = { username, token -> viewModel.saveAccount(username, token) },
            onDismiss = { viewModel.dismissDialog() }
        )
    }
}
```

::: tip collectAsState 的原理
`collectAsState()` 本质上是：
1. 在 `LaunchedEffect` 中启动协程收集 Flow
2. 将最新值存入 Compose `State`
3. Compose 监听 State 变化，自动触发重组

这就是为什么 Compose 能响应式地更新 UI——不需要手动调用 `notifyDataSetChanged()`。
:::

