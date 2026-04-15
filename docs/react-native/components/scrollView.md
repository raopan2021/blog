# ScrollView 组件

> 滚动视图，用于内容超出屏幕时提供滚动能力

## 一、基础用法

```tsx
import { ScrollView, Text } from 'react-native'

const MyScreen = () => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ height: 1000, padding: 16 }}>
        <Text>很长的内容...</Text>
      </View>
    </ScrollView>
  )
}
```

## 二、常用属性

### 2.1 滚动方向

```tsx
// 垂直滚动（默认）
<ScrollView>

// 水平滚动
<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
```

### 2.2 分页滚动

```tsx
<ScrollView
  pagingEnabled={true}         // 按页滚动（类似 ViewPager）
  showsHorizontalScrollIndicator={false}
  showsVerticalScrollIndicator={false}
>
  {pages.map((page, i) => (
    <View key={i} style={{ width: screenWidth, height: 200 }}>
      <Text>{page}</Text>
    </View>
  ))}
</ScrollView>
```

### 2.3 下拉刷新

```tsx
const [refreshing, setRefreshing] = useState(false)

<ScrollView
  refreshing={refreshing}
  onRefresh={() => {
    setRefreshing(true)
    fetchData().finally(() => setRefreshing(false))
  }}
>
  {/* 内容 */}
</ScrollView>
```

### 2.4 内容偏移

```tsx
<ScrollView
  contentContainerStyle={{ padding: 16 }}  // 内容容器样式
  contentOffset={{ x: 0, y: 100 }}         // 初始偏移
  showsVerticalScrollIndicator={true}       // 显示滚动条
>
```

## 三、滚动事件

```tsx
<ScrollView
  onScroll={(e) => {
    const y = e.nativeEvent.contentOffset.y
    console.log('滚动位置:', y)
  }}
  scrollEventThrottle={16}  // 限制滚动事件频率（ms）
>
```

## 四、性能注意

```tsx
// ❌ 错误：ScrollView 会一次性渲染所有子元素
// 大数据量时会造成性能问题
<ScrollView>
  {largeArray.map(item => <ComplexItem key={item.id} {...item} />)}
</ScrollView>

// ✅ 正确：大列表用 FlatList
import { FlatList } from 'react-native'

<FlatList
  data={largeArray}
  renderItem={({ item }) => <ComplexItem {...item} />}
  keyExtractor={item => item.id}
/>
```

## 五、嵌套滚动

```tsx
// 外层 ScrollView + 内层 ScrollView（水平）
<ScrollView>
  <View>
    <ScrollView horizontal={true}>
      {/* 横向内容 */}
    </ScrollView>
    {/* 其他内容 */}
  </View>
</ScrollView>

// 嵌套时 Android 可能需要
nestedScrollEnabled={true}  // Android
```

## 六、注意事项

1. **性能瓶颈**：ScrollView 一次性渲染所有子组件，大数据量用 FlatList
2. **flex: 1**：外层 ScrollView 需指定宽高，`flex: 1` 可占满父容器
3. **horizontal 横向滚动**：需要给子元素设置固定宽度
4. **KeyboardAvoidingView**：表单输入时配合使用，避免键盘遮挡
