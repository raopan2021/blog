# ssh

## vscode通过ssh连接

[参考vsdn](https://blog.csdn.net/Oxford1151/article/details/137228119#:~:text=%E8%BF%9C%E7%A8%8B%E8%BF%9E%E6%8E%A5%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%B7%A5%E5%85%B7%E6%9C%89)

### 拓展

#### 下载拓展`Remote-SSH`

#### 配置config

::: tip 注意 User
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
