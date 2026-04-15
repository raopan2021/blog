# iOS 发布详细指南

> React Native iOS 应用发布到 App Store 的完整步骤

## 一、开发者账号配置

### 1.1 Apple Developer Program

- 个人/公司账号：$99/年
- 企业账号：$299/年（用于企业内部分发）

### 1.2 创建 App ID

1. 登录 [Apple Developer Console](https://developer.apple.com)
2. Certificates, Identifiers & Profiles → Identifiers → 创建
3. 选择 App IDs → App
4. 填写 Bundle ID（必须与项目一致）

### 1.3 创建分发证书

**方式一：自动（Xcode）**
- Xcode → Preferences → Accounts → 添加账号
- 自动管理签名

**方式二：手动**
```bash
# 1. 创建 CSR
openssl req -new -newkey rsa:2048 -nodes \
  -keyout Distribution.key \
  -out Distribution.csr

# 2. Apple Developer 上传 CSR，下载证书
# 3. 导入证书
security import Distribution.cer -k ~/Library/Keychains/login.keychain

# 4. 创建 Provisioning Profile
# Certificates, Identifiers & Profiles → Profiles → 创建 App Store
```

## 二、Xcode 配置

### 2.1 设置 Bundle Identifier

```
Xcode → Project → TARGETS → MyApp → General
→ Identity → Bundle Identifier
```

### 2.2 配置 Signing

```
→ Signing & Capabilities → 自动签名
→ Team 选择你的开发者账号
```

### 2.3 App Icon 配置

1. Assets.xcassets → AppIcon → 拖入各尺寸图标
2. 必要尺寸：20pt、29pt、40pt、60pt、76pt、83.5pt（各 @1x/@2x/@3x）

### 2.4 应用名称

```
→ Display Name：我的应用
```

## 三、构建 Archive

### 3.1 Xcode GUI

```bash
# 1. 选择真机作为 Target（不是模拟器）
# 2. Product → Clean Build Folder (Cmd+Shift+K)
# 3. Product → Archive
# 4. 等待构建完成
# 5. Organizer 窗口打开，选择 Archive
# 6. Distribute App → App Store Connect → Upload
```

### 3.2 命令行构建

```bash
# 1. 生成 ExportOptions.plist
xcodebuild -exportArchive \
  -listSigningIdentities \
  -archivePath build/MyApp.xcarchive

# 2. 导出 ipa
xcodebuild -exportArchive \
  -archivePath build/MyApp.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath output/
```

## 四、上传到 App Store Connect

### 4.1 Transporter（推荐）

- App Store 下载 Transporter
- 用 Apple ID 登录
- 拖入 .ipa 文件
- 等待上传完成

### 4.2 命令行上传

```bash
xcrun altool --upload-app \
  -type iosapp \
  -f MyApp.ipa \
  -u "your@email.com" \
  -p "app-specific-password"
```

## 五、App Store Connect 配置

上传后，在 [App Store Connect](https://appstoreconnect.apple.com) 配置：

1. **App Information**
   - 名称、类别、版权

2. **定价与分发**
   - 价格、可用地区

3. **App Privacy**
   - 填写数据收集和使用情况

4. **App Store 截图**
   - iPhone 各尺寸截图（6.7"/6.5"/5.5"等）

5. **App 描述**
   - 详细描述、关键词、联系人

6. **审核信息**
   - 测试账号（如果需要）
   - 备注

## 六、审核注意事项

| 问题 | 解决 |
|------|------|
| 闪退 | 测试账号预装 App，真机测试 |
| 权限说明不清晰 | 隐私清单说明用途 |
| 元数据问题 | 截图/描述符合实际 |
| IPv6 问题 | RN 0.72+ 已修复 |

## 七、审核时间

- 首次提交：1-3 天
- 更新版本：通常 24 小时内
- 紧急修复：可选加急审核
