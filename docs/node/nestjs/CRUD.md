# CRUD 快速上手

创建（Create）、读取（Read）、更新（Update）和删除（Delete）操作，在开发中，CRUD 操作是是最常见的，下面来快速上手

## 生成 user 模块

```bash
nest g res user
```

## 定义实体-创建数据库表

[参见上集](./Entity)

## DTO

::: code-group

```ts [create-user.dto.ts]
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
```

```ts [page-user.dto.ts]
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
```

```ts [update-user.dto.ts]
export class UpdateUserDto extends PartialType(CreateUserDto) {
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
    @ApiProperty({ description: '更新时间', required: false })
    update_time: Date;
}
```

:::

## Module 关联实体

```ts {2-4}
@Module({
    imports: [
        TypeOrmModule.forFeature([User]), // 关联实体
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
```

## user.controller.ts

```ts
@ApiTags('用户管理')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({ summary: '创建用户' })
    @ApiBody({ type: CreateUserDto }) // 指定请求体类型
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: '查询用户分页' })
    @ApiQuery({ type: PageUserDto })
    findAll(
        @Query() query: { keyWord: string; page: number; pageSize: number },
    ) {
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
```

## user.service.ts

### 使用封装好的 TypeORM

```ts
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly user: Repository<User>, // 接受一个实体
    ) {}

    create(createUserDto: CreateUserDto) {
        const { name, age, gender } = createUserDto;
        return this.user.save({ name, age, gender });
    }

    async findAll(query: { keyWord: string; page: number; pageSize: number }) {
        // findAndCount 返回2个数组，第一个是查询结果，第二个是总条数
        const data = await this.user.findAndCount({
            where: {
                name: Like(`%${query.keyWord}%`), // Like 用于模糊查询
            },
            order: {
                // 排序
                id: 'DESC',
            },
            // 分页
            skip: (query.page - 1) * query.pageSize,
            take: query.pageSize,
        });
        return {
            data: data[0],
            total: data[1],
        };
    }

    async findId(id: number) {
        const data = await this.user.findOne({ where: { id } });
        return { data: [data] };
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const data = await this.user.update(id, updateUserDto);
        return { data: [data] };
    }

    async remove(id: number) {
        const data = await this.user.delete(id);
        return { data: [data] };
    }
}
```

::: tip where 的用法

```ts
// where:{
//     name: Like(`%${query.keyWord}%`), // 满足name和age
//     age: MoreThanOrEqual(18)
// }

// where: [
//     { name: Like(`%${query.keyWord}%`) }, // 满足name或age
//     { age: MoreThanOrEqual(18) }
// ]
```

:::

### [使用原生 sql 语句](./os)
