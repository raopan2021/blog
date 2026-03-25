# download-git-repo

## 简介

`download-git-repo` 是一个用于从 Git 仓库下载代码的命令行工具。

- 支持从 GitHub、GitLab 和 Bitbucket 等平台下载代码。
- 支持下载指定分支、标签和提交哈希值（某个版本）的代码。
- 下载代码时，会自动创建保存代码的目录，如果目录已经存在，则会覆盖原有内容。

## 安装

::: code-group

```bash [pnpm]
pnpm add download-git-repo
```

```bash [npm]
npm install download-git-repo
```

:::

## 使用方法

```javascript
const download = require('download-git-repo');

// 从 GitHub 仓库下载代码
download('https://gitee.com/yangdan1028/yd_cli_vue', 'test', function (err) {
  if (err) console.error('Error:', err);    
  else console.log('Downloaded successfully!');
});
```

## 参数

- `repo`：Git 仓库的 URL，例如 `username/repo` 或 `https://github.com/username/repo.git`。
- `dest`：代码保存的路径。
- `callback`：下载完成后的回调函数，可以接收一个错误参数。

## 示例

```javascript
// const download = require('download-git-repo');
import download from 'download-git-repo'

// 从 GitHub 仓库下载代码
download(
    'github:raopan2021/blog#main',
    'test',
    (err) => {
        if (err) {
            console.error('Error:',err);
        } else {
            console.log('Downloaded successfully!')
        }
    }
);
```
