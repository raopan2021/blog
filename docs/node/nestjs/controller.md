# Controller 控制器

nestjs 提供了方法参数装饰器 用来帮助我们快速获取参数 如下

| -                       |               -               |
|-------------------------|:-----------------------------:|
| @Request()              |              req              |
| @Response()             |              res              |
| @Next()                 |             next              |
| @Session()              |          req.session          |
| @Param(key?: string)    |  req.params/req.params[key]   |
| @Body(key?: string)     |    req.body/req.body[key]     |
| @Query(key?: string)    |   req.query/req.query[key]    |
| @Headers(name?: string) | req.headers/req.headers[name] |
| @HttpCode               |                               |

## 获取 get 请求传参

可以使用 Request 装饰器 或者 Query 装饰器 跟 express 完全一样

```ts
@Get()
findAll(@Request() req) {
    console.log(req.query); // { name: 'sm' }
    return { code: 200 };
}
```

浏览器访问 http://localhost:3000/v1/user?name=sm

也可以使用 Query 直接获取 不需要在通过 req.query 了

```ts
@Get()
findAll(@Query() query) {
    console.log(query); // { name: 'sm' }
    return { code: 200 };
}
```

## post 获取参数

可以使用 Request 装饰器 或者 Body 装饰器 跟 express 完全一样

```ts
@Post()
create(@Request() req) {
    console.log(req.body); // { name: 'sm' }
    return { code: 200 };
}
```

或者直接使用 Body 装饰器

```ts
@Post()
create(@Body() body) {
    console.log(body);
    return { code: 200 };
}
```

## 动态路由

可以使用 Request 装饰器 或者 Param 装饰器 跟 express 完全一样

```ts
@Get(':id')
findOne(@Request() req) {
    console.log(req.params); // { id: '1' }
    return { code: 200 };
}
```

浏览器访问 http://localhost:3000/v1/user/1

## 读取 header 信息

在调试工具随便加了一个 cookie

<img src="https://i-blog.csdnimg.cn/blog_migrate/78f61b60dfbbcb91f3e43d74af5ebc74.png" />

```ts
@Get()
findOne(@Headers() headers) {
    console.log(headers);
    // {
    //   cookie: '123',
    //   'user-agent': 'Apifox/1.0.0 (https://apifox.com)',
    //   accept: '*/*',
    //   host: 'localhost:3000',
    //   'accept-encoding': 'gzip, deflate, br',
    //   connection: 'keep-alive'
    // }
```

## 状态码

使用 HttpCode 装饰器 控制接口返回的状态码

```ts
@Get(':id')
@HttpCode(500)
findId (@Headers() header) {
    return {
        code:500
    }
}
```
