# npm / yarn / pnpm 包管理器

## npm 常用命令

```bash
# 查看版本
npm -v

# 初始化项目（生成 package.json）
npm init
# 快速初始化（所有选项默认 yes）
npm init -y

# 安装依赖
npm install
# 或
npm i

# 安装指定包
npm install <package>
npm i <package>

# 全局安装
npm install -g <package>

# 安装指定版本
npm install <package>@<version>

# 生产依赖（写入 dependencies）
npm install <package> --save
npm install <package> -S

# 开发依赖（写入 devDependencies）
npm install <package> --save-dev
npm install <package> -D

# 卸载包
npm uninstall <package>
npm remove <package>

# 查看已安装的包
npm list
npm ls

# 查看包信息
npm view <package>
npm info <package>

# 搜索包
npm search <package>

# 更新包
npm update <package>
npm update # 更新所有

# 清理缓存
npm cache clean --force

# 运行脚本
npm run <script>

# 查看某个包的所有版本
npm view <package> versions

# 安装特定版本的包
npm install <package>@latest   # 最新版
npm install <package>@next    # 下一个大版本
```


## yarn 常用命令

```bash
# 安装 yarn
npm install -g yarn

# 初始化
yarn init

# 添加依赖
yarn add <package>          # 生产依赖
yarn add <package> --dev   # 开发依赖
yarn add <package> -D       # 同上
yarn global add <package>   # 全局安装

# 升级依赖
yarn up <package>
yarn up                     # 升级所有

# 移除依赖
yarn remove <package>

# 安装所有依赖
yarn install
yarn                        # 简写

# 运行脚本
yarn <script>

# 查看依赖信息
yarn why <package>

# 清除缓存
yarn cache clean
```


## pnpm 常用命令

> pnpm 是新一代高性能包管理器，安装更快、磁盘空间利用率更高

```bash
# 安装 pnpm
npm install -g pnpm

# 添加依赖
pnpm add <package>          # 生产依赖
pnpm add -D <package>       # 开发依赖
pnpm add -g <package>       # 全局安装

# 安装所有依赖
pnpm install

# 移除依赖
pnpm remove <package>
pnpm uninstall <package>

# 更新依赖
pnpm up
pnpm update

# 运行脚本
pnpm <script>

# 查看配置
pnpm config get registry
pnpm config set registry https://registry.npmmirror.com
```


## 国内镜像配置

### npm 切换镜像

```bash
# 查看当前镜像
npm config get registry

# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 恢复官方镜像
npm config set registry https://registry.npmjs.org
```


### pnpm 切换镜像

```bash
# 查看镜像
pnpm config get registry

# 设置镜像
pnpm config set registry https://registry.npmmirror.com
```


### 使用 nrm 快速切换镜像

```bash
# 全局安装 nrm
npm install -g nrm

# 查看可用镜像
nrm ls

# 切换镜像
nrm use taobao
nrm use npm

# 测试镜像速度
nrm test
```


## package.json 字段说明

```json
{
  "name": "my-project",        // 项目名称
  "version": "1.0.0",          // 版本号
  "description": "项目描述",
  "main": "index.js",          // 入口文件
  "scripts": {                 // 运行脚本
    "dev": "node index.js",
    "build": "webpack",
    "test": "jest"
  },
  "keywords": ["keyword"],
  "author": "作者",
  "license": "MIT",
  "dependencies": {            // 生产依赖
    "vue": "^3.0.0"
  },
  "devDependencies": {        // 开发依赖
    "webpack": "^5.0.0"
  },
  "engines": {                 // 限制 Node 版本
    "node": ">=16.0.0"
  },
  "packageManager": "pnpm@8.0.0"  // 指定包管理器及版本
}
```


## 语义化版本号

版本格式：`主版本.次版本.修订号`

- `^` (caret)：次版本和修订号可更新 `^1.2.3` → `1.x.x`
- `~` (tilde)：只更新修订号 `~1.2.3` → `1.2.x`
- `*`：匹配最新版本
- 指定精确版本：`1.2.3`

```bash
npm install vue@^3.0.0   # 安装 3.x.x 中最新版本
npm install vue@~3.2.0   # 安装 3.2.x 中最新版本
npm install vue@3.2.1    # 精确版本
```

