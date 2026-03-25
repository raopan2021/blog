# 脚手架的实现

实现一个类似 `vite` 、 `crete-react-app` 的脚手架

## 前置-第三方工具的使用

实现一个脚手架，通常需要以下工具

- [chalk](./chalk.md) 美化终端的输出
- [figlet](./figlet.md) 在终端输出logo
- [ora](./ora.md) 控制台的loading样式
- [fs-extra](./fs-extra.md) 是fs的一个扩展，继承了fs所有方法，为fs方法添加了promise的支持。
- [commander](./commander.md) 可以自定义一些命令行指令，在输入自定义的命令行的时候，会去执行相应的操作
- [inquirer](./inquirer.md) 可以在命令行询问用户问题，并且可以记录用户回答选择的结果
- [download-git-repo](./download-git-repo.md) 下载远程模板

## 写一个自己的脚手架

[我的脚手架](https://github.com/raopan2021/RAOPANCLI)

``` bash
  ____      _    ___  ____   _    _   _  ____ _     ___
 |  _ \    / \  / _ \|  _ \ / \  | \ | |/ ___| |   |_ _|
 | |_) |  / _ \| | | | |_) / _ \ |  \| | |   | |    | |
 |  _ <  / ___ \ |_| |  __/ ___ \| |\  | |___| |___ | |
 |_| \_\/_/   \_\___/|_| /_/   \_\_| \_|\____|_____|___|
```
