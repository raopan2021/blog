# inquirer

可以在命令行询问用户问题，并且可以记录用户回答选择的结果

## 安装

::: code-group

```bash [pnpm]
pnpm add inquirer
```

```bash [npm]
npm install inquirer
```

:::

## 基本使用

实现一个vite简易脚手架

```js
const inquirer = require('inquirer');
// import inquirer from 'inquirer'

inquirer.prompt([
    {
        name: 'project',
        type: 'input',
        message: 'Project name: ',
    },
    {
        name: 'framework',
        type: 'list',
        message: 'Select a framework: ',
        choices: ['React','Vue','Angular'],
    },
    {
        name: 'variant',
        type: 'list',
        message: 'Select a variant: ',
        choices: ['TypeScript','JavaScript'],
    },
]).then(res => {
    console.log(res);
}).catch(error => {
    console.error(error);
});

// PS D:\Code\blog\test> node .\index.js
// ? Project name:  q
// ? Select a framework:  Vue
// ? Select a variant:  TypeScript
// { project: 'q', framework: 'Vue', variant: 'TypeScript' }
```

::: details 在终端实现一个简单的计算器功能

``` js
const inquirer = require('inquirer');

inquirer
    .prompt([
        {
            type: 'list',
            name: 'operation',
            message: '请选择要执行的运算类型：',
            choices: ['加法','减法','乘法','除法']
        },
        {
            type: 'number',
            name: 'num1',
            message: '请输入第一个数字：'
        },
        {
            type: 'number',
            name: 'num2',
            message: '请输入第二个数字：'
        }
    ])
    .then((answers) => {
        let result;

        switch (answers.operation) {
            case '加法':
                result = answers.num1 + answers.num2;
                break;
            case '减法':
                result = answers.num1 - answers.num2;
                break;
            case '乘法':
                result = answers.num1 * answers.num2;
                break;
            case '除法':
                result = answers.num1 / answers.num2;
                break;
        }

        console.log(`运算结果为：${result}`);
    });

// PS D:\Code\blog\test> node .\index.js
// ? 请选择要执行的运算类型： 加法
// ? 请输入第一个数字： 1
// ? 请输入第二个数字： 2
// 运算结果为：3
```

:::

## 常用类型

- list √
- input √
- number √
- confirm
- rawlist
- expand
- checkbox
- password
- editor
