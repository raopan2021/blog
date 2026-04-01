# 字形分段与 Unicode 处理

> 为什么一个 emoji "🇨🇳" 要当成一个字符处理？Pretext 如何正确切割"用户感知字符"

## 什么是字形簇（Grapheme Cluster）？

用户感知的一个"字符"，在 Unicode 中可能由多个码点组成。

```javascript
// 你看到的是 1 个字符
'🇨🇳'  // 中国国旗 emoji

// 实际上是 2 个 Unicode 码点（码单元）
'\u{1F1E8}\u{1F1F3}'  //Regional Indicator Symbol Letter C + Regional Indicator Symbol Letter N
```

这就是为什么 `str.length` 在处理 emoji 时会出错：

```javascript
'🇨🇳'.length          // 2（错误的"长度"）
'你好'.length          // 2（正确）
'hello'.length        // 5（正确）
'👨‍👩‍👧‍👦'.length   // 5（错误！这是 family emoji，中间有零宽度连接符）
```

## Unicode 组合字符的复杂性

### 1. 组合附加符号

```javascript
// 字母 + 组合附加符号
'a\u0301'  // á（a + 重音符）
// 在你眼里是一个字符，但 JavaScript 认为它是2个码点
```

### 2. Emoji 序列

```javascript
// 基础 emoji + 肤色 modifier
'👍🏿'  // 拇指 + 深色肤色
// 码点数量: 1 + 1 = 2

// 家庭 emoji（ZWJ 序列）
'👨‍👩‍👧‍👦'  // 男人 + ZWJ + 女人 + ZWJ + 女孩 + ZWJ + 男孩
// 用零宽度连接符连接
```

### 3. 汉字与标点

```javascript
'你好'.length     // 2（中文一个汉字 = 一个码点）
'，。'.length     // 2（中文标点）
'𝟙𝟚𝟛'.length     // 3（数学粗体数字，每个是独立码点）
```

## Pretext 的字形分段策略

Pretext 使用 [Unicode Segmentation](https://github.com/nicktimko/ucsur) 来正确切割字形簇：

```typescript
import { prepare } from '@chenglou/pretext'

const prepared = prepare('Hello 🇨🇳 世界！', '16px Inter')

// 内部会把 emoji 当成一个整体处理
// 不会在 emoji 中间换行
// 不会把 "🇨🇳" 错误地算成 2 个"字符"
```

## 换行与字形簇

不同语言有不同的断行规则：

### 1. 西文：可在空格处断行

```javascript
'Hello World'
// 可断行位置：空格处
// 不可断行：单词中间
```

### 2. 中文：几乎任何位置都可断行

```javascript
'你好世界'
// 几乎每个字之间都可以断行
```

### 3. 日文：混合规则

```javascript
'你好hello世界'
// 汉字之间可断，汉字和拉丁字母之间也可断
// 拉丁字母之间可断（按空格）
```

## Pretext 的粘合规则（Glue Rules）

Pretext 定义了一套"粘合规则"，决定哪些字符之间**不能断行**：

```typescript
// 例如：URL 不应该在中间断开
const prepared = prepare('官网: https://example.com', '16px Inter')
// "https://" 整体粘合，不会断成多行

// 例如：数字串不断开
const prepared = prepare('订单号: 1234567890', '16px Inter')
// 长数字串尽量保持连续
```

## 混合方向文本（Bidi）

阿拉伯文、希伯来文是从右到左（RTL）的语言，和左到右（LTR）的英文、中文混排时：

```javascript
const text = 'Hello مرحبا World'  // LTR + RTL + LTR
```

Pretext 内部处理了 Unicode Bidi Algorithm，确保：
- 测量宽度正确（RTL 文本从右向左排列）
- 换行位置正确（不会在 RTL 文本中间错误断行）

## 总结

| 概念 | 说明 |
|------|------|
| 字形簇（Grapheme） | 用户感知的一个"字符"，可能包含多个 Unicode 码点 |
| 码点（Code Point） | Unicode 标准中的唯一编号 |
| 组合附加符号 | 附加在基础字符上的变音符号 |
| ZWJ（零宽度连接符） | 用于连接多个 emoji 形成新序列 |
| 粘合规则 | 决定哪些字符之间不可断行 |
| Bidi 算法 | 处理混合方向文本的排列逻辑 |
