# 样式

> React Native 中的样式系统，与 CSS 类似但使用 JavaScript 对象

## 一、基础用法

### 1.1 StyleSheet.create（推荐）

```tsx
import { StyleSheet, View, Text } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  }
})

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>标题</Text>
    </View>
  )
}
```

### 1.2 内联样式

```tsx
// 不推荐：每次渲染都创建新对象
<View style={{ flex: 1, padding: 16 }}>
  <Text style={{ fontSize: 16 }}>内容</Text>
</View>
```

### 1.3 样式数组

```tsx
<View style={[styles.container, styles.highlight, { padding: 8 }]}>
  {/* 数组中后面的样式会覆盖前面的同名属性 */}
</View>
```

## 二、单位与尺寸

```tsx
// RN 中所有尺寸都是 dp（密度无关像素），无需 px
// 数值直接写，不带单位

<View style={{
  width: 300,      // dp
  height: 200,     // dp
  padding: 16,     // dp
  margin: 8,       // dp
  borderWidth: 1,   // dp
  fontSize: 16,    // sp（字体）
}} />
```

## 三、颜色

```tsx
// 十六进制（常用）
color: '#FF5733'
color: '#F00'       // 缩写
color: '#FF000080'  // 带透明度

// RGB / RGBA
color: 'rgb(255, 87, 51)'
color: 'rgba(255, 87, 51, 0.5)'

// 颜色名称（部分支持）
color: 'red'
color: 'transparent'

// 系统颜色（iOS）
color: 'systemBlue'
```

## 四、阴影

```tsx
// RN 没有 box-shadow，需分别设置

// iOS 阴影
<View style={{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 4  // Android 阴影（无需 shadowOffset）
}} />

// Android 阴影
// 只需 elevation 属性
<View style={{ elevation: 4 }} />
```

## 五、渐变

RN 不支持 CSS 渐变，使用第三方库：

```tsx
// react-native-linear-gradient
import { LinearGradient } from 'react-native-linear-gradient'

<LinearGradient
  colors={['#4facfe', '#00f2fe']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ flex: 1 }}
>
  <Text>渐变背景</Text>
</LinearGradient>
```

## 六、主题样式

### 6.1 使用 Context

```tsx
const ThemeContext = createContext({
  colors: { primary: '#007AFF', background: '#fff', text: '#333' }
})

// Provider
const App = () => {
  const theme = useMemo(() => ({
    colors: isDark ? darkColors : lightColors
  }), [isDark])

  return (
    <ThemeContext.Provider value={theme}>
      <Content />
    </ThemeContext.Provider>
  )
}

// 消费
const Button = () => {
  const { colors } = useContext(ThemeContext)
  return <View style={{ backgroundColor: colors.primary }} />
}
```

## 七、注意事项

1. **没有 CSS selector**：不能像 CSS 那样选择子元素
2. **没有 inherit**：Text 子元素不会自动继承父 Text 样式
3. **样式不合并**：需要通过数组或 spread 手动合并
4. **borderRadius**：在 Android 圆形图片上需配合 `overflow: 'hidden'`
5. **textAlignVertical**：Android 多行 TextInput 默认顶部对齐，需显式设置
