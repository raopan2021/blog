# os 模块

Node.js os 模块提供了一些基本的系统操作函数。我们可以通过以下方式引入该模块：

[菜鸟](https://www.runoob.com/nodejs/nodejs-os-module.html)

```js
var os = require('os');
```

| 方法                   | 描述                                                                                  |
| :--------------------- | :------------------------------------------------------------------------------------ |
| os.tmpdir()            | 返回操作系统的默认临时文件夹。                                                        |
| os.endianness()        | 返回 CPU 的字节序，可能的是 "BE" 或 "LE"。                                            |
| os.hostname()          | 返回操作系统的主机名。                                                                |
| os.type()              | 返回操作系统名                                                                        |
| os.platform()          | 返回编译时的操作系统名                                                                |
| os.arch()              | 返回操作系统 CPU 架构，可能的值有 "x64"、"arm" 和 "ia32"。                            |
| os.release()           | 返回操作系统的发行版本。                                                              |
| os.uptime()            | 返回操作系统运行的时间，以秒为单位。                                                  |
| os.loadavg()           | 返回一个包含 1、5、15 分钟平均负载的数组。                                            |
| os.totalmem()          | 返回系统内存总量，单位为字节。                                                        |
| os.freemem()           | 返回操作系统空闲内存量，单位是字节。                                                  |
| os.cpus()              | 返回一个对象数组，包含所安装的每个 CPU/内核的信息：型号、速度（单位 MHz）、时间（一个含 user、nice、sys、idle 和 irq 所使用 CPU/内核毫秒数的对象）。 |
| os.networkInterfaces() | 获得网络接口列表。                                                                    |

device-task.service.ts

```ts{9,12-19,26-29}
@Injectable()
export class DeviceTaskService {
    constructor(
        @InjectRepository(Device) private readonly device: Repository<Device>,
    ) {}

    @Cron(CronExpression.EVERY_SECOND)
    handleCron() {
        const os = require('os');
        const createDeviceDto = new CreateDeviceDto();

        const cores = os.cpus().map(({ model, ...rest }) => {
            return rest;
        });
        createDeviceDto.cpu = JSON.stringify(cores);
        createDeviceDto.model = os.cpus()[0].model;
        createDeviceDto.uptime = os.uptime();
        createDeviceDto.totalmem = os.totalmem();
        createDeviceDto.freemem = os.freemem();

        return this.device.save(createDeviceDto);
    }

    @Cron(CronExpression.EVERY_MINUTE)
    clearCron() {
        return this.device.query(
            // 删除创建时间早于当前时间减去5分钟的记录
            'delete from device where create_time < now() - interval 5 minute',
        );
    }
}
```
