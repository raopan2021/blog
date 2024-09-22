# 通过cli创建nestjs项目

```bash
npm i -g @nestjs/cli
```

在当前目录创建nest项目

```bash
nest new [项目名称]
```

## 启动项目

```bash
"start": "nest start",
"start:dev": "nest start --watch",
"start:debug": "nest start --debug --watch",
```

热更新启动 `npm run start:dev` 就可以了

## 常用命令

```bash
# 创建一个模块
nest generate module [模块名称]
# 可以缩写成
nest g module [模块名称]
# 创建一个控制器
nest g controller [控制器名称]
# 创建一个服务
nest g service [服务名称]
```

以上步骤一个一个生成的太慢了我们可以直接使用一个命令生成CURD

```bash
nest g resource [模块名称]
```

其他

```bash
# 创建一个守卫
nest g guard [守卫名称]
# 创建一个拦截器
nest g interceptor [拦截器名称]
# 创建一个装饰器
nest g decorator [装饰器名称]
# 创建一个管道
nest g pipe [管道名称]
# 创建一个过滤器
nest g filter [过滤器名称]
```

查看nestjs所有的命令

```bash
PS D:\Code\NestJs\nestjs> nest
Usage: nest <command> [options]

Options:
  -v, --version                                   Output the current version.
  -h, --help                                      Output usage information.

Commands:
  new|n [options] [name]                          Generate Nest application.
  build [options] [app]                           Build Nest application.
  start [options] [app]                           Run Nest application.
  info|i                                          Display Nest project details.
  add [options] <library>                         Adds support for an external library to your project.
  generate|g [options] <schematic> [name] [path]  Generate a Nest element.
    Schematics available on @nestjs/schematics collection:
      ┌───────────────┬─────────────┬──────────────────────────────────────────────┐
      │ name          │ alias       │ description                                  │
      │ application   │ application │ Generate a new application workspace         │
      │ class         │ cl          │ Generate a new class                         │
      │ configuration │ config      │ Generate a CLI configuration file            │
      │ controller    │ co          │ Generate a controller declaration            │
      │ decorator     │ d           │ Generate a custom decorator                  │
      │ filter        │ f           │ Generate a filter declaration                │
      │ gateway       │ ga          │ Generate a gateway declaration               │
      │ guard         │ gu          │ Generate a guard declaration                 │
      │ interceptor   │ itc         │ Generate an interceptor declaration          │
      │ interface     │ itf         │ Generate an interface                        │
      │ library       │ lib         │ Generate a new library within a monorepo     │
      │ middleware    │ mi          │ Generate a middleware declaration            │
      │ module        │ mo          │ Generate a module declaration                │
      │ pipe          │ pi          │ Generate a pipe declaration                  │
      │ provider      │ pr          │ Generate a provider declaration              │
      │ resolver      │ r           │ Generate a GraphQL resolver declaration      │
      │ resource      │ res         │ Generate a new CRUD resource                 │
      │ service       │ s           │ Generate a service declaration               │
      │ sub-app       │ app         │ Generate a new application within a monorepo │
      └───────────────┴─────────────┴──────────────────────────────────────────────┘
```
