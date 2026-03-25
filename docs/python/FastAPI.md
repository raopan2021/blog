# FastAPI 高性能框架

## 安装

```bash
pip install fastapi uvicorn
```


## 最小应用

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

# 运行：uvicorn main:app --reload --port 8000
```


## 类型提示与自动文档

```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI()

# Pydantic 模型
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tags: List[str] = []

# GET 请求
@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {
        "item_id": item_id,
        "q": q
    }

# POST 请求
@app.post("/items/")
def create_item(item: Item):
    return {"item": item, "message": "创建成功"}

# PUT 请求
@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_id": item_id, "item": item}
```


## 请求参数

```python
from fastapi import Query, Path, Header, Cookie

@app.get("/search")
def search(
    q: str = Query(..., min_length=1, max_length=50),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100)
):
    return {"q": q, "page": page, "size": size}

@app.get("/items/{item_id}")
def get_item(
    item_id: int = Path(..., ge=1, description="物品ID")
):
    return {"item_id": item_id}

@app.get("/user-agent")
def read_user_agent(user_agent: str = Header(...)):
    return {"user_agent": user_agent}
```


## 响应模型

```python
from fastapi import FastAPI
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

app = FastAPI()

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

@app.post("/users/", response_model=User)
def create_user(user: UserCreate):
    return {
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "user_id": 1,
        "created_at": datetime.now()
    }
```


## 依赖注入

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

security = HTTPBasic()

def get_current_user(credentials: HTTPBasicCredentials = Depends(security)):
    if credentials.username != "admin" or credentials.password != "secret":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="认证失败"
        )
    return credentials.username

@app.get("/protected")
def protected_route(username: str = Depends(get_current_user)):
    return {"message": f"欢迎, {username}"}
```


## 中间件

```python
from fastapi import FastAPI
import time

app = FastAPI()

@app.middleware("http")
async def add_process_time_header(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```


## CORS 跨域

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 允许的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```


---

[[返回 Python 首页|python/index]]
