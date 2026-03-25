# 部署MySQL

[参考](https://b11et3un53m.feishu.cn/wiki/MWQIw4Zvhil0I5ktPHwcoqZdnec)

## 安装

```bash
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e TZ=Asia/Shanghai \
  -e MYSQL_ROOT_PASSWORD=123 \
  mysql
```

::: tip 这里下载的不是安装包，而是镜像。
镜像中不仅包含了MySQL本身，还包含了其运行所需要的环境、配置、系统级函数库。

因此它在运行时就有自己独立的环境，就可以跨系统运行，也不需要手动再次配置环境了。

这套独立运行的隔离环境我们称为容器。
:::

MySQL安装完毕！通过任意客户端工具即可连接到MySQL

::: tip 注意端口是否对外开放
:::

解读：

- docker run -d ：创建并运行一个容器，-d则是让容器以后台进程运行
- --name mysql  : 给容器起个名字叫mysql，你可以叫别的
- -p 3306:3306 : 设置端口映射。
  - 容器是隔离环境，外界不可访问。但是可以将宿主机端口映射容器内到端口，当访问宿主机指定端口时，就是在访问容器内的端口了。
  - 容器内端口往往是由容器内的进程决定，例如MySQL进程默认端口是3306，因此容器内端口一定是3306；而宿主机端口则可以任意指定，一般与容器内保持一致。
  - 格式： -p 宿主机端口:容器内端口，示例中就是将宿主机的3306映射到容器内的3306端口
- -e TZ=Asia/Shanghai : 配置容器内进程运行时的一些参数
  - 格式：-e KEY=VALUE，KEY和VALUE都由容器内进程决定
  - 案例中，TZ=Asia/Shanghai是设置时区；MYSQL_ROOT_PASSWORD=123是设置MySQL默认密码
- mysql : 设置镜像名称，Docker会根据这个名字搜索并下载镜像
  - 格式：REPOSITORY:TAG，例如mysql:8.0，其中REPOSITORY可以理解为镜像名，TAG是版本号
  - 在未指定TAG的情况下，默认是最新版本，也就是mysql:latest
