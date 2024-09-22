import { Module } from '@nestjs/common';
import { UploadPicService } from './upload-pic.service';
import { UploadPicController } from './upload-pic.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: join(__dirname, '../images'),
                filename: (_, file, callback) => {
                    const fileName = `${new Date().getTime() + extname(file.originalname)}`;
                    return callback(null, fileName);
                },
            }),
        }),
    ],

    controllers: [UploadPicController],
    providers: [UploadPicService],
})
export class UploadPicModule {
}
