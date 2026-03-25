---
title: Python 爬虫：BeautifulSoup
---

BeautifulSoup（简称 BS4）是 Python 中最常用的 HTML/XML 解析库，配合 Requests 使用，可以快速从网页中提取所需数据。本篇介绍 BS4 的核心用法和实战技巧。

## 安装与基础使用

```bash
pip install beautifulsoup4 lxml
```


- `beautifulsoup4`：主库
- `lxml`：推荐的高性能 HTML/XML 解析器

```python
from bs4 import BeautifulSoup
import requests

# 获取网页
response = requests.get("https://example.com")
html = response.text

# 解析网页
soup = BeautifulSoup(html, "lxml")  # 指定解析器

# 打印格式化后的 HTML
print(soup.prettify()[:500])
```


## 解析器选择

BeautifulSoup 支持多种解析器：

| 解析器 | 安装方式 | 速度 | 备注 |
|--------|----------|------|------|
| `lxml` | `pip install lxml` | 最快 | 推荐使用 |
| `html.parser` | 内置 | 中等 | 无需安装 |
| `html5lib` | `pip install html5lib` | 最慢 | 容错性最强 |

```python
soup_lxml = BeautifulSoup(html, "lxml")
soup_parser = BeautifulSoup(html, "html.parser")
soup_html5lib = BeautifulSoup(html, "html5lib")
```


## 查找元素：find 与 find_all

### find - 返回第一个匹配结果

```python
# 查找第一个 <h1> 标签
h1 = soup.find("h1")
print(h1.text)  # 标签内的文本

# 查找第一个 class="title" 的元素
title = soup.find(class_="title")
print(title.get_text(strip=True))

# 查找第一个 id="main" 的元素
main = soup.find(id="main")
```


### find_all - 返回所有匹配的列表

```python
# 查找所有 <a> 标签
all_links = soup.find_all("a")
print(f"找到 {len(all_links)} 个链接")

# 查找所有 class="item" 的元素
items = soup.find_all(class_="item")

# 查找所有 <li> 标签，最多返回 10 个
lis = soup.find_all("li", limit=10)

# 同时匹配多个标签
tags = soup.find_all(["h1", "h2", "h3"])  # 所有标题
```


### 按属性查找

```python
# 查找 class="article" 且 id 不是空的元素
articles = soup.find_all("div", class_="article", id=True)

# 查找 href 以 "/news/" 开头的链接
news_links = soup.find_all("a", href=lambda x: x and x.startswith("/news/"))

# 查找 data-status="active" 的标签
active = soup.find_all(attrs={"data-status": "active"})
```


## CSS 选择器

BS4 支持直接使用 CSS 选择器，比 `find_all` 更直观：

```python
# 选择所有 class="post-title" 的元素
titles = soup.select(".post-title")

# 选择 id="header" 下的所有 <a>
nav_links = soup.select("#header a")

# 选择 article > h2（article 标签的直接子元素 h2）
headers = soup.select("article > h2")

# 选择 class="item" 且包含 class="featured" 的元素
featured = soup.select(".item.featured")

# nth-child 选择器（获取列表的第二个元素）
second_item = soup.select(".item:nth-of-type(2)")

# 获取元素的文本
for item in soup.select(".item"):
    title = item.get_text(strip=True)
    link = item.select_one("a")["href"]
    print(f"{title} -> {link}")
```


## 提取数据

### 获取标签属性

```python
# 获取单个属性
link = soup.find("a", href=True)
print(link["href"])         # 直接用 [] 取属性
print(link.get("href"))     # get 方法更安全，不存在返回 None

# 获取所有属性
for tag in soup.find_all("img"):
    src = tag.get("src")
    alt = tag.get("alt", "无描述")  # 默认值
    print(f"{alt}: {src}")
```


### 获取文本

```python
# get_text() - 获取所有文本
article = soup.find("article")
print(article.get_text())  # 包含所有子元素的文本，空白会被压缩

# strip=True 去除首尾空白
print(article.get_text(strip=True))

# get_text(separator="\n") - 自定义分隔符
lines = article.get_text(separator="\n", strip=True)
```


### 获取 HTML 内容

```python
# 获取标签的完整 HTML
outer_html = str(tag)
inner_html = tag.decode_contents()

# prettify() 格式化输出
print(tag.prettify())
```


## 遍历文档树

```python
html = """
<article id="main">
    <header>
        <h1>Python 教程</h1>
        <span class="author">张三</span>
    </header>
    <div class="content">
        <p>这是第一段。</p>
        <p>这是第二段。</p>
        <div class="comment">
            <p>评论内容</p>
        </div>
    </div>
</article>
"""

soup = BeautifulSoup(html, "lxml")
article = soup.find("article")

# 父子兄弟关系
print(article.parent.name)           # 父元素: body
print(article.children)              # 直接子元素（迭代器）
for child in article.children:
    print(child.name)

# find_next_sibling - 下一个兄弟元素
p1 = soup.find("p")
print(p1.find_next_sibling("p").text)  # "这是第二段。"

# find_previous_sibling - 上一个兄弟元素
p2 = soup.find_all("p")[1]
print(p2.find_previous_sibling("p").text)  # "这是第一段。"
```


## 实战案例

### 案例1：爬取简书文章列表

```python
import requests
from bs4 import BeautifulSoup

url = "https://www.jianshu.com/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

response = requests.get(url, headers=headers, timeout=10)
soup = BeautifulSoup(response.text, "lxml")

# 提取文章列表
articles = soup.select("a.title")
for article in articles[:10]:
    title = article.get_text(strip=True)
    link = "https://www.jianshu.com" + article.get("href", "")
    print(f"{title}\n{link}\n")
```


### 案例2：解析表格数据

```python
html = """
<table>
    <thead>
        <tr><th>姓名</th><th>年龄</th><th>城市</th></tr>
    </thead>
    <tbody>
        <tr><td>张三</td><td>25</td><td>北京</td></tr>
        <tr><td>李四</td><td>30</td><td>上海</td></tr>
        <tr><td>王五</td><td>28</td><td>广州</td></tr>
    </tbody>
</table>
"""

soup = BeautifulSoup(html, "lxml")
rows = soup.select("tbody tr")

data = []
for row in rows:
    cells = row.select("td")
    data.append({
        "姓名": cells[0].get_text(strip=True),
        "年龄": cells[1].get_text(strip=True),
        "城市": cells[2].get_text(strip=True),
    })

for item in data:
    print(item)
```


### 案例3：提取 JSON 数据中的 HTML

```python
import requests
import json
from bs4 import BeautifulSoup

# 有些 API 返回的 HTML 片段被编码在 JSON 中
api_url = "https://api.example.com/news"
response = requests.get(api_url)
data = response.json()

# 提取其中嵌入的 HTML
html_content = data["html"]
soup = BeautifulSoup(html_content, "lxml")

titles = soup.select(".news-title")
for title in titles:
    print(title.get_text(strip=True))
```


## 注意事项

1. **始终设置 User-Agent**：大多数网站会检查请求头
2. **处理编码问题**：`response.encoding = 'utf-8'` 确保正确解码
3. **优雅处理缺失元素**：`tag.get_text()` 对 None 调用会报错，用 `soup.find()` 返回 None 时要加条件判断
4. **不要高频请求**：加上 `time.sleep()` 限速，避免被封禁
5. **优先使用 API**：很多网站提供官方 API，比爬虫更可靠

## 小结

- `BeautifulSoup(html, "lxml")` 创建解析对象
- `find` / `find_all` 按标签名和属性查找
- `select` 支持 CSS 选择器语法，更直观
- `.text` / `.get_text()` 获取文本，`["href"]` / `.get("href")` 获取属性
- 配合 Requests 使用，构成完整的爬虫采集流程

[[返回 Python 首页|python/index]]
