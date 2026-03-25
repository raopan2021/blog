# Linux 学习笔记

> Linux 是一种开源的 Unix-like 操作系统内核，广泛用于服务器、嵌入式设备和桌面

## 📚 目录导航

### 基础
- [VMware 虚拟机安装](./VMware) - 在 Windows 上安装 Linux
- [SSH 远程连接](./ssh) - 远程访问 Linux 服务器
- [yum 包管理器](./yum) - 软件安装与更新
- [端口管理](./端口) - 查看和配置网络端口
- [一键替换源](./一键替换源) - 切换到国内镜像源

## 🔗 相关资源

- [Linux 命令手册](https://man.linuxde.net/)
- [鸟哥的 Linux 私房菜](http://linux.vbird.org/)
- [Linux 中国](https://linux.cn/)

## 常用命令速查

### 文件操作

```bash
# 浏览文件
ls -la              # 列出所有文件（含隐藏）
cd /path            # 切换目录
pwd                 # 显示当前目录
cat file            # 查看文件内容
less file           # 分页查看（可滚动）
head -n 10 file     # 查看前10行
tail -n 10 file     # 查看后10行
tail -f file        # 实时查看日志

# 文件操作
cp src dst          # 复制
mv src dst          # 移动/重命名
rm -rf dir          # 删除目录
mkdir dir           # 创建目录
touch file          # 创建空文件

# 搜索
find / -name "*.log"      # 按名称搜索
grep "error" file         # 搜索内容
which command             # 查找命令路径
```

### 权限管理

```bash
# 权限表示：rwx rwx rwx (所有者 组 其他)
# r=4, w=2, x=1

chmod 755 file       # 设置权限
chown user:group file  # 修改所有者
sudo command         # 以管理员身份运行
```

### 系统管理

```bash
# 进程
ps aux             # 查看所有进程
top                # 实时进程监视
kill -9 PID        # 强制终止进程
nohup command &    # 后台运行

# 内存和磁盘
df -h              # 查看磁盘使用
free -h            # 查看内存使用
du -sh dir         # 查看目录大小

# 网络
netstat -tulpn     # 查看端口
ifconfig / ip addr # 查看IP
ping host          # 测试连接
curl url           # 发请求
```

### 压缩解压

```bash
# tar 压缩/解压
tar -czvf file.tar.gz dir/    # 压缩
tar -xzvf file.tar.gz         # 解压

# zip
zip -r file.zip dir/           # 压缩
unzip file.zip                 # 解压
```

## 目录结构

```
/           # 根目录
├── bin/    # 常用命令
├── sbin/   # 系统管理命令
├── etc/    # 配置文件
├── home/   # 用户主目录
├── root/   # root 用户主目录
├── usr/    # 用户程序
├── var/    # 变量文件（日志）
├── tmp/    # 临时文件
├── proc/   # 虚拟文件系统
└── dev/    # 设备文件
```

## Vim 编辑器

```bash
# 三种模式：命令模式、编辑模式、末行模式

# 基本操作
i          # 进入编辑模式
Esc        # 返回命令模式
:w         # 保存
:q         # 退出
:wq        # 保存并退出
:q!        # 强制退出

# 命令模式操作
dd         # 删除当前行
yy         # 复制当前行
p          # 粘贴
u          # 撤销
/keyword   # 搜索
```

## 服务管理

```bash
# systemd (CentOS 7+, Ubuntu 16.04+)
systemctl start nginx     # 启动服务
systemctl stop nginx     # 停止服务
systemctl restart nginx  # 重启服务
systemctl status nginx   # 查看状态
systemctl enable nginx   # 开机自启
systemctl disable nginx   # 关闭自启

# 旧版系统
service nginx start
chkconfig nginx on
```

## 用户管理

```bash
# 添加用户
useradd username
passwd username

# 删除用户
userdel username

# 切换用户
su - username

# 查看用户
whoami
who
```

## 安装软件

```bash
# Ubuntu/Debian
apt update
apt install nginx
apt remove nginx

# CentOS/RHEL
yum install nginx
yum remove nginx

# 源码编译安装
./configure
make
make install
```

## 实用技巧

### 查看系统信息

```bash
uname -a          # 内核版本
cat /etc/os-release  # 操作系统信息
uptime            # 运行时间
hostname          # 主机名
```

### 定时任务（cron）

```bash
crontab -e        # 编辑定时任务

# 格式：分 时 日 月 周 命令
# 示例：每天凌晨3点执行
0 3 * * * /path/to/command
```

### 远程复制

```bash
scp file user@host:/path   # 复制文件到远程
scp -r dir user@host:/path # 复制目录
rsync -avz src/ dst/       # 增量同步
```
