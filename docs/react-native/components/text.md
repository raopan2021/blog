# Text 组件

> Text 用于显示文本内容，是 RN 中最常用的组件之一

## 一、基础用法

```tsx
import { Text } from 'react-native'

const MyComponent = () => {
  return (
    <View>
      <Text>普通文本</Text>
      <Text style={{ fontSize: 20, color: 'red' }}>红色大文本</Text>
    </View>
  )
}
```

## 二、常用属性

### 2.1 文本样式

```tsx
<Text style={{
  fontSize: 16,              // 字号
  fontWeight: 'bold',        // 'normal' | 'bold' | '100' ~ '900'
  color: '#333',             // 颜色
  fontFamily: 'System',      // 字体（iOS 支持更多）
  lineHeight: 24,            // 行高
  textAlign: 'center',       // 'auto' | 'left' | 'right' | 'center'
  textDecorationLine: 'underline',  // 'none' | 'underline' | 'line-through'
  letterSpacing: 2,           // 字间距
}}>
```

### 2.2 嵌套文本（部分样式）

```tsx
<Text>
  这是普通文本
  <Text style={{ fontWeight: 'bold', color: 'red' }}>
    这里加粗红色
  </Text>
  又是普通文本
</Text>
```

### 2.3 数字、链接等特殊文本

```tsx
<Text
  numberOfLines={2}           // 限制行数
  ellipsizeMode="tail"        // 'head' | 'middle' | 'tail' | 'clip'
  selectable={true}           // 可选择复制
>
  这是一段超长的文本，会在超过两行时被截断...
</Text>
```

### 2.4 onPress 事件

```tsx
<Text
  onPress={() => console.log('点击')}
  onLongPress={() => console.log('长按')}
  style={{ color: 'blue' }}
>
  可点击的文本
</Text>
```

## 三、实际示例

```tsx
const ArticleTitle = () => {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
        React Native 入门指南
      </Text>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
        作者：张三 · 2024-01-15
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 24 }}>
        React Native 是 Facebook 开源的跨平台移动开发框架，
        使用 JavaScript 和 React 构建原生应用。
        {'\n\n'}
        本文将介绍 React Native 的基础知识和开发环境搭建。
      </Text>
    </View>
  )
}
```

## 四、注意事项

1. **样式不继承**：Text 的子 Text 不会自动继承父 Text 的样式，需单独设置
2. **必须包在 View 里**：Text 不能直接放在 ViewGroup 下
3. **换行**：使用 `{'\n'}` 或 `\n` 实现换行
4. **长文本截断**：结合 `numberOfLines` 使用
