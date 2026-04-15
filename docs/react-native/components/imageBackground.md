# ImageBackground 组件

> ImageBackground 是带背景图功能的容器组件，内部可放置任意子组件

## 一、基础用法

```tsx
import { ImageBackground, Text, StyleSheet } from 'react-native'

const WelcomeScreen = () => {
  return (
    <ImageBackground
      source={{ uri: 'https://example.com/bg.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>欢迎回来</Text>
        <Text style={styles.subtitle}>登录即表示同意用户协议</Text>
        <Button title="登录" onPress={handleLogin} />
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',  // 半透明遮罩
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 32
  }
})
```

## 二、属性

| 属性 | 类型 | 说明 |
|------|------|------|
| source | ImageSourcePropType | 图片源 |
| style | ViewStyle | 容器的样式 |
| imageStyle | ImageStyle | 背景图的样式 |
| resizeMode | ImageResizeMode | 填充模式 |
| children | ReactNode | 子组件 |

## 三、常用场景

### 3.1 卡片背景

```tsx
<ImageBackground
  source={require('./card-bg.png')}
  style={styles.card}
  imageStyle={styles.cardImage}
>
  <Text style={styles.cardTitle}>限时优惠</Text>
  <Text style={styles.cardDesc}>全场 5 折起</Text>
</ImageBackground>

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden'
  },
  cardImage: {
    borderRadius: 12
  }
})
```

### 3.2 全屏启动图

```tsx
const SplashScreen = () => {
  return (
    <ImageBackground
      source={require('./splash.png')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <ActivityIndicator size="large" color="#fff" />
    </ImageBackground>
  )
}
```

## 四、注意事项

1. **必须指定宽高**：父容器应有宽高，或设置 `width: '100%', height: xxx`
2. **子组件定位**：ImageBackground 是普通容器，子组件用普通 flexbox 定位
3. **叠加遮罩**：常用半透明黑色遮罩保证文字可读性
4. **性能**：大背景图建议压缩后使用，避免内存占用过高
