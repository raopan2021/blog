# Git 提交规范

Git 规范一般包括：

1. Git Flow 规范
2. 分支管理规范
3. git commit 规范

## Git Flow 规范

Git Flow 规范网上已经有非常多的文章去讲解了，这里也不再细说，贴一个我比较常用的 Git Flow 流程图，和主流常用的大同小异。

![Git Flow](/engineering/git-flow.png)

## 分支管理规范

### 命名

分支命名以 `feature/xx-xx` `fix/xx-xx` 的格式命名，中间用短横线 `-` 连接。

### 分支管理

项目需要根据环境的不同创建对应的分支：

- master（线上环境）
- develop（开发环境）
- test（测试环境）
- feature/xxx（功能分支）
- fix/xxx（修复分支）
- 其他...

### 开发新功能

当团队成员开发新功能时，需要从 `master` 分支上拉一个 `feature/功能名称-开发姓名` 分支进行开发，例如：`feature/login-tgz`。开发完成后需要合并到 `develop` 分支进行部署测试。

### 修改 bug

当团队成员修改线上 bug 时，需要从 `master` 分支拉一个 `fix/功能名称-bug号/bug现象` 分支进行修复，例如：`fix/login-404`。
修复完成并通过测试后再合并到 `master` 分支进行部署。

以 `feature` 或 `fix` 开始的分支都属于临时分支，在通过测试并上线后需要将临时分支进行删除。避免 git 上出现太多无用的分支。

### 合并分支

在将一个分支合并到另一个分支时（例如将 `feature/*` 合并到 develop），需要查看自己的新分支中有没有多个重复提交或意义不明的 commit。如果有，则需要对它们进行合并（git rebase）。示例：

```bash
# 这两个 commit 可以合并成一个
chore: 修改按钮文字
chore: 修改按钮样式

# 合并后
chore: 修改按钮样式及文字
```

**注意**，在将分支合并到另一分支前，例如将 `feature/*` 合并到 `develop`。需要先拉取 `develop` 的最新更新，然后回到 `feature/*`，执行 `git rebase develop` 操作，再提交，最后提合并分支操作。

### 标签备份

每次代码上线时，均要对当前的线上环境分支（例如 master）进行打标签处理，用作备份。当线上环境出现问题时，可以快速回滚。标签命名有两种方式：

1. 版本号命名，适合移动端 APP 或组件库
2. 用时间+当天发布次数命名，例如 20230319-1，这种命名方式一般用于业务项目。

## Git Commit Message 规范

git 在每次提交时，都需要填写 commit message。

```bash
git commit -m 'this is a test'
```

commit message 就是对你这次的代码提交进行一个简单的说明，好的提交说明可以让人一眼就明白这次代码提交做了什么。

既然明白了 commit message 的重要性，那我们就更要好好的学习一下 commit message 规范。下面让我们看一下 commit message 的格式：

```md
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

我们可以发现，commit message 分为三个部分(使用空行分割):

1. 标题行（subject）: 必填, 描述主要修改类型和内容。
2. 主题内容（body）: 描述为什么修改, 做了什么样的修改, 以及开发的思路等等。
3. 页脚注释（footer）: 可以写注释，放 BUG 号的链接。

### type

commit 的类型：

- feat: 新功能、新特性
- fix: 修改 bug
- perf: 更改代码，以提高性能（在不影响代码内部行为的前提下，对程序性能进行优化）
- refactor: 代码重构（重构，在不影响代码内部行为、功能下的代码修改）
- docs: 文档修改
- style: 代码格式修改, 注意不是 css 修改（例如分号修改）
- test: 测试用例新增、修改
- build: 影响项目构建或依赖项修改
- revert: 恢复上一次提交
- ci: 持续集成相关文件修改
- chore: 其他修改（不在上述类型中的修改）
- release: 发布新版本

### scope

commit message 影响的功能或文件范围, 比如: route, component, utils, build...

### subject

commit message 的概述

### body

具体修改内容, 可以分为多行.

### footer

一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.

### 约定式提交规范

以下内容来源于：[conventionalcommits.org/zh-hans](https://www.conventionalcommits.org/zh-hans/v1.0.0-beta.4/)

- 每个提交都必须使用类型字段前缀，它由一个名词组成，诸如 `feat` 或 `fix` ，其后接一个可选的作用域字段，以及一个必要的冒号（英文半角）和空格。
- 当一个提交为应用或类库实现了新特性时，必须使用 `feat` 类型。
- 当一个提交为应用修复了 `bug` 时，必须使用 `fix` 类型。
- 作用域字段可以跟随在类型字段后面。作用域必须是一个描述某部分代码的名词，并用圆括号包围，例如： `fix(parser):`
- 描述字段必须紧接在类型/作用域前缀的空格之后。描述指的是对代码变更的简短总结，例如： `fix: array parsing issue when multiple spaces were contained in string.`
- 在简短描述之后，可以编写更长的提交正文，为代码变更提供额外的上下文信息。正文必须起始于描述字段结束的一个空行后。
- 在正文结束的一个空行之后，可以编写一行或多行脚注。脚注必须包含关于提交的元信息，例如：关联的合并请求、Reviewer、破坏性变更，每条元信息一行。
- 破坏性变更必须标示在正文区域最开始处，或脚注区域中某一行的开始。一个破坏性变更必须包含大写的文本 `BREAKING CHANGE`，后面紧跟冒号和空格。
- 在 `BREAKING CHANGE:` 之后必须提供描述，以描述对 API 的变更。例如： `BREAKING CHANGE: environment variables now take precedence over config files.`。
- 在提交说明中，可以使用 `feat` 和 `fix` 之外的类型。
- 工具的实现必须不区分大小写地解析构成约定式提交的信息单元，只有 `BREAKING CHANGE` 必须是大写的。
- 可以在类型/作用域前缀之后，: 之前，附加 `!` 字符，以进一步提醒注意破坏性变更。当有 `!` 前缀时，正文或脚注内必须包含 `BREAKING CHANGE: description`

## 示例

### fix（修复BUG）

每次 git commit 最好加上范围描述。

例如这次 BUG 修复影响到全局，可以加个 global。如果影响的是某个目录或某个功能，可以加上该目录的路径，或者对应的功能名称。

```js
// 示例1
fix(global):修复checkbox不能复选的问题
// 示例2 下面圆括号里的 common 为通用管理的名称
fix(common): 修复字体过小的BUG，将通用管理下所有页面的默认字体大小修改为 14px
// 示例3
fix(test): value.length -> values.length
```

### feat（添加新功能或新页面）

```js
feat: 添加网站主页静态页面

这是一个示例，假设对任务静态页面进行了一些描述。
 
这里是备注，可以是放 BUG 链接或者一些重要性的东西。
```

### chore（其他修改）

chore 的中文翻译为日常事务、例行工作。顾名思义，即不在其他 commit 类型中的修改，都可以用 chore 表示。

```js
chore: 将表格中的查看详情改为详情
```

其他类型的 commit 和上面三个示例差不多，在此不再赘述。

## 验证 git commit 规范

利用 [git hook](https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90) 能在特定的重要动作发生时触发自定义脚本。

验证 git commit 规范也不例外，我们需要通过 git 的 `pre-commit` 钩子函数来进行。当然，你还需要下载一个辅助插件 husky 来帮助你进行验证。

>pre-commit 钩子在键入提交信息前运行，它用于检查即将提交的快照。

husky 是一个开源的工具，使用它我们可以配置相关的 `git hook` 脚本。下面让我们看一下如何使用：

下载 `husky`

``` bash
npm i -D husky
```

第一次使用需要执行 `husky install` 初始化，但是为了方便，最好把命令写到 `package.json` 里，以后每次重新安装依赖都会自动初始化：

``` bash
npm set-script prepare "husky install"
npm run prepare
```

初始化后，根目录下会生成一个 `.husky` 目录（这个一般情况下不需要动）。接下来就可以自己添加需要监听的 git 相关钩子了。

``` bash
npx husky add .husky/pre-commit "npm run lint"
```

这行命令会成一个 `pre-commit` 文件（文件内容为 `npm run lint`），在 git 的 `pre-commit` 钩子触发时，就会去执行这个文件的代码。

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
```

这里介绍一下比较常用的三个钩子的含义：

1. `pre-commit`，在 `git commit` 提交消息前执行，一般用来执行 lint，校验代码格式。
2. `commit-msg`，在 `git commit` 提交消息时执行，一般用来验证消息是否符合规范。
3. `pre-push`，在推送前执行，一般用于执行测试。

现在我们来实践一下，创建一个 `commit-msg` 钩子文件。

首先在项目根目录下新建一个文件夹 `scripts`，并在下面新建一个文件 `verify-commit.js`，输入以下代码：

```js
// eslint-disable-next-line import/no-extraneous-dependencies
const chalk = require('chalk')

const msgPath = process.argv[2]
const msg = require('fs')
.readFileSync(msgPath, 'utf-8')
.trim()

const commitRE = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|release)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
    console.log()
    console.error(
        `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
            '不合法的 commit 消息格式',
        )}\n\n`
          + chalk.red(
              '  请使用正确的提交格式:\n\n',
          )
          + `    ${chalk.green('feat: add \'comments\' option')}\n`
          + `    ${chalk.green('fix: handle events on blur (close #28)')}\n\n`
          + chalk.red('  请查看 git commit 提交规范：https://github.com/woai3c/Front-end-articles/blob/master/git%20commit%20style.md。\n'),
    )

    process.exit(1)
}
```

然后再创建 `commit-msg` 钩子文件

``` bash
npx husky add .husky/commit-msg "FORCE_COLOR=1 node scripts/verify-commit.js $1"
```

这样每次提交消息的时候，都会执行 `FORCE_COLOR=1 node scripts/verify-commit.js $1` 去验证消息格式了（FORCE_COLOR=1 是为了在终端让文字可以显示颜色，$1 是 git commit msg 的文件地址）。

通过工具，我们可以很好的管理团队成员的 git commit 格式，无需使用人力来检查，大大提高了开发效率。

另外，我提供了一个简单的工程化 [DEMO](https://github.com/woai3c/front-end-engineering-demo)。它包含了自动格式化代码和 git 验证，如果看完文章还是不知道如何配置，可以参考一下。

## lint-staged 只对 git 暂存区上的文件进行校验

使用 `lint-staged` 可以只对 git 暂存区上的文件进行校验，不需要对所有的文件进行 lint 检查。

安装 `lint-staged`

``` bash
npm i -D lint-staged
```

在 `package.json` 中加上这段代码：

```json
"lint-staged": {
  "src/**/*.{js,jsx,ts,tsx}": "eslint",
  "test/**/*.{js,jsx,ts,tsx}": "eslint"
},
```

然后把 `pre-commit` 文件中的 `npm run lint` 改为 `npx lint-staged`。

**文件过滤说明**：

```json
{
    "*.js": "项目下所有的 js 文件（不包含子文件夹）",
    "**/*.js": "项目下所有的 js 文件",
    "src/*.js": "src 目录所有的 js 文件（不包含子文件夹）",
    "src/**/*.js": "src 目录所有的 js 文件",
}
```

**多个后缀匹配**：

```json
"lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": "eslint",
  },
```
