import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableVersioning({ type: VersioningType.URI });

    const options = new DocumentBuilder()
        .setTitle('接口文档')
        .setVersion('1')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api-docs', app, document);

    app.use(
        session({
            secret: 'RaoPan',
            name: 'rp.session',
            rolling: true,
            cookie: { maxAge: null },
        }),
    ); // session 是服务器 为每个用户的浏览器创建的一个会话对象 这个session 会记录到 浏览器的 cookie 用来区分用户

    app.useStaticAssets(join(__dirname, 'images'), {
        prefix: '/raopan',
    });

    await app.listen(3000);
}

bootstrap();
