# 如何区分 arr 和 obj

### typeof不行

相信大家都用过`typeof`,我们判断类型经常会使用`typeof`,但你会发现，在这次讨论的话题中，它就没有那么香了

```js
const arr = [1, 2, 3]
const obj = {name: 'zhangsan'}

console.log(typeof arr) // object
console.log(obj) // object
```

那这是为什么呢？

因为`typeof`返回的类型只有

| 类型          | 结果           |
| ------------- | -------------- |
| Undefined     | "undefined"    |
| Null          | "object"       |
| Boolean       | "boolean"      |
| Number        | "number"       |
| BigInt        | "bigint"       |
| String        | "string"       |
| Symbol        | "symbol"       |
| 宿主对象      | 取决于具体实现 |
| Function 对象 | "function"     |
| 其他任何对象  | "object"       |

*在表中可以看出，Array 是归为其他任何对象了 所以 `typeof []` 的结果为 'object'*

> 既然出了问题，那我们怎么来解决呢？官方给出了两种解决方案，使用 `Array.isArray` 或者 `Object.prototype.toString.call`

### **Array.isArray**

```js
const arr = [1,2,3]
const obj = {name: 'zhangsan'}

Array.isArray(arr) // true
Array.isArray(obj) // false
```

### **Object.prototype.toString.call**

```js
const arr = [1,2,3]
const obj = {name: 'zhangsan'}

Object.prototype.toString.call(obj)==="[object Array]" // false
Object.prototype.toString.call(arr)==="[object Array]" // true
```

### **instanceof**

这个方法 左侧是待测对象 ，右侧是父构造函数

```js
const arr = [1,2,3]
const obj = {name: 'zhangsan'}

arr instanceof Array // true
obj instanceof Array // false
```

### **isPrototypeOf()**

```js
const arr = [1,2,3]
const obj = {name: "zhangsan"}

Array.prototype.isPrototypeOf(arr) // true
Array.prototype.isPrototypeOf(obj) // false
```

### **构造函数`constructor`**

```js
const arr = [1,2,3]
const obj = { name: 'zhangsan' }

arr.constructor === Array; // true
obj.constructor === Object; // true
```

