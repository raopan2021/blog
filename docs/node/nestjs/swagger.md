# swagger

Swagger 是一个用于生成、描述和可视化 RESTful API 的工具。

## 安装

```bash
pnpm install @nestjs/swagger swagger-ui-express
```

## 在 main.ts 注册 swagger

```ts{1,2,7-12}
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const options = new DocumentBuilder()
        .setTitle('接口文档')
        .setVersion('1')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api-docs', app, document);
    ...
}
```

浏览器访问 http://localhost:3000/api-docs 即可查看接口文档。

## 在 controller 中添加接口描述

### ApiOperation 接口描述

```ts
@Get()
@ApiOperation({ summary: '获取用户列表' })
getUsers() {
    ...
}
```

### url 传参描述

```ts
@Get(':id')
@ApiParam({ name: 'id', description: '用户ID', required: true}) // 指定参数描述
getUser(@Param('id', new ParseIntPipe(), new DefaultValuePipe(0)) id: number) {
    ...
}
```

### query 参数描述

```ts
@Get('search')
@ApiQuery({ name: 'name', description: '用户名' }) // 指定查询参数描述
searchUsers(@Query('name') name: string) {
    ...
}
```

### header 参数描述

```ts
@Get('header')
@ApiHeader({ name: 'Authorization', description: '用户Token' }) // 指定请求头描述
getUsersWithHeader(@Headers('Authorization') authorization: string) {
    ...
}
```

### body 参数描述

```ts
@Post()
@ApiBody({ type: CreateUserDto }) // 指定请求体类型
createUser(@Body() createUserDto: CreateUserDto) {
    ...
}
```

## 在 dto 中添加字段描述

```ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: '用户名', required: true })
    name: string;

    @ApiProperty({ description: '密码', required: true })
    password: string;
}
```

## 在 service 中添加接口描述

```ts
import { Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Injectable()
@ApiTags('用户')
export class UserService {
    @ApiOperation({ summary: '获取用户列表' })
    getUsers() {
        ...
    }
}
```
