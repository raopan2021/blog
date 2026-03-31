# key 的作用

## 📖 本节总结

`key` 帮助 React 识别哪些元素改变了，是列表渲染优化的关键。

---

## 为什么需要 key？

```jsx
// 没有 key
<div>
  <input />  {/* 可能复用错误的 input */}
  <input />
</div>

// 有 key
<div>
  <input key="1" />  {/* 正确匹配 */}
  <input key="2" />
</div>
```

---

## key 的匹配规则

### 匹配成功

```jsx
// 之前
<div>
  <li key="a">A</li>
  <li key="b">B</li>
</div>

// 之后
<div>
  <li key="a">A</li>
  <li key="b">B</li>
</div>

// React 复用 A 和 B，只更新内容
```

### 匹配失败

```jsx
// 之前
<div>
  <li key="a">A</li>
  <li key="b">B</li>
</div>

// 之后
<div>
  <li key="b">B</li>  {/* 复用 */}
  <li key="a">A</li>  {/* 复用 */}
</div>

// React 会移动元素，而不是重新创建
```

### 新增元素

```jsx
// 之前
<div>
  <li key="a">A</li>
  <li key="b">B</li>
</div>

// 之后
<div>
  <li key="c">C</li>  {/* 新增 */}
  <li key="a">A</li>
  <li key="b">B</li>
</div>

// React 只创建 C，A 和 B 复用
```

---

## key 的最佳实践

### ✅ 推荐

```jsx
// 使用稳定的唯一 ID
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

### ❌ 不推荐

```jsx
// 使用数组索引（可能出问题）
{items.map((item, index) => (
  <li key={index}>{item.name}</li>
))}

// 列表顺序变化时，会导致错误的复用
```

---

## 总结

| 场景 | key 的作用 |
|------|------------|
| 列表渲染 | 帮助 React 识别元素 |
| 列表重排 | 最小化 DOM 操作 |
| 列表删除 | 正确复用元素 |
