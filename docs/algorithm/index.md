# 算法学习

> 本章节记录常见算法的学习笔记，包括排序算法、搜索算法等

## 📚 目录导航

### 排序算法
- [冒泡排序](./冒泡排序.md)
- [选择排序](./选择排序.md)
- [插入排序](./插入排序.md)
- [归并排序](./归并排序.md)
- [计数排序](./计数排序.md)
- [基数排序](./基数排序.md)

## 📖 学习资源

- [B站UP主 - 英雄哪里出来](https://www.bilibili.com/video/BV1Zs4y1X7mN) - 算法可视化教程
- [菜鸟教程 - 10大排序算法](https://www.runoob.com/w3cnote/ten-sorting-algorithm.html)

## 复杂度速查表

| 算法 | 时间复杂度(平均) | 时间复杂度(最坏) | 空间复杂度 | 稳定性 |
|------|-----------------|-----------------|-----------|--------|
| 冒泡排序 | O(n²) | O(n²) | O(1) | 稳定 |
| 选择排序 | O(n²) | O(n²) | O(1) | 不稳定 |
| 插入排序 | O(n²) | O(n²) | O(1) | 稳定 |
| 归并排序 | O(n log n) | O(n log n) | O(n) | 稳定 |
| 快速排序 | O(n log n) | O(n²) | O(log n) | 不稳定 |
| 堆排序 | O(n log n) | O(n log n) | O(1) | 不稳定 |
| 计数排序 | O(n + k) | O(n + k) | O(k) | 稳定 |
| 基数排序 | O(nk) | O(nk) | O(n + k) | 稳定 |

## 算法思想

### 二分查找
```js
function binarySearch(arr, target) {
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (arr[mid] === target) {
      return mid
    } else if (arr[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return -1
}
```


### 双指针
```js
// 有序数组两数之和
function twoSum(nums, target) {
  let left = 0
  let right = nums.length - 1

  while (left < right) {
    const sum = nums[left] + nums[right]

    if (sum === target) {
      return [left, right]
    } else if (sum < target) {
      left++
    } else {
      right--
    }
  }

  return []
}
```


### 滑动窗口
```js
// 最大子序和（滑动窗口）
function maxSubArray(nums) {
  let maxSum = nums[0]
  let currentSum = nums[0]

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i])
    maxSum = Math.max(maxSum, currentSum)
  }

  return maxSum
}
```

