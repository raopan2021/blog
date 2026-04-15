# 渲染流程

> React Native 如何将 JSX 渲染为原生 UI

## 一、渲染流程概览

```
用户交互 / 数据变化
        ↓
  React 重新渲染
        ↓
  Virtual DOM Diff
        ↓
  更新命令通过 Bridge
        ↓
  Native 渲染器处理
        ↓
  原生 UI 更新
```

## 二、React 渲染阶段

### 2.1 Render 阶段

```javascript
// JSX 被编译为 createElement 调用
const element = React.createElement('View', { style: {...} }, children)

// 创建 Virtual DOM
// React 计算需要更新什么（Diff）
```

### 2.2 Commit 阶段

```
Virtual DOM diff 结果
       ↓
生成批量更新命令
       ↓
通过 Bridge 发送到 Native
       ↓
Native UI Manager 创建/更新/删除原生视图
```

## 三、Native 渲染器

### 3.1 Old Architecture: RCTViewManager

```objc
// iOS: 每个 RN 组件对应一个 RCTViewManager
// RN 的 View → RCTViewManager → UIView

@interface RCTViewManager : NSObject
- (UIView *)view // 创建原生视图
- (RCTViewProperty祛除 *ShadowView) // 创建 shadow view (layout)
@end
```

### 3.2 New Architecture: Fabric

Fabric 是新的渲染系统：

```cpp
// Fabric 使用 C++ 实现，跨平台一致性更好
// Shadow Tree → MRI → Native View

// 特点：
// 1. 线程安全：不再依赖主线程
// 2. 并发渲染：支持 React 18 并发特性
// 3. 同步测量：layout 测量更快
```

## 四、UI 更新机制

### 4.1 批量更新

```javascript
// React 会批量处理更新
setCount(1)
setName('A')
setAge(25)
// → 只触发一次 Native UI 更新
```

### 4.2 Animated 动画

```javascript
// Animated API 的动画运行在原生层
const opacity = new Animated.Value(0)
Animated.timing(opacity, {
  toValue: 1,
  useNativeDriver: true  // 动画直接在 Native 执行
}).start()
// JS 线程完全不参与，性能好
```

## 五、Diff 算法

React Native 的 Diff 发生在 JS 线程：

```
新的 Virtual DOM 树
       ↓
与上次的 Virtual DOM 树对比
       ↓
生成最小更新命令
       ↓
发送到 Native
```

**优化策略**：
- 同层级比较，不同层级直接替换
- key 帮助识别跨层级移动
- 类型不同的组件直接卸载重建

## 六、性能关键点

| 优化点 | 说明 |
|--------|------|
| useNativeDriver | 位置/透明度动画在 Native 执行 |
| shouldComponentUpdate | 类组件中避免不必要的重渲染 |
| React.memo | 函数组件浅比较避免重渲染 |
| FlatList | 虚拟列表，只渲染可见行 |
| 减少 Bridge 调用 | 批量更新减少通信开销 |

## 七、iOS vs Android 渲染差异

| 方面 | iOS | Android |
|------|-----|---------|
| 渲染线程 | Main Thread | Main Thread |
| UI 框架 | UIKit | Android View 系统 |
| 文字渲染 | CoreText | Android 字体系统 |
| 图片缓存 | NSCache | LruCache |
| 动画 | CADisplayLink | Choreographer |
