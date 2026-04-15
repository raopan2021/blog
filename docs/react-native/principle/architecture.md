# 架构原理

> React Native 的整体架构与核心原理

## 一、整体架构

React Native 采用三层架构：

```
┌─────────────────────────────────────────┐
│              JavaScript 层               │
│    React 组件、状态管理、业务逻辑         │
│         (React Core / Business Logic)    │
└────────────────────┬────────────────────┘
                     │ Bridge (异步 JSON)
┌────────────────────▼────────────────────┐
│              Bridge 层                   │
│   JSON 序列化 / 反序列化，异步通信        │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│              Native 层                   │
│   iOS (Objective-C/Swift)               │
│   Android (Java/Kotlin)                 │
│   UI 组件、系统 API、原生模块            │
└─────────────────────────────────────────┘
```

## 二、旧架构 (Bridge)

JS 与 Native 通过 Bridge 异步通信：

```javascript
// JS 端
NativeModules.ModuleName.method()
  .then(result => console.log(result))

// 原理：消息被序列化为 JSON，通过 Bridge 发送到 Native
// Native 处理后，结果同样序列化为 JSON 返回
```

**问题**：
- JSON 序列化/反序列化开销大
- 异步通信，无法同步调用
- JS 和 Native 数据格式转换复杂

## 三、新架构 (0.76+) - JSI + TurboModules + Fabric

```
┌─────────────────────────────────────────┐
│           JavaScript (Hermes)            │
│              直接调用 Native              │
└────────────────────┬────────────────────┘
                     │ JSI (同步 C++ 接口)
┌────────────────────▼────────────────────┐
│        TurboModules (原生模块)           │
│    同步调用 / 懒加载 / 类型安全            │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│      Fabric Renderer (渲染器)            │
│      并发渲染 / 新线程模型                │
└─────────────────────────────────────────┘
```

**核心改进**：
- **JSI**：JavaScript Interface，C++ 直接调用原生模块，同步通信
- **TurboModules**：新原生模块系统，支持同步调用、懒加载
- **Fabric**：新渲染器，支持并发渲染和 React 18 并发特性

## 四、Hermes 引擎

Facebook 优化的 JavaScript 引擎：

- **AOT 编译**：启动时执行字节码，无需解析 JS 源码，启动快
- **优化 GC**：减少内存碎片和 GC 停顿
- **体积小**：比 JSC 小约 30%

```java
// android/app/build.gradle
project.ext.react = [
    enableHermes: true  // 默认开启
]
```

## 五、JSX 如何变成 UI

```
JSX 代码
   ↓
React.createElement()
   ↓
Virtual DOM (JS 对象)
   ↓
Bridge (JSON 序列化)
   ↓
Native 层
   ↓
原生 UI 组件
```

## 六、New Architecture 开启

```java
// android/gradle.properties
newArchEnabled=true  // 改为 true 开启新架构
```

```swift
// iOS: ios/Podfile
ENV['RCT_NEW_ARCH_ENABLED'] = '1'
```

新架构带来：
- 启动速度提升约 30%
- 滚动帧率更稳定
- TurboModules 懒加载
- React 18 并发模式支持
