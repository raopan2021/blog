import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeviceService } from './device.service';

@Controller('device')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) {}

    @Get()
    @ApiTags('设备管理')
    findAll() {
        return this.deviceService.findAll();
    }
}
