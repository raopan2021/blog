# 动画

> React Native 中实现动画的几种方式

## 一、Animated API（基础）

### 1.1 基础用法

```tsx
import { Animated, Text, View } from 'react-native'
import { useRef, useEffect } from 'react'

const FadeIn = () => {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true  // 优先使用原生驱动
    }).start()
  }, [])

  return (
    <Animated.View style={{ opacity }}>
      <Text>淡入动画</Text>
    </Animated.View>
  )
}
```

### 1.2 常用动画类型

```tsx
// 渐变
Animated.timing(opacity, {
  toValue: 1, duration: 300, useNativeDriver: true
}).start()

// 弹性
Animated.spring(scale, {
  toValue: 1,
  friction: 3,     // 摩擦力（越小越弹）
  tension: 40      // 张力
}).start()

// 顺序
Animated.sequence([
  Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
  Animated.spring(scale, { toValue: 1, useNativeDriver: true })
]).start()

// 并行
Animated.parallel([
  Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
  Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: true })
]).start()

// 循环
Animated.loop(
  Animated.timing(rotation, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true
  })
).start()
```

## 二、LayoutAnimation（简易布局动画）

```tsx
import { LayoutAnimation, UIManager, Platform } from 'react-native'

// Android 需要开启
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

// 状态切换时自动动画
const toggle = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  setExpanded(!expanded)
}
```

## 三、react-native-reanimated（推荐）

react-native-reanimated 在 UI 线程运行，性能更好：

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated'

const AnimatedButton = ({ onPress }) => {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  return (
    <Animated.View
      style={animatedStyle}
      onTouchStart={() => { scale.value = withSpring(0.9) }}
      onTouchEnd={() => {
        scale.value = withSpring(1)
        runOnJS(onPress)()
      }}
    >
      <Text>按钮</Text>
    </Animated.View>
  )
}
```

## 四、动画性能优化

| 原则 | 说明 |
|------|------|
| useNativeDriver | 位置、透明度动画用原生驱动 |
| 避免布局动画 | width/height 变化不用原生驱动 |
| 善用 Animated.Value | 不要在动画过程中创建新对象 |

## 五、注意事项

1. **useNativeDriver**：位置（translate）、透明度、旋转可以用，布局（width/height）不行
2. **Android 16.4+**：默认开启 LayoutAnimation
3. **复杂动画**：推荐使用 react-native-reanimated（支持手势驱动动画）
