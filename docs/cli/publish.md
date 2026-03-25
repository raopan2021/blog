# 上传到 `npm`

## 登录注册 `npm` 账号

```bash
npm login
```

## 上传

::: tip
上传前需要注意，npm需要切换到官方源，否则会报错

```bash
npm config set registry https://registry.npmjs.org/
```

:::

```bash
npm publish
```

## 取消发布

```bash
npm unpublish raopancli@1.0.15 --force
```
