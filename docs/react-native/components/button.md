# Button 组件

> 简单的跨平台按钮组件

## 一、基础用法

```tsx
import { Button } from 'react-native'

const MyButton = () => {
  return (
    <Button
      title="点击我"
      onPress={() => console.log('点击')}
      color="#007AFF"
    />
  )
}
```

## 二、属性

| 属性 | 类型 | 说明 |
|------|------|------|
| title | string | 按钮文字 |
| onPress | () => void | 点击事件（必须） |
| color | string | 背景色（iOS 为文字色） |
| disabled | boolean | 是否禁用 |
| onLongPress | () => void | 长按事件 |

## 三、iOS vs Android 差异

| 方面 | iOS | Android |
|------|-----|---------|
| 样式 | 文字颜色由 color 控制 | 背景色由 color 控制 |
| 边框 | 圆角矩形 | 圆角矩形 |
| 高度 | 自适应文字 | 48dp 最小高度 |

## 四、样式受限

Button 样式定制能力弱，如果需要自定义样式，使用 TouchableOpacity 或 Pressable：

```tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center'
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
})
```

## 五、TouchableOpacity vs Pressable

| 组件 | 特点 |
|------|------|
| TouchableOpacity | 按下降低透明度 |
| Pressable | 更多交互 API，支持按压区域配置 |
| TouchableHighlight | 按下背景变暗 |
| TouchableWithoutFeedback | 无视觉反馈，仅响应事件 |

推荐使用 **Pressable**（React Native 0.63+）：

```tsx
import { Pressable, Text } from 'react-native'

<Pressable
  onPress={() => {}}
  onPressIn={() => console.log('按下')}
  onPressOut={() => console.log('抬起')}
  style={({ pressed }) => ({
    opacity: pressed ? 0.7 : 1,
  })}
>
  <Text>Pressable 按钮</Text>
</Pressable>
```
