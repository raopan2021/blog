# 练习 04：实现任务调度器

> 难度：⭐⭐⭐ | 配套源码：`packages/runtime-core/src/scheduler.ts`

## 📖 原理回顾

### 为什么需要调度器？

```javascript
// 场景：连续修改数据
state.count = 1
state.count = 2
state.count = 3

// 如果每次修改都立即更新，会渲染 3 次！
// 但实际上只需要最终渲染 1 次

// 解决方案：使用微任务批量更新
// 所有修改收集到队列，下一个微任务时统一更新
```

### Vue3 的调度器原理

```
用户修改数据
     ↓
触发 trigger()
     ↓
将 effect 放入队列 queueJob()
     ↓
Promise.resolve().then()  ← 下一个微任务
     ↓
批量执行队列中的所有更新
```

## 📂 源码位置

```typescript
// packages/runtime-core/src/scheduler.ts
const queue = [];
let isFlushing = false;
const resolvePromise = Promise.resolve();

export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }
  if (!isFlushing) {
    isFlushing = true;
    resolvePromise.then(() => {
      isFlushing = false;
      const copy = queue.slice(0);
      queue.length = 0;
      copy.forEach((job) => job());
      copy.length = 0;
    });
  }
}
```

## 🎯 练习要求

### 题目 1：理解调度流程

```javascript
/**
 * 模拟执行以下代码，分析输出顺序：
 */

let isFlushing = false
const queue = []

function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job)
  }
  if (!isFlushing) {
    isFlushing = true
    Promise.resolve().then(() => {
      isFlushing = false
      const copy = queue.slice(0)
      queue.length = 0
      copy.forEach(job => job())
    })
  }
}

// 执行顺序是什么？
queueJob(() => console.log('A'))
queueJob(() => console.log('B'))
queueJob(() => console.log('C'))
queueJob(() => console.log('D'))

console.log('同步代码')
```

### 题目 2：实现简易版调度器

```javascript
/**
 * 要求：
 * 1. 任务去重（同一个任务只执行一次）
 * 2. 异步批量执行
 * 3. 支持优先级（可选）
 */

function createScheduler() {
  const queue = []
  let isFlushing = false

  async function flush() {
    if (isFlushing) return
    isFlushing = true

    // TODO: 使用 Promise 实现批量执行

    isFlushing = false
  }

  return {
    queue(job) {
      // TODO: 添加任务到队列
    },
    flush
  }
}

// 测试
const scheduler = createScheduler()
scheduler.queue(() => console.log('job1'))
scheduler.queue(() => console.log('job2'))
scheduler.queue(() => console.log('job3'))
console.log('同步代码1')
scheduler.flush()
console.log('同步代码2')
```

## 💡 关键点

1. **isFlushing 标志** — 防止并发执行
2. **去重** — `queue.includes(job)` 避免重复任务
3. **Promise.resolve()** — 利用微任务特性实现异步

## ✅ 答案参考

<details>

```javascript
function createScheduler() {
  const queue = []
  let isFlushing = false

  async function flush() {
    if (isFlushing) return
    isFlushing = true

    // 等待下一个微任务
    await Promise.resolve()

    // 批量执行所有任务
    const copy = queue.slice(0)
    queue.length = 0
    copy.forEach(job => job())

    isFlushing = false
  }

  return {
    queue(job) {
      if (!queue.includes(job)) {
        queue.push(job)
      }
      // 自动触发 flush
      if (!isFlushing) {
        flush()
      }
    },
    flush
  }
}
```

</details>

---

## 📚 相关源码

- `packages/runtime-core/src/scheduler.ts` — 完整的调度器实现
- `packages/reactivity/src/effect.ts` — scheduler 的使用场景

[← 返回练习列表](../index)
