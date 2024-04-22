# 安装配置

## 下载

[官网](https://dev.mysql.com/downloads/mysql/)

[阿里云镜像](https://mirrors.aliyun.com/mysql/)

## 环境变量配置

[教程](https://zhuanlan.zhihu.com/p/373515920)

新建变量名：MYSQL_HOME

变量值（你的mysql解压到位置）：`D:\APP\mysql-5.7.38-winx64`

---

Path变量添加： `%MYSQL_HOME%\bin`

---

保存后退出；

在终端测试：输入 `mysql`，如果出现以下提示，安装成功！

``` txt
C:\Users\raopa>mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.7.38 MySQL Community Server (GPL)

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```

## 配置my.ini文件

在你的mysql目录下新建my.ini文件，内容为：

``` txt
[mysqld]
#端口号
port = 3306
#mysql-5.7.27-winx64的路径
basedir=D:\APP\mysql-5.7.38-winx64
#mysql-5.7.27-winx64的路径+\data
datadir=D:\APP\mysql-5.7.38-winx64\data 
#最大连接数
max_connections=200
#编码
character-set-server=utf8

default-storage-engine=INNODB

sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES

[mysql]
#编码
default-character-set=utf8
```

## 安装MySQL

1、进入`管理员终端`

2、输入安装命令：

`mysqld -install`

若出现`Service successfully installed`，证明安装成功；

如出现`Install of the Service Denied`，则说明没有以`管理员权限`来运行cmd!

3、然后继续输入命令：

`mysqld --initialize`

此时不会有任何提示。

4、再输入启动命令：

`net start mysql`

正常会提示启动成功！
