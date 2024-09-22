import { Injectable } from '@nestjs/common';
import { CreateUploadPicDto } from './dto/create-upload-pic.dto';
import { UpdateUploadPicDto } from './dto/update-upload-pic.dto';

@Injectable()
export class UploadPicService {
    create(createUploadPicDto: CreateUploadPicDto) {
        return 'This action adds a new uploadPic';
    }

    findAll() {
        return `This action returns all uploadPic`;
    }

    findOne(id: number) {
        return `This action returns a #${id} uploadPic`;
    }

    update(id: number, updateUploadPicDto: UpdateUploadPicDto) {
        return `This action updates a #${id} uploadPic`;
    }

    remove(id: number) {
        return `This action removes a #${id} uploadPic`;
    }
}
