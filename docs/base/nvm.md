# `nvm` - `node` 版本管理工具

由于不同项目依赖的node版本可能不同，所以在维护多个项目时通常需要使用不同的node版本，这时候用nvm来切换不同的node版本就很方便。

 <a href="https://github.com/nvm-sh/nvm/blob/master/README.md" target="_blank">官方文档</a>

 <a href="https://nvm.uihtm.com/" target="_blank">nvm使用手册</a>



## nvm下载

当前最新版本是 1.1.12 ， 建议安装最新版（2023-6）

[国内下载链接](https://nvm.uihtm.com/)


## 常用命令

显示nvm版本。
```js
nvm version
```

显示可下载版本的部分列表
```js
nvm list available 
```

下载14.0.0版本的node
```js
nvm install 14.0.0
```

使用14.0.0版本的node
```js
nvm use 14.0.0 
```

列出所有安装的node版本
```js
nvm list
```




## `nvm` 和 `npm` 切换国内镜像

1、安装 [chsrc 换源工具](https://gitee.com/RubyMetric/chsrc)

```bash
curl -L https://gitee.com/RubyMetric/chsrc/releases/download/preview/chsrc-x64-windows.exe -o chsrc.exe
```

2、检测用户网络最快的npm源

``` bash
chsrc set node
```

结果：
```bash {8}
C:\Users\raopa>chsrc set node
√ 命令 npm 存在
× 命令 yarn 不存在
chsrc: 测速 https://npmmirror.com/ ... 2.62 MByte/s
chsrc: 测速 https://mirrors.zju.edu.cn/ ... 3.03 MByte/s
chsrc: 最快镜像站: 浙江大学开源软件镜像站
chsrc: 选中镜像站: ZJU (zju)
chsrc: 运行 npm config set registry https://mirrors.zju.edu.cn/npm
chsrc: 感谢镜像提供方: 浙江大学开源软件镜像站
```

3、切换源

``` bash
npm config set registry https://mirrors.zju.edu.cn/npm
```

3、查看源

``` bash
npm config get registry
```
结果：
https://mirrors.zju.edu.cn/npm

## nvm所有命令

- `nvm arch`：显示node是运行在32位还是64位。
- `nvm install <version> [arch]` ：安装node， version是特定版本也可以是最新稳定版本latest。可选参数arch指定安装32位还是64位版本，默认是系统位数。可以添加--insecure绕过远程服务器的SSL。
- `nvm list [available]` ：显示已安装的列表。可选参数available，显示可安装的所有版本。list可简化为ls。
- `nvm on` ：开启node.js版本管理。
- `nvm off` ：关闭node.js版本管理。
- `nvm proxy [url]` ：设置下载代理。不加可选参数url，显示当前代理。将url设置为none则移除代理。
- `nvm node_mirror [url]` ：设置node镜像。默认是https://nodejs.org/dist/。 如果不写url，则使用默认url。设置后可至安装目录settings.txt文件查看，也可直接在该文件操作。
- `nvm npm_mirror [url]` ：设置npm镜像。https://github.com/npm/cli/archive/。 如果不写url，则使用默认url。设置后可至安装目录settings.txt文件查看，也可直接在该文件操作。
- `nvm uninstall <version>` ：卸载指定版本node。
- `nvm use [version] [arch]` ：使用制定版本node。可指定32/64位。
- `nvm root [path]` ：设置存储不同版本node的目录。如果未设置，默认使用当前目录。
- `nvm version` ：显示nvm版本。version可简化为v。
