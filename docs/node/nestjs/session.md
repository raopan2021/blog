# session

session 模块用于管理用户会话，包括登录、登出、获取用户信息等操作。

## 安装

我们使用的是 nestjs 默认框架 express 他也支持 express 的插件 所以我们就可以安装 express 的 session

```bash
npm i express-session --save
```

需要智能提示可以装一个声明依赖

```bash
npm i @types/express-session -D
```

然后在 main.ts 引入 通过 app.use 注册 session

```bash
import * as session from 'express-session'

app.use(session())
```

## 参数配置详解

| 参数名     | 类型                                                                              |
|:--------|:--------------------------------------------------------------------------------|
| name    | 生成客户端 cookie 的名字 默认 connect.sid                                                 |
| secret  | 生成服务端 session 签名 可以理解为加盐                                                        |
| cookie  | 设置返回到前端 key 的属性，默认值为{ path: ‘/’, httpOnly: true, secure: false, maxAge: null }。 |
| rolling | 在每次请求时强行设置 cookie，这将重置 cookie 过期时间(默认:false)                                    |

## 引入

```ts {6-13}
import * as session from 'express-session';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(
        session({
            secret: 'RaoPan',
            name: 'rp.session',
            cookie: { maxAge: null },
            rolling: true,
        }),
    );
    ...
}
```

## 使用

```ts{1,19-21,30-31}
import * as svgCaptcha from 'svg-captcha';
import { CodeDto } from './dto/code.dto';

@Controller({ path: 'user', version: '1' })
@ApiTags('用户管理')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('code')
    @ApiOperation({ summary: '生成验证码' })
    getCode(@Req() req, @Res() res) {
        const captcha = svgCaptcha.create({
            size: 4, //生成几个验证码
            fontSize: 50, //文字大小
            width: 100, //宽度
            height: 34, //高度
            background: '#cc9966', //背景颜色
        });
        req.session.code = captcha.text; //存储验证码记录到session
        res.type('image/svg+xml');
        res.send(captcha.data);
    }

    @Post('code')
    @ApiOperation({ summary: '核对验证码' })
    @ApiBody({ type: CodeDto })
    checkCode(@Req() req, @Body() codeDto: CodeDto) {
        console.log(req.session.code, codeDto);
        if (
            req.session.code.toLocaleLowerCase() ===
            codeDto?.code?.toLocaleLowerCase()
        ) {
            return {
                message: '验证码正确',
            };
        } else {
            return {
                message: '验证码错误',
            };
        }
    }
    ...
}
```
