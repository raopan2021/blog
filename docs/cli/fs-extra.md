# fs-extra

> fs-extra 是一个在 Node.js 中对 fs 模块进行扩展的库，提供了更多方便的文件操作方法。

## 安装

::: code-group

```bash [pnpm]
pnpm add fs-extra
```

```bash [npm]
npm install fs-extra
```

:::

## APIs

```js
const fs = require('fs-extra');
// import fs from 'fs-extra';

// 写入文件
fs.writeFile('1.txt','Hello World!',function(err) {
    if (err) return console.error(err);
    console.log('File has been written'); // File has been written
});

// 复制文件
fs.copySync('1.txt', '2.txt');

// 读取文件
fs.readFile('1.txt', 'utf8', function (err, data) {
    if (err) return console.error(err);
  console.log(data); // Hello World!
});

// 删除文件
fs.removeSync('1.txt');

// 读取文件夹
fs.readdir('../test',function(err,files) {
    if (err) return console.error(err);
    console.log(files); // [ 'app', 'index.js' ]
});

// 创建文件夹
fs.mkdir('app',function(err) {
    if (err) {
        console.log('文件已创建');
        return console.error(err)
    }
    console.log('Folder has been created');
});
// 第一次创建
// PS D:\Code\blog\test> node .\index.js
// Folder has been created
// 再次创建
// PS D:\Code\blog\test> node .\index.js
// 文件已创建
// [Error: EEXIST: file already exists, mkdir 'D:\Code\blog\test\app'] {
//   errno: -4075,
//   code: 'EEXIST',
//   syscall: 'mkdir',
//   path: 'D:\\Code\\blog\\test\\app'
// }

// 复制文件夹
fs.copySync('app', 'app2');

// 删除文件夹
fs.removeSync('app');
```

## 读写目录示例

``` js
import path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer';

async function create (name,options) {
    console.log(name,options);
    // 当前命令行选择的目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetCwd = path.join(cwd,name)
    console.log(targetCwd);
    // 目录是否已经存在？
    if (fs.existsSync(targetCwd)) {
        console.log('目录已经存在');
        // 是否为强制创建？
        if (options?.force) {
            console.log('进入了强制创建')
            //移除掉原本存在的文件
            await fs.remove(targetCwd)
        } else {
            console.log('需要询问用户是否强行创建')
            // 询问用户是否需要强行创建文件夹
            let {
                action
            } = await inquirer.prompt([{
                name: 'action',
                type: 'list',
                message: 'Target directory already exists Pick an action:',
                choices: [{
                    name: 'Overwrite',
                    value: 'overwrite'
                },{
                    name: 'Cancel',
                    value: false
                }]
            }])

            if (!action) {
                return;
            } else if (action === 'overwrite') {
                console.log(`移除已存在的目录`)
                await fs.remove(targetCwd)
            }
        }
    } else {
        console.log('创建文件夹');
        await fs.mkdir(targetCwd)
    }
}

create('app')
```
