# iOS 环境搭建

## 一、环境要求

| 要求 | 版本 |
|------|------|
| Node.js | ≥ 18.x |
| Xcode | ≥ 15.0 |
| CocoaPods | ≥ 1.14 |
| Ruby | ≥ 3.1 |
| Watchman | 最新稳定版 |

## 二、安装步骤

### 2.1 安装 Node.js

```bash
# 使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 18
nvm use 18
```

### 2.2 安装 Xcode

1. App Store 下载 Xcode 15+
2. 安装完成后打开一次，接受协议
3. 安装 Command Line Tools：
```bash
xcode-select --install
```

### 2.3 安装 CocoaPods

```bash
# 通过 gem 安装（或使用 bundler）
sudo gem install cocoapods

# 或使用 Homebrew
brew install cocoapods
```

### 2.4 安装 Watchman

```bash
brew install watchman
```

### 2.5 创建项目

```bash
npx react-native@latest init MyProject
cd MyProject

# 安装 iOS 依赖
cd ios && pod install && cd ..

# 启动 Metro
npx react-native start

# 新开终端，运行 iOS
npx react-native run-ios
```

### 2.6 指定模拟器

```bash
# 列出可用模拟器
xcrun simctl list devices available

# 指定设备运行
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### 2.7 常见问题

#### Ruby 版本问题

```bash
# macOS 建议使用 rbenv 管理 Ruby
brew install rbenv ruby-build
rbenv install 3.1.0
rbenv global 3.1.0

# 验证
ruby --version
```

#### pod install 失败

```bash
cd ios

# 清理缓存
pod deintegrate
rm -rf Podfile.lock
pod install --repo-update

# 或使用 bundler
bundle install
bundle exec pod install
```

#### CocoaPods 下载慢

```ruby
# 在 Podfile 顶部添加
source 'https://cdn.cocoapods.org/'

# 或使用国内镜像（在 Podfile 中）
plugin 'cocoapods-user-defined-build-types'
enable_user_defined_build_types!

# 添加阿里云镜像源
source 'https://mirrors.aliyun.com/cocoapods/'
```

#### Xcode 版本不兼容

React Native 0.73+ 需要 Xcode 15.0+。

如果版本过低，需要升级 Xcode 或降级 React Native：

```bash
# 初始化指定版本的项目
npx react-native@0.72.0 init MyProject --version 0.72.0
```

#### 模拟器无法启动

```bash
# 重置模拟器
xcret simctl shutdown all
xcret simctl erase all

# 删除 DerivedData
rm -rf ~/Library/Developer/Xcode/DerivedData
```

#### 真机调试

1. Xcode 中打开项目 (`ios/MyProject.xcworkspace`)
2. 选择真机作为 Target
3. 配置签名（需要 Apple Developer 账号）
4. 点击运行
