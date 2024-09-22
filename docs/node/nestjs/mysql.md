# MYSQL

[mysql 下载安装](https://blog.csdn.net/weixin_39289696/article/details/128850498)

## 安装 ORM 框架连接 mysql

typeOrm 是 TypeScript 中最成熟的对象关系映射器( ORM )。因为它是用 TypeScript 编写的，所以可以很好地与 Nest 框架集成

```bash
pnpm install --save @nestjs/typeorm typeorm mysql2
```

## 配置数据库连接

```typescript {1,5-17}
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql', //数据库类型
            username: 'root', //账号
            password: 'raopan3139', //密码
            host: 'localhost', //host
            port: 3306, //
            database: 'portal', //库名
            entities: [__dirname + '/**/*.entity{.ts,.js}'], //实体文件
            synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库
            retryDelay: 500, //重试连接数据库间隔
            retryAttempts: 10, //重试连接数据库的次数
            autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
        }),
        ...
    ],
})
export class AppModule {}
```

## DTO 实体-定义/关联
