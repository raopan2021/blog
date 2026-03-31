# React 19: Server Components

## 📖 本节总结

React 19 引入了 **Server Components** 和 **Actions**，让 React 可以同时在服务端和客户端渲染。

---

## Server Components

### 什么是 Server Components？

```
┌─────────────────────────────────────────┐
│                 浏览器                    │
│  ┌─────────────────────────────────────┐ │
│  │  Client Components (浏览器执行)        │ │
│  │  - useState, useEffect              │ │
│  │  - 交互逻辑                         │ │
│  └─────────────────────────────────────┘ │
│                     ↑                      │
│                     │                      │
│  ┌─────────────────────────────────────┐ │
│  │  Server Components (服务端执行)        │ │
│  │  - 直接访问数据库、文件系统            │ │
│  │  - 无需 API 层                       │ │
│  │  - 自动代码分割                      │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 基本用法

```javascript
// app/blog/page.js (Server Component)
async function BlogList() {
  // 直接访问数据库，不需要 API
  const posts = await db.posts.findMany()

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

---

## Actions

### 表单处理

```javascript
// Server Action
async function submitForm(formData) {
  'use server'
  // 服务端直接处理表单数据
  await db.create({ title: formData.get('title') })
}

// Client Component
function MyForm() {
  return (
    <form action={submitForm}>
      <input name="title" />
      <button type="submit">提交</button>
    </form>
  )
}
```

### useFormStatus

```javascript
import { useFormStatus } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending}>
      {pending ? '提交中...' : '提交'}
    </button>
  )
}
```

---

## useOptimistic

### 乐观更新

```javascript
import { useOptimistic } from 'react'

function CommentSection({ comments }) {
  const [optimisticComments, addOptimistic] = useOptimistic(
    comments,
    (state, newComment) => [
      ...state,
      { id: Date.now(), text: newComment, pending: true }
    ]
  )

  async function handleSubmit(text) {
    const newComment = { id: 'temp', text, pending: true }
    addOptimistic(newComment)
    await submitComment(newComment)
  }

  return (
    <div>
      {optimisticComments.map(c => (
        <Comment key={c.id} comment={c} />
      ))}
    </div>
  )
}
```

---

## use (新的 Hook)

### 简化 Promise/Context 使用

```javascript
import { use } from 'react'

function Comments({ promise }) {
  // 直接使用 Promise，不需要 .then
  const comments = use(promise)

  return (
    <div>
      {comments.map(c => (
        <Comment key={c.id} text={c.text} />
      ))}
    </div>
  )
}

// 也可以用于 Context
function ThemeProvider({ theme }) {
  const ctx = use(ThemeContext)
  return <div>{ctx.theme}</div>
}
```

---

## 改进的 useRef

```javascript
// React 19: useRef 不再需要 initialValue
function MyComponent() {
  const ref = useRef(null)  // ✅ 可以不传值
  const timerRef = useRef()  // ✅ 也行

  return <div ref={ref}>Hello</div>
}
```

---

## Document Metadata

```javascript
// React 19 支持在组件中直接渲染 metadata
function BlogPost() {
  return (
    <article>
      <title>My Post</title>
      <meta name="description" content="Description" />
      <link rel="canonical" href="https://example.com" />
      <h1>My Post</h1>
    </article>
  )
}
```

---

## 总结

| 特性 | 说明 |
|------|------|
| Server Components | 服务端执行，直接访问 DB/FS |
| Actions | 表单处理简化 |
| useOptimistic | 乐观更新 |
| use | 简化 Promise/Context |
| useRef 改进 | 不需要 initialValue |
| Document Metadata | 组件内渲染 head 标签 |
