# gitblit部署



<a href="https://blog.csdn.net/qq_38693757/article/details/127963673" target="_blank">原网址</a>

### 安装Java

略过

打开cmd，输入 java -version ， 显示了java的版本则为成功

![img](https://img-blog.csdnimg.cn/666beebe0f234dda839121099518e00d.png)

### 下载gitblit

![img](https://img-blog.csdnimg.cn/61ff646df48746eea5896eca9e0fac13.png)

下载 gitblit ，下载完成后，不比安装，直接解压到你电脑的一个目录中即可

比如：D:\gitblit-1.9.1

### 创建资料目录

用来存储提交代码的资料目录，一定不要选系统盘，否则权限不够

比如：D:\GitRepository

### 修改配置

找到 data 中的 defaults.properties 文件，用记事本或者 Notepad++ 打开

![img](https://img-blog.csdnimg.cn/508a7766278a443bb1d4b0871e841483.png)



## 1.**git.repositoriesFolder**

改为你刚刚创建的资料目录，后面提交的代码都会存储在这个位置

![img](https://img-blog.csdnimg.cn/513921618deb4d0ca048e55652d20894.png)



## 2.**server.httpPort**

这里是设置 http 的端口号，下面是 https ，如果只用在局域网中，可以不用管

![img](https://img-blog.csdnimg.cn/47fd9421acde45d68c6ce800efb52854.png)



## 3.server.httpBindInterface

server.httpBindInterface 和 server.httpsBindInterface 这两个都是服务器的IP地址，，两个名字几乎一样，区别是一个是http，一个是 https，下图中写的是自己电脑局域网的IP地址，这个根据个人的 IP 进行设置

![img](https://img-blog.csdnimg.cn/153fc6204afb43f09462e07747ec735f.png)



## 4.installService.cmd

这个文件是安装 服务 程序，必须要改内部的目录，否则无法安装成功

![img](https://img-blog.csdnimg.cn/06af9abf35cb48188988681ec4f7c6bf.png)



amd64，代表的是 电脑系统是64位。

在 ARCH 下面加上一句

SET CD=D:\gitblit-1.9.1 **（根据自己的文件路径填写）**



注意下面的图片中，**路径不要有空格，否则安装服务是没有效果的。**

**错误演示：**

![img](https://img-blog.csdnimg.cn/7d092fd6c959458e9a47b99363760a81.png)



**正确写法：**

![img](https://img-blog.csdnimg.cn/689b355d7cff4af3887db82eca45b58b.png)



右键已管理员的身份运行，然后打开服务，找到 gitblit 则为成功

![img](https://img-blog.csdnimg.cn/01b62d39cae14766b67e118e68ed6b5e.png)

 启动服务后，在浏览器输入 http://192.168.71.88:8080/ （根据个人IP地址 和上面的设置的端口号）

 打开了当前界面则为成功![img](https://img-blog.csdnimg.cn/2ee9fe40af3e49f4acde2539969738d2.png)

### 卸载 gitblit

卸载 gitblit ，也要修改配置才可以卸载，否则是卸载不了的

打开 uninstallService.cmd 内容如下

![img](https://img-blog.csdnimg.cn/35fc4e6158dd406399b1897541db150f.png)

在里面加一句：SET CD=D:\gitblit-1.9.1

如下：

![img](https://img-blog.csdnimg.cn/9f33e74813a24019bd1ea3df74127ac1.png)

保存后，先关闭 gitblit 的服务，右键已管理员的身份运行 uninstallService.cmd

服务里找不到 gitblit 则为成功