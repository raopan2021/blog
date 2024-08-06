# 脚手架实操

创建一个模拟 `vite` 的脚手架

1. 按照下面的项目目录结构，创建项目；
2. `pnpm init` 初始化项目，并安装依赖 `pnpm add commander fs-extra inquirer chalk figlet ora`；
3. 在 `package.json` 中添加 `type` 字段为`module`；
4. 在 `package.json` 中添加 `bin` 字段，指定入口文件`"rpcli": "./bin/index.js"`；
5. `npm link` 将项目链接到全局，这样就可以在命令行中直接使用 `rpcli` 命令了；
6. 在 `bin` 目录下创建 `index.js`，`printLogo.js`，`options.js` 文件；
7. 从 [vite的仓库](https://github.com/vitejs/vite/tree/main/packages/create-vite) 复制 `template模板` 到项目的 `lib` 目录；
8. 测试一下；
9. [上传到 `npm`](./publish.md)。

::: code-group

``` md [项目目录结构]
 --- package.json
 |
 --- bin
 |    |--- addversion.js
 |    |--- create.js
 |    |--- delete_node_modules.js
 |    |--- index.js
 |    |--- print.js
 |    |--- printLogo.js
 |    |--- run.js
 --- lib
      |--- template-lit-ts
      |--- template-lit
      |--- template-preact-ts
      |--- template-preact
      |--- template-qwik-ts
      |--- template-qwik
      |--- template-react-ts
      |--- template-react
      |--- template-solid-ts
      |--- template-solid
      |--- template-svelte-ts
      |--- template-svelte
      |--- template-vanilla-ts
      |--- template-vanilla
      |--- template-vue-ts
      |--- template-vue
```

<<< ./demo/pkg.json {6-9,16-23} [package.json]
<<< ./demo/addversion.js
<<< ./demo/create.js
<<< ./demo/delete_node_modules.js
<<< ./demo/index.js
<<< ./demo/print.js
<<< ./demo/printLogo.js
<<< ./demo/run.js

:::
