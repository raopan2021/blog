# 部署2个MySQL

## 安装

```bash
# 下载2种版本的mysql
docker pull mysql:5.7
docker pull mysql8

# 查看镜像
docker images
# REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
# mysql        latest    c757d623b190   2 months ago    586MB
# mysql        5.7       5107333e08a8   10 months ago   501MB

# 运行2个容器
# -p 3307:3306 指定端口映射，将宿主机的3307映射到容器内的3306端口
# --name mysql5.7 指定容器名称为mysql5.7
# -e MYSQL_ROOT_PASSWORD=123456 指定容器内进程运行时的一些参数，这里是指定MySQL默认密码为123456
# -d c757d623b190 是镜像id，也可以使用镜像名称mysql:latest
docker run -p 3307:3306 --name mysql5.7 -e MYSQL_ROOT_PASSWORD=123456 -d c757d623b190
# ffca154e5833bf18f1579477411f07d697054db5468b98b5f5977e7db6461a79
docker run -p 3308:3306 --name mysql8 -e MYSQL_ROOT_PASSWORD=123456 -d 5107333e08a8
# 03ab4db467c4f10df5eb88ce7b533177c6d1b3217af0944a792260e24a6aaba5

# 查看正在运行的容器
docker ps
# CONTAINER ID   IMAGE          COMMAND                   CREATED          STATUS          PORTS                                                  NAMES
# 03ab4db467c4   5107333e08a8   "docker-entrypoint.s…"   4 seconds ago    Up 3 seconds    33060/tcp, 0.0.0.0:3308->3306/tcp, :::3308->3306/tcp   mysql8
# ffca154e5833   c757d623b190   "docker-entrypoint.s…"   32 seconds ago   Up 32 seconds   33060/tcp, 0.0.0.0:3307->3306/tcp, :::3307->3306/tcp   mysql5.7

# 停止容器
docker stop 03ab4db467c4 ffca154e5833
# 03ab4db467c4
# ffca154e5833

# 删除容器（需要先停止容器）
docker rm 03ab4db467c4 ffca154e5833
# 03ab4db467c4
# ffca154e5833
```
