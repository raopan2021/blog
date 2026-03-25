---
title: Python 数据处理：NumPy
---

NumPy（Numerical Python）是 Python 科学计算的基础库，提供了高性能的多维数组对象 `ndarray` 以及丰富的数学函数库。Pandas、Matplotlib、scikit-learn 等几乎所有数据科学工具都建立在 NumPy 之上。

## 安装与导入

```bash
pip install numpy
```

```python
import numpy as np
```

约定俗成用 `np` 作为别名。

## 创建数组

### 从列表创建

```python
# 一维数组
a = np.array([1, 2, 3, 4, 5])
print(a)        # [1 2 3 4 5]
print(type(a))  # <class 'numpy.ndarray'>

# 二维数组（矩阵）
b = np.array([[1, 2, 3],
              [4, 5, 6]])
print(b)
# [[1 2 3]
#  [4 5 6]]

# 指定数据类型
c = np.array([1, 2, 3], dtype=np.float32)
print(c)  # [1. 2. 3.]
```

### 快速生成数组

```python
# 范围数组
np.arange(0, 10, 2)      # [0, 2, 4, 6, 8]
np.linspace(0, 1, 5)     # [0., 0.25, 0.5, 0.75, 1.]  等间距

# 全 0 / 全 1 数组
np.zeros(5)                        # [0. 0. 0. 0. 0.]
np.ones((3, 4))                   # 3×4 全 1 矩阵
np.zeros_like(a)                  # 与 a 同形状的全 0 数组

# 单位矩阵
np.eye(3)                         # 3×3 单位矩阵

# 随机数组
np.random.rand(3, 2)              # [0,1) 均匀分布
np.random.randn(4)                # 标准正态分布
np.random.randint(0, 10, (3, 3))  # [0,10) 整数矩阵
np.random.seed(42)                 # 固定随机种子
```

## 数组属性

```python
a = np.array([[1, 2, 3], [4, 5, 6]])

print(a.ndim)     # 2  维度
print(a.shape)    # (2, 3) 形状
print(a.size)     # 6  元素总数
print(a.dtype)    # int64 数据类型
print(a.itemsize) # 8  每个元素的字节数
```

## 索引与切片

### 基本索引

```python
a = np.arange(1, 13).reshape(3, 4)  # 1~12 组成 3×4 矩阵
# [[ 1  2  3  4]
#  [ 5  6  7  8]
#  [ 9 10 11 12]]

print(a[0])        # [1 2 3 4]   第一行
print(a[1, 2])     # 7           第二行第三列
print(a[-1])       # [ 9 10 11 12] 最后一行
```

### 切片

```python
print(a[0:2])           # 前两行
print(a[:, 0:2])        # 前两列
print(a[1:, 2:])        # 第二行及之后，第三列及之后
print(a[::2, ::2])      # 跳着取：行间隔2，列间隔2
```

### 布尔索引

```python
a = np.array([10, 20, 30, 40, 50])

# 找出大于 25 的元素
mask = a > 25
print(a[mask])  # [30 40 50]

# 一步到位
print(a[a > 25])
```

### Fancy 索引（花式索引）

```python
a = np.arange(1, 13).reshape(3, 4)

# 按行索引数组取特定行
print(a[[0, 2]])  # 取第一行和第三行
# [[ 1  2  3  4]
#  [ 9 10 11 12]]

# 按列索引数组
print(a[:, [1, 3]])  # 取第二列和第四列
```

## 数组运算

### 逐元素运算

```python
a = np.array([1, 2, 3])

print(a + 1)      # [2 3 4]
print(a * 2)      # [2 4 6]
print(a ** 2)     # [1 4 9]
print(1 / a)      # [1. 0.5 0.333...]
```

### 数组间运算

```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

print(a + b)   # [5 7 9]
print(a * b)   # [4 10 18]   逐元素相乘
print(a @ b)   # 32          矩阵点积
print(np.dot(a, b))  # 同上
```

### 矩阵乘法

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print(A @ B)            # [[19 22] [43 50]] 矩阵乘法
print(A * B)           # [[ 5 12] [21 32]] 逐元素相乘
```

## 广播机制

广播（Broadcasting）是 NumPy 处理不同形状数组运算的核心机制——小数组可以"扩展"以匹配大数组的形状：

```python
# 标量与数组相加
a = np.array([1, 2, 3])
print(a + 10)   # [11 12 13]  10 被广播到所有元素

# 一维与二维数组运算
a = np.array([[1, 2, 3],
              [4, 5, 6]])
b = np.array([10, 20, 30])  # 形状 (3,) -> 自动广播到 (2, 3)
print(a + b)
# [[11 22 33]
#  [14 25 36]]

# 逐行减去行均值（标准化常用）
row_mean = a.mean(axis=1, keepdims=True)  # shape (2, 1)
print(a - row_mean)  # 每行减去该行均值
```

## 常用统计函数

```python
a = np.arange(1, 13).reshape(3, 4)

print(a.sum())         # 78  总和
print(a.sum(axis=0))   # [15 18 21 24]  每列求和
print(a.sum(axis=1))   # [10 26 42]  每行求和

print(a.mean())        # 6.5  均值
print(a.mean(axis=0))  # 每列均值

print(a.std())         # 标准差
print(a.max())         # 12
print(a.min())         # 1
print(a.argmax())      # 11  最大值索引
print(a.argmin())      # 0  最小值索引

# 累积
print(np.cumsum(a))    # 累加 [1, 3, 6, 10, ...]
print(np.cumprod(a))   # 累乘
```

## 数组重塑与合并

```python
a = np.arange(12)  # [0 1 2 ... 11]

# reshape - 不改变数据，只改变视图
print(a.reshape(3, 4))
# [[ 0  1  2  3]
#  [ 4  5  6  7]
#  [ 8  9 10 11]]

# flatten - 展平为一维（副本）
flat = a.flatten()

# ravel - 展平为一维（视图，尽量避免复制）
view = a.ravel()

# 合并
a1 = np.array([1, 2])
a2 = np.array([3, 4])
print(np.concatenate([a1, a2]))        # [1 2 3 4]
print(np.hstack([a1, a2]))             # 水平堆叠
print(np.vstack([a1, a2]))             # 垂直堆叠

# 分割
arr = np.arange(12)
print(np.split(arr, [3, 7]))  # 按索引分割 [[0,1,2], [3,4,5,6], [7,8,9,10,11]]
```

## 排序

```python
a = np.array([[3, 1, 4], [1, 5, 9]])

# 沿轴排序
print(np.sort(a))              # 每行升序
print(np.sort(a, axis=0))      # 每列升序

# 返回排序后的索引
idx = np.argsort(a[0])         # [1 0 2]  第0行排序后的索引
print(a[0][idx])               # [1 3 4]
```

## 实战：图像数据处理

NumPy 数组天然适合处理图像数据（图像就是像素值的多维数组）：

```python
import numpy as np

# 模拟一张 100×100 的灰度图像
image = np.random.randint(0, 256, (100, 100), dtype=np.uint8)

# 调整亮度（+30）
brighter = np.clip(image + 30, 0, 255).astype(np.uint8)

# 二值化（阈值 128）
binary = (image > 128).astype(np.uint8) * 255

# 裁剪区域
crop = image[20:60, 30:70]

# 水平翻转
flipped = image[:, ::-1]

print(f"原始形状: {image.shape}, 亮度增强后: {brighter.shape}")
```

## 小结

- **ndarray**：NumPy 核心，高性能多维数组
- **创建**：`array()`, `arange()`, `zeros()`, `random` 系列
- **索引**：基本索引、切片、布尔索引、花式索引
- **广播**：小数组自动扩展匹配大数组形状
- **统计**：`.mean()`, `.sum()`, `.std()`, `.max()` 等
- **运算**：逐元素运算、矩阵乘法 `@`、点积 `np.dot`
- **重塑**：`reshape()`, `flatten()`, `ravel()`, 合并分割

NumPy 是几乎所有 Python 数据处理工具的基础，掌握好数组操作，能让后续学习 Pandas、Matplotlib 更加顺畅。

[[返回 Python 首页|python/index]]
