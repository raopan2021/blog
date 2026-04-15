# 通信机制

> JS 与 Native 之间如何通信

## 一、Bridge 通信（旧架构）

Bridge 是 JS 和 Native 的异步通信桥梁：

```javascript
// JS 调用 Native
NativeModules.CameraModule.takePicture()
  .then(uri => console.log(uri))
  .catch(err => console.error(err))

// 原理：
// 1. JS 端将方法名和参数序列化为 JSON
// 2. 通过 Bridge 发送到 Native
// 3. Native 处理后，将结果序列化为 JSON
// 4. 通过 Bridge 回调给 JS
```

## 二、BatchBridgeNativeModules

RN 在事件循环中批量处理 Bridge 消息，减少通信次数：

```javascript
// 多次 setState 会被合并为一次 UI 更新
setName('A')
setAge(25)
setAddress('Beijing')
// → 最终只触发一次 Native UI 更新
```

## 三、Native 调用 JS

### 3.1 事件发送

```javascript
// Native 端（iOS）
[RCTEventEmitter emitter];
[emitter sendEventWithName:@"onProgress" body:@{@"progress": 0.5}];

// JS 端监听
import { NativeEventEmitter } from 'react-native'
const emitter = new NativeEventEmitter(NativeModules.CameraModule)
emitter.addListener('onProgress', (e) => console.log(e.progress))
```

### 3.2 直接回调

```javascript
// Native 调用 JS 函数
[RCTBridge.batchedBridge.uiManagerModule
  dispatchViewManagerCommand:commandId
  command:@"updateProgress"
  args:@[@0.8]]
```

## 四、JSI 通信（新架构）

新架构中，JS 可以直接持有 Native 对象引用，绕过 Bridge：

```javascript
// 类似 Node.js 的原生模块调用方式
const nativeModule = require('NativeModule').get()
const result = nativeModule.syncMethod()  // 同步调用！

// 不再需要 Promise，调用更高效
```

## 五、自定义 Native Module 通信

### iOS (Swift)

```swift
@objc(MyModule)
class MyModule: NSObject {
  // 异步调用（Bridge）
  @objc func getDeviceName(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(UIDevice.current.name)
  }

  // 同步调用（JSI）
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
```

### Android (Kotlin)

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

## 六、通信性能优化

1. **减少 Bridge 调用**：批量操作，避免频繁通信
2. **使用事件**：多个 JS 组件监听同一 Native 事件用 NativeEventEmitter
3. **TurboModules**：新架构中优先使用 TurboModules
4. **避免大对象传递**：Bridge 序列化有开销，不要传大数组/图片

## 七、注意事项

1. **Bridge 是异步**：不能直接获取 Native 的同步返回值（除非用 sync 方法）
2. **iOS 和 Android 行为差异**：Bridge 通信在两端表现略有不同
3. **TurboModules 优先**：新项目建议直接用 TurboModules（需 RN 0.76+）
