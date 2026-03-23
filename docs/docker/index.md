# Docker 容器化

> Docker 是一个开源的容器化平台，用于打包、分发和运行应用程序

## 📚 目录导航

- [常见命令](./常见命令) - Docker 基础命令速查
- [命令别名](./命令别名) - 提高效率的命令别名配置
- [镜像管理](./镜像) - 镜像的构建、拉取、推送
- [部署 Nginx](./nginx) - 使用 Docker 部署 Web 服务
- [部署 MySQL](./mysql) - 使用 Docker 运行 MySQL 数据库
- [部署 MongoDB](./mongo) - 使用 Docker 运行 MongoDB
- [部署 Redis](./redis) - 使用 Docker 运行 Redis
- [Windows 安装 Docker](./windesk) - Windows 环境下安装 Docker Desktop

## 核心概念

- **镜像（Image）**：应用程序的只读模板
- **容器（Container）**：镜像的运行实例
- **仓库（Registry）**：存储和分发镜像的服务（如 Docker Hub）

## Docker 特点

- **轻量级**：共享宿主机内核，容器启动快
- **可移植**：一次构建，处处运行
- **隔离性**：应用间相互隔离
- **版本控制**：可追踪镜像版本
- **生态丰富**：官方和社区提供大量镜像

[参考](https://b11et3un53m.feishu.cn/wiki/Rfocw7ctXij2RBkShcucLZbrn2d)

## 卸载旧版

首先如果系统中已经存在旧的Docker，则先卸载：

```bash
yum remove docker \
    docker-client \
    docker-client-latest \
    docker-common \
    docker-latest \
    docker-latest-logrotate \
    docker-logrotate \
    docker-engine \
    docker-selinux
```

## 配置Docker的yum库

首先要安装一个yum工具

```bash
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

安装成功后，执行命令，配置Docker的yum源（已更新为阿里云源）：

```bash
sudo yum-config-manager --add-repo <https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo>

sudo sed -i 's+download.docker.com+mirrors.aliyun.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo
```

更新yum，建立缓存

```bash
sudo yum makecache fast
```

## 安装Docker

最后，执行命令，安装Docker

```bash
yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## 启动Docker

```bash
systemctl start docker
```

## 停止Docker

```bash
systemctl stop docker
```

## 重启

```bash
systemctl restart docker
```

## Docker开机自启

```bash
systemctl enable docker
```

## Docker容器开机自启

```bash
docker update --restart=always [容器名/容器id]
# 例如
docker update --restart=always mysql
```

## 执行docker ps命令，如果不报错，说明安装启动成功

```bash
docker ps
```
