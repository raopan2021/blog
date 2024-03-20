# `git` 的基本使用

::: tip 来源
[菜鸟](https://www.runoob.com/git/git-create-repository.html)

[git ssh配置、密钥创建](https://www.jianshu.com/p/3f4b2ede5a93)

[如何将一个项目同时提交到GitHub和Gitee(码云)上](https://zhuanlan.zhihu.com/p/346400298)
:::

## 安装 `git`

[官网下载](https://git-scm.com/download/win)、安装（一直 `next` 就行了）

## 配置密钥 `ssh`

> 查看当前用户信息：

``` txt
git config user.name
```

``` txt
git config user.email
```

> 设置提交代码时的用户信息：

``` txt
git config --global user.name "raopan2021"
```

``` txt
git config --global user.email "raopan2021@outlook.com"
```

> 创建 `ssh`

``` txt
ssh-keygen -t rsa -C 'raopan2021@outlook.com'
```

之后不断Enter即可

> 查看你生成的公钥

``` txt
cat ~/.ssh/id_rsa.pub
```

输入该命令回车后，复制看到的公钥，是类似于这样的一串字符

``` txt
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDY01oB1yY4wbZj8T/
·······
kf82w4u+RZwyu4E20I6p7boP/EKjGXiDBw10/Qc= raopan2021@outlook.com
```

> 将 `ssh` 保存到 [gitee](https://gitee.com/profile/sshkeys) 、[github](https://github.com/settings/keys)

## git同时提交到 `gitee`、`github`

找到 `.git` 文件夹下面的 `config`文件修改，新增行：

``` txt {9,10}
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
        ignorecase = true
        precomposeunicode = true
[remote "origin"]
        url = https://github.com/raopan2021/blog.git
        url = https://gitee.com/raopan2021/blog.git 
        fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
        remote = origin
        merge = refs/heads/main
```

也就是说，在原来的github仓库地址下面再添加一个url配置，指向gitee的地址。

当然，这里有一个前提条件，Gitee和GitHub的账号的公私钥为同一套。

此时再修改本地代码，进行提交，你会发现GitHub和Gitee上的代码同时被修改了。是不是很cool？

## git commit 提交规范 & 规范校验

在多人协作项目中，如果代码风格统一、代码提交信息的说明准确，那么在后期协作以及Bug处理时会更加方便。

下面介绍怎么使用下面这个工具，在`git push` 代码之前检测 `commit messages`

### Commit message格式

`<type>: <subject>`

注意冒号后面有空格。

#### type

用于说明 commit 的类别，只允许使用下面7个标识。

- feat：新功能（feature）
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动

如果type为feat和fix，则该 commit 将肯定出现在 Change log 之中。

#### subject

subject是 commit 目的的简短描述，不超过50个字符，且结尾不加句号（.）。

### 使用工具校验commit是否符合规范

#### commitlint

全局安装

```bash
npm install -g @commitlint/cli @commitlint/config-conventional
```

生成配置配件

这个文件在根目录下生成就可以了。

```bash
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

在commitlint.config.js制定提交message规范

```js
"module.exports = {extends: ['@commitlint/config-conventional']}"

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      "feat", "fix", "docs", "style", "refactor", "test", "chore", "revert"
    ]],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never']
  }
};
```

上面我们就完成了commitlint的安装与提交规范的制定。检验commit message的最佳方式是结合git hook，所以需要配合Husky

### husky

husky继承了Git下所有的钩子，在触发钩子的时候，husky可以阻止不合法的commit,push等等。注意使用husky之前，必须先将代码放到git 仓库中，否则本地没有.git文件，就没有地方去继承钩子了。

```js
npm install husky --save-dev
```

安装成功后需要在项目下的package.json中配置

```json
"scripts": {
    "commitmsg": "commitlint -e $GIT_PARAMS",

 },
 "config": {
    "commitizen": {
      "path": "cz-customizable"
    }
  },
```

最后我们可以正常的git操作

可以在package.json下面添加如下的钩子。

```json
"husky": {
    "hooks": {
      "pre-commit": "npm run lint"
    }
  },
```

可参考 [Vue 2.7 + Vite 脚手架](../vue/vue2/index.md) 项目的配置
