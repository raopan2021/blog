# React Native 项目结构

## 一、典型项目结构

```
MyProject/
├── android/                    # Android 原生项目
│   ├── app/
│   │   └── src/main/
│   │       ├── java/          # Java/Kotlin 源码
│   │       └── res/           # Android 资源
│   ├── build.gradle           # 项目级构建配置
│   └── settings.gradle        # 项目设置
├── ios/                       # iOS 原生项目
│   ├── MyProject/
│   │   ├── AppDelegate.mm     # iOS 入口
│   │   └── Info.plist         # iOS 配置
│   └── Podfile               # CocoaPods 依赖
├── src/                       # JS/TS 源码（自定义）
│   ├── components/           # 组件
│   ├── screens/               # 页面
│   ├── navigation/            # 导航
│   ├── store/                # 状态管理
│   ├── services/             # API 服务
│   ├── utils/                # 工具函数
│   └── assets/               # 静态资源
├── __tests__/                # 测试文件
├── App.tsx                   # 应用入口
├── index.js                  # RN 入口（必须）
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
└── react-native.config.js
```

## 二、关键文件说明

### 2.1 index.js（入口）

```javascript
import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'

// 注册应用（必须）
AppRegistry.registerComponent(appName, () => App)
```

### 2.2 App.tsx（根组件）

```tsx
import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './src/navigation/AppNavigator'

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 }
})

export default App
```

### 2.3 app.json

```json
{
  "name": "MyProject",
  "displayName": "我的应用"
}
```

### 2.4 metro.config.js

Metro bundler 配置文件：

```javascript
const { getDefaultConfig } = require('metro-config')

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig()
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer')
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg']
    }
  }
})()
```

## 三、Android vs iOS 差异

| 方面 | Android | iOS |
|------|---------|-----|
| 入口文件 | `MainActivity.java` | `AppDelegate.mm` |
| 应用图标 | `android/app/src/main/res/mipmap-*/ic_launcher.png` | Xcode Asset Catalog |
| 应用名称 | `android/app/src/main/res/values/strings.xml` | Info.plist |
| 原生模块位置 | `android/app/src/main/java/...` | `ios/LocalPods/` |
| 打包命令 | `./gradlew assembleRelease` | Xcode Archive |

## 四、资源文件

### 4.1 应用图标

```bash
# Android 图标目录
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png    # 48x48
├── mipmap-hdpi/ic_launcher.png    # 72x72
├── mipmap-xhdpi/ic_launcher.png   # 96x96
├── mipmap-xxhdpi/ic_launcher.png  # 144x144
└── mipmap-xxxhdpi/ic_launcher.png # 192x192

# iOS 图标
# 通过 Xcode Asset Catalog 管理
```

### 4.2 启动屏

```bash
# Android: android/app/src/main/res/drawable/launch_screen.xml
# iOS: ios/MyProject/Images.xcassets/LaunchImage.launchimage
```

## 五、热更新配置

```javascript
// 启用 Hermes
// android/app/build.gradle
project.ext.react = [
    enableHermes: true
]
```
