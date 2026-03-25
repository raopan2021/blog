---
title: Docker入门
---

# Docker 入门

## 核心概念

### 镜像（Image）

镜像是一个只读的模板，包含了运行容器所需的文件系统、代码和依赖。

```
镜像结构：
nginx:latest (Ubuntu + Nginx + 应用)
```

### 容器（Container）

容器是镜像的运行实例，是一个轻量级、可执行的独立环境。

```bash
# 镜像是类，容器是实例
```

### 仓库（Registry）

存储和分发镜像的服务，Docker Hub 是最大的公共仓库。

```bash
# 格式：registry/repository:tag
# 例如：docker.io/nginx:1.25
```

## 镜像操作

### 拉取镜像

```bash
# 拉取默认标签（latest）
docker pull nginx

# 拉取指定版本
docker pull nginx:1.25-alpine

# 拉取所有标签
docker pull -a nginx
```

### 列出本地镜像

```bash
docker images
# REPOSITORY   TAG        IMAGE ID       CREATED        SIZE
# nginx        latest     a6bd71f48f68   2 weeks ago    187MB
# python       3.12       abc123...      3 weeks ago    1.01GB

# 查看镜像详细信息
docker inspect nginx:latest
```

### 删除镜像

```bash
# 删除单个镜像
docker rmi nginx:latest

# 强制删除（如果有容器使用）
docker rmi -f nginx:latest

# 删除未使用的镜像
docker image prune

# 删除所有镜像
docker rmi $(docker images -q)
```

### 构建镜像

#### Dockerfile 基础

```dockerfile
# Dockerfile 示例：Python Web 应用
FROM python:3.12-slim          # 基础镜像

WORKDIR /app                   # 设置工作目录

COPY requirements.txt .         # 复制依赖文件
RUN pip install -r requirements.txt  # 安装依赖

COPY . .                       # 复制应用代码

EXPOSE 8080                    # 暴露端口

CMD ["python", "app.py"]       # 启动命令
```

#### 构建命令

```bash
# 构建镜像
docker build -t myapp:v1 .

# 指定 Dockerfile 路径
docker build -t myapp:v1 -f ./docker/Dockerfile .

# 构建时传递参数
docker build --build-arg VERSION=1.0 -t myapp:v1 .

# 多阶段构建
docker build -t myapp:v1 -f Dockerfile.multi .
```

#### 多阶段构建示例

```dockerfile
# 第一阶段：构建
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN go build -o myapp

# 第二阶段：运行
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/myapp .
EXPOSE 8080
CMD ["./myapp"]
```

### 镜像标签

```bash
# 给镜像打标签
docker tag myapp:v1 myapp:v1.0
docker tag myapp:v1 registry.example.com/myapp:v1

# 推送前需要登录
docker login registry.example.com
docker push registry.example.com/myapp:v1
```

## 容器操作

### 运行容器

```bash
# 基本运行
docker run nginx

# 后台运行
docker run -d nginx

# 带名称运行
docker run -d --name my-nginx nginx

# 映射端口
docker run -d -p 8080:80 nginx
# 格式：-p 主机端口:容器端口

# 环境变量
docker run -d -e APP_ENV=production myapp

# 挂载目录
docker run -d -v /host/path:/container/path nginx

# 交互式运行
docker run -it ubuntu bash
```

### 启动/停止/重启

```bash
# 启动已停止的容器
docker start my-nginx

# 停止运行中的容器
docker stop my-nginx

# 重启容器
docker restart my-nginx

# 强制停止
docker kill my-nginx
```

### 查看容器

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 查看最新容器
docker ps -l

# 格式化输出
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"
```

### 进入容器

```bash
# 使用 exec（推荐）
docker exec -it my-nginx bash

# 进入后台运行的容器
docker exec -it my-nginx sh

# 分离模式（exit 不会停止容器）
docker attach my-nginx
```

### 删除容器

```bash
# 删除已停止的容器
docker rm my-nginx

# 强制删除运行中的容器
docker rm -f my-nginx

# 删除所有已停止的容器
docker container prune

# 删除所有容器
docker rm $(docker ps -aq)
```

### 容器日志

```bash
# 查看日志
docker logs my-nginx

# 实时跟踪日志
docker logs -f my-nginx

# 查看最近 100 行
docker logs --tail 100 my-nginx

# 查看指定时间后的日志
docker logs --since "2024-01-01" my-nginx

# 查看错误日志
docker logs --tail 100 --since 30m my-nginx | grep ERROR
```

## 数据卷（Volume）

数据卷用于持久化容器数据：

```bash
# 创建数据卷
docker volume create mydata

# 列出数据卷
docker volume ls

# 查看数据卷详情
docker volume inspect mydata

# 挂载数据卷到容器
docker run -d -v mydata:/app/data nginx

# 匿名卷（只指定容器内路径）
docker run -d -v /app/data nginx

# 挂载主机目录
docker run -d -v /host/data:/container/data nginx
```

## 常用示例

### 运行 Nginx

```bash
docker run -d \
  --name nginx \
  -p 80:80 \
  -v $(pwd)/html:/usr/share/nginx/html \
  nginx
```

### 运行 MySQL

```bash
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=myapp \
  -v mysql_data:/var/lib/mysql \
  mysql:8
```

### 运行 Redis

```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v redis_data:/data \
  redis:7 \
  redis-server --appendonly yes
```

### 运行 Python 应用

```bash
docker run -d \
  --name python-app \
  -p 5000:5000 \
  -e FLASK_ENV=production \
  -v $(pwd):/app \
  myapp:v1
```

## 清理资源

```bash
# 停止所有容器
docker stop $(docker ps -q)

# 删除所有容器
docker rm $(docker ps -aq)

# 删除所有镜像
docker rmi $(docker images -q)

# 删除所有数据卷
docker volume prune

# 一键清理（容器、镜像、网络）
docker system prune

# 完全清理（包括未使用的镜像）
docker system prune -a
```

[[返回 Docker 首页|docker/index]]
