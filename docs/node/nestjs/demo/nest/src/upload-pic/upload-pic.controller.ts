import {
    Body,
    Controller,
    Get,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { UploadPicService } from './upload-pic.service';
import { CreateUploadPicDto } from './dto/create-upload-pic.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import type { Response } from 'express';
import { zip } from 'compressing';

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

    @Get('download')
    @ApiOperation({ summary: 'download 直接下载' })
    downLoad(@Res() res: Response) {
        const url = join(__dirname, '../images/1724426168357.png');
        console.log(url);
        res.download(url);
    }

    @Get('stream')
    @ApiOperation({ summary: '文件流下载' })
    async down(@Res() res: Response) {
        const url = join(__dirname, '../images/1724426168357.png');
        const tarStream = new zip.Stream();
        await tarStream.addEntry(url);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=pic.zip`);
        tarStream.pipe(res);
    }
}
