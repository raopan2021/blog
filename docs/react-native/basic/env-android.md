# Android 环境搭建

## 一、环境要求

| 要求 | 版本 |
|------|------|
| Node.js | ≥ 18.x |
| JDK | JDK 17（推荐） |
| Android SDK | Android 13 (API 33) |
| Yarn / npm | 最新稳定版 |

## 二、安装步骤

### 2.1 安装 Node.js

推荐使用 nvm 管理 Node 版本：

```bash
# 安装 nvm (Linux/macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 安装 Node 18
nvm install 18
nvm use 18
```

### 2.2 安装 JDK

```bash
# macOS 使用 Homebrew
brew install openjdk@17

# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# Windows 下载 JDK 17 安装包
# https://adoptium.net/temurin/releases/?version=17
```

配置环境变量：
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

### 2.3 安装 Android SDK

#### 方法一：Android Studio（推荐）

1. 下载 [Android Studio](https://developer.android.com/studio)
2. 安装后，打开 SDK Manager
3. 勾选以下组件：
   - Android SDK Platform 33
   - Android SDK Build-Tools 33.0.2
   - Android SDK Command-line Tools
   - Platform-Tools

#### 方法二：命令行安装

```bash
# 下载命令行工具
mkdir -p ~/Android/sdk/cmdline-tools
cd ~/Android/sdk/cmdline-tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip
mv cmdline-tools latest

# 配置环境变量
export ANDROID_HOME=~/Android/sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

# 安装 SDK 组件
sdkmanager --install "platform-tools" "platforms;android-33" "build-tools;33.0.2"
```

### 2.4 配置环境变量

将以下内容添加到 `~/.bashrc` 或 `~/.zshrc`：

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export ANDROID_HOME=~/Android/sdk
export PATH=$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/33.0.2:$PATH
```

### 2.5 创建项目

```bash
# 使用 React Native CLI
npx react-native@latest init MyProject

# 进入项目
cd MyProject

# 启动 Metro
npx react-native start

# 新开终端，运行 Android
npx react-native run-android
```

### 2.6 常见问题

#### gradle 下载失败

```bash
# 使用国内镜像
# 在 android/build.gradle 中添加
allprojects {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/public' }
        maven { url 'https://maven.aliyun.com/repository/google' }
        google()
        mavenCentral()
    }
}
```

#### SDK license 未授权

```bash
# 自动接受所有 license
yes | sdkmanager --licenses
```

#### Node 版本不兼容

```bash
# 查看 React Native 兼容的 Node 版本
# https://reactnative.dev/docs/environment-support

# Node 20+ 可能需要降级
nvm install 18
nvm use 18
```

#### 真机调试

```bash
# 1. 手机开启开发者模式 + USB 调试
# 2. 用 USB 连接电脑
adb devices
# 应该看到设备列表

# 3. 安装并运行
npx react-native run-android
```
