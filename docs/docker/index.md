---
title: Docker 概览
---

# Docker 概览

## 什么是 Docker

Docker 是一个开源的容器化平台，让开发者可以将应用及其依赖打包成轻量级的容器，实现"构建一次，到处运行"。

### 容器 vs 虚拟机

| 特性 | 容器 | 虚拟机 |
|------|------|--------|
| 启动速度 | 秒级 | 分钟级 |
| 资源占用 | 小（MB级） | 大（GB级） |
| 性能 | 接近原生 | 有虚拟化开销 |
| 隔离性 | 进程级 | 完整系统级 |
| 移植性 | 强 | 强 |

### Docker 核心概念

```

Docker Client (命令行工具)
       ↓
Docker Daemon (守护进程)
       ↓
Container (容器) ← Image (镜像)
       ↓
Registry (仓库) ← Docker Hub
```


## 为什么要用 Docker

### 1. 环境一致性

开发、测试、生产环境一致，避免"在我机器上能运行"问题。

### 2. 快速部署

容器秒级启动，快速扩缩容。

### 3. 资源隔离

不同应用运行在独立容器，互不影响。

### 4. 微服务架构

天然适合微服务，每个服务一个容器。

## Docker 基本架构

```

┌─────────────────────────────────────────┐
│              Docker Host                │
│  ┌─────────────────────────────────┐   │
│  │       Docker Daemon (dockerd)    │   │
│  │   ┌─────────┐    ┌────────────┐  │   │
│  │   │ Container│    │  Container │  │   │
│  │   │   Nginx   │    │   Python   │  │   │
│  │   └─────────┘    └────────────┘  │   │
│  │   ┌─────────────────────────┐    │   │
│  │   │        Images           │    │   │
│  │   │  nginx   python   redis  │    │   │
│  │   └─────────────────────────┘    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
         ↑              ↓
┌─────────────┐   ┌──────────────────┐
│    Client   │   │     Registry     │
│  docker CLI │   │  Docker Hub 等   │
└─────────────┘   └──────────────────┘
```


## 核心组件

### Docker Daemon (dockerd)

后台运行的服务进程，接收客户端请求，管理容器、镜像、网络等。

```bash
# 查看状态
systemctl status docker

# 重启
sudo systemctl restart docker

# 查看版本
docker version
```


### Docker Client

命令行工具，与 Daemon 通信。

```bash
docker build   # 构建镜像
docker run     # 运行容器
docker ps      # 查看容器
docker pull    # 拉取镜像
docker push    # 推送镜像
```


### Docker Registry

存储和分发镜像的服务。

- **Docker Hub**：官方公共仓库
- **私有仓库**：企业自建 Harbor

```bash
# 登录 Docker Hub
docker login

# 搜索镜像
docker search nginx

# 拉取镜像
docker pull nginx:latest
```


### Images（镜像）

只读模板，用于创建容器。

### Containers（容器）

镜像的运行实例，是动态的。

## 安装 Docker

### Ubuntu/Debian

```bash
# 卸载旧版本
sudo apt-get remove docker docker-engine docker.io containerd runc

# 安装依赖
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 添加 Docker GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 添加 Docker 仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list

# 安装 Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 启动
sudo systemctl start docker
sudo systemctl enable docker

# 添加当前用户到 docker 组（避免每次 sudo）
sudo usermod -aG docker $USER
# 需要重新登录生效
```


### 验证安装

```bash
docker run hello-world
```


## Docker 工作流程

```

1. 开发编写代码
2. Dockerfile 定义应用环境
3. docker build 构建镜像
4. docker push 推送镜像到仓库
5. docker pull 从仓库拉取镜像
6. docker run 运行容器
```


## 常用命令速查

```bash
# 镜像操作
docker images                    # 列出本地镜像
docker pull nginx:latest         # 拉取镜像
docker rmi nginx                 # 删除镜像
docker build -t myapp:v1 .      # 构建镜像

# 容器操作
docker ps                        # 运行中的容器
docker ps -a                     # 所有容器（包括停止的）
docker run -d nginx              # 后台运行
docker exec -it container_id bash # 进入容器
docker stop container_id         # 停止容器
docker rm container_id           # 删除容器

# 日志和调试
docker logs container_id         # 查看日志
docker inspect container_id      # 查看容器详情
docker stats                     # 查看资源使用
```


## Docker 生态工具

| 工具 | 用途 |
|------|------|
| Docker Compose | 定义多容器应用 |
| Docker Swarm | 容器编排（集群） |
| Kubernetes | 容器编排（K8S） |
| Docker Desktop | 桌面客户端 |
| Portainer | Web 管理界面 |

[[返回 Docker 首页|docker/index]]
