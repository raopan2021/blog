class Cpu {
    speed: number;
    times: {
        user: number;
        nice: number;
        sys: number;
        idle: number;
        irq: number;
    };
}
export class CreateDeviceDto {
    model: string;
    cpu: string;
    uptime: number; //  操作系统运行的时间，以秒为单位。
    totalmem: number; //  系统内存总量，单位为字节。
    freemem: number; //  操作系统空闲内存量，单位是字节。
}
