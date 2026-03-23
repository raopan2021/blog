# Python 学习笔记

> 本章节记录 Python 基础知识，包括环境配置、Web 开发等

## 📚 目录导航

### 环境配置
- [pyenv](./pyenv) - Python 版本管理工具
- [conda](./conda) - Anaconda 环境管理

## 🔗 相关资源

- [Python 官方文档](https://docs.python.org/3/)
- [pip 镜像](https://mirrors.aliyun.com/pypi/simple/)
- [PyPI 仓库](https://pypi.org/)

## Python 特点

- **简洁易学**：语法简洁，适合入门
- **跨平台**：Windows、Mac、Linux 均可运行
- **丰富的库**：NumPy、Pandas、TensorFlow 等
- **多范式**：支持面向对象、函数式、过程式
- **胶水语言**：易于与其他语言交互

## 基础语法

### 变量与数据类型

```python
# 变量（无需声明类型）
name = "Python"
age = 18
price = 99.9
is_active = True

# 常见数据类型
# int, float, str, bool, list, tuple, dict, set
```

### 条件判断

```python
if age >= 18:
    print("成年")
elif age >= 6:
    print("青少年")
else:
    print("童年")
```

### 循环

```python
# for 循环
for i in range(5):
    print(i)

# while 循环
count = 0
while count < 5:
    print(count)
    count += 1

# 列表推导式
squares = [x**2 for x in range(10)]
```

### 函数

```python
def greet(name, greeting="Hello"):
    """Docstring 文档"""
    return f"{greeting}, {name}!"

# 默认参数
greet("World")  # Hello, World!

# 关键字参数
greet("Python", greeting="Hi")  # Hi, Python!

# 可变参数
def func(*args, **kwargs):
    print(args, kwargs)
```

### 类与对象

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def say_hello(self):
        return f"Hello, I'm {self.name}"

p = Person("张三", 18)
print(p.say_hello())
```

## 常用数据结构

### 列表（List）

```python
fruits = ["苹果", "香蕉", "橙子"]
fruits.append("葡萄")      # 追加
fruits.insert(0, "草莓")   # 插入
fruits.remove("香蕉")       # 删除
print(fruits[0])           # 索引访问
```

### 字典（Dict）

```python
person = {"name": "张三", "age": 18}
person["city"] = "北京"    # 添加
print(person.get("name"))  # 获取
```

### 集合（Set）

```python
s = {1, 2, 3, 3, 3}  # 自动去重
s.add(4)              # 添加
s.remove(1)           # 删除
```

## 常用标准库

| 库 | 用途 |
|----|------|
| os | 操作系统操作 |
| sys | 系统参数 |
| json | JSON 序列化 |
| datetime | 日期时间 |
| re | 正则表达式 |
| math | 数学运算 |
| random | 随机数 |
| collections | 集合容器 |

## Web 框架

### Flask（轻量级）

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello, Flask!'

app.run(debug=True)
```

### Django（全功能）

```bash
pip install django
django-admin startproject mysite
python manage.py runserver
```

## 数据处理

### NumPy

```python
import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print(arr * 2)  # [2, 4, 6, 8, 10]
print(arr.mean())  # 3.0
```

### Pandas

```python
import pandas as pd

df = pd.DataFrame({
    'name': ['张三', '李四'],
    'age': [18, 20]
})
print(df.describe())
```

## 环境管理

### pyenv（推荐）

```bash
# 安装
brew install pyenv

# 列出可用版本
pyenv install --list

# 安装指定版本
pyenv install 3.11.0

# 切换全局版本
pyenv global 3.11.0
```

### conda

```bash
# 创建环境
conda create -n myenv python=3.11

# 激活环境
conda activate myenv

# 退出环境
conda deactivate
```
