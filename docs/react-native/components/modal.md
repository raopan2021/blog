# Modal 组件

> 模态弹窗，用于显示覆盖当前页面的内容

## 一、基础用法

```tsx
import { Modal, View, Text, Button } from 'react-native'

const [visible, setVisible] = useState(false)

<Modal
  visible={visible}
  transparent={true}          // 透明背景
  animationType="fade"        // 'none' | 'slide' | 'fade'
  onRequestClose={() => setVisible(false)}  // Android 返回键
>
  <View style={styles.overlay}>
    <View style={styles.content}>
      <Text>这是弹窗内容</Text>
      <Button title="关闭" onPress={() => setVisible(false)} />
    </View>
  </View>
</Modal>

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%'
  }
})
```

## 二、属性

| 属性 | 类型 | 说明 |
|------|------|------|
| visible | boolean | 是否显示 |
| transparent | boolean | 透明背景 |
| animationType | string | 动画类型 |
| onRequestClose | () => void | Android 返回键回调 |
| onShow | () => void | 显示后回调 |
| onDismiss | () => void | 关闭后回调 |

## 三、动画类型

```tsx
// 淡入淡出
<Modal animationType="fade" transparent={true}>

// 从底部滑入
<Modal animationType="slide" transparent={true}>
  <View style={styles.bottomSheet}>
    <View style={styles.handle} />
    {/* 内容 */}
  </View>
</Modal>

const styles = StyleSheet.create({
  bottomSheet: {
    marginTop: 'auto',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16
  }
})
```

## 四、全屏 Modal（iOS）

```tsx
<Modal
  visible={visible}
  presentationStyle="fullScreen"  // iOS only
  // 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen'
>
  <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <Button title="关闭" onPress={() => setVisible(false)} />
  </View>
</Modal>
```

## 五、注意事项

1. **Android 返回键**：必须在 `onRequestClose` 中关闭 Modal
2. **背景点击关闭**：需要自定义实现
3. **SafeArea**：Modal 默认不处理安全区域，需要在外层包 SafeAreaView
4. **嵌套 Modal**：RN 0.72+ 支持，建议尽量避免多层嵌套
