# babel

Babel 是一个广泛使用的 ES6 转码器，可以将 ES6 代码转为 ES5 代码，从而在老版本的浏览器执行。

这意味着，你可以用 ES6 的方式编写程序，又不用担心现有环境是否支持。

下面是一个例子。

``` js
// 转码前
input.map(item => item + 1);

// 转码后
input.map(function (item) {
  return item + 1;
});
```

原始代码用了箭头函数，Babel 将其转为普通函数，就能在不支持箭头函数的 JavaScript 环境执行了。

但是通常ide和浏览器都是支持ED6的

下面的命令在项目目录中，安装 Babel。

``` bash
npm install --save-dev @babel/core
```

## 配置文件.babelrc

Babel 的配置文件是`.babelrc`，存放在项目的根目录下。

使用 Babel 的第一步，就是配置这个文件。

该文件用来设置转码规则和插件，基本格式如下。

``` js
{
    "presets": [],
    "plugins": []
}
```

presets字段设定转码规则，官方提供以下的规则集，你可以根据需要安装。

``` bash
# 最新转码规则
npm install --save-dev @babel/preset-env

# react 转码规则
npm install --save-dev @babel/preset-react
```

然后，将这些规则加入`.babelrc`。

``` js
{
    "presets": [
        "@babel/env",
        "@babel/preset-react"
    ],
    "plugins": []
}
```

注意，以下所有 Babel 工具和模块的使用，都必须先写好`.babelrc`。

## 命令行转码

Babel 提供命令行工具@babel/cli，用于命令行转码。

它的安装命令如下。

``` bash
npm install --save-dev @babel/cli
```

基本用法如下。

``` bash
# 转码结果输出到标准输出
npx babel example.js

# 转码结果写入一个文件
# --out-file 或 -o 参数指定输出文件
npx babel example.js --out-file compiled.js
# 或者
npx babel example.js -o compiled.js

# 整个目录转码
# --out-dir 或 -d 参数指定输出目录
npx babel src --out-dir lib
# 或者
npx babel src -d lib

# -s 参数生成source map文件
npx babel src -d lib -s
```

## 更多详见 [ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/intro#babel-node)
