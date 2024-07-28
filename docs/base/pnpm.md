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

