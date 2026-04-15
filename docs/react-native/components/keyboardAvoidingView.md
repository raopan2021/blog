# KeyboardAvoidingView 组件

> 自动调整视图位置，避免键盘遮挡输入框

## 一、基础用法

```tsx
import {
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  View
} from 'react-native'

const LoginScreen = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <TextInput
          placeholder="用户名"
          style={styles.input}
        />
        <TextInput
          placeholder="密码"
          secureTextEntry
          style={styles.input}
        />
        <Button title="登录" onPress={handleLogin} />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    padding: 16
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12
  }
})
```

## 二、behavior 属性

| OS | 推荐值 | 说明 |
|----|--------|------|
| iOS | `padding` | 向上移动键盘高度的距离 |
| iOS | `height` | 通过减少高度来避开键盘 |
| Android | `height` | padding 在 Android 效果不稳定 |
| Android | `none` | 不做处理 |

## 三、配合 ScrollView 使用

```tsx
const FormScreen = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <TextInput placeholder="邮箱" />
          <TextInput placeholder="密码" />
          <TextInput placeholder="确认密码" />
          <Button title="注册" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
```

## 四、keyboardVerticalOffset

```tsx
// iOS Modal 中使用时，可能需要调整偏移
<KeyboardAvoidingView
  behavior="padding"
  keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}  // 90 ≈ 状态栏+导航栏高度
>
```

## 五、Together 整体模板

```tsx
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TextInput,
  Button
} from 'react-native'

const LoginScreen = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.form}>
            <TextInput placeholder="用户名" />
            <TextInput placeholder="密码" />
            <Button title="登录" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
```

## 六、注意事项

1. **必须包住内容**：KeyboardAvoidingView 需要有明确的 height
2. **Platform 判断**：iOS 和 Android 行为不同，必须分别处理
3. **keyboardShouldPersistTaps**：`handled` 使点击输入框外时收起键盘
4. **Android height 模式**：在 Android 上可能无法完美贴合键盘高度
