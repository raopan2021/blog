# 数据处理：Pandas

## 安装

```bash
pip install pandas numpy
```


## 基本数据结构

```python
import pandas as pd
import numpy as np

# Series（1维）
s = pd.Series([1, 3, 5, np.nan, 6, 8])
print(s)

# DataFrame（2维）
df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie", "David"],
    "age": [25, 30, 35, 40],
    "score": [85, 92, 78, 88]
})

print(df)
print(df.head(2))     # 前2行
print(df.tail(2))     # 后2行
print(df.info())      # 数据信息
print(df.describe())  # 统计摘要
```


## 数据选择

```python
# 选择列
print(df["name"])           # Series
print(df[["name", "age"]])  # DataFrame

# 标签选择
print(df.loc[0])           # 第一行
print(df.loc[0:2])         # 行切片
print(df.loc[0, "name"])   # 单个值

# 位置选择
print(df.iloc[0])           # 第一行（整数索引）
print(df.iloc[0:2, 0:2])    # 行+列切片

# 条件筛选
print(df[df["age"] > 30])           # age > 30
print(df[(df["age"] > 25) & (df["score"] > 80)])  # 多条件
```


## 数据操作

```python
# 新增列
df["pass"] = df["score"] >= 60

# 修改列
df["age"] = df["age"] + 1

# 重命名列
df.rename(columns={"name": "username", "age": "Age"}, inplace=True)

# 删除列
df.drop(columns=["pass"], inplace=True)

# 排序
df.sort_values(by="score", ascending=False, inplace=True)

# 排名
df["rank"] = df["score"].rank(ascending=False)
```


## 缺失值处理

```python
# 创建带缺失值的数据
df = pd.DataFrame({
    "A": [1, 2, np.nan, 4],
    "B": [5, np.nan, np.nan, 8],
    "C": [9, 10, 11, 12]
})

df.isnull()              # 判断缺失
df.dropna()              # 删除缺失行
df.fillna(0)             # 用0填充
df.fillna(df.mean())     # 用均值填充
df.interpolate()         # 插值填充
```


## 分组聚合

```python
df = pd.DataFrame({
    "department": ["A", "A", "B", "B", "C"],
    "name": ["Alice", "Bob", "Charlie", "David", "Eve"],
    "salary": [5000, 6000, 5500, 7000, 5200]
})

# 分组
grouped = df.groupby("department")

# 聚合
print(grouped["salary"].sum())
print(grouped["salary"].mean())
print(grouped["salary"].agg(["sum", "mean", "max", "min"]))

# 自定义聚合
def salary_range(x):
    return x.max() - x.min()

print(grouped["salary"].agg(salary_range))
```


## 数据合并

```python
# concat 拼接
df1 = pd.DataFrame({"A": [1, 2], "B": [3, 4]})
df2 = pd.DataFrame({"A": [5, 6], "B": [7, 8]})
result = pd.concat([df1, df2])

# merge 关联
left = pd.DataFrame({"key": ["K0", "K1", "K2"], "A": ["A0", "A1", "A2"]})
right = pd.DataFrame({"key": ["K0", "K1", "K2"], "B": ["B0", "B1", "B2"]})
result = pd.merge(left, right, on="key")
```


## CSV 读写

```python
# 读取
df = pd.read_csv("data.csv", encoding="utf-8")
df = pd.read_excel("data.xlsx", sheet_name="Sheet1")

# 写入
df.to_csv("output.csv", index=False, encoding="utf-8")
df.to_excel("output.xlsx", index=False)
```


---

[[返回 Python 首页|python/index]]
