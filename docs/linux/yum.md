# yum

## 更换YUM源

### 备份

```shell
cp /etc/yum.repos.d/*.repo /etc/yum.repos.d/backup/
```

### 删除原有YUM仓库文件

```shell
rm -rf /etc/yum.repos.d/CentOS-Base.repo
```

### 创建新的YUM源文件

使用文本编辑器（如vi, vim或nano）创建新的YUM源文件

```shell
vi /etc/yum.repos.d/CentOS-Base.repo
```

### 添加YUM源配置

::: code-group

```shell [阿里云的源]
[base]
name=CentOS-$releasever - Base - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos/$releasever/os/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-Key-CentOS7
 
[updates]
name=CentOS-$releasever - Updates - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos/$releasever/updates/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-Key-CentOS7
 
[extras]
name=CentOS-$releasever - Extras - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos/$releasever/extras/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-Key-CentOS7
 
[centos-plus]
name=CentOS-$releasever - Plus - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos/$releasever/centosplus/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-Key-CentOS7
```

```shell [华为云的源]
[base]
name=CentOS-$releasever - Base - mirrors.huaweicloud.com
baseurl=https://mirrors.huaweicloud.com/repository/centos/$releasever/os/$basearch/
gpgcheck=1
gpgkey=https://mirrors.huaweicloud.com/repository/centos/RPM-GPG-KEY
 
[updates]
name=CentOS-$releasever - Updates - mirrors.huaweicloud.com
baseurl=https://mirrors.huaweicloud.com/repository/centos/$releasever/updates/$basearch/
gpgcheck=1
gpgkey=https://mirrors.huaweicloud.com/repository/centos/RPM-GPG-KEY
 
[extras]
name=CentOS-$releasever - Extras - mirrors.huaweicloud.com
baseurl=https://mirrors.huaweicloud.com/repository/centos/$releasever/extras/$basearch/
gpgcheck=1
gpgkey=https://mirrors.huaweicloud.com/repository/centos/RPM-GPG-KEY
 
[centos-plus]
name=CentOS-$releasever - Plus - mirrors.huaweicloud.com
baseurl=https://mirrors.huaweicloud.com/repository/centos/$releasever/centosplus/$basearch/
gpgcheck=1
gpgkey=https://mirrors.huaweicloud.com/repository/centos/RPM-GPG-KEY
```

:::

### 保存文件并退出

按`Esc`键，然后输入`:wq`保存并退出

### 验证YUM源是否更换成功

``` bash
yum clean all
```

重新生成YUM缓存：

``` bash
yum makecache
```

验证YUM源是否更换成功：可以通过运行以下命令检查当前YUM源状态。

``` bash
yum repolist
```

您应该会看到使用的新源的名称以及可用的包数量。

## 安装常用软件

```shell
yum install wget -y
yum install curl -y
yum install git -y
```
