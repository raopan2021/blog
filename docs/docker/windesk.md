# 在windows安装Docker Desktop

## 安装

下载安装包

[下载地址](https://www.docker.com/products/docker-desktop)

防止 C 盘空间过小，安装 Docker Desktop 到 D 盘

``` bash
start /w "" "Docker Desktop Installer.exe" install --installation-dir=D:\IDEs\Docker
```

启动

## 修改软件为中文

根据docker版本，下载对应的 asar 中文包

[下载 app-4.34-windows-x86.asar](https://github.com/asxez/DockerDesktop-CN)

## 修改镜像存储位置

- 点击Resources， 点击Advanced
- 修改Docker Root Dir的路径，例如 `D:\IDEs\DockerImages\DockerDesktopWSL`

## 配置镜像加速

- 打开docker desktop
- 点击设置按钮
- 点击Docker Engine
- 在json中添加镜像加速地址

```json
{
    "registry-mirrors": [
        "https://dockerproxy.net",
        "https://dockerproxy.com"
    ]
}
```

- 点击Apply & Restart
