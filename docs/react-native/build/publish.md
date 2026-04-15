# React Native 发布流程

> 将 React Native 应用发布到 iOS App Store 和 Android 应用市场的完整流程

## 一、发布前准备

### 1.1 代码检查

```bash
# 1. 确保 JS Bundle 正确
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios

# 2. Android Bundle
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res
```

### 1.2 配置应用信息

```json
// app.json
{
  "name": "MyApp",
  "displayName": "我的应用"
}
```

### 1.3 应用图标

```bash
# iOS: 通过 Xcode Asset Catalog 管理
# android/app/src/main/res/mipmap-*/
# 需要各尺寸图标：mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi
```

## 二、iOS 发布

### 2.1 配置签名

1. 登录 [Apple Developer](https://developer.apple.com)
2. 创建 App ID
3. 创建分发证书（Distribution）
4. 创建 Provisioning Profile（App Store Distribution）
5. Xcode → Project → Signing & Capabilities 配置

### 2.2 构建发布版本

```bash
# 方法一：Xcode GUI
# Product → Archive → Validate → Distribute to App Store

# 方法二：命令行
cd ios
xcodebuild -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -configuration Release \
  -archivePath build/MyApp.xcarchive \
  archive

# 上传
xcodebuild -exportArchive \
  -archivePath build/MyApp.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath output
```

### 2.3 上传到 App Store Connect

```bash
# 使用 Transporter App（推荐）
# 或命令行
xcrun altool --upload-app \
  -type iosapp \
  -f MyApp.ipa \
  -u "Apple ID" \
  -p "App-Specific Password"
```

## 三、Android 发布

### 3.1 生成签名密钥

```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

### 3.2 配置签名

```java
// android/app/build.gradle
android {
  signingConfigs {
    release {
      storeFile file('my-release-key.keystore')
      storePassword 'your-keystore-password'
      keyAlias 'my-key-alias'
      keyPassword 'your-key-password'
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
  }
}
```

### 3.3 构建 APK/AAB

```bash
cd android
./gradlew assembleRelease
# 输出：android/app/build/outputs/apk/release/app-release.apk
# 或 AAB（Google Play 必须）
./gradlew bundleRelease
# 输出：android/app/build/outputs/bundle/release/app-release.aab
```

## 四、热更新（可选）

```bash
# 使用 Microsoft CodePush
npm install @microsoft/codepush-cli -g
codepush deployment add Production

# 发布更新
codepush release-react MyApp-ios -d Production
codepush release-react MyApp-android -d Production
```

## 五、注意事项

1. **Bundle 必须正确**：发布前手动 bundle 一次验证
2. **签名证书**：iOS 签名证书必须有效，Android 密钥必须妥善保管
3. **AAB vs APK**：Google Play 必须上传 AAB
4. **App Tracking Transparency**：iOS 14.5+ 需要弹窗请求跟踪权限
5. **隐私清单**：iOS 需要 PrivacyInfo.xcprivacy
