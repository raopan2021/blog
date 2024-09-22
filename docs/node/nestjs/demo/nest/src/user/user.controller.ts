import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Res,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import * as svgCaptcha from 'svg-captcha';
import { AddUserTagDto } from './dto/add-userTag';
import { CodeDto } from './dto/code.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PageUserDto } from './dto/page-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller({
    path: 'user',
    version: '1',
})
@ApiTags('用户管理')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('code')
    @ApiOperation({ summary: '生成验证码' })
    getCode(@Req() req, @Res() res) {
        const captcha = svgCaptcha.create({
            size: 4, //生成几个验证码
            fontSize: 50, //文字大小
            width: 100, //宽度
            height: 34, //高度
            background: '#cc9966', //背景颜色
        });
        req.session.code = captcha.text; //存储验证码记录到session
        res.type('image/svg+xml');
        res.send(captcha.data);
    }

    @Post('code')
    @ApiOperation({ summary: '核对验证码' })
    @ApiBody({ type: CodeDto })
    checkCode(@Req() req, @Body() codeDto: CodeDto) {
        console.log(req.session.code, codeDto);
        if (
            req.session.code.toLocaleLowerCase() ===
            codeDto?.code?.toLocaleLowerCase()
        ) {
            return {
                message: '验证码正确',
            };
        } else {
            return {
                message: '验证码错误',
            };
        }
    }

    @Post('/add/tags')
    @ApiOperation({ summary: '给用户添加标签' })
    @ApiBody({ type: AddUserTagDto }) // 指定请求体类型
    addTags(@Body() params: AddUserTagDto) {
        return this.userService.addTags(params);
    }

    @Post()
    @ApiOperation({ summary: '创建用户' })
    @ApiBody({ type: CreateUserDto }) // 指定请求体类型
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: '查询用户分页' })
    // @ApiQuery({ type: PageUserDto })
    findAll(@Query() query: PageUserDto) {
        return this.userService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: '根据用户id查询用户' })
    @ApiParam({ name: 'id', description: '用户ID', required: true })
    findId(@Param('id') id: number) {
        return this.userService.findId(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: '根据用户id更新用户' })
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: '根据用户id删除用户' })
    remove(@Param('id') id: number) {
        return this.userService.remove(id);
    }
}
