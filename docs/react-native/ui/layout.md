# 布局

> React Native 使用 Flexbox 布局，与 CSS Flexbox 类似但有差异

## 一、基础概念

RN 默认 `flexDirection` 为 `column`（不是 `row`），且 `flex` 默认值为 0（非 auto）。

```tsx
<View style={{ flex: 1 }}>
  {/* flex: 1 占满整个父容器 */}
</View>
```

## 二、主轴与交叉轴

```tsx
// 默认 column：主轴垂直，交叉轴水平
<View style={{ flexDirection: 'column' }}>
  <View style={{ flex: 1 }} />  {/* 占满高度 */}
</View>

// 水平排列
<View style={{ flexDirection: 'row' }}>
  <View style={{ flex: 1 }} />  {/* 占满宽度 */}
</View>
```

## 三、常用属性

### 3.1 主轴对齐 (justifyContent)

```tsx
<View style={{ justifyContent: 'space-between' }}>
  {/* 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' */}
</View>
```

### 3.2 交叉轴对齐 (alignItems)

```tsx
<View style={{ alignItems: 'center' }}>
  {/* 'flex-start' | 'center' | 'flex-end' | 'stretch' */}
</View>
```

### 3.3 自身对齐 (alignSelf)

```tsx
<View style={{ alignSelf: 'flex-end' }}>
  {/* 覆盖父容器的 alignItems */}
</View>
```

### 3.4 弹性 (flex)

```tsx
// flex: 1 平分空间
<View style={{ flexDirection: 'row' }}>
  <View style={{ flex: 1 }} />   {/* 1/3 */}
  <View style={{ flex: 2 }} />   {/* 2/3 */}
</View>

// flexGrow/flexShrink/flexBasis
<View style={{ flexGrow: 1, flexShrink: 0, flexBasis: 100 }} />
```

### 3.5 换行 (flexWrap)

```tsx
<View style={{ flexWrap: 'wrap' }}>
  {/* 'wrap' | 'nowrap' */}
  <View style={{ width: '50%' }} />  {/* 换行 */}
</View>
```

## 四、实战：典型布局

### 4.1 头部+内容+底部

```tsx
<View style={{ flex: 1 }}>
  {/* 头部 */}
  <View style={{ height: 60, backgroundColor: 'blue' }}>
    <Text>Header</Text>
  </View>

  {/* 内容（占满剩余空间） */}
  <View style={{ flex: 1 }}>
    <Text>Content</Text>
  </View>

  {/* 底部 */}
  <View style={{ height: 50, backgroundColor: 'green' }}>
    <Text>Footer</Text>
  </View>
</View>
```

### 4.2 水平等分列表

```tsx
<View style={{ flexDirection: 'row' }}>
  {[1, 2, 3].map(i => (
    <View key={i} style={{ flex: 1, alignItems: 'center' }}>
      <Text>Item {i}</Text>
    </View>
  ))}
</View>
```

### 4.3 绝对定位覆盖层

```tsx
<View style={{ flex: 1 }}>
  <View style={{ flex: 1 }}>
    <Text>主要内容</Text>
  </View>
  {/* 绝对定位的悬浮按钮 */}
  <View style={{
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF'
  }}>
    <Text style={{ color: '#fff' }}>+</Text>
  </View>
</View>
```

## 五、与 CSS Flexbox 差异

| 方面 | CSS | RN |
|------|-----|-----|
| 默认方向 | row | column |
| 默认 flex | none (0 0 auto) | flex: 0 |
| flexBasis | auto | 与 CSS 一致 |
| position fixed | 支持 | 不支持，用 absolute |
