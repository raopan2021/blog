# useRef / useMemo / useCallback

## 📖 本节总结

这三个 Hook 都用于**性能优化**，但用途不同。

---

## useRef

### 用途

```javascript
// 1. 保存不触发渲染的值
const timerRef = useRef(null)

// 2. 引用 DOM 元素
const inputRef = useRef(null)

useEffect(() => {
  inputRef.current?.focus()
}, [])

return <input ref={inputRef} />
```

### 实现

```javascript
function useRef(initialValue) {
  const hook = {
    memoizedState: { current: initialValue }
  }
  return hook.memoizedState
}
```

---

## useMemo

### 用途

```javascript
// 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])
```

### 实现

```javascript
function useMemo(getValue, deps) {
  const hook = mountWorkInProgressHook()

  if (deps changed) {
    hook.memoizedState = getValue()
  }

  return hook.memoizedState
}
```

---

## useCallback

### 用途

```javascript
// 缓存函数引用
const handleClick = useCallback(() => {
  doSomething(value)
}, [value])

// 传递给子组件时，防止子组件不必要的渲染
<Child onClick={handleClick} />
```

### 实现

```javascript
function useCallback(callback, deps) {
  const hook = mountWorkInProgressHook()

  if (deps changed) {
    hook.memoizedState = callback
  }

  return hook.memoizedState
}
```

---

## 总结

| Hook | 用途 | 缓存内容 |
|------|------|----------|
| useRef | DOM 引用/不变值 | any |
| useMemo | 缓存计算结果 | 任何值 |
| useCallback | 缓存函数引用 | 函数 |

---

## 性能优化建议

| 场景 | 推荐 Hook |
|------|----------|
| 引用 DOM | useRef |
| 避免重复计算 | useMemo |
| 避免函数重建 | useCallback |
