# 04 - 数据模型

## 数据模型定义

在 Android 开发中，数据模型（Model）用于描述应用的数据结构。本项目使用 Kotlin 的 `data class`（数据类）和 `@Serializable` 注解来实现。

<!-- more -->

## Kotlin 数据类

数据类是 Kotlin 专为数据存储设计的类，自动生成 `equals()`、`hashCode()`、`copy()`、`toString()` 等方法。

### 基本定义

```kotlin
// 普通类 vs 数据类
class User(val name: String, val age: Int) {
    // 需要手写 equals/hashCode/toString
}

data class UserAccount(
    val id: String,
    val username: String,
    val token: String
)

// 自动生成：
// - equals()：按属性比较
// - hashCode()：根据属性生成
// - toString()：格式 "UserAccount(id=xxx, username=xxx, ...)"
// - copy()：复制并修改部分属性
// - componentN()：解构
```

### copy() 方法

```kotlin
val original = UserAccount(
    id = "123",
    username = "张三",
    token = "sk-xxx"
)

// 复制一份，只修改 username
val modified = original.copy(username = "李四")

println(original)      // UserAccount(id=123, username=张三, ...)
println(modified)      // UserAccount(id=123, username=李四, ...)
```

### 解构

```kotlin
val account = UserAccount("123", "张三", "sk-xxx")

// 解构赋值
val (id, username, token) = account
println("$username 的 ID 是 $id")
```

## 本项目数据模型

### Models.kt 完整代码

```kotlin
package com.apiapp.api_quota_helper.data.model

import kotlinx.serialization.Serializable

/**
 * 用户账户（用于额度查询）
 * @Serializable 注解让数据类可以被 JSON 序列化/反序列化
 */
@Serializable
data class UserAccount(
    val id: String,              // UUID，唯一标识符
    val username: String,        // 用户名
    val token: String,           // API Token
    val createdAt: Long = System.currentTimeMillis()  // 创建时间
)

/**
 * 额度查询响应
 */
@Serializable
data class QuotaResponse(
    val success: Boolean,
    val data: QuotaData? = null,
    val message: String? = null
)

/**
 * 额度数据
 */
@Serializable
data class QuotaData(
    val subscription_id: Int = 0,
    val plan_name: String = "",          // 套餐名称
    val days_remaining: Int = 0,          // 剩余天数
    val end_time: String = "",            // 到期时间
    val amount: Double = 0.0,             // 总额度
    val amount_used: Double = 0.0,         // 已用额度
    val next_reset_time: String = "",     // 下次重置时间
    val status: String = ""               // 状态
) {
    // 计算属性：剩余额度
    val remaining: Double
        get() = amount - amount_used

    // 计算属性：已用百分比
    val usedPercentage: Float
        get() = if (amount > 0) (amount_used / amount).toFloat() else 0f
}

/**
 * 账户列表（带额度信息）
 * 这是 UI 层使用的数据结构，同时包含账户信息和额度信息
 */
@Serializable
data class AccountWithQuota(
    val account: UserAccount,            // 账户基本信息
    val quota: QuotaData? = null,        // 查询到的额度（null 表示正在加载/查询失败）
    val error: String? = null,           // 错误信息
    val lastUpdated: Long = 0L           // 最后更新时间戳
)

/**
 * 应用设置
 */
@Serializable
data class AppSettings(
    val darkMode: Boolean = false,       // 是否开启暗黑模式
    val refreshIntervalSeconds: Int = 300 // 自动刷新间隔（秒，默认5分钟）
)
```

## 计算属性

Kotlin 的计算属性（Computed Property）类似 JavaScript 的 getter：

```kotlin
data class QuotaData(...) {
    // 计算属性：在外部访问 remaining 时动态计算
    val remaining: Double
        get() = amount - amount_used

    val usedPercentage: Float
        get() = if (amount > 0) (amount_used / amount).toFloat() else 0f
}

// 使用
val quota = QuotaData(amount = 100.0, amount_used = 25.0)
println(quota.remaining)       // 75.0（自动计算）
println(quota.usedPercentage)  // 0.25
```

## @Serializable 序列化

`kotlinx.serialization` 库让数据类可以在 JSON 和对象之间互相转换：

```kotlin
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

private val json = Json { ignoreUnknownKeys = true }

// 对象 → JSON 字符串
val account = UserAccount("1", "张三", "sk-xxx")
val jsonString = json.encodeToString(account)
println(jsonString)
// {"id":"1","username":"张三","token":"sk-xxx","createdAt":1710912000000}

// JSON 字符串 → 对象
val parsed: UserAccount = json.decodeFromString(jsonString)

// 忽略未知字段（服务器新增字段不会报错）
```

::: tip JSON 序列化场景
- **DataStore 存储**：将对象转为 JSON 字符串后存入 DataStore
- **网络请求**：将对象转为 JSON 发送给 API，解析响应 JSON 为对象
- **跨组件传递**：通过 Intent 传输（需要实现 Parcelable，但 JSON 更通用）
:::

## 模型设计思路

### 为什么 AccountWithQuota 单独拎出来？

```kotlin
// 方案 A：嵌套在 UserAccount 里
data class UserAccount(
    val quota: QuotaData? = null  // ❌ 语义不对，账户本身不应该包含额度
)

// 方案 B：单独的数据类（推荐）
data class AccountWithQuota(
    val account: UserAccount,   // 账户
    val quota: QuotaData?,      // 额度
    val error: String?,         // 错误
    val lastUpdated: Long       // 更新时间
)
```

UI 需要同时展示"账户信息"和"额度状态"，把它们组合在一起比嵌套更灵活。错误信息和时间戳也不适合放在模型里，所以组合类是最优解。

## 空安全的重要性

Kotlin 的空安全机制在编译期就防止 NPE（NullPointerException）：

```kotlin
// ❌ 编译错误：String 不能为 null
val name: String = null

// ✅ 可空类型
val name: String? = null

// ❌ 编译错误：直接访问可空类型
println(name.length)

// ✅ 安全调用
println(name?.length)  // null 时打印 null

// ✅ Elvis 操作符
println(name?.length ?: 0)  // null 时返回 0

// ✅ 非空断言（慎用！）
println(name!!.length)  // null 时直接崩溃
```

