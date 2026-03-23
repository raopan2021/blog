# 02 - 环境搭建

## JDK 安装配置

Android 开发需要 JDK 17+，推荐使用 Amazon Corretto 或 AdoptOpenJDK。

<!-- more -->

### 下载安装

```bash
# 下载 Amazon Corretto 17（已下载到 ~/amazon-corretto-17.0.18.9.1-linux-x64）
# 解压到 ~/jdk-17
tar -xzf ~/下载/amazon-corretto-17.0.18.9.1-linux-x64.tar.gz -C ~/

# 配置环境变量（~/.bashrc 或 ~/.zshrc）
export JAVA_HOME=~/jdk-17
export PATH=$JAVA_HOME/bin:$PATH

# 使配置生效
source ~/.bashrc

# 验证
java -version
# openjdk version "17.0.x"
```

### Windows / macOS

- **Windows**: 下载 MSI 安装包，安装后自动配置 PATH
- **macOS**: `brew install openjdk@17`，然后配置 JAVA_HOME

### 环境变量说明

| 变量 | 作用 |
|------|------|
| `JAVA_HOME` | 告诉 Gradle 和 Android SDK  JDK 在哪 |
| `PATH` | 包含 `$JAVA_HOME/bin`，可在任意目录执行 `java` |

## Android SDK 安装配置

### 下载 Android Command Line Tools

```bash
# 下载 command line tools（如果没有）
# https://developer.android.com/studio#command-line-tools-only

# 创建 SDK 目录
mkdir -p ~/android-sdk/cmdline-tools
cd ~/android-sdk/cmdline-tools

# 解压（将 cmdline-tools 放在 latest 目录，这是官方要求的目录结构）
unzip ~/下载/commandlinetools-linux-*.zip
mv cmdline-tools latest
```

### 安装 SDK 组件

```bash
export ANDROID_HOME=~/android-sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

# 接受协议
yes | sdkmanager --licenses

# 安装必要的 SDK 组件
sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0" "ndk;26.1.10909125"
```

| 组件 | 说明 |
|------|------|
| `platform-tools` | adb、fastboot 等调试工具 |
| `platforms;android-35` | Android 35 API（targetSdk） |
| `build-tools;35.0.0` | 编译工具链 |
| `ndk;26.1.10909125` | Native 开发工具（可选） |

### 配置 local.properties

在项目根目录创建/编辑 `local.properties`：

```properties
# 告诉 Gradle Android SDK 在哪里
sdk.dir=/home/rao/android-sdk
```

## Gradle 安装

Gradle 8.7 已内置在项目中（`gradle/` 目录），不需要单独安装。

```bash
# 项目已自带 Gradle Wrapper，直接用
./gradlew -v
# Gradle 8.7
```

::: tip Gradle Wrapper 是什么？
`gradlew` 是一个脚本，会自动下载指定版本的 Gradle，并保存在 `~/.gradle/wrapper/dists/`。团队成员不需要各自安装 Gradle，保证版本一致。
:::

## 一键环境变量配置

将以下内容加入 `~/.bashrc` 或 `~/.zshrc`：

```bash
# JDK
export JAVA_HOME=/home/rao/jdk-17
export PATH=$JAVA_HOME/bin:$PATH

# Android SDK
export ANDROID_HOME=/home/rao/android-sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

# Gradle（如果全局安装）
# export PATH=/opt/gradle/bin:$PATH
```

## 在 IDE（Android Studio / VS Code）中配置

### Android Studio（推荐）

1. 下载 [Android Studio](https://developer.android.com/studio)
2. 首次启动会自动检测 JDK 和 Android SDK
3. 打开项目根目录即可

### VS Code + Kotlin 插件

1. 安装 Kotlin 插件：`Kotlin Language` by Kotlin Team
2. 安装 Flutter 插件（可选，带 Android SDK 检测）
3. 配置 `local.properties` 中的 `sdk.dir`

## 构建验证

```bash
# 进入项目目录
cd /home/rao/.openclaw/workspace/api_quota_helper

# 首次构建（会下载 Gradle + 依赖，可能需要几分钟）
./gradlew assembleDebug

# 构建成功后，APK 位置
# app/build/outputs/apk/debug/app-debug.apk
```

## 常见问题

### Gradle 下载慢

编辑 `~/.gradle/init.gradle`，配置镜像：

```groovy
allprojects {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/public' }
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/gradle-plugin' }
        google()
        mavenCentral()
    }
}
```

### Android SDK 组件下载失败

开启代理（系统已配置 Clash）：

```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
sdkmanager "platforms;android-35"
```

### NDK 版本问题

如果 `ndk;26.1.10909125` 下载失败，检查可用的 NDK 版本：

```bash
sdkmanager --list | grep ndk
```

选择已安装或可用的版本，然后在 `app/build.gradle.kts` 中修改：

```kotlin
defaultConfig {
    ndk {
        abiFilters += listOf("arm64-v8a")
    }
}
```

### Gradle 内存不足

如果构建时出现 `OutOfMemoryError`，修改 `gradle.properties`：

```properties
org.gradle.jvmargs=-Xmx4096m -Dfile.encoding=UTF-8
```

### Android Studio 同步失败

1. File → Invalidate Caches → Invalidate and Restart
2. 删除 `.gradle` 和 `build` 目录
3. 重新 Sync Project

### 真机调试识别不到设备

```bash
# 查看设备
adb devices

# 如果是 unauthorized，重新插拔 USB 并在手机上确认授权
# 如果是 no devices，检查 USB 驱动或尝试换个 USB 口
```

### 模拟器启动失败

- 确保 BIOS 中已启用虚拟化技术（VT-x/AMD-V）
- 确保 HAXM 或 WHPX 正确安装
- 尝试从 AVD Manager 中 wipe data 后重启

