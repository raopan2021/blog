# Switch 组件

> 开关选择器，用于布尔值切换

## 一、基础用法

```tsx
import { Switch } from 'react-native'

const [enabled, setEnabled] = useState(false)

// 受控
<Switch
  value={enabled}
  onValueChange={setEnabled}
/>

// 非受控（默认值）
<Switch
  defaultValue={false}
  onValueChange={(value) => console.log(value)}
/>
```

## 二、样式定制

```tsx
// iOS 颜色
<Switch
  value={enabled}
  onValueChange={setEnabled}
  trackColor={{ false: '#767577', true: '#81b0ff' }}
  thumbColor={enabled ? '#f5dd4b' : '#f4f3f4'}
/>

// iOS 关闭时拇指颜色（Android 5.0+）
<Switch
  value={enabled}
  onValueChange={setEnabled}
  ios_backgroundColor="#ccc"
/>

// Android 拇指颜色
<Switch
  value={enabled}
  onValueChange={setEnabled}
  thumbTintColor="#f5dd4b"   // Android only
  trackTintColor="#81b0ff"   // Android only
/>
```

## 三、禁用状态

```tsx
<Switch
  value={enabled}
  onValueChange={setEnabled}
  disabled={true}            // 禁用，无法操作
  opacity={0.5}              // 视觉上变淡
/>
```

## 四、实际示例

```tsx
const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)

  return (
    <View style={{ padding: 16 }}>
      <View style={styles.row}>
        <Text style={styles.label}>接收通知</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ true: '#4CAF50' }}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>深色模式</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ true: '#4CAF50' }}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>自动播放</Text>
        <Switch
          value={autoPlay}
          onValueChange={setAutoPlay}
          trackColor={{ true: '#4CAF50' }}
        />
      </View>
    </View>
  )
}
```

## 五、iOS vs Android 差异

| 方面 | iOS | Android |
|------|-----|---------|
| 关闭颜色 | `ios_backgroundColor` | `trackTintColor` |
| 拇指颜色 | `thumbColor` | `thumbTintColor` |
| 动画 | 原生平滑 | Material Design |

## 六、注意事项

1. **iOS 关闭状态拇指色**：thumbColor 在 iOS 关闭时会被染成灰色（系统行为）
2. **Android 5.0 以下**：thumbTintColor 可能不生效
3. **Switch 高度固定**：约 31dp（Android）无法自定义
4. **异步 setState**：onValueChange 回调中不要立即读取 value，可能尚未更新
