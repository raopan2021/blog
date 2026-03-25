# Object.create 和new

Object.create是内部定义一个**funcition****对象****f**，并且让F.prototype对象 赋值为base，并return出一个新的对象实例。

```js
Object.create =  function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
};
```

new做法是新建一个**obj**对象o1，并且让o1的__proto__指向了Base.prototype对象。并且使用call 进行强转作用环境。从而实现了实例的创建。

JavaScript 实际上执行的是：

```js
var o1 = new Object();
o1.[[Prototype]] = Base.prototype;
Base.call(o1);
```

