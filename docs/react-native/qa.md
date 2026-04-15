# React Native 常见问题与解决方案

> React Native 开发中的实际问题及解决方案

## ⚙️ 环境问题

### 1. Node 版本不兼容

**问题**: 项目需要特定 Node 版本。

```bash
# 查看当前版本
node -v

# 使用 nvm 切换版本
nvm install 18
nvm use 18
```

### 2. CocoaPods 安装失败

```bash
# 清理缓存重新安装
cd ios
pod deintegrate
pod install --repo-update

# 或手动执行
cd ios
rm -rf Pods Podfile.lock
pod install
```

### 3. iOS 构建失败 (xcodebuild)

```bash
# 清理构建
xcodebuild clean -workspace App.xcworkspace -scheme App

# 查看详细错误
xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug -sdk iphonesimulator build 2>&1 | tail -50

# 确保 Xcode Command Line Tools
xcode-select --install
```

### 4. Android 构建失败

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

---

## 🖼️ 图片相关

### 5. 图片不显示

```tsx
// ❌ 错误：Android 资源需用 require
<Image source={{ uri: 'asset:/logo.png' }} />

// ✅ Android drawable 图片
<Image source={require('./assets/logo.png')} />

// ✅ 网络图片
<Image source={{ uri: 'https://example.com/logo.png' }} 
       style={{ width: 100, height: 100 }} />

// ✅ 必须指定尺寸
<Image source={{ uri: '...' }} 
       style={{ width: 200, height: 200 }}
       resizeMode="contain" />
```

### 6. Android 图片闪烁

```tsx
// 使用 FastImage 替代 Image
import FastImage from 'react-native-fast-image'

<FastImage
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

---

## 🗂️ 列表与滚动

### 7. FlatList 白屏或闪烁

```tsx
// ❌ 缺少关键属性
<FlatList data={items} renderItem={renderItem} />

// ✅ 正确配置
<FlatList
  data={items}
  renderItem={({ item }) => <ListItem item={item} />}
  keyExtractor={item => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  windowSize={5} // 减少内存占用
  maxToRenderPerBatch={10}
  removeClippedSubviews={true} // Android 性能优化
/>
```

### 8. 列表中使用 RefreshControl 失效

```tsx
// RefreshControl 必须在 FlatList 属性中
<FlatList
  refreshing={refreshing}
  onRefresh={handleRefresh}
  // ❌ 不要放在 renderItem 中
/>
```

---

## 🧭 导航问题

### 9. 导航返回不刷新页面

```tsx
// ✅ 使用 useIsFocused
import { useIsFocused } from '@react-navigation/native'

const MyScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused()
  
  useEffect(() => {
    if (isFocused) {
      fetchData() // 每次进入都刷新
    }
  }, [isFocused])

  return <View />
}

// ✅ 或使用 focus 事件
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    fetchData()
  })
  return unsubscribe
}, [navigation])
```

### 10. 底部 TabBar 被内容遮挡

```tsx
// 在外层加 SafeAreaView
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <NavigationContainer>
        <Tab.Navigator>
          {/* ... */}
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  </SafeAreaProvider>
)
```

---

## ⌨️ 键盘问题

### 11. 键盘遮挡输入框

```tsx
// 使用 KeyboardAvoidingView
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <TextInput placeholder="Enter text" />
  </ScrollView>
</KeyboardAvoidingView>
```

### 12. 键盘 dismiss

```tsx
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

// 点击空白处 dismiss
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <View style={{ flex: 1 }}>
    <TextInput />
  </View>
</TouchableWithoutFeedback>
```

---

## 📨 网络请求

### 13. Fetch 请求失败无提示

```tsx
// ✅ 添加超时和错误处理
const fetchData = async () => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      Toast.show('请求超时')
    } else {
      Toast.show('网络错误')
    }
  }
}
```

---

## 📱 原生交互

### 14. 调用原生模块报错

```tsx
// iOS: 确保在 @objc 注解的方法中
@objc(MyModule)
class MyModule: NSObject {
  @objc func getDeviceName(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(UIDevice.current.name)
  }

  @escaping 注解必须加
  static requiresMainQueueSetup() 返回 false 可在后台线程
}
```

### 15. Android Hermes 启用后 API 不兼容

```java
// android/app/build.gradle
project.ext.react = [
    enableHermes: true  // 确保为 true
]
```

---

## 🔐 安全问题

### 16. 敏感数据存储

```tsx
// ❌ 绝对不要用 AsyncStorage 存敏感信息
await AsyncStorage.setItem('token', 'xxx')

// ✅ 使用 Keychain (iOS) / Keystore (Android)
import * as Keychain from 'react-native-keychain'

await Keychain.setGenericPassword('token', 'xxx', {
  service: 'myapp'
})

// 读取
const credentials = await Keychain.getGenericPassword({ service: 'myapp' })
```

---

## 🔄 状态管理

### 17. 跨组件状态同步

```tsx
// ✅ Zustand 示例
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
}))

// 任何组件中使用
const Counter = () => {
  const { count, increment } = useStore()
  return <Button onPress={increment}>{count}</Button>
}
```

---

## 🏗️ 性能优化

### 18. 大数据列表内存泄漏

```tsx
// 使用 FlatList 的优化属性
<FlatList
  data={largeDataset}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  // 减少同时渲染的 item 数量
  maxToRenderPerBatch={10}
  // 间隔更新
  updateCellsBatchingPeriod={50}
  // 不渲染屏幕外的 item
  removeClippedSubviews={true}
  // 初始渲染数量
  initialNumToRender={10}
  // 视口渲染
  windowSize={5}
/>
```

### 19. 避免在 render 中创建对象/函数

```tsx
// ❌ 每次渲染都创建新对象
return <Child style={{ width: 100, height: 100 }} onPress={() => doSomething()} />

// ✅ 使用 useMemo / useCallback
const style = useMemo(() => ({ width: 100, height: 100 }), [])
const handlePress = useCallback(() => doSomething(), [])

return <Child style={style} onPress={handlePress} />
```

---

## 📦 新架构 (New Architecture)

### 20. TurboModule / Fabric 兼容性问题

```tsx
// 检查库是否支持 New Architecture
// 在 android/gradle.properties 中
newArchEnabled=true

// 如果库不兼容，回退到旧架构
newArchEnabled=false
```

### 21. Reanimated 3.x 动画不工作

```tsx
// 确保在 babel.config.js 中配置
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'], // 必须在最后
}

// 在组件中使用
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated'

const AnimatedView = () => {
  const opacity = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))
  return <Animated.View style={animatedStyle} />
}
```
