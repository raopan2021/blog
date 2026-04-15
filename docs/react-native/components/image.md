# Image 组件

> 用于显示图片，支持本地和网络图片

## 一、基础用法

```tsx
import { Image } from 'react-native'

// 网络图片
<Image
  source={{ uri: 'https://example.com/logo.png' }}
  style={{ width: 100, height: 100 }}
/>

// 本地图片（必须指定尺寸）
<Image
  source={require('./assets/logo.png')}
  style={{ width: 100, height: 100 }}
/>
```

## 二、属性

```tsx
<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
  resizeMode="cover"       // 'cover' | 'contain' | 'stretch' | 'repeat' | 'center'
  // cover: 裁剪填满（默认值）
  // contain: 完整显示
  // stretch: 拉伸
  // center: 居中（无法填满）
/>
```

## 三、占位图与加载状态

RN 内置 Image 不支持加载占位，可使用第三方库或自定义：

```tsx
import { Image } from 'react-native'

// 使用 FastImage（推荐）
import FastImage from 'react-native-fast-image'

<FastImage
  style={{ width: 200, height: 200 }}
  source={{
    uri: 'https://example.com/image.jpg',
    priority: FastImage.priority.normal,
  }}
  placeholder={{ uri: 'https://placeholder.com/200' }}
  fallback
/>
```

## 四、本地图片注意

```tsx
// ❌ 错误：本地图片不指定尺寸会报错
<Image source={require('./img.png')} />

// ✅ 正确：必须指定尺寸或使用 flex
<Image source={require('./img.png')} style={{ width: 100, height: 100 }} />
<Image source={require('./img.png')} style={{ flex: 1 }} />

// ✅ 动态本地图片（不能用变量）
const icon = require('./icon.png')  // 必须是静态字符串
```

## 五、Image 背景图

```tsx
// 使用 ImageBackground
import { ImageBackground, Text } from 'react-native'

<ImageBackground
  source={{ uri: 'https://example.com/bg.jpg' }}
  style={{ width: '100%', height: 200 }}
  resizeMode="cover"
>
  <Text style={{ color: '#fff', padding: 16 }}>叠加内容</Text>
</ImageBackground>
```

## 六、iOS 图片缓存

```tsx
// iOS 默认缓存网络图片
// 如需禁用缓存（每次重新请求）
<Image
  source={{
    uri: 'https://example.com/img.jpg',
    cache: 'reload'  // 'default' | 'reload' | 'force-cache' | 'only-if-cached'
  }}
/>
```

## 七、常见问题

```tsx
// Android 图片不显示？检查尺寸是否指定
<Image source={{ uri: '...' }} style={{ width: 200, height: 200 }} />

// Android rounded corners 不生效？需要 overflow: 'hidden' 配合
<Image
  source={require('./img.png')}
  style={{ width: 100, height: 100, borderRadius: 50, overflow: 'hidden' }}
/>
```
