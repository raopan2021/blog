import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceTaskService } from './device-task.service';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Device]), // 关联实体
    ],
    controllers: [DeviceController],
    providers: [DeviceService, DeviceTaskService],
})
export class DeviceModule {}
