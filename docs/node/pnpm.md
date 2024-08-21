# pnpm

## 安装 pnpm

``` bash
npm i -g pnpm
```

## 查看当前pnpm版本

``` bash
pnpm -v
```

## 获取当前配置的镜像地址

``` bash
pnpm get registry
```

or

``` bash
pnpm config get registry
```

## 配置全局镜像源

``` bash 设置新的镜像地址
pnpm set registry https://registry.npmmirror.com
```

也可以在 `C:\Users\raopa` 目录下，查看 `.npmrc` 文件

在项目根目录的 `.npmrc` 文件里，配置镜像地址，会覆盖全局镜像地址

## 安装包

安装软件包及其依赖的任何软件包

``` bash
pnpm add vue
```

用于安装项目所有依赖

``` bash
pnpm install
```

## 卸载包

``` bash
pnpm uninstall -g vue
```

## 修改默认的安装包安装路径

默认安装包路径位置是C盘的Local目录下，占据C盘宝贵位置

允许设置全局安装包的 bin 文件的目标目录。

``` bash
pnpm config set global-bin-dir "D:\pnpm-store"
```

包元数据缓存的位置。

``` bash
pnpm config set cache-dir "D:\pnpm-store\pnpm-cache"
```

pnpm 创建的当前仅由更新检查器使用的 pnpm-state.json 文件的目录。

``` bash
pnpm config set state-dir "D:\pnpm-store\pnpm-state"
```

指定储存全局依赖的目录。

``` bash
pnpm config set global-dir "D:\pnpm-store\global"
```

所有包被保存在磁盘上的位置。（可选，以下这条命令可以选择不执行也是OK的）

``` bash
pnpm config set store-dir "D:\pnpm-store\pnpm-store"
```

## 在项目本地配置 `.npmrc`

``` bash
registry=https://registry.npmmirror.com

# 提升依赖项到根目录的 node_modules 。因为某些依赖项需要提升到根目录的 node_modules 下才生效，比如 gulp 。
shamefully-hoist=true

# pnpm 将使用类 bash shell 的 JavaScript 实现来执行脚本。此选项简化了跨平台脚本。
shell-emulator=true

# 禁用 strict 模式（即 strict-peer-dependencies=false）后，即使应用程序没有严格按照库所声明的版本范围安装对应的 peer dependencies，包管理器也不会抛出错误或阻止操作继续。这提供了更大的灵活性，但也可能隐藏潜在的版本兼容性问题。
strict-peer-dependencies=false
```
