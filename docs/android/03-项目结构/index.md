# 03 - 项目结构

## 完整目录结构

```
api_quota_helper/
├── app/                           # App 模块（主应用）
│   ├── build.gradle.kts            # App 构建配置
│   └── src/main/
│       ├── AndroidManifest.xml     # 应用清单（声明 Activity、权限等）
│       ├── kotlin/
│       │   └── com/apiapp/api_quota_helper/
│       │       ├── MainActivity.kt      # 入口 Activity
│       │       ├── MainScreen.kt        # 主页面 UI
│       │       ├── MainViewModel.kt     # 主页面 ViewModel
│       │       ├── SettingsScreen.kt    # 设置页面
│       │       ├── LogScreen.kt         # 日志页面
│       │       ├── data/
│       │       │   ├── model/
│       │       │   │   └── Models.kt    # 数据模型定义
│       │       │   ├── repository/
│       │       │   │   └── AccountRepository.kt  # 数据仓库
│       │       │   └── service/
│       │       │       ├── QuotaService.kt     # API 请求
│       │       │       └── LogBuffer.kt        # 日志缓冲
│       │       └── ui/
│       │           └── theme/
│       │               ├── Color.kt     # 颜色定义
│       │               ├── Type.kt      # 字体定义
│       │               └── Theme.kt     # Compose 主题
│       └── res/                   # 资源文件（图标、字符串等）
├── build.gradle.kts               # 根构建配置（插件版本管理）
├── settings.gradle.kts            # 项目设置（模块列表）
├── gradle.properties              # Gradle 属性（开启 AndroidX 等）
├── gradlew / gradlew.bat          # Gradle Wrapper 脚本
├── gradle/                       # Gradle Wrapper 本身
│   └── wrapper/
│       └── gradle-wrapper.jar
└── api_quota_helper.jks           # 签名文件（不提交到 Git）
```

## 核心文件解析

### 根目录 build.gradle.kts

定义全局插件版本，所有子模块共享：

```kotlin
// build.gradle.kts（根目录）
plugins {
    id("com.android.application") version "8.3.2" apply false
    id("org.jetbrains.kotlin.android") version "2.0.0" apply false
    id("com.google.devtools.ksp") version "2.0.0-1.0.21" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.0" apply false
    id("org.jetbrains.kotlin.plugin.serialization") version "2.0.0" apply false
}
```

::: tip `apply false` 是什么意思？
表示插件仅声明，不应用到当前项目。通常根 `build.gradle.kts` 只负责声明版本，具体应用在子模块的 `build.gradle.kts` 中。
:::

### app/build.gradle.kts

应用模块的构建配置，是最重要的配置文件：

```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.devtools.ksp")
    id("org.jetbrains.kotlin.plugin.compose")
    id("org.jetbrains.kotlin.plugin.serialization")
}

android {
    namespace = "com.apiapp.api_quota_helper"  // 应用包名
    compileSdk = 35                            // 编译 SDK 版本

    defaultConfig {
        applicationId = "com.apiapp.api_quota_helper"
        minSdk = 26                            // 最低支持 Android 8.0
        targetSdk = 35                         // 目标 SDK 版本
        versionCode = 44                       // 版本号（内部递增）
        versionName = "1.0.47"                // 版本名（用户可见）

        ndk {
            abiFilters += listOf("arm64-v8a")  // 只打包 64 位架构，减小体积
        }
    }

    signingConfigs {
        create("release") {
            // 签名配置，从环境变量读取密码
            storeFile = file("api_quota_helper.jks")
            storePassword = System.getenv("KEY_STORE_PASSWORD") ?: "android"
            keyAlias = System.getenv("KEY_ALIAS") ?: "api_quota_helper"
            keyPassword = System.getenv("KEY_PASSWORD") ?: "android"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true             // 开启 R8 压缩
            isShrinkResources = true           // 移除无用资源
            if (file("api_quota_helper.jks").exists()) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
        debug {
            isDebuggable = true
            isMinifyEnabled = true
            isShrinkResources = true
            applicationIdSuffix = ".debug"    // 包名加 .debug 后缀
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"                       // 编译为 Java 17 字节码
    }

    buildFeatures {
        compose = true                         // 启用 Compose
        buildConfig = true                     // 生成 BuildConfig 类
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.02.00")
    implementation(composeBom)

    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")

    // Compose UI
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.compose.animation:animation")

    // DataStore
    implementation("androidx.datastore:datastore-preferences:1.0.0")

    // JSON 序列化
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2")

    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
```

### gradle.properties

Gradle 全局配置，影响构建行为：

```properties
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true          # 启用 AndroidX（替代旧 support 库）
android.enableJetifier=true       # 自动将旧 support 库依赖迁移到 AndroidX
kotlin.code.style=official        # Kotlin 代码风格
org.gradle.parallel=true           # 开启并行构建
org.gradle.caching=true           # 开启 Gradle 缓存
```

### settings.gradle.kts

声明项目包含哪些模块：

```kotlin
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "api_quota_helper"
include(":app")
```

### AndroidManifest.xml

应用清单，声明四大组件和所需权限：

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- 网络权限 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ApiQuotaHelper">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.ApiQuotaHelper">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>
</manifest>
```

## Kotlin 代码组织

### 包名规范

Kotlin 用包名组织代码，`src/main/kotlin/` 下的目录结构对应包名：

```
src/main/kotlin/
└── com/apiapp/api_quota_helper/
    └── MainActivity.kt
```

对应包名 `package com.apiapp.api_quota_helper`，文件顶部写：

```kotlin
package com.apiapp.api_quota_helper
```

### 多个同包文件合并

一个包可以有多个文件，比如 `data/model/` 下的所有文件都在 `com.apiapp.api_quota_helper.data.model` 包下，编译时自动合并。

## 下一章

[数据模型 →](./04-数据模型)
