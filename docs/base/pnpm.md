# `pnpm` 的基本使用

::: tip 来源
[官网](https://pnpm.io/zh/)
:::

::: danger 我这个项目，想换 `pnpm` 试试，启动不起来，放弃了 
:::



## 安装 `pnpm` 

[官网](https://pnpm.io/zh/installation)


## 换源(淘宝)

``` js
// 查看源
pnpm get registry 
// 临时修改
pnpm --registry https://registry.npm.taobao.org install any-touch
// 持久使用
pnpm config set registry https://registry.npm.taobao.org
// 还原
pnpm config set registry https://registry.npmjs.org
```


## 日常使用

- `pnpm add <pkg>`

安装软件包及其依赖的任何软件包。

- `pnpm install` 

用于安装项目所有依赖.



## 修改 node_module 包方法

### 1. 直接修改

通过 `pnpm store status` 查看状态（仅当前应用下有效果）

通过 `pnpm install --force` 去生新捕获修改后的原文件。

### 2. pnpm patch

通过 `pnpm patch` 得到临时目录，修改后，通过 `pnpm patch-commit <path>` 进行打补丁的方式。

### 3. pnpm link

下载源包去 `pnpm link` 同 npm。



## 修改国内源

同 npm，修改 `.npmrc` 或者直接 config 命令实现，如修改 cnpm 的源：

```
registry=https://registry.npmmirror.com
```
