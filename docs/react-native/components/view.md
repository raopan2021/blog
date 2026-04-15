# View 组件

> View 是 React Native 中最基础的容器组件，相当于 HTML 的 div

## 一、基础用法

```tsx
import { View, Text, StyleSheet } from 'react-native'

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  }
})
```

## 二、常用属性

### 2.1 布局属性（Flexbox）

```tsx
<View style={{
  flexDirection: 'row',      // 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justifyContent: 'center',  // 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  alignItems: 'center',      // 'flex-start' | 'center' | 'flex-end' | 'stretch'
  flexWrap: 'wrap',          // 'wrap' | 'nowrap'
  flex: 1,                   // 占满可用空间
}}>
```

### 2.2 样式属性

```tsx
<View style={{
  backgroundColor: '#f0f0f0',
  padding: 10,
  margin: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  // RN 中无 box-shadow，使用 elevation (Android) 或 shadow (iOS)
  elevation: 4,             // Android 阴影
  shadowColor: '#000',       // iOS 阴影
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
}}>
```

### 2.3 触摸属性

```tsx
<View
  onTouchStart={() => console.log('touch start')}
  onTouchEnd={() => console.log('touch end')}
  onLongPress={() => console.log('long press')}
>
```

## 三、嵌套布局示例

```tsx
<View style={{ flex: 1, backgroundColor: '#fff' }}>
  {/* 头部 */}
  <View style={{ height: 60, backgroundColor: 'blue', padding: 16 }}>
    <Text style={{ color: '#fff' }}>Header</Text>
  </View>

  {/* 内容区 */}
  <View style={{ flex: 1, flexDirection: 'row' }}>
    {/* 侧边栏 */}
    <View style={{ width: 80, backgroundColor: '#eee' }}>
      <Text>Sidebar</Text>
    </View>
    {/* 主内容 */}
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Main Content</Text>
    </View>
  </View>

  {/* 底部 */}
  <View style={{ height: 50, backgroundColor: 'green' }}>
    <Text>Footer</Text>
  </View>
</View>
```

## 四、Android 特有：StatusBar

```tsx
import { StatusBar } from 'react-native'

// 控制状态栏
<StatusBar
  barStyle="dark-content"    // 'dark-content' | 'light-content'
  backgroundColor="transparent"
  translucent={true}          // 沉浸式状态栏
/>
```

## 五、注意事项

1. **View 默认 display: flex**，且 flexDirection 为 column
2. **RN 不支持 position: fixed**，用 `position: absolute` + `top/left/right/bottom`
3. **阴影需分别设置** Android (elevation) 和 iOS (shadow*)
4. **不能嵌套 Text 在 View 里直接显示文本**，需要用 Text 组件
