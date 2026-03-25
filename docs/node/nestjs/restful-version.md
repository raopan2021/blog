# RESTful 版本控制

一共有三种我们一般用第一种 更加语义化

| -                     |          -          |
|-----------------------|:-------------------:|
| URI Versioning        | 版本将在请求的 URI 中传递（默认） |
| Header Versioning     |    自定义请求标头将指定版本     |
| Media Type Versioning | 请求的 Accept 标头将指定版本  |

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableVersioning({
        type: VersioningType.URI,
    });
    await app.listen(3000);
}
bootstrap();
```

然后在 user.controller 配置版本

Controller 变成一个对象 通过 version 配置版本

```ts {1-4}
@Controller({
    path: 'user',
    version: '1',
})
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }
 ...
}
```

浏览器访问：http://localhost:3000/v1/user

This action returns all user
