import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceModule } from './device/device.module';
import { UploadPicModule } from './upload-pic/upload-pic.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql', //数据库类型
            username: 'root', //账号
            password: 'raopan3139', //密码
            host: 'localhost', //host
            port: 3306, //
            database: 'nestjs', //库名
            entities: [__dirname + '/**/*.entity{.ts,.js}'], //实体文件
            synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库
            retryDelay: 500, //重试连接数据库间隔
            retryAttempts: 10, //重试连接数据库的次数
            autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
        }),
        ScheduleModule.forRoot(),
        UserModule,
        UploadPicModule,
        DeviceModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
