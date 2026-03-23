# setTimeout 倒计时误差

由于javascript是单线程的，同一时间只能执行一个js代码（同一时间其他异步事件执行会被阻塞 ) ，导致定时器事件每次执行都会有时间误差，甚至误差会越来越大。

**由于代码执行占用时间和其他事件阻塞原因，导致定时器事件执行延迟了几ms，但影响较小。**

**加了很占线程的阻塞事件，会导致定时器事件每次执行延迟越来越严重。**

------

**setTimeout(fn,0)**当setTimeout的延时为0时,是不是意味着他会立即执行呢?

答案是:**NO!**

`setTimeout(fn,0)`的含义是，**指定某个任务在主线程最早可得的空闲时间执行**，意思就是不用再等多少秒了，**只要主线程执行栈内的同步任务全部执行完成，栈为空就马上执行**

关于`setTimeout`要补充的是，即便主线程为空，0毫秒实际上也是达不到的。根据HTML的标准，最低是4毫秒。

------

### **解决方案**

用递归的方法执行倒计时，在每次递归调用`setTimeout`回调的时候，计算出时间偏差，在下一次执行`setTimeout`时，把原**设定的延迟回调时间**减去时间偏差即可。

```js
const interval = 1000 // 设定倒计时规则为每秒倒计时
let totalCount = 30000 // 设定总倒计时长为30s
let count = 0 // 记录递归已执行次数，以倒计时时间间隔 interval=1000ms 为例，那么count就相当于如果没有时间偏差情况下的理想执行时间
    
const startTime = new Date().getTime(); // 记录程序开始运行的时间
let timeoutID = setTimeout(countDownFn, interval)

// 倒计时回调函数
function countDownFn() {
    count++ // count自增，记录理想执行时间
    // 获取当前时间减去刚开始记录的startTime再减去理想执行时间得到时间偏差：等待执行栈为空的时间
    const offset = new Date().getTime() - startTime - count * interval; // 时间偏差
    let nextTime = interval - offset // 根据时间偏差，计算下次倒计时设定的回调时间，从而达到纠正的目的
    if (nextTime < 0 ) nextTime = 0
    totalCount -= interval
    if (totalCount < 0) {
        clearTimeout(timeoutID)
    } else {
        timeoutID = setTimeout(countDownFn, nextTime)
    }
}
```