# Commitlint 提交信息校验

我们在使用 `git commit` 时，git 会记录每一次的 `commit message`（提交信息）。

正确的描述 `commit message` 在多人协同开发一个项目时，显得尤其重要。

这里我们可以看一下 `angular` 的 [`commit message`](https://github.com/angular/angular/commits/main)，会发现它的描述特别的清晰明了。

而 [`commitlint`](https://commitlint.js.org/#/) 就是对 `commit message` 进行的检查的一个工具，当不规范时会终止提交。

## 示例

feat(eslint): 集成 eslint - xcder - 2022.07.01

1. Vscode 安装 Eslint 插件即可在保存时自动格式化
2. 运行 pnpm lint:eslint 可全局进行代码格式化

可以浏览 docs/1.工程化实践/1.eslint 文件了解详情。

## 使用方法

### 1.  安装依赖

- `@commitlint/cli`- Commitlint 本体

- `@commitlint/config-conventional`- 通用的提交规范

```bash
pnpm add @commitlint/cli @commitlint/config-conventional -D
```

### 2.  创建 commitlint 配置

在根目录添加一个 `.commitlintrc.js` 文件，内容如下：

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

### 3.  在 git `commit-msg` 时进行检查

执行下面这条命令即可：

```bash
pnpm husky add .husky/commit-msg "pnpm commitlint --edit $1"
```

## 格式

配置完成之后就可以在每次 `git commit` 时对 `commit message` 进行校验了，规范有两种格式：单行信息和多行信息。

### 1.  单行信息

用于业务代码提交时使用，业务代码一般来说更改比较多而且无法具体说明其信息，具体的还需要看产品文档，所以用单行信息即可。

```xml
<type>(<scope>): <subject>
```

### 2.  多行信息

用于提交一些不经常更改的功能型代码时使用，如：某个功能函数的新增、修改或重构，目录结构的调整（工程化调整），架构的更改等，这些我们需要进行详细说明防止出现遗忘。

```xml
<type>(<scope>): <subject>
<BLANK LINE> // 空行
<body>
<BLANK LINE>
<footer>
```

### 字段描述

- `type` 类型
- `scope` 影响的范围, 比如: \*（全局），route, component, utils, build，readme，css 等，
- `subject` 概述, 建议符合 [50/72 formatting](https://link.zhihu.com/?target=https%3A//stackoverflow.com/questions/2290016/git-commit-messages-50-72-formatting)
- `body` 具体修改内容，描述为什么修改, 做了什么样的修改, 以及开发的思路等等，可以分为多行, 建议符合 [50/72 formatting](https://link.zhihu.com/?target=https%3A//stackoverflow.com/questions/2290016/git-commit-messages-50-72-formatting)
- `footer` 一些备注, 通常是 Breaking Changes（重要改动） 或 Closed Issues（修复 Bug 的链接）

`type` 类型有以下几种：

| 类型     | 描述                                 |
| :------- | :----------------------------------- |
| build    | 发布版本                             |
| chore    | 改变构建流程、或者增加依赖库、工具等 |
| ci       | 持续集成修改                         |
| docs     | 文档修改                             |
| feat     | 新特性                               |
| fix      | 修改问题                             |
| perf     | 优化相关，比如提升性能、体验         |
| refactor | 代码重构                             |
| revert   | 回滚到上一个版本                     |
| style    | 代码格式修改                         |
| test     | 测试用例修改                         |
