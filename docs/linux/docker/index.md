# Docker

## 安装docker

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
