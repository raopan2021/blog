# vscode通过ssh连接linux

[参考csdn1](https://blog.csdn.net/Oxford1151/article/details/137228119#:~:text=%E8%BF%9C%E7%A8%8B%E8%BF%9E%E6%8E%A5%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%B7%A5%E5%85%B7%E6%9C%89)

[参考csdn2](https://blog.csdn.net/u014180504/article/details/83579192)

## 客户端vscode安装拓展 `Remote-SSH`

::: tip 配置config
注意 User
:::

```txt {5,11}
# Read more about SSH config files: https://linux.die.net/man/5/ssh_config
Host ubuntu22
    HostName 192.168.157.128
    Port 22
    User raopan
    IdentityFile C:\Users\raopan\.ssh\id_rsa
    
Host CentOS7
    HostName 192.168.157.101
    Port 22
    User root
    IdentityFile C:\Users\raopan\.ssh\id_rsa
```

## 服务器centos开启ssh

修改 /etc/ssh/sshd_config 文件以调整配置

```bash
# 大概是35行开始，将以下配置改为 yes
PermitRootLogin yes
#StrictModes yes
#MaxAuthTries 6
#MaxSessions 10

RSAAuthentication yes
PubkeyAuthentication yes

# The default is to check both .ssh/authorized_keys and .ssh/authorized_keys2
# but this is overridden so installations will only check .ssh/authorized_keys
AuthorizedKeysFile .ssh/authorized_keys
```

重启ssh服务

```bash {6}
systemctl status sshd.service

# 会显示下面内容，注意第6行是Active: active (running)就行
# ● sshd.service - OpenSSH server daemon
#    Loaded: loaded (/usr/lib/systemd/system/sshd.service; enabled; vendor preset: enabled)
#    Active: active (running) since 三 2024-10-09 09:56:55 CST; 12h ago
#      Docs: man:sshd(8)
#            man:sshd_config(5)
#  Main PID: 972 (sshd)
#     Tasks: 1
#    Memory: 4.7M
#    CGroup: /system.slice/sshd.service
#            └─972 /usr/sbin/sshd -D
```

配置ssh服务开机自启动

```bash
systemctl enable sshd.service
```

## 免密登录

### 在客户端生成公钥id_rsa.pub 和私钥

```bash
ssh-keygen -t rsa
```

### 将公钥复制到服务器上

在root/.ssh目录下，生成authorized_keys文件

将id_rsa.pub内容copy到authorized_keys文件

将文件夹权限修改 600

```bash
chmod 600 .ssh/authorized_keys
```
