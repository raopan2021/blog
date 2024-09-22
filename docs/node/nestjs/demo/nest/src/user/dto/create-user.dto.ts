import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '姓名', example: '饶盼' })
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: '年龄', example: '18' })
    age: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '性别0女1男', enum: ['0', '1'], example: '1' })
    gender: string;

    @IsDate()
    @ApiProperty({ description: '创建时间', required: false })
    create_time: Date;
}
