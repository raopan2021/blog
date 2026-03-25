---
title: Java 并发编程
---

# Java 并发编程

## 进程与线程

```java
// 进程：程序的一次执行，是系统分配资源的基本单位
// 线程：CPU 调度的基本单位，同一进程共享堆和方法区

public class ThreadDemo {
    public static void main(String[] args) {
        // 方式1：继承 Thread
        Thread t1 = new MyThread();
        t1.start();

        // 方式2：实现 Runnable（更常用）
        Thread t2 = new Thread(new MyRunnable());
        t2.start();

        // 方式3：Lambda（JDK 8+）
        Thread t3 = new Thread(() -> {
            System.out.println("Hello from lambda thread");
        });
        t3.start();

        // 方式4：FutureTask（带返回值）
        FutureTask<Integer> task = new FutureTask<>(() -> {
            return 42;
        });
        new Thread(task).start();
        System.out.println(task.get());  // 阻塞等待
    }
}
```

## 线程状态

```
NEW → RUNNABLE → BLOCKED/WAITING/TIMED_WAITING → TERMINATED
                        ↑         ↓
                   join()/wait()   notify()
```

```java
Thread.State[] states = Thread.State.values();
// NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED
```

## synchronized 关键字

```java
// 1. 修饰实例方法（锁 this）
public synchronized void increment() {
    count++;
}

// 2. 修饰静态方法（锁 class 对象）
public static synchronized void staticIncrement() {
    staticCount++;
}

// 3. 修饰代码块（锁指定对象）
public void increment() {
    synchronized (this) {  // 锁 this
        count++;
    }
}

// 锁对象可以是任意对象
private final Object lock = new Object();
public void increment() {
    synchronized (lock) {
        count++;
    }
}
```

## synchronized 原理

```java
// 反编译看原理
javap -c MyClass

// synchronized 字节码会添加 monitorenter 和 monitorexit
// 每个对象有一个 monitor，锁升级过程：
// 偏向锁 → 自旋锁 → 重量级锁（OSmutex，不可interruptible）
```

## volatile 关键字

```java
// 保证可见性：一个线程修改，其他线程立即可见
// 禁止指令重排序

private volatile boolean flag = false;

// 适用场景：
// - 单一标志位（如 shutdown 标记）
// - 写入时不依赖当前值（如初始化完成标记）
// - 计数器不行（count++ 不是原子操作）
```

## CAS（Compare And Swap）

```java
// 乐观锁实现，无锁算法
import java.util.concurrent.atomic.AtomicInteger;

AtomicInteger count = new AtomicInteger(0);

// 相当于 count++，但线程安全
count.incrementAndGet();

// 底层：CAS(V, expected, newValue)
// 如果 V == expected，则 V = newValue，否则重试
```

### 常用原子类

```java
AtomicInteger, AtomicLong, AtomicBoolean
AtomicIntegerArray, AtomicLongArray
AtomicReference<V>
AtomicStampedReference  // 带版本号，防 ABA 问题
```

## JUC 并发工具包

### ReentrantLock（可重入锁）

```java
ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
    // 业务逻辑
} finally {
    lock.unlock();  // 必须 finally 释放
}

// trylock（非阻塞）
if (lock.tryLock()) {
    try {
        // 业务逻辑
    } finally {
        lock.unlock();
    }
} else {
    // 获取失败，做其他事
}

// tryLock 超时
if (lock.tryLock(5, TimeUnit.SECONDS)) {
    try {
        // 业务逻辑
    } finally {
        lock.unlock();
    }
}
```

### CountDownLatch（倒计时门闩）

```java
// 等待 N 个线程完成
CountDownLatch latch = new CountDownLatch(3);

for (int i = 0; i < 3; i++) {
    new Thread(() -> {
        try {
            Thread.sleep(1000);
            System.out.println("任务完成");
        } finally {
            latch.countDown();  // 计数-1
        }
    }).start();
}

latch.await();  // 阻塞，直到计数为0
System.out.println("全部任务完成");
```

### CyclicBarrier（循环栅栏）

```java
// N 个线程相互等待，全部到达后一起执行
CyclicBarrier barrier = new CyclicBarrier(3, () -> {
    System.out.println("全部到达屏障点，执行汇总");
});

for (int i = 0; i < 3; i++) {
    new Thread(() -> {
        System.out.println("线程开始");
        try {
            barrier.await();  // 等待其他线程
            System.out.println("线程继续执行");
        } catch (InterruptedException | BrokenBarrierException e) {}
    }).start();
}
```

### Semaphore（信号量）

```java
// 控制同时访问资源的线程数
Semaphore semaphore = new Semaphore(3);

for (int i = 0; i < 10; i++) {
    new Thread(() -> {
        try {
            semaphore.acquire();  // 获取许可证
            System.out.println("处理请求");
            Thread.sleep(1000);
        } catch (InterruptedException e) {
        } finally {
            semaphore.release();  // 释放许可证
        }
    }).start();
}
```

### ConcurrentHashMap

```java
// 线程安全的 HashMap
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

map.put("a", 1);
map.putIfAbsent("a", 2);  // 键不存在才插入
map.computeIfAbsent("b", k -> 1);  // 懒计算
map.getOrDefault("c", 0);  // 获取或默认值
```

## 线程池

```java
// 创建线程池
ExecutorService pool = Executors.newFixedThreadPool(5);
// 或
ThreadPoolExecutor pool = new ThreadPoolExecutor(
    2,                      // 核心线程数
    5,                      // 最大线程数
    60L, TimeUnit.SECONDS,  // 空闲线程存活时间
    new LinkedBlockingQueue<>(100),  // 任务队列
    Executors.defaultThreadFactory(), // 线程工厂
    new ThreadPoolExecutor.AbortPolicy()  // 拒绝策略
);

// 提交任务
pool.execute(() -> System.out.println("task"));

Future<String> future = pool.submit(() -> "result");
String result = future.get();  // 阻塞获取结果

// 关闭
pool.shutdown();      // 等待任务完成
pool.shutdownNow();   // 立即中断
```

### 拒绝策略

```java
// AbortPolicy（默认）：抛异常
// CallerRunsPolicy：由调用线程执行
// DiscardPolicy：丢弃
// DiscardOldestPolicy：丢弃最老的
```

## 生产者-消费者模式

```java
public class ProducerConsumer {
    private final Queue<Integer> queue = new LinkedList<>();
    private final int MAX = 10;

    public void produce(int value) throws InterruptedException {
        synchronized (queue) {
            while (queue.size() == MAX) {
                queue.wait();
            }
            queue.add(value);
            queue.notifyAll();
        }
    }

    public int consume() throws InterruptedException {
        synchronized (queue) {
            while (queue.isEmpty()) {
                queue.wait();
            }
            int value = queue.poll();
            queue.notifyAll();
            return value;
        }
    }
}
```

## ThreadLocal

```java
// 线程本地变量，每个线程有自己的副本
ThreadLocal<String> tl = new ThreadLocal<>();
tl.set("hello");           // 设置
String value = tl.get();   // 获取
tl.remove();               // 清理（重要！）

// 常见用途：保存用户上下文、数据库连接、事务等
```

[[返回 Java 首页|../index]]
