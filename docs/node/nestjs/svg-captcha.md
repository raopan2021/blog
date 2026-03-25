# 验证码

后端 nestjs 验证码插件 `svg-captcha`

```bash
pnpm install svg-captcha -S
```

```ts
import * as svgCaptcha from 'svg-captcha';

export class UserController {
    @Get('code')
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
    ...
}
```
