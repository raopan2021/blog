# gitee pages 部署 Vue 单页应用注意事项

<a href="https://www.jianshu.com/p/2751d0ceef94" target="_blank">原网址</a>

### **1、根目录下添加 `.spa` 文件**

内容为空，主要是为了用于自动切换 Nginx 的 404 配置，`Gitee Pages` 服务器的 `Nginx` 规则就会自动变为

```
try_files $uri $uri.html /index.html $uri/ =404;
```

当根目录没有 `.spa` 文件的时候，`Gitee Pages` 服务器的 `Nginx` 规则跟原来的一致，为

```
try_files $uri $uri.html $uri.md $uri/ =404;
```

### 2、**`vue.config.js` 配置中的 `publicPath` 配置**

```js
const BASE_URL = process.env.NODE_ENV === "production" ? "/Blog/" : "/";
module.exports = {
  publicPath: BASE_URL,
}
```

> 解释：当变量 `process.env.NODE_ENV` 为生产环境时，将 `BASE_URL` 设置为项目名称，这是因为使用 gitee pages 部署的应用，默认根路径为 `http://xxx.gitee.io/`，如果不修改 `publicPath` ，则你的应用中的资源请求都将会从根路径去找，结果就是出现 **404**，找不到你的资源，因为你的资源都存放在 `http://xxx.gitee.io/` 下面的项目目录中，比如你在 `gitee` 上的项目名称为 `myblog`，那么上面代码中的 `"/yourProjName/"` 就应为 `"/myblog/"`

### 3、注意静态资源

> 将项目中**使用了 `/` 开头的绝对路径写法去引用 public 静态资源的 `URI` 改掉**。如果是写在 Html 部分 `<template>...</template>` 里面的，则可以直接将打头的 `/` 去掉，如 `<img src="/img/test.jpg" />` 改为 `<img src="img/test.jpg" />`。如果写在 Css 部分 `<style></style>` 里面的，如 `background: url("/img/test.jpg")`，那你还是把 public 里面对应的资源挪到 asstes 下面吧……因为我也没找到其他解决办法 ε=(´ο｀*)))唉

### 4、`.gitignore`注释掉 /dist

> 因为我们最终部署上去的应用，就在这里面，所以我们必须将它上传到 gitee

```
.DS_Store
node_modules
# /dist
```

### 5、npm run biuld

### 6、推送到gitee

### 7、Gitee Pages部署

部署分支：master

部署目录：dist

万事大吉！
