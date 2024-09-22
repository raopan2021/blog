import { ApiProperty } from '@nestjs/swagger';

export class CreateUploadPicDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}
