# bind、call、apply的区别

三者都是用于改变函数体内this的指向

apply和call都是为了改变某个函数运行时的上下文而存在的（就是为了改变函数内部this的指向）；apply和call的调用返回函数执行结果；

如果使用apply或call方法，那么this指向他们的第一个参数，apply的第二个参数是一个参数数组，call的第二个及其以后的参数都是数组里面的元素，就是说要全部列举出来；

bind与apply和call的最大的区别是：bind不会立即调用，而是返回一个新函数，称为绑定函数，其内的this指向为创建它时传入bind的第一个参数，而传入bind的第二个及以后的参数作为原函数的参数来调用原函数。

```js
var db = {
  name: "德玛",
  age: 99
}

var obj = {
  myFun: function(from,goto) {
    console.log(this.name + "年龄" + this.age,"来自" + from + "去往" + goto);
  }
}
```

```js
obj.myFun.call(db,'成都','上海');　　　　 // 德玛 年龄 99  来自 成都去往上海
obj.myFun.apply(db,['成都','上海']);      // 德玛 年龄 99  来自 成都去往上海  
obj.myFun.bind(db,'成都','上海')();       // 德玛 年龄 99  来自 成都去往上海
obj.myFun.bind(db,['成都','上海'])();　　 // 德玛 年龄 99  来自 成都, 上海去往 undefined
```

Call:传入参数数列

Apply:传入参数数组

Bind:返回绑定函数，传入参数数列