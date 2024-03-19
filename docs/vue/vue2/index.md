# Vue 2

## Vue 2.7 + Vite 脚手架

开箱即用的脚手架模板，脚手架的功能可以看下面的功能列表小节，并且配备完整的技术文档。

可以直接使用，也可以当作学习源码。

[Vue2.7 + Vite + Less + Eslint + Stylelint + Commitlint 工程化脚手架。](https://github.com/raopan2021/Vue2.7-Vite-Template)

## 教程目录

1. 工程化实践
    - [Eslint 格式化 JS 代码](./eslint)
    - [Stylelint 格式化 CSS 代码](./stylelint)
    - [Husky 提交时自动格式化代码](./husky)
    - [Commitlint 校验 Commit Message](./commitlint)

2. 更多功能
    - [Axios 封装及接口管理](./axios)
    - [Css 样式处理](./css)
    - [Vite 基础配置](./vite)

## 基础搭建

使用 [pnpm](https://pnpm.io/zh/) 来作为本项目的包管理工具。

```bash
# 安装依赖
pnpm i

# 运行
pnpm run dev

# 打包
pnpm run build

# 打包文件预览
pnpm run preview
```

::: tip 开发环境

> node v16.13.1（大于 14 版本即可）

> pnpm v6.30.0
:::


### vscode插件安装

此脚手架必须安以下依赖才能保证，代码自动格式化的有效运行：

- Vetur
- EditorConfig for VS Code
- ESLint
- Stylelint

## 功能列表

- [x] Vue2.7 + Vite
- [x] Eslint、Stylelint、Commitlint 统一开发规范
- [x] husky + lint-staged （git commit 时自动格式化代码）
- [x] Vue 全家桶集成
- [x] Axios 封装及接口管理
- [x] Css 样式处理
- [x] vite.config.js 基础配置
- [x] 跨域配置
- [x] 多环境变量配置
- [x] 浏览器构建兼容性
