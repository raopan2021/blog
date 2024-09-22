import { Injectable } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(Device) private readonly device: Repository<Device>,
    ) {}

    @ApiOperation({ summary: '查询设备运行状态' })
    findAll() {
        return this.device.query(
            'select * from device where create_time > now() - interval 1 minute',
        );
    }
}
