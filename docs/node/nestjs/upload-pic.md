# 图片上传下载

## 上传

### 安装包

`@nestjs/platform-express` `nestJs` 自带了

`multer` `@types/multer` 这两个需要安装

```bash
pnpm add --save multer @types/multer
```

### 生成模块

```bash
nest g res uploadPic
```

### 设置数据格式 `DTO`

```ts {5-6}
// create-upload-pic.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateUploadPicDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}
```

### `Module` 注册

在 `Module` 使用 `MulterModule.register` 注册存放图片的目录

需要用到 `multer` 的 `diskStorage` 设置存放目录 `extname` 用来读取文件后缀 `filename` 给文件重新命名

```ts{6-18}
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: join(__dirname, '../images'),
                filename: (_, file, callback) => {
                    const fileName = `${
                        new Date().getTime() + extname(file.originalname)
                    }`;
                    return callback(null, fileName);
                },
            }),
        }),
    ],

    controllers: [UploadPicController],
    providers: [UploadPicService],
})
export class UploadPicModule {}
```

### 在控制器使用

使用 UseInterceptors 装饰器 FileInterceptor 是单个 读取字段名称 FilesInterceptor 是多个

参数 使用 UploadedFile 装饰器接受 file 文件

```ts{10-11}
// upload-pic.controller.ts
@Controller('upload-pic')
@ApiTags('图片上传-查看')
export class UploadPicController {
    constructor(private readonly uploadPicService: UploadPicService) {}

    @Post()
    @ApiOperation({ summary: '图片上传' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    create(@UploadedFile() file, @Body() fileInfo: CreateUploadPicDto) {
        console.log(file);
        console.log(fileInfo);
        return true;
    }
    ...
}
```

## 下载/查看图片

### 生成静态目录访问上传之后的图片

useStaticAssets prefix 是虚拟前缀

```ts {2,4-5}
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(join(__dirname, 'images'), {
        prefix: '/raopan',
    });
    ...
}
```

浏览器打开 http://localhost:3000/raopan/[/dist/images 目录里的图片]

http://localhost:3000/raopan/1724328044724.png

就可以看到图片了

### download 直接下载

这个文件信息应该存数据库，我们这儿演示就写死了

```ts {2,8-11}
import { join } from 'path';
import type { Response } from 'express';

@Controller('upload-pic')
@ApiTags('图片上传-查看')
export class UploadPicController {
    @Get('download')
    downLoad(@Res() res: Response) {
        const url = join(__dirname, '../images/1724328044724.png');
        console.log(url);
        res.download(url);
    }
}
```

### 文件流下载

使用 compressing 把他压缩成一个 zip 包

```bash
pnpm add compressing
```

```ts{1,6-13}
import { zip } from 'compressing';

@Controller('upload-pic')
@ApiTags('图片上传-查看')
export class UploadPicController {
    @Get('stream')
    async down(@Res() res: Response) {
        const url = join(__dirname, '../images/1724330110116.png');
        const tarStream = new zip.Stream();
        await tarStream.addEntry(url);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=pic.zip`);
        tarStream.pipe(res);
    }
}
```
