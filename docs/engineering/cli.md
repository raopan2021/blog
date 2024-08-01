# 脚手架的实现

实现一个类似 `vite` 、 `crete-react-app` 的脚手架

## 前置-第三方工具的使用

实现一个脚手架，通常需要以下工具

- commander: 命令行工具
- chalk: chalk是一个颜色的插件。可以通过chalk.green(‘success’)来改变颜色。修改控制台输出内容样式
- inquirer: 用于命令行交互问询等
- download-git-repo: 来通过git下载项目模板的插件
- figlet: 生成好看的艺术字，增加终端美观度
- ora: 用于实现node命令环境的loading效果，并显示各种状态的图标,显示 loading 动画
- npm link: 本地调试npm包的神器。
