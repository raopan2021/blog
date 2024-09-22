import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserTagDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '标签列表', example: ['帅的一批', 'nb'] })
    tags: string[];

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: '用户id', example: '18' })
    userId: number;
}
