import { ApiProperty } from '@nestjs/swagger';

export class CodeDto {
    @ApiProperty({ description: '验证码' })
    code: string;
}
