# Android 发布详细指南

> React Native Android 应用发布到应用市场的完整步骤

## 一、打包方式

| 方式 | 格式 | 说明 |
|------|------|------|
| APK | `.apk` | 直接安装，用户可复制分发 |
| AAB | `.aab` | Google Play 必须，上传后 Play 自动优化 |

## 二、签名配置

### 2.1 生成签名密钥

```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# 妥善保管 .keystore 文件！丢失密钥无法更新应用
```

### 2.2 配置 gradle

```java
// android/app/build.gradle

android {
  signingConfigs {
    release {
      storeFile file('my-release-key.keystore')  // 放在 android/app/ 下
      storePassword 'your-keystore-password'
      keyAlias 'my-key-alias'
      keyPassword 'your-key-password'
    }
  }

  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      shrinkResources true
      proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
  }
}
```

### 2.3 分离签名配置（安全）

```properties
# android/keystore.properties (不要提交到 git)
storeFile=my-release-key.keystore
storePassword=your-keystore-password
keyAlias=my-key-alias
keyPassword=your-key-password
```

```java
// 在 build.gradle 中读取
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('keystore.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
  signingConfigs {
    release {
      storeFile file(keystoreProperties.storeFile)
      storePassword keystoreProperties.storePassword
      keyAlias keystoreProperties.keyAlias
      keyPassword keystoreProperties.keyPassword
    }
  }
}
```

## 三、构建 APK

```bash
cd android

# 清理
./gradlew clean

# 构建 Release APK
./gradlew assembleRelease

# 输出目录
# android/app/build/outputs/apk/release/app-release.apk
```

## 四、构建 AAB（Google Play）

```bash
# 构建 AAB（App Bundle）
./gradlew bundleRelease

# 输出目录
# android/app/build/outputs/bundle/release/app-release.aab
```

## 五、JavaScript Bundle 内嵌

### 5.1 自动打包

RN 0.71+ Release 构建自动包含 JS Bundle，无需手动操作。

### 5.2 手动打包验证

```bash
# Android JS Bundle
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res
```

## 六、Google Play 发布

### 6.1 开发者账号

- 注册 Google Play Console：$25 一次性付费

### 6.2 创建应用

1. Play Console → 所有应用 → 创建应用
2. 填写应用名称、默认语言
3. 应用类型选择

### 6.3 配置商店信息

**必填项**：
- 应用图标：512x512 PNG
- 特性图片：1024x500 JPG
- 截图：手机、平板各尺寸
- 简短说明（80字符）
- 完整说明

**内容分级**：
- 填写问卷调查
- 获取分级标签

### 6.4 上传 AAB

```
生产 → 正式版 → 创建版本
→ 上传 AAB 文件
→ 填写版本说明
→ 保存 → 发布
```

## 七、国内应用市场

### 7.1 主流市场

| 市场 | 账号类型 | 审核时间 |
|------|---------|---------|
| 应用宝 | 个人/企业 | 1-3天 |
| 华为应用市场 | 企业 | 3-7天 |
| OPPO 软件商店 | 企业 | 2-5天 |
| 小米应用商店 | 企业 | 1-3天 |
| vivo 应用商店 | 企业 | 3-7天 |

### 7.2 APK 发布

国内市场通常接受 APK 直传，无需 AAB：

```bash
# 签名 APK 即可分发
./gradlew assembleRelease
# 复制 app-release.apk 重命名为 MyApp_v1.0.0.apk
```

### 7.3 各市场要求

- **应用宝**：需要软件著作权
- **华为**：需要企业认证
- **小米**：需要企业认证或个人开发者（限制多）

## 八、混淆配置

```properties
# proguard-rules.pro
# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# 第三方库（如 axios）
-keep class axios.** { *; }
-dontwarn okhttp3.**
-keep class okhttp3.** { *; }
```

## 九、常见问题

| 问题 | 解决 |
|------|------|
| APK 无法安装 | 检查签名是否正确 |
| 华为市场安装失败 | 检查是否签名+v1+v2 |
| Bundle 加载失败 | 确认 JS Bundle 内嵌成功 |
| 32位/64位问题 | Android ABI 配置包含 arm64-v8a |
