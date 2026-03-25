# new原理

new 关键词的主要作用就是**执行一个构造函数、返回一个对象**

**返回的对象，要么是实例对象，要么是return语句指定的对象**

```js
function Person () {
  this.name = 'Jack';
}
var p = new Person();
console.log(p)  // Person { name: 'Jack' }
console.log(p.name)  // Jack
```

从下面的代码中可以看到，我们没有使用 new 这个关键词，返回的结果就是 undefined。

> js在默认情况下 this 的指向是 window，那么 name 的输出结果就为 Jack，这是一种不存在 new 关键词的情况。

```js
function Person(){
  this.name = 'Jack';
}
var p = Person();
console.log(p) // undefined
console.log(name) // Jack
console.log(p.name) // 'name' of undefined
```

当构造函数最后 return 出来的是一个和 this 无关的对象时，new 命令会直接返回这个新对象，而不是通过 new 执行步骤生成的 this 对象

```js
function Person(){
   this.name = 'Jack'; 
   return {age: 18}
}
var p = new Person(); 
console.log(p) // {age: 18}
console.log(p.name) // undefined
console.log(p.age) // 18
```

当构造函数中 return 的不是一个对象时，那么它还是会根据 new 关键词的执行逻辑，生成一个新的对象（绑定了最新 this），最后返回出来。

```js
function Person(){
   this.name = 'Jack'; 
   return 'tom';
}
var p = new Person(); 
console.log(p)  // {name: 'Jack'}
console.log(p.name) // Jack
```



在 new 的过程中，根据构造函数的情况，来确定是否可以接受参数的传递。



mdn上把内部操作大概分为4步：

创建一个空的简单JavaScript对象（即{ } ）；

链接该对象（即设置该对象的构造函数）到另一个对象 ；(因此this就指向了这个新对象)

执行构造函数中的代码（为这个新对象添加属性）；

如果该函数没有返回对象，则返回this。

```js
function _new(){
	let target={} // 创建一个空的简单JavaScript对象
	let[constructor,...args]=[...arguments] //通过参数绑定构造函数和参数
	target.__proto__=constructor.prototype //新对象和构造函数使用原型链连接
	constructor.apply(target,args) //执行构造函数，通过apply传入this和参数
	return target 
}
```

