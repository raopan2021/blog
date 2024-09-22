# RESTful

RESTful 是一种风格，在RESTful中，一切都被认为是资源，每个资源有对应的URL标识.

不是标准也不是协议，只是一种风格。当然你也可以不按照他的风格去写。

## 接口url

### 传统接口

http://localhost:8080/api/get_list?id=1

http://localhost:8080/api/delete_list?id=1

http://localhost:8080/api/update_list?id=1

### RESTful接口

查询 删除 更新

http://localhost:8080/api/get_list

RESTful 风格一个接口就会完成 增删改差 他是通过不同的请求方式来区分的

查询 GET

提交 POST

更新 PUT PATCH

删除 DELETE

```bash
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
```