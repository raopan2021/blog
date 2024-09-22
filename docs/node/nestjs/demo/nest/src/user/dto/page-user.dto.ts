import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PageUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '查询关键词', example: '饶' })
    keyWord: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'page页码', example: '1' })
    page: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'pageSize每页多少条', example: '10' })
    pageSize: number;
}
