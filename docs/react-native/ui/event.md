# 事件处理

> React Native 中的触摸事件和手势处理

## 一、触摸事件

RN 组件都支持触摸事件：

| 事件 | 说明 |
|------|------|
| onPressIn | 按下时触发 |
| onPressOut | 松开时触发 |
| onPress | 点击完成时触发 |
| onLongPress | 长按（500ms+）触发 |

### 1.1 基本使用

```tsx
<TouchableOpacity
  onPressIn={() => console.log('按下')}
  onPressOut={() => console.log('抬起')}
  onPress={() => console.log('点击完成')}
  onLongPress={() => console.log('长按')}
>
  <Text>点击我</Text>
</TouchableOpacity>
```

### 1.2 事件对象

```tsx
const handlePress = (event: PanResponderResponderSyntheticEvent) => {
  const { locationX, locationY } = event.nativeEvent
  // locationX/Y 是相对于元素自身的坐标
  console.log(locationX, locationY)
}
```

## 二、手势处理

### 2.1 PanResponder（基础）

```tsx
import { View, PanResponder, StyleSheet } from 'react-native'

const Draggable = () => {
  const pan = useRef(new Animated.ValueXY()).current

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (e, gestureState) => {
        // 释放时回到原位
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true
        }).start()
      }
    })
  ).current

  return (
    <Animated.View
      style={[styles.box, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    />
  )
}
```

### 2.2 react-native-gesture-handler（推荐）

```tsx
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

const SwipeableRow = () => {
  const translateX = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = Math.max(0, e.translationX)
    })
    .onEnd((e) => {
      if (e.translationX > 100) {
        // 滑动超过100px，执行删除等操作
      }
      translateX.value = withSpring(0)
    })

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <Text>可滑动的行</Text>
      </Animated.View>
    </GestureDetector>
  )
}
```

## 三、触摸反馈

### 3.1 TouchableOpacity

```tsx
// 按下时降低透明度（默认 0.2）
<TouchableOpacity
  activeOpacity={0.6}  // 自定义透明度
  onPress={handlePress}
>
```

### 3.2 Pressable（0.63+，推荐）

```tsx
import { Pressable, Text } from 'react-native'

<Pressable
  onPress={handlePress}
  onLongPress={handleLongPress}
  delayLongPress={800}  // 长按触发时间，默认500ms
  style={({ pressed }) => ({
    opacity: pressed ? 0.7 : 1,
    transform: [{ scale: pressed ? 0.98 : 1 }]
  })}
>
  <Text>按钮</Text>
</Pressable>
```

## 四、事件穿透

```tsx
// 底层 View 设置 pointerEvents 阻止事件穿透
<View pointerEvents="none">
  {/* 这个 View 上的触摸事件会穿透到下层 */}
</View>

// 可选值：
// 'auto' - 默认，可接收触摸
// 'none' - 不接收触摸，穿透
// 'box-none' - 自身不接收，子元素可接收
// 'box-only' - 自身接收，子元素穿透
```

## 五、注意事项

1. **事件冲突**：避免在同一个 View 上同时使用 onPress 和 PanResponder
2. **手势库**：复杂手势（滑动解锁、缩放）推荐用 react-native-gesture-handler
3. **性能**：避免在触摸回调中执行复杂计算或 setState
