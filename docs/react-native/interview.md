# React Native 核心面试题

> React Native 开发常见面试题整理

## ⭐ 基础题

### 1. React Native 是什么？

Facebook 开源的跨平台移动端开发框架，使用 JavaScript 和 React 构建 iOS/Android 原生应用。

**核心特点**:
- 一次学习，多平台编写（iOS + Android）
- 组件化开发
- 使用 JavaScript，门槛低
- 热更新能力

### 2. React Native 工作原理

```
JavaScript 代码
      ↓
Metro Bundler 打包
      ↓
JS Bundle (Hermes 引擎执行)
      ↓
Bridge (异步通信)
      ↓
Native Modules (原生模块)
      ↓
UI 渲染 / 系统 API
```

**关键组件**:
- **JS Engine**: Hermes (优化后的 JS 引擎)
- **Bridge**: JS 和 Native 的通信桥梁（JSON 序列化，异步）
- **Native Modules**: 原生功能暴露给 JS

### 3. React Native vs Flutter vs Cordova

| | RN | Flutter | Cordova |
|--|---|--------|---------|
| 语言 | JavaScript | Dart | JavaScript |
| 渲染 | 原生组件 | Skia 自绘 | WebView |
| 性能 | 较好 | 优秀 | 一般 |
| 生态 | 成熟 | 快速成长 | 成熟 |
| 上手 | 容易 | 较难 | 容易 |

### 4. RN 有哪些内置组件？

核心组件：
- `View` - 容器
- `Text` - 文本
- `Image` - 图片
- `TextInput` - 输入框
- `ScrollView` - 滚动容器
- `FlatList` - 高性能列表
- `SectionList` - 分组列表
- `Button` - 按钮
- `Switch` - 开关
- `Modal` - 模态框
- `ActivityIndicator` - 加载指示器
- `TouchableOpacity` / `TouchableHighlight` - 可触摸组件

---

## ⭐⭐ 中级题

### 5. FlatList vs ScrollView

| | FlatList | ScrollView |
|--|----------|------------|
| 渲染方式 | 按需渲染（虚拟化） | 一次性渲染全部 |
| 数据量 | 大列表（千万级） | 小数据 |
| 性能 | 高 | 低 |
| 功能 | 支持下拉刷新、加载更多 | 功能丰富 |
| 必须属性 | data, renderItem, keyExtractor | 无 |

```tsx
// FlatList 虚拟化 - 只渲染可见区域
<FlatList
  data={items}
  renderItem={({ item }) => <ListItem item={item} />}
  keyExtractor={item => item.id}
  onEndReached={loadMore} // 加载更多
  onRefresh={refresh}     // 下拉刷新
/>
```

### 6. RN 中的样式系统

RN 使用 JavaScript 编写样式，类似 CSS 但有差异：

```tsx
// 1. 使用 StyleSheet.create 优化性能
const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, color: '#333' }
})

// 2. Flexbox 布局
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <View style={{ flex: 1 }} />
  <View style={{ flex: 2 }} />
</View>

// 3. 样式继承
// ❌ Text 的样式不会自动继承子 Text
// ✅ 需要手动设置
<Text style={{ color: 'red' }}>
  <Text style={{ fontSize: 16 }}>子文本</Text> {/* 仍是默认色 */}
</Text>
```

### 7. RN 中的定位方式

RN 使用 Flexbox 定位，不支持 `position: fixed`：

```tsx
// ✅ 覆盖在底部的元素
<View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
  <Text>底部</Text>
</View>

// ✅ 居中
<View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
  <Text>居中</Text>
</View>
```

### 8. 组件生命周期

```
挂载 (Mounting)
  → constructor()
  → render()
  → componentDidMount()

更新 (Updating)
  → render()
  → componentDidUpdate()

卸载 (Unmounting)
  → componentWillUnmount()
```

函数组件使用 `useEffect` 模拟：

```tsx
useEffect(() => {
  // componentDidMount + componentDidUpdate (deps 变化时)
  doSomething()
  return () => {
    // componentWillUnmount
    cleanup()
  }
}, [dep]) // deps 变化时触发
```

### 9. Bridge vs New Architecture

**Old Architecture (Bridge)**:
- JS 和 Native 通过 JSON 异步通信
- 有性能瓶颈（序列化/反序列化）
- Bridge 模式

**New Architecture (0.76+)**:
- **TurboModules**: 同步调用原生模块
- **Fabric**: 新的渲染器，支持并发渲染
- **Codegen**: 自动生成类型安全的 Native Module 代码

### 10. Hermes 引擎

Facebook 优化的 JS 引擎：

- **预编译**: AOT 编译字节码，启动快
- **优化 GC**: 更少的内存占用
- **缩小体积**: 比 JSC 更小

```gradle
// android/app/build.gradle
project.ext.react = [
    enableHermes: true  // 默认开启
]
```

---

## ⭐⭐⭐ 高级题

### 11. RN 性能优化手段

1. **列表优化**: 使用 FlatList / FlashList 替代 ScrollView
2. **图片优化**: 使用 FastImage，本地图片 require
3. **缓存优化**: 使用 react-native-mmkv 替代 AsyncStorage
4. **动画优化**: 使用 react-native-reanimated（UI 线程）
5. **减少重渲染**: React.memo、useMemo、useCallback
6. **代码分割**: babel-preset-expo 或懒加载
7. **减少 Bridge 调用**: 批量操作，减少通信次数

### 12. react-native-reanimated 工作原理

不同于 RN 内置 Animated API，reanimated 在 **UI 线程** 运行动画，不受 JS 线程影响：

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated'

const AnimatedBox = () => {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  return (
    <Animated.View
      style={animatedStyle}
      onTouchStart={() => {
        scale.value = withSpring(1.2)  // 弹簧动画
      }}
      onTouchEnd={() => {
        scale.value = withTiming(1)     // 时间动画
      }}
    />
  )
}
```

### 13. 手势处理

react-native-gesture-handler 配合 reanimated：

```tsx
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

const Draggable = () => {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX
      translateY.value = e.translationY
    })
    .onEnd(() => {
      translateX.value = withSpring(0)
      translateY.value = withSpring(0)
    })

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={{ transform: [{ translateX }, { translateY }] }} />
    </GestureDetector>
  )
}
```

### 14. Native Module 开发

**iOS (Swift)**:
```swift
@objc(MyModule)
class MyModule: NSObject {
  @objc func getDeviceName(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(UIDevice.current.name)
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}

// 注册
@objc func constantsToExport() -> [String: Any]! {
  return [:]
}
```

**Android (Kotlin)**:
```kotlin
class MyModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "MyModule"

    @ReactMethod
    fun getDeviceName(promise: Promise) {
        promise.resolve(android.os.Build.MODEL)
    }
}
```

### 15. RN 状态管理方案

| 方案 | 适用场景 | 复杂度 |
|------|---------|--------|
| Context API | 简单全局状态 | 低 |
| Zustand | 中小型应用 | 低 |
| Redux + Redux Toolkit | 大型复杂应用 | 高 |
| MobX | 响应式数据流 | 中 |

```tsx
// Zustand 示例
import { create } from 'zustand'

interface AppStore {
  count: number
  increment: () => void
}

const useStore = create<AppStore>((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
}))

// 使用
const Counter = () => {
  const { count, increment } = useStore()
  return <Button onPress={increment}>{count}</Button>
}
```

### 16. RN 网络请求

```tsx
// ✅ Fetch API
const fetchData = async () => {
  try {
    const res = await fetch('https://api.example.com/data')
    const json = await res.json()
    setData(json)
  } catch (err) {
    console.error(err)
  }
}

// ✅ Axios（推荐）
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
})

// 请求拦截
api.interceptors.request.use(config => {
  const token = await getToken()
  config.headers.Authorization = `Bearer ${token}`
  return config
})
```

### 17. 安全考虑

```tsx
// 1. 敏感数据不存 AsyncStorage
// ✅ 用 Keychain/Keystore

// 2. HTTPS
// 确保所有 API 使用 HTTPS

// 3. 代码混淆
// android: enableProguardInReleaseBuilds

// 4. 防止调试
if (__DEV__) {
  // 开发环境特殊处理
}

// 5. 证书锁定 (Certificate Pinning)
// 使用 react-native-ssl-pinning
```

### 18. 热更新

```tsx
// CodePush (微软)
// AppCenter → 部署 → 更新推送

// 配置
// AppRegistry.registerComponent('App', () => App)

// 客户端检查更新
import CodePush from 'react-native-code-push'

const App = () => {
  return (
    <CodePush checkForUpdate={...}>
      <Root />
    </CodePush>
  )
}
```

### 19. 调试技巧

```tsx
// 1. Flipper 调试
// npx react-native run-android --reverse
// open http://facebook.github.io/react-native/docs/debugging

// 2. 日志
console.log('debug info')
console.warn('warning')
console.error('error', error)

// 3. RN Debugger
// Chrome DevTools → React DevTools

// 4. Performance Monitor
// iOS: In instruments
// Android: Systrace
```

### 20. 打包发布流程

**iOS**:
1. Apple Developer 账号
2. Xcode → Archive → Validate → Distribute
3. TestFlight / App Store Connect

**Android**:
```bash
# 生成签名
keytool -genkey -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias

# 配置 gradle
# android/app/build.gradle
signingConfigs {
  release {
    storeFile file('my-release-key.keystore')
    storePassword 'password'
    keyAlias 'my-key-alias'
    keyPassword 'password'
  }
}

# 构建
cd android && ./gradlew assembleRelease
```

---

## ⭐⭐⭐⭐ 架构题

### 21. React Native 新架构

React Native 0.76+ 默认开启 New Architecture：

| 组件 | Old | New |
|------|-----|-----|
| JS-Native 通信 | Bridge (异步 JSON) | JSI (同步 C++) |
| 渲染器 | Legacy Renderer | Fabric Renderer |
| Native Modules | Bridge Modules | TurboModules |
| 渲染 | 串行 | 并发（Concurrent Rendering）|

**TurboModules**:
- 懒加载，按需初始化
- 同步调用（不再等待 JSON 序列化）
- 类型安全（CodeGen 生成）

### 22. RN 与原生模块通信

**Old**: Bridge (JSON, 异步)

**New**: JSI (JavaScript Interface)
```cpp
// C++ 接口
std::shared_ptr<CallInvoker> invoke;
TurboModule::initModule();

binding->registerCallable("getDeviceName", [](auto args) {
  return UIDevice.current.name;
});
```

### 23. 如何做 RN 性能监控？

1. **JS 端**: 使用 `react-native-performance` 或自定义埋点
2. **Native 端**: Flipper (Network/FPS/Memory 插件)
3. **崩溃监控**: Sentry
4. **APM**: Firebase Performance / New Relic

```tsx
import { startTracing, stopTracing } from 'react-native-performance'

// 监控
startTracing('api_call')
await fetchData()
stopTracing('api_call')
```

### 24. RN 首屏优化

1. 减少 Bundle 体积（代码分割）
2. Hermes AOT 编译
3. 骨架屏 / 启动屏
4. 按需加载 Native 模块
5. 图片预加载
6. Hermes 字节码缓存
