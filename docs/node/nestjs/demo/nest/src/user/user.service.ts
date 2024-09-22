import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Tags } from './entities/tags.entity';
import { AddUserTagDto } from './dto/add-userTag';
import { PageUserDto } from './dto/page-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly user: Repository<User>,
        @InjectRepository(Tags) private readonly tag: Repository<Tags>,
    ) {}

    //通过前端传入的userId 查到当前id 的用户信息，然后拿到前端传入的tags [tag1,tag2,tag3]
    // 进行遍历 给tag实例进行赋值 然后调用保存方法添加tag 添加完之后 通过 tagList 保存该tag类
    // 最后把tagList 赋给 user类的tags属性 然后重新调用save 进行更新
    async addTags(params: AddUserTagDto) {
        const userInfo = await this.user.findOne({
            where: { id: params.userId },
        });
        const tagList: Tags[] = [];
        for (let i = 0; i < params.tags.length; i++) {
            let item = new Tags();
            item.tags = params.tags[i];
            await this.tag.save(item);
            tagList.push(item);
        }
        userInfo.tags = tagList;
        return this.user.save(userInfo);
    }

    create(createUserDto: CreateUserDto) {
        const { name, age, gender } = createUserDto;
        return this.user.save({ name, age, gender });
    }

    async findAll(query: PageUserDto) {
        const data = await this.user.findAndCount({
            //查询的时候如果需要联合查询需要增加 relations
            relations: ['tags'],
            where: {
                name: Like(`%${query.keyWord}%`),
            },
            order: {
                id: 'DESC',
            },
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
