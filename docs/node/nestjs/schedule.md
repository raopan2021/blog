# schedule 定时任务

在 nestjs 定时执行任务

## 安装

```bash
npm install @nestjs/schedule
```

## 创建定时任务

@Cron()装饰器，把 handleCron()方法定义成一个每 10 秒执行一次的定时任务。

```ts
// my-task.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
    @Cron(CronExpression.EVERY_10_SECONDS)
    handleCron() {
        console.log('Cron task called every 10 seconds');
    }
}
```

## 注册服务

将 MyTaskService 服务添加到你的模块的 providers 数组中，以便 NestJS 可以创建并管理它

```ts {7}
// app.module.ts
@Module({
    imports: [
        TypeOrmModule.forFeature([Device]), // 关联实体
    ],
    controllers: [DeviceController],
    providers: [DeviceService, DeviceTaskService],
})
export class DeviceModule {}
```

一切设置好后，我们可以运行项目 npm run start 看看我们的定时任务效果：

打开你的控制台，你应该可以看到每隔 10 秒钟打印出一条消息"Cron task called every 10 seconds"。

## 其他

### 固定时间执行任务（Cron Jobs）

Cron 是一种时间表达式，它允许你以非常精确的方式定义任务执行的时间。你可以指定分钟、小时、日、月、星期几以及他们的组合。例如，如果你想在每周一的上午 8 点到下午 5 点之间每小时运行一次任务，你可以这样设置：

```ts
@Cron('0 8-17 \* \* 1')
handleCron() {
// 实现具体的任务逻辑
}
```

### 间隔执行任务

如果你想每隔一段固定的时间执行一次任务，可以使用 @Interval() 装饰器：

```ts
@Interval(10000)
handleInterval() {
// 每隔 10 秒执行一次
}
```

### 超时执行任务

你还可以设置一个任务在应用程序经过特定时间后执行。使用 @Timeout() 装饰器：

```ts
@Timeout(5000)
handleTimeout() {
// 应用程序启动后 5 秒执行
}
```
