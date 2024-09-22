import { PartialType } from '@nestjs/swagger';
import { CreateUploadPicDto } from './create-upload-pic.dto';

export class UpdateUploadPicDto extends PartialType(CreateUploadPicDto) {
}
