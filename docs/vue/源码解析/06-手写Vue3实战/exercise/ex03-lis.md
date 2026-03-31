# 练习 03：实现最长递增子序列 (LIS)

> 难度：⭐⭐⭐⭐ | 配套源码：`packages/runtime-core/src/seq.ts`

## 📖 原理回顾

### 什么是最长递增子序列？

给定一个数组，找出其中最长的严格递增子序列的**索引**。

```
输入: [2, 1, 5, 3, 6, 4, 8, 3, 7]
输出: [1, 3, 4, 6]  // 对应值: [1, 3, 6, 8]，长度 4
```

### 在 Vue3 Diff 算法中的应用

Vue3 的 Diff 算法在处理列表移动时，使用 LIS 找出最长不需要移动的子序列。

```
旧 children: [A, B, C, D, E]  (索引 0,1,2,3,4)
新 children: [A, E, B, C, D]  (索引 0,4,1,2,3)

需要移动的元素 = 总数 - LIS长度 = 5 - 4 = 1 (只需要移动 E)
```

## 📂 源码位置

```typescript
// packages/runtime-core/src/seq.ts
export function getSequence(arr) {
  const result = [0];
  const p = result.slice(0);
  let start, end, middle;
  const len = arr.length;

  for (let i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      let resultLastIndex = result[result.length - 1];
      if (arr[resultLastIndex] < arrI) {
        p[i] = result[result.length - 1];
        result.push(i);
        continue;
      }
    }

    start = 0;
    end = result.length - 1;

    while (start < end) {
      middle = ((start + end) / 2) | 0;
      if (arr[result[middle]] < arrI) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }

    if (arrI < arr[result[start]]) {
      p[i] = result[start - 1];
      result[start] = i;
    }
  }

  let l = result.length;
  let last = result[l - 1];
  while (l-- > 0) {
    result[l] = last;
    last = p[last];
  }

  return result;
}
```

## 🎯 练习要求

### 题目：追踪算法执行过程

```javascript
/**
 * 给定数组 [1, 2, 3, 4, 5, 8, 9, 10, 6]
 *
 * 请逐步写出每次循环后 result 和 p 的值：
 *
 * i=0, arrI=1: result=[0], p=[0,?,?,?,?,?,?,?,?]
 * i=1, arrI=2: result=[0,1], p=[0,0,...]
 * ...
 *
 * 最终输出的序列索引是什么？
 * 对应的值是什么？
 */

function getSequence(arr) {
  // 参考上面源码实现
}
```

## 💡 关键理解

1. **result 存储索引，不是值** — result = [0,1,2] 表示索引 0,1,2 构成最长递增子序列

2. **p 数组用于回溯** — 记录每个位置的前一个索引，最终通过回溯得到完整序列

3. **时间复杂度 O(n log n)** — 二分查找优化

## ✅ 验证方法

```javascript
const arr = [1, 2, 3, 4, 5, 8, 9, 10, 6]
const indices = getSequence(arr)
console.log(indices)  // [0, 1, 2, 3, 4]
console.log(indices.map(i => arr[i]))  // [1, 2, 3, 4, 5]
```

## 📚 相关源码
- `packages/runtime-core/src/seq.ts`
- `packages/runtime-core/src/renderer.ts` — Diff 算法中使用 LIS
[← 返回练习列表](../index)
