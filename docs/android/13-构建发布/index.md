# 13 - 构建与发布

## Debug 构建

```bash
# 在项目根目录执行
cd /home/rao/.openclaw/workspace/api_quota_helper

# 第一次构建会下载 Gradle 和依赖，大约需要 5-10 分钟
./gradlew assembleDebug

# 输出位置
# app/build/outputs/apk/debug/app-debug.apk
```

安装到手机：

```bash
# 连接手机后
adb install app/build/outputs/apk/debug/app-debug.apk

# 如果已安装过，加 -r 覆盖
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

<!-- more -->

## Release 构建

Release 构建会启用代码压缩和混淆：

```bash
./gradlew assembleRelease
```

### 签名配置

Android 应用必须签名才能安装到用户手机。签名文件 `api_quota_helper.jks` 存放在项目根目录：

```kotlin
// app/build.gradle.kts
signingConfigs {
    create("release") {
        storeFile = file("api_quota_helper.jks")
        storePassword = System.getenv("KEY_STORE_PASSWORD") ?: "android"
        keyAlias = System.getenv("KEY_ALIAS") ?: "api_quota_helper"
        keyPassword = System.getenv("KEY_PASSWORD") ?: "android"
    }
}

buildTypes {
    release {
        isMinifyEnabled = true
        isShrinkResources = true

        // 只有签名文件存在时才使用签名
        if (file("api_quota_helper.jks").exists()) {
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

::: warning 保护签名文件
签名文件 `api_quota_helper.jks` 不要提交到 GitHub！添加到 `.gitignore`：

```bash
*.jks
*.keystore
```

签名密码通过环境变量读取，不硬编码在代码中。
:::

## R8 代码混淆

`isMinifyEnabled = true` 启用 R8 压缩，会：

1. **移除无用代码** — 没有调用的类、方法、字段
2. **混淆名称** — 将类名/方法名改成短随机名（如 `a()`, `b()`）
3. **优化字节码** — 内联、死代码消除等

需要配置 `proguard-rules.pro` 保留必要的反射代码：

```prolog
# app/proguard-rules.pro

# Kotlin 序列化
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt

-keepclassmembers class kotlinx.serialization.json.** {
    *** Companion;
}
-keepclasseswithmembers class kotlinx.serialization.json.** {
    kotlinx.serialization.KSerializer serializer(...);
}

# 数据类必须保留，否则 JSON 解析会失败
-keep class com.apiapp.api_quota_helper.data.model.** {
    *;
}

# Keep generic signature of Call, Response (R8 full mode strips signatures from non-kept items).
-keep,allowobfuscation,allowshrinking interface retrofit2.Call
-keep,allowobfuscation,allowshrinking class kotlin.coroutines.Continuation
```

## APK 体积优化

本项目从 15MB 优化到 **2.6MB**，主要手段：

### 1. 只打包 arm64 架构

```kotlin
defaultConfig {
    ndk {
        abiFilters += listOf("arm64-v8a")  // 移除 x86, x86_64, armeabi-v7a
    }
}
```

| 架构 | APK 体积 | 兼容性 |
|------|----------|--------|
| arm64-v8a + armeabi-v7a | 100% | 几乎所有手机 |
| 只 arm64-v8a | ~60% | 2018年后手机 |
| 全架构 | 100% | 所有设备 |

### 2. 启用 R8 压缩

```kotlin
release {
    isMinifyEnabled = true
    isShrinkResources = true
}
```

### 3. 使用 BOM 管理依赖版本

```kotlin
// ❌ 逐个指定版本，可能有冗余
implementation("androidx.compose.ui:ui:1.6.0")
implementation("androidx.compose.material3:material3:1.2.0")

// ✅ 使用 BOM 统一版本
val composeBom = platform("androidx.compose:compose-bom:2024.02.00")
implementation(composeBom)
implementation("androidx.compose.material3:material3")  // 自动使用 BOM 中的版本
```

### 4. 移除不需要的资源

```kotlin
// 不打包 lint 生成的报告
lint.abortOnError false

// 排除不需要的语言资源（可选）
android {
    resourceConfigurations += listOf("zh", "en")  // 只保留中英文
}
```

### 5. 对比

| 优化项 | 优化前 | 优化后 |
|--------|--------|--------|
| ABI 过滤 | 全部架构 | 仅 arm64-v8a |
| Minify | 关闭 | 开启 |
| Shrink | 关闭 | 开启 |
| Compose BOM | 无 | 2024.02.00 |
| **APK 大小** | **15MB** | **2.6MB** |

## GitHub Actions 自动构建

可以在 GitHub 上配置 CI，每次 push 自动构建 APK：

```yaml
# .github/workflows/build.yml
name: Build APK

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v2

      - name: Build APK
        run: ./gradlew assembleDebug

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: app-debug
          path: app/build/outputs/apk/debug/app-debug.apk
```

## 版本号管理

| 字段 | 用途 | 说明 |
|------|------|------|
| `versionCode` | 内部递增整数 | Google Play 更新依据，必须递增 |
| `versionName` | 用户可见版本号 | 如 "1.0.47" |

```kotlin
defaultConfig {
    versionCode = 44      // 每次发布递增（+1）
    versionName = "1.0.47" // 用户看到的版本号
}
```

版本对比逻辑（SettingsScreen 中的实现）：

```kotlin
val needsUpdate = try {
    val latest = latestVersion.split(".").map { it.toInt() }
    val current = currentVersion.split(".").map { it.toInt() }
    val size = maxOf(latest.size, current.size)
    val latestPadded = latest + List(size - latest.size) { 0 }
    val currentPadded = current + List(size - current.size) { 0 }
    latestPadded.zip(currentPadded).any { it.first > it.second }
} catch (e: Exception) {
    latestVersion != currentVersion
}
```

## GitHub Releases 自动检测

设置页面进入时自动调用 GitHub API 检查更新：

```kotlin
val apiUrl = URL("https://api.github.com/repos/raopan2021/api_quota_helper/releases/latest")
val conn = apiUrl.openConnection() as HttpURLConnection
conn.requestMethod = "GET"
conn.setRequestProperty("Accept", "application/vnd.github+json")
conn.setRequestProperty("X-GitHub-Api-Version", "2022-11-28")

if (conn.responseCode == 200) {
    val json = JSONObject(conn.inputStream.bufferedReader().readText())
    val tagName = json.getString("tag_name").removePrefix("v")
    val assets = json.optJSONArray("assets") ?: JSONArray()

    // 找到 .apk 文件的下载链接
    for (i in 0 until assets.length()) {
        val asset = assets.getJSONObject(i)
        if (asset.getString("name").endsWith(".apk")) {
            val downloadUrl = asset.getString("browser_download_url")
            // 显示更新提示
        }
    }
} else if (conn.responseCode == 403) {
    // GitHub API 限流（每小时 60 次）
}
```

## 发布到应用市场

### Google Play

1. 注册 Google Play 开发者账号（$25 一次性）
2. 生成签名 APK/AAB
3. 创建应用，填写信息
4. 提交审核（通常 1-3 天）

### 国内应用市场

- 华为应用市场
- 小米应用商店
- OPPO / vivo / 应用宝

各市场需要单独注册开发者账号，单独提交审核。

## 日常开发技巧

```bash
# 清理构建缓存
./gradlew clean

# 查看依赖树
./gradlew dependencies

# 只编译指定模块（更快）
./gradlew :app:compileDebugKotlin

# 跳过测试
./gradlew assembleDebug -x test

# 并行构建（多核加速）
./gradlew assembleDebug --parallel

# 查看详细构建日志
./gradlew assembleDebug --info
```

## 调试技巧

### 查看 APK 信息

```bash
# 查看 APK 包含的架构
aapt dump badging app/build/outputs/apk/release/app-release.apk | grep sdk

# 查看 APK 大小
ls -lh app/build/outputs/apk/release/app-release.apk

# 对比 debug 和 release 大小
ls -lh app/build/outputs/apk/debug/app-debug.apk app/build/outputs/apk/release/app-release.apk
```

### 查看依赖冲突

```bash
# 查看依赖树（特定库）
./gradlew app:dependencies --configuration releaseRuntimeClasspath | grep kotlin

# 查看重复依赖
./gradlew app:dependencies --configuration releaseRuntimeClasspath | grep "om\\.google" | head -20
```

### 本地测试不同主题

```kotlin
// 在 MainActivity 中临时修改
ApiQuotaHelperTheme(darkTheme = true) {  // 强制暗黑模式
    // ...
}
```

### 查看 Compose UI 层级

在设备上摇一摇（或运行 `adb shell input keyevent 82`）打开 Dev Menu，选择 "Inspect" 可以查看 Compose UI 层级结构。

## 总结

本章涵盖：
- ✅ Debug / Release 构建
- ✅ 签名配置与环境变量
- ✅ R8 代码混淆
- ✅ APK 体积优化（15MB → 2.6MB）
- ✅ GitHub Actions CI
- ✅ GitHub Releases 更新检测
