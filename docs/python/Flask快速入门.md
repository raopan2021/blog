# Flask 快速入门

## 安装

```bash
pip install flask
```

## 最小应用

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, World!"

if __name__ == "__main__":
    app.run(debug=True, port=5000)
```

## 路由

```python
@app.route("/")
def index():
    return "首页"

@app.route("/user/<username>")
def profile(username):
    return f"用户: {username}"

@app.route("/post/<int:post_id>")
def post(post_id):
    return f"文章ID: {post_id}"

@app.route("/path/<path:subpath>")
def catch_all(subpath):
    return f"路径: {subpath}"
```

## 请求与响应

```python
from flask import request, jsonify, render_template, redirect, url_for

@app.route("/search")
def search():
    # 获取查询参数
    query = request.args.get("q", "")
    page = request.args.get("page", 1, type=int)
    return f"搜索: {query}, 第{page}页"

@app.route("/login", methods=["POST"])
def login():
    # 获取 POST 数据
    username = request.form.get("username")
    password = request.form.get("password")

    # 获取 JSON 数据
    data = request.get_json()

    # 返回 JSON
    return jsonify({"success": True, "username": username})

@app.route("/old")
def old_url():
    # 重定向
    return redirect(url_for("new_url"))

@app.route("/new")
def new_url():
    return "新页面"
```

## 模板渲染

```python
# 返回 HTML 模板
@app.route("/")
def index():
    return render_template("index.html", title="首页", user={"name": "Alice"})

# templates/index.html
# <h1>{{ title }}</h1>
# <p>欢迎, {{ user.name }}</p>

# 模板循环和条件
# {% for item in items %}
#   <li>{{ item }}</li>
# {% endfor %}

# {% if user %}
#   <p>{{ user.name }}</p>
# {% else %}
#   <p>请登录</p>
# {% endif %}
```

## 蓝图（Blueprint）

```python
# app.py
from flask import Flask
from routes import api_bp

app = Flask(__name__)
app.register_blueprint(api_bp, url_prefix="/api")

# routes.py
from flask import Blueprint
api_bp = Blueprint("api", __name__)

@api_bp.route("/users")
def users():
    return {"users": ["Alice", "Bob"]}

@api_bp.route("/posts/<int:post_id>")
def get_post(post_id):
    return {"id": post_id, "title": "示例文章"}
```

## 中间件

```python
from flask import Flask, request
import time

app = Flask(__name__)

@app.before_request
def before():
    print(f"请求: {request.path}")
    request.start_time = time.time()

@app.after_request
def after(response):
    elapsed = time.time() - request.start_time
    response.headers["X-Response-Time"] = f"{elapsed:.3f}s"
    return response
```

## 错误处理

```python
@app.errorhandler(404)
def not_found(e):
    return {"error": "页面不存在"}, 404

@app.errorhandler(500)
def server_error(e):
    return {"error": "服务器错误"}, 500
```

---

[[返回 Python 首页|python/index]]
