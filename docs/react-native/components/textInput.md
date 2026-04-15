# TextInput 组件

> 文本输入框，用于用户输入文字

## 一、基础用法

```tsx
import { TextInput } from 'react-native'

const [text, setText] = useState('')

<TextInput
  value={text}
  onChangeText={setText}
  placeholder="请输入..."
  style={styles.input}
/>
```

## 二、常用属性

### 2.1 基础属性

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  placeholder="占位文字"
  placeholderTextColor="#999"
  maxLength={50}              // 最大字符数
  editable={true}             // 是否可编辑
  autoFocus={true}            // 自动聚焦
/>
```

### 2.2 键盘类型

```tsx
<TextInput
  keyboardType="default"    // 'default' | 'email-address' | 'numeric'
                             // 'phone-pad' | 'url' | 'number-pad' | 'decimal-pad'
  placeholder="请输入手机号"
/>
```

### 2.3 安全输入

```tsx
// 密码输入
<TextInput
  secureTextEntry={true}     // 隐藏输入内容
  passwordRules="minlength: 8"
/>

// iOS 清除按钮
<TextInput
  clearButtonMode="while-editing"  // 'never' | 'while-editing' | 'unless-editing' | 'always'
/>
```

### 2.4 多行输入

```tsx
<TextInput
  multiline={true}
  numberOfLines={4}
  textAlignVertical="top"   // Android 多行时文本对齐
  style={{ height: 100, textAlignVertical: 'top' }}
/>
```

### 2.5 样式

```tsx
<TextInput
  style={{
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16
  }}
/>
```

## 三、受控与非受控

```tsx
// 受控组件（推荐）
const [text, setText] = useState('')
<TextInput value={text} onChangeText={setText} />

// 非受控组件
const inputRef = useRef(null)
<TextInput
  defaultValue="初始值"
  ref={inputRef}
  onSubmitEditing={() => inputRef.current.blur()}
/>
```

## 四、事件处理

```tsx
<TextInput
  onChangeText={(text) => console.log(text)}
  onFocus={() => console.log('聚焦')}
  onBlur={() => console.log('失焦')}
  onSubmitEditing={() => console.log('提交')}
  onKeyPress={({ nativeEvent }) => {
    if (nativeEvent.key === 'Backspace') console.log('删除')
  }}
  returnKeyType="done"    // 'done' | 'go' | 'search' | 'send' | 'next'
/>
```

## 五、常用场景

### 5.1 搜索框

```tsx
const SearchBar = () => {
  const [keyword, setKeyword] = useState('')

  return (
    <View style={styles.container}>
      <TextInput
        value={keyword}
        onChangeText={setKeyword}
        placeholder="搜索..."
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={() => search(keyword)}
      />
      <TouchableOpacity onPress={() => search(keyword)}>
        <Text>搜索</Text>
      </TouchableOpacity>
    </View>
  )
}
```

## 六、注意事项

1. **Android 底部线条样式**：用 `underlineColorAndroid="transparent"` 去除
2. **iOS 圆角**：需自行设置 `borderRadius` 和 `overflow: 'hidden'`
3. **iOS 键盘收起**：需配合 `KeyboardAvoidingView` 使用
4. **中文输入**：RN 0.72+ 对中文输入支持较好，旧版本可能有输入候选框问题
