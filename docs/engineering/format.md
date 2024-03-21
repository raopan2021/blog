# 如何检查代码规范

规范制订下来了，那怎么确保它被严格执行呢？目前有两个方法：

1. 使用工具校验代码格式。
2. 利用 code review 审查变量命名、注释。

建议使用这两个方法双管齐下，确保代码规范被严格执行。

下面让我们来看一下，如何使用工具来校验代码格式。

## ESLint

> ESLint最初是由Nicholas C. Zakas 于2013年6月创建的开源项目。它的目标是提供一个插件化的javascript代码检测工具。

1. 下载依赖

eslint-config-airbnb-base 使用 airbnb 代码规范

``` bash
npm i -D babel-eslint eslint eslint-config-airbnb-base eslint-plugin-import
```

2. 配置 `.eslintrc` 文件

```json
{
    "parserOptions": {
        "ecmaVersion": 2019
    },
    "env": {
        "es6": true,
    },
    "parser": "babel-eslint",
    "extends": "airbnb-base",
}
```

3. 在 `package.json` 的 `scripts` 加上这行代码 `"lint": "eslint --ext .js test/ src/"`。

然后执行 `npm run lint` 即可开始验证代码。

代码中的 `test/ src/` 是要进行校验的代码目录，这里指明了要检查 `test`、`src` 目录下的代码。

> 不过这样检查代码效率太低，每次都得手动检查。并且报错了还得手动修改代码。

为了改善以上缺点，我们可以让 VSCode 在每次保存代码的时候，自动验证代码并进行格式化，省去了动手的麻烦（下一节讲如何使用 VSCode 自动格式化代码）。

## 使用 VSCode 自动格式化代码

### 安装 VSCode 插件 ESLint

选择 `File` -> `Preference`-> `Settings`（如果装了中文插件包应该是 文件 -> 选项 -> 设置），搜索 eslint，点击 `Edit in setting.json`。

将以下选项添加到配置文件

```js
"editor.codeActionsOnSave": {
    "source.fixAll": true,
},
"eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
],
"eslint.alwaysShowStatus": true,
"stylelint.validate": [
    "css",
    "less",
    "postcss",
    "scss",
    "sass"
],
```

同时要确保 VSCode 右下角的状态栏 ESlint 是处于工作状态的。如果右下角看不到 Eslint 的标识，请按照上面讲过的步骤打开 `setting.json`，加上这行代码：

```js
"eslint.alwaysShowStatus": true,
```

配置完之后，VSCode 会根据你当前项目下的 `.eslintrc` 文件的规则来验证和格式化代码。

### 项目安装 eslint 插件

``` bash
npm i -D eslint eslint-config-airbnb-vue3-ts
```

添加 `.eslintrc` 文件，具体配置项为：

``` js
module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
        jest: true,
    },
    extends: ['eslint-config-airbnb-vue3-ts'],
    rules: {
        
    },
}
```

在根目录下的 `package.json` 文件的 `scripts` 选项里添加以下配置项：

```json
"scripts": {
  "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
},
```

修改完后，现在 js ts vue 文件都可以自动格式化了。

## stylelint 格式化代码

### 项目安装依赖

``` bash
npm i -D sass stylelint stylelint-config-standard-scss stylelint-scss
```

在项目根目录下新建一个 `.stylelintrc.js` 文件，并输入以下内容：

```js
module.exports = {
    extends: [
        'stylelint-config-standard-scss',
    ],
    rules: {
        indentation: 4,
        'media-feature-range-notation': null,
        'alpha-value-notation': ['number'],
        'color-function-notation': ['legacy'],
        'no-descending-specificity': null,
        'font-family-no-missing-generic-family-keyword': null,
        'selector-type-no-unknown': null,
        'at-rule-no-unknown': null,
        'no-duplicate-selectors': null,
        'no-empty-source': null,
        'selector-class-pattern': null,
        'selector-pseudo-class-no-unknown': [
            true,
            { ignorePseudoClasses: ['global', 'deep'] },
        ],
        'scss/at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: ['tailwind'],
            },
        ],
    },
};
```

### VSCode 添加 `stylelint` 插件

然后就可以看到效果了。

如果你想修改插件的默认规则，可以看[官方文档](https://github.com/stylelint/stylelint/blob/5a8465770b4ec17bb1b47f359d1a17132a204a71/docs/user-guide/rules/list.md)，它提供了 170 项规则修改。

## 格式化 HTML 文件

如何格式化 HTML 文件中的代码？这需要利用 VSCode 自带的格式化，快捷键是 `shift + alt + f`。

假设当前 VSCode 已经打开了一个 HTML 文件，按下 `shift + alt + f` 会提示你选择一种格式化规范。

如果没提示，那就是已经有默认的格式化规范了，然后 HTML 文件的所有代码都会格式化，并且格式化规则还可以自己配置。

## 踩坑

### 忽略 `.vue` 文件中的 HTML 模板验证规则无效

举个例子，如果你将 HTML 模板每行的代码文本长度设为 100，当超过这个长度后 eslint 将会报错。此时如果你还是想超过这个长度，可以选择忽略这个规则：

``` js
/* eslint-disable max-len */
```

注意，以上这行忽略验证的代码是不会生效的，因为这个注释是 JavaScript 注释，我们需要将注释改为 HTML 格式，这样忽略验证才会生效：

``` html
<!-- eslint-disable max-len -->
```

## Code Review 代码审查

代码审查是指让其他人来审查自己代码的一种行为。审查有多种方式：例如结对编程（一个人写，一个人看）或者统一某个时间点大家互相做审查（单人或多人）。

代码审查的目的是为了检查代码是否符合代码规范以及是否有错误，另外也能让评审人了解被审人所写的功能。经常互相审查，能让大家都能更清晰地了解整个项目的功能，这样就不会因为某个核心开发人员离职了而引起项目延期。

当然，代码审查也是有缺点的：一是代码审查非常耗时，二是有可能引发团队成员争吵。据我了解，目前国内很多开发团队都没有代码审查，包括很多大厂。

个人建议在找工作时，可以询问一下对方团队是否有测试规范、测试流程、代码审查等。如果同时拥有以上几点，说明是一个靠谱的团队，可以优先选择。
