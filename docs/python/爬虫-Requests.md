# 爬虫：Requests 网络请求

## 安装

```bash
pip install requests
```

## 基本请求

```python
import requests

# GET 请求
response = requests.get("https://api.github.com/users")
print(response.status_code)   # 200
print(response.json())         # 解析 JSON
print(response.text)          # 原始文本
print(response.headers)       # 响应头

# 带参数
params = {"page": 1, "per_page": 10}
response = requests.get("https://api.github.com/users", params=params)
```

## POST 请求

```python
# 表单数据
data = {"username": "alice", "password": "secret"}
response = requests.post("https://example.com/login", data=data)

# JSON 数据
import json
payload = {"title": "文章标题", "content": "文章内容"}
response = requests.post("https://api.example.com/posts", json=payload)

# 文件上传
files = {"file": open("image.png", "rb")}
response = requests.post("https://api.example.com/upload", files=files)
```

## 请求头和认证

```python
# 自定义请求头
headers = {
    "User-Agent": "Mozilla/5.0",
    "Authorization": "Bearer YOUR_TOKEN",
    "Accept": "application/json"
}
response = requests.get("https://api.example.com/data", headers=headers)

# Basic 认证
from requests.auth import HTTPBasicAuth
response = requests.get(
    "https://api.example.com/protected",
    auth=HTTPBasicAuth("username", "password")
)

# Token 认证
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
response = requests.get("https://api.example.com/user", headers=headers)
```

## 超时和重试

```python
# 超时设置（秒）
response = requests.get("https://example.com/api", timeout=5)

# 重试机制
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

session = requests.Session()
retry = Retry(
    total=3,              # 总重试次数
    backoff_factor=0.5,    # 重试间隔
    status_forcelist=[500, 502, 503, 504]
)
adapter = HTTPAdapter(max_retries=retry)
session.mount("http://", adapter)
session.mount("https://", adapter)

response = session.get("https://example.com/api")
```

## Session 保持会话

```python
session = requests.Session()

# 自动处理 Cookie
session.headers.update({"User-Agent": "Mozilla/5.0"})

# 登录
session.post("https://example.com/login", json={"username": "alice", "password": "xxx"})

# 之后的请求会自动带上 Cookie
response = session.get("https://example.com/profile")
```

## 异常处理

```python
import requests
from requests.exceptions import RequestException, Timeout, ConnectionError

try:
    response = requests.get("https://example.com/api", timeout=5)
    response.raise_for_status()  # 非 2xx 抛出异常
    data = response.json()
except Timeout:
    print("请求超时")
except ConnectionError:
    print("连接失败")
except RequestException as e:
    print(f"请求错误: {e}")
```

---

[[返回 Python 首页|python/index]]
