# Maven

Maven的作用：

项目构建：提供标准的，跨平台的自动化构建项目的方式

依赖管理：方便快捷的管理项目依赖的资源（jar包），避免资源间的版本冲突等问题

统一开发结构：提供标准的，统一的项目开发结构

## 下载

[3.6.1 版下载链接](https://archive.apache.org/dist/maven/maven-3/3.6.1/binaries/)

将压缩包放到任意目录（注意不要使用中文路径）

## 配置

修改maven安装包中的conf/settings.xml文件

1、指定本地仓库位置（约第55行）：

```xml
<localRepository>D:\APP\Java\maven-repo</localRepository>
```

2、远程仓库配置

maven默认连接的远程仓库位置并不在国内，因此有时候下载速度非常慢

我们可以配置一个国内站点镜像，可用于加速下载资源。

（约第160行）：

``` xml
<mirror>
  <id>alimaven</id>
  <name>阿里云仓库</name>
  <mirrorOf>*</mirrorOf>
  <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
</mirror>
```
