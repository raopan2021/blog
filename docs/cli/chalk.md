# chalk

> chalk 是一个终端字符串样式美化工具，可以给字符串添加颜色和样式。

## 安装

::: code-group

```bash [pnpm]
pnpm add chalk
```

```bash [npm]
npm install chalk
```

:::

## 使用

```js
const chalk = require('chalk');

console.log(chalk.blue('Hello world!')); // Hello world! (蓝色)
```

## API

### chalk.level

> 设置 chalk 的颜色级别，默认为 3。

```js
chalk.level = 0; // 白色
chalk.level = 1;
chalk.level = 2;
chalk.level = 3; // 蓝色
```

### chalk.supportsColor

> 检查当前环境是否支持颜色。

```js
chalk.supportsColor;
```

### chalk.reset

> 重置颜色。

```js
chalk.reset('Hello world!');
```

### chalk.bold

> 加粗。

```js
chalk.bold('Hello world!');
```

### chalk.dim

> 淡化。

```js
chalk.dim('Hello world!');
```

### chalk.italic

> 斜体。

```js
chalk.italic('Hello world!');
```

### chalk.underline

> 下划线。

```js
chalk.underline('Hello world!');
```

### chalk.inverse

> 反转颜色。

```js
chalk.inverse('Hello world!');
```

### chalk.hidden

> 隐藏。

```js
chalk.hidden('Hello world!');
```

### chalk.strikethrough

> 删除线。

```js
chalk.strikethrough('Hello world!');
```

### chalk.bgGreen

> 背景绿色。

```js
chalk.bgGreen('Hello world!');
```
