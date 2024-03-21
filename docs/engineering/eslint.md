# ESLint 基本配置与使用

[参考](https://zhuanlan.zhihu.com/p/578214101)

ESLint 是 JavaScript 代码检查工具。

通常有2种使用方式：

1. 配合 VS Code 的 ESLint 插件来提示代并修复码格式错误
2. 在命令行使用，比如执行 eslint . --fix来检查并修复代码格式。

:::tip ESLint 也可通过插件来配置对其他语言（ HTML、Vue 等）进行代码检查。
:::

## 一、ESLint 上手与功能体验

### 1. 安装与配置

初始化一个新项目 创建一个新文件夹，执行下面命令，然后一路回车

```bash
npm init
```

### 2. 安装 ESLint 包

```bash
npm intall eslint
```

### 3. 创建 index.js, 编写测试代码

代码中使用双引号和分号

```js
const msg = "hello world";
```

### 4. 在项目根目录创建.eslintrc.js

输入以下配置，来要求代码风格为单引号和不允许分号

```js
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    quotes: [2, 'single'], // 单引号
    semi: [2, 'never'], // 不允许分号
  },
}
```

### 5. 检查代码风格

虽然上面代码格式和 ESLint 要求的格式不一致，但是并没有标志告诉开发者。

要想知道哪里的代码不符合代码规范，有两种方法：

1. VS Code ESLint 插件 安装完 ESLint 插件，VS Code 会用波浪线标出不符合代码风格的地方，鼠标移入会显示详细信息。
2. 在命令行执行 ESLint 命令 在package.json 的 scripts 字段里添加一行脚本

``` json{2}
"scripts": {
  "lint": "eslint . "
}
```

然后执行 `npm run lint` ，此时会在控制台打印出不符合代码风格的错误信息

### 6. 自动格式化代码

虽然上一步知道了代码不符合规范的地方，但是要手动修正太累了。使用 ESLint 自动修复代码格式，有两种方法：

#### 设置 VS Code 代码格式化程序为 ESLint

在安装并启用了ESLint 插件后，在代码编辑区右键选择使用...格式化文档选择 ESLint，执行后，代码将会自动格式化为符合规范的代码。

将ESLint设置为VS Code的默认格式化程序，并设置Format On Save ，可实现保存文件自动整理代码格式

#### 在命令行执行 ESLint 的fix 命令 修改package.json 的 scripts 字段里的lint脚本

``` json
"scripts": {
  "lint": "eslint . --fix"
}
```

然后执行 `npm run lint`  此时，代码也会自动格式化为符合规范的

## 二、ESLint 进阶使用

经过上面的步骤，我们已经体验到了使用 ESLint 进行代码风格检查和修复代码风格。要想使用 ESLint 来应对更复杂的场景就需要一种更优雅的方式来引入ESLint

### 1、通过 eslint --init 初始化 ESLint 到前端项目

``` bash
npm eslint --init
```

根据提示，可进行个性化定制 ESLint 的初始功能，比如选择将 ESLint 只用来检查代码语法还是语法和风格、是否应用于 typescript 、是否选用流行代码规范还是根据问题自己定义规范。

执行完后，会有根据刚才的选择安装对应的 ESLint 插件包和生成对应的配置文件。

### 2、通过项目脚手架来引入 ESLint

很多前端项目的脚手架工具如 `Vue2` 的 `Vue CLI` `、Vue3` 的 `create-vue` `、Vite` 等，都会在创建项目的时候提供选项询问是否用 ESLint 来校验代码风格。

如果选择了是，脚手架工具会安装 ESLint 及配套插件，并会在.eslintrc.js中配置好相关的规则与插件。

新手同学可能会觉得 ESlint 规则恼人且配置麻烦因而选择否，随着后面的 ESLint 深入解析，这个顾虑将不复存在。

## 三、ESLint 深入解析

### 1、ESLint 配置文件解析

根目录下的 .eslintrc.js 文件是 ESLint 配置的文件，无论是在命令行中执行 ESLint 命令还是 VS Code 的 ESlint 插件，都是根据这个配置文件来进行代码格式化校验与修复 * 解析 npm eslint --init 生成的配置文件

``` js
module.exports = {
  // env 定义环境，每个环境都定义了一组预定义的全局变量
  env: {     
    browser: true, // 可以使用浏览器环境中的全局变量
    es2021: true, // 可以使用 es2021 环境中的全局变量
  },
  // 配置文件可以被基础配置中的已启用的规则继承
  extends: [
    // 字符串数组：每个配置继承它前面的配置。
    // 当前配置文件继承自 plugin:vue/vue3-essential 和 airbnb-base
    'plugin:vue/vue3-essential',  
    'airbnb-base',
  ],
  // 针对特定文件覆盖配置(下面详解)
  overrides: [
  ],
  // 指定你想要支持的 JavaScript 语言选项
  parserOptions: {
    ecmaVersion: 'latest', // 使用最新的 ECMAScript 进行语法解析
    sourceType: 'module',   // 默认为 script ，可设置为 module 标明代码是 ECMAScript 模块
  },
  // ESLint 支持使用第三方插件。在使用插件之前，你必须使用 npm 安装它。
  // 在配置文件里配置插件时，可以使用 plugins 关键字来存放插件名字的列表。
  // 插件名称可以省略 eslint-plugin- 前缀。
  plugins: [
    'vue',  // 使用了 eslint-plugin-vue 插件
  ],
  // 具体校验的规则（后面讲解）
  rules: {},
};
```

解析 Vue3 官方初始化命令 npm init vue@latest 生成的配置文件

``` js
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true, // ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找。
  // 继承下面的规则
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  // 使用使用最新版的 ECMAScript 进行语法解析
  parserOptions: {
    ecmaVersion: 'latest',  
  },
  // 具体校验的规则（后面讲解）
  rules: {},
};
```

### 2、ESLint 配置具体规则

ESLint 附带有大量的规则。

可以使用注释或配置文件修改你项目中要使用的规则。

要改变一个规则设置，必须将规则 ID 设置为下列值之一：

- "off" 或 0 - 关闭规则
- "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
- "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)

使用 rules 连同错误级别和任何想使用的选项，在配置文件中进行规则配置。例如：

``` json
{
  "rules": {
    "eqeqeq": "off", // 关闭 === 校验
    "quotes": ["error", "double"] // 引号使用
  }
}
```

配置定义在插件中的一个规则的时候，必须使用 插件名/规则ID 的形式。比如：

``` json
{
  "plugins": [
    "plugin1"
  ],
  "rules": {
    "eqeqeq": "off",
    "curly": "error",
    "quotes": ["error", "double"],
    "plugin1/rule1": "error"
  }
}
```

针对特定文件覆盖配置,禁用一组文件的配置文件中的规则，请使用 overrides 和 files。

例如: 将文件名以-test.js、.spec.js 结尾的文件，关闭 no-unused-expressions 校验

``` json
{
  "rules": {...},
  "overrides": [
    {
      "files": ["*-test.js","*.spec.js"],
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  ]
}
```

忽略特定的文件和目录: 在项目根目录创建一个 .eslintignore 文件(类似.gitignore)

告诉 ESLint 去忽略特定的文件和目录

例如，以下将忽略所有的 JavaScript 文件：

``` txt
**/*.js
```

## 四、深入理解 ESLint 插件

### 1、ESLint 插件拆解

每个插件是一个命名格式为 eslint-plugin- 的 npm 模块。

插件可以包含以下几个功能模块：

- Rules: 提供规则
- Environments 提供环境变量
- Processors ESLint 处理 JavaScript 之外的文件的处理器
- Configs 集成的配置，配置的集合
- ...

也就是说，ESLint 插件封装了一些关系紧密的功能和配置，来供给插件的调用者使用。

例如 Vue 官方的 ESlint 插件 eslint-plugin-vue，提供了处理 .vue 文件的 Processors ，提供了 Vue 代码风格校验相关的 Rules，同样也提供了 Vue 的环境变量等等。

### 2、ESLint 插件的使用

ESLint 支持使用第三方插件。在使用插件之前，你必须使用 npm 安装它。

在配置文件里配置插件时，可以使用 plugins 关键字来存放插件名字的列表。

>插件名称可以省略 eslint-plugin- 前缀。

上述插件所提供的功能，均可在配置文件对应的字段里使用插件 - 使用插件提供的 Rules ：使用 插件名/规则ID 的形式。比如：

``` json {3,9}
{
  "plugins": [
    "plugin1"
  ],
  "rules": {
    "eqeqeq": "off",
    "curly": "error",
    "quotes": ["error", "double"],
    "plugin1/rule1": "error"
  }
}
```

使用插件提供的 Environments：确保提前在 plugins 数组里指定了插件名，然后在 env 配置中不带前缀的插件名后跟一个 / ，紧随着环境名。例如：

``` json {2,4}
{
    "plugins": ["example"],
    "env": {
        "example/custom": true
    }
}
```

使用插件提供的 Environments：由插件名和 processor 名组成的串接字符串加上斜杠。

例如，下面的选项启用插件 a-plugin 提供的processor： a-processor：

``` json
{
    "plugins": ["a-plugin"],
    "processor": "a-plugin/a-processor"
}
```

要为特定类型的文件指定processor，请使用 overrides 和 processor 的组合。

例如，下面对 *.md 文件使用processor： a-plugin/markdown。

``` json
{
  "plugins": ["a-plugin"],
  "overrides": [
    {
      "files": ["*.md"],
      "processor": "a-plugin/markdown"
    }
  ]
}
```
