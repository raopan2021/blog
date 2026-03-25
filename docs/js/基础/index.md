# 面试题

## 面试软通1（10分钟、电话）

数据类型、**前台跨域实现**、vue周期、vue常用指令、v-if   v-show、v-for 的key、**js原型链**、**闭包**、git提交代码会不会？**自定义属性选择器**



## 面试中电（40分钟、电话）

怎样垂直居中

怎样靠右

flex=1详解

前端如何解决跨域

你实际开发的时候，前后端联调怎么做的

直接访问后端的ip地址开发环境，为什么没产生跨域

我之前的项目，视频监控怎么做的

我之前的项目，单点登陆怎么做的

怎样确定对象某个属性有值

怎样获取对象所有属性的值

怎样删除数组最后一项

子组件v-if为false，子组件触发哪些生命周期（不触发）



## 面试软通2

grid布局

页面全屏的原生js方法

a链接和vue-router跳转的区别

手写：// 长度5的数组、5个 2-30的随机整数不重复、用递归，不能循环

``` js
// 长度5的数组
// 2-30的整数
// 5个随机数不重复
// 用递归，不能循环

let arr = new Array()
// let index = 0

//随机生成 2 到 30 之间的整数
function random (min,max) {
  return Math.floor((max - min + 1) * Math.random()) + min;
}

// 递归
function arrItemCreate (arr) {
  if (arr.length < 5) {
    let newSum = random(2,30); // 随机生成 2 到 30 之间的整数
    console.log(newSum);

    if (arr.indexOf(newSum) == -1) { // 是否重复
      arr.push(newSum);
    }
    return arrItemCreate(arr);
  } else {
    return arr
  }
}

//循环while
function arrItemCreateWhile (arr) {
  while (arr.length < 5) {
    let newSum = random(2,30)
    console.log(newSum);

    if (arr.indexOf(newSum) == -1) {
      arr.push(newSum)
    }
  }
}

arrItemCreateWhile(arr);
console.log(arr);
```



# H5

## h5新增特性：

1. 简化了文档声明，HTML5的文档声明只需要`<!DOCTYPE HTML>`
2. 简化了编码声明，只需要`<meta charset="gbk">`
3. 删除了一些能用CSS代替的旧标签，比如 `<i>`
4. 增加了一些新标签，来改善文档结构的`<header>``<footer>`等等，来减少插件依赖的`<canvas>``<audio>`等等。
5. 增加了一些新的javascript的API，比如地理定位、请求动画帧、离线存储等等。
6. 配合一些框架，例如cordova和react等，可以来开发基于HTML5的移动应用。

> `语义化标签`：header、footer、section、nav、aside、article
> `增强型表单`：input 的多个 type
> `新增表单属性`：placehoder、required、min 和 max
> `音频视频`：audio、video
> `canvas 画布`
> `地理定位`
> `拖拽`
> `本地存储`：localStorage 没有时间限制的数据存储；sessionStorage， session 的数据存储，当用户关闭浏览器窗口后，数据会被删除
> `新事件`：onresize、ondrag、onscroll、onmousewheel、onerror、onplay、onpause
> `WebSocket`：建立持久通信协议



## 语义化标签

| 标签    | 描述                            |
| ------- | ------------------------------- |
| header  | 定义了文档的头部区域            |
| footer  | 定义了文档的尾部区域            |
| nav     | 定义文档的导航                  |
| section | 定义文档中的节（section、区段） |
| article | 定义页面独立的内容区域          |
| aside   | 定义页面的侧边栏内容            |
| dialog  | 定义对话框，比如提示框          |



## 表单类型增强

> HTML5 拥有多个新的表单 Input 输入类型。这些新特性提供了更好的输入控制和验证

| input 的 type | 描述                         |
| ------------- | ---------------------------- |
| color         | 主要用于选取颜色             |
| date          | 从一个日期选择器选择一个日期 |
| datetime      | 选择一个日期（UTC 时间）     |
| email         | 包含 e-mail 地址的输入域     |
| month         | 选择一个月份                 |
| number        | 数值的输入域                 |
| range         | 一定范围内数字值的输入域     |
| search        | 用于搜索域                   |
| tel           | 定义输入电话号码字段         |
| time          | 选择一个时间                 |
| url           | URL 地址的输入域             |

week选择周和年



## html5 新增的表单属性

| 表单属性        | 描述                                                                                   |
| --------------- | -------------------------------------------------------------------------------------- |
| placehoder      | 简短的提示在用户输入值前会显示在输入域上。即我们常见的输入框默认提示，在用户输入后消失 |
| required        | 是一个 boolean 属性。要求填写的输入域不能为空                                          |
| pattern         | 描述了一个正则表达式用于验证 input 元素的值                                            |
| min 和 max      | 设置元素最小值与最大值                                                                 |
| step            | 为输入域规定合法的数字间隔                                                             |
| height 和 width | 用于 image 类型的 input 标签的图像高度和宽度                                           |
| autofocus       | 是一个 boolean 属性。规定在页面加载时，域自动地获得焦点                                |
| multiple        | 是一个 boolean 属性。规定 input 元素中可选择多个值                                     |



## html5 新事件

| 事件         | 描述                             |
| ------------ | -------------------------------- |
| onresize     | 当调整窗口大小时触发             |
| ondrag       | 当拖动元素时触发                 |
| onscroll     | 当滚动元素滚动元素的滚动条时触发 |
| onmousewheel | 当转动鼠标滚轮时触发             |
| onerror      | 当错误发生时触发                 |
| onplay       | 当媒介数据将要开始播放时触发     |
| onpause      | 当媒介数据暂停时触发             |



## src和href的区别

①src

​    是将目标路径下的文件下载并应用到文档中，只能替换当前内容，不能建立连接。

​    src被解析时，会进行下载并编译，同时会暂停该文档其他资源的下载和处理。所以js文件的载入最好在body中，而不是在head中。

​    常用有：script，img 、iframe；

②href

​    是将建立当前元素与文档的连接。

​    href被添加时，其中的元素会被识别为css文件进行处理，且不会停止其他资源的运行。所以建议用link加载css文件，而不是@import。

​    常用有：link，a



## DOCTYPE的作用

​    作用：DOCTYPE是文档类型document type的缩写。主要作用是告诉浏览器的解析器使用哪种HTML规范或者XHTML规范来解析页面。而如果DOCTYPE缺失，或形式不正确，会导致html文档或XHTML文档不是以标准模式（浏览器对页面的渲染具有统一的规范）而是以混杂模式（不同浏览器有不同的页面渲染）运行。



## script标签中的的defer和async

作用：平常的script标签如果直接使用，html会按顺序下载和执行脚本，并阻碍后续DOM的渲染。如果script发生延迟，就会阻碍后续的渲染，使得页面白屏。

参考：[浅谈script标签中的async和defer - 贾顺名 - 博客园](https://www.cnblogs.com/jiasm/p/7683930.html)

①defer

​    异步下载文件

​    不阻碍dom的渲染

​    如果有多个defer，会按顺序执行。

​    执行顺序：在文档渲染后执行，在`DOMContentLoaded`事件调用前执行。

②async

​    异步下载

​    不影响dom

​    如果有多个defer，谁快先执行谁

推荐的应用场景

defer

如果你的脚本代码依赖于页面中的`DOM`元素（文档是否解析完毕），或者被其他脚本文件依赖。
**例：**

1. 评论框
2. 代码语法高亮
3. `polyfill.js`

async

如果你的脚本并不关心页面中的`DOM`元素（文档是否解析完毕），并且也不会产生其他脚本需要的数据。
**例：**百度统计



## 行内元素；块元素；空元素

①行内元素：a\b\span\input\img\strong\br\em\big\small

②块元素：div\ul\ol\li\h1-h6\p\dl\dt\address

③空元素：img\input\link\meta



### meta标签

meta 元素被用于规定页面的描述、关键词、文档的作者、最后修改时间以及其他元数据。标签始终位于 head 元素中。

meta属性包括：必选属性content—进行描述说明的，相当于键值；可选属性http-equiv、name和scheme，http-equiv—添加http头部内容，name—浏览器解析

包括：

①charset charset定义使用的字符编码

```html
<meta charset="utf-8">
<meta http-euiqv="Content-Type" content="text/html;charset=utf-8">
```

②SEO

```html
<meta name="keyword" content="csdn"> #网页关键词
<meta name="author" content="LiHua">
<meta name="description" content="we are world">#网页描述
```

③viewport 

```html
<meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0">
```




# css

## css3新特性

1. 选择器
2. 背景和边框
3. 文本效果
4. 2D/3D 转换 — 变形（transform）、过渡(transtion)、动画(animation)




## 背景和边框

背景：

> background-size：规定背景图片的尺寸（cover：填充；100% 100%：拉伸）

> background-origin：规定背景图片的定位区域 对于 background-origin 属性，有如下属性 背景图片可以放置于
> content-box、padding-box 或 border-box 区域

边框：

> border-radius：圆角
> box-shadow / text-shadow：阴影
> border-image：边框图片



## 文本效果

| 属性            | 描述                                                                       |
| --------------- | -------------------------------------------------------------------------- |
| text-shadow     | 向文本添加阴影                                                             |
| text-justify    | 规定当 text-align 设置为 “justify” 时所使用的对齐方法                      |
| text-emphasis   | 向元素的文本应用重点标记以及重点标记的前景色                               |
| text-outline    | 规定文本的轮廓                                                             |
| text-overflow   | 规定当文本溢出包含元素时发生的事情                                         |
| text-wrap       | 规定文本的换行规则                                                         |
| word-break      | 规定非中日韩文本的换行规则                                                 |
| word-wrap       | 允许对长的不可分割的单词进行分割并换行到下一行                             |
| text-decoration | 文本修饰符：overline、line-through、underline 分别是上划线、中划线、下划线 |

- @font-face 自定义字体
- 渐变，CSS3新增了渐变效果，包括 linear-gradient(线性渐变)和 radial-gradient(径向渐变)




## flex 布局

flex是css3新增的一种布局方式,我们可以同时设置一个元素的display属性值设置为flex，从而使它成为一个flex容器，它的所有子元素都成为它的项目。



一个容器默认有两条轴，一个水平轴，一条是与主轴垂直的交叉轴

flex-direction来指定主轴的方向。

justify-content来指定标签在主轴的排列方式，

使用align-items来指定元素在交叉轴的排序方式。

还可以使用flex-wrap来规定当一行排列不下时的换行方式。



对于一个容器的项目，

使用order属性来指定项目的排列顺序，

flex-grow来指定当前排序空间有剩余的时候，项目放大比例。

flex-shrink来指定当前排序空间不足时， 项目缩小比例。



## position 有几个值，absolute 是相对于谁的定位。

relative：生成相对定位的元素，相对于其在普通流中的位置进行定位。

absolute ：生成绝对定位的元素，相对于最近一级的父元素，且该父元素不能是static，来进行定位。

fixed：（老IE不支持）生成绝对定位的元素，通常相对于浏览器窗口或 frame 进行定位。

static：默认值。没有定位，元素出现在正常的流中


## link标签和import区别

1 属性差别。

link属于XHTML标签，而@import完全是CSS提供的语法规则。 link标签除了可以加载CSS外，还可以做很多其它的事情，比如定义RSS，定义rel连接属性等，@import就只能加载CSS了。 

2 加载顺序的差别。

当一个页面被加载的时候（就是被浏览者浏览的时候），link引用的CSS会同时被加载，而@import引用的CSS会等到页面全部被下载完再被加载。所以有时候浏览@import加载CSS的页面时开始会没有样式（就是闪烁），网速慢的时候还挺明显. 

3 兼容性的差别。

由于@import是CSS2.1提出的所以老的浏览器不支持，@import只有在IE5以上的才能识别，而link标签无此问题。 

4 使用dom控制样式时的差别。

当使用javascript控制dom去改变样式的时候，只能使用link标签，因为@import不是dom可以控制的。



## 画一条0.5px的直线？

> 考查的是css3的transform

```css
height: 1px;
transform: scale(0.5);
```



## 盒模型

盒模型的组成，由里向外content,padding,border,margin.

在IE盒子模型中，width表示content+padding+border这三个部分的宽度

在标准的盒子模型中，width指content部分的宽度



## label

label标签主要是方便鼠标点击使用，扩大可点击的范围，增强用户操作体验



## img中的alt title区别

alt是图片加载失败时，显示在网页上的替代文字； 

title是鼠标放在图片上面时显示的文字，title是对图片的描述与进一步说明； 

alt是img必要的属性，而title不是； 

对于网站seo优化来说，title与alt还有最重要的一点： 搜索引擎对图片意思的判断，主要靠alt属性。所以在图片alt属性中以简要的文字说明，同时包含关键词，也是页面优化的一部分。条件允许的话，可以在title属性里进一步对图片说明。




# js





## for...in 和 for...of 的区别

### key 和 value

for...in 遍历 key , for...of 遍历 value

``` js
const arr = [10,20,30]
for (let n of arr) console.log(n) 
//10  
//20   
//30

const str = 'abc'
for (let s of str) console.log(s) 
//a   
//b   
//c
```

```
const arr = [10,20,30]
for (let n in arr) console.log(n) // 0   //1   //2

const str = 'abc'
for (let s in str) console.log(s)
```



``` js
function fn() {
    for (let argument of arguments) {
        console.log(argument) // for...of 可以获取 value ，而 for...in 获取 key
    }
}
fn(10, 20, 30)

const pList = document.querySelectorAll('p')
for (let p of pList) {
    console.log(p) // for...of 可以获取 value ，而 for...in 获取 key
}
```



### 遍历对象

for...in 可以遍历对象，for...of 不可以



### 遍历 Map/Set

for...of 可以遍历 Map/Set ，for...in 不可以

``` js
const set1 = new Set([10, 20, 30])
for (let n of set1) {
    console.log(n)
}

let map1 = new Map([
    ['x', 10], ['y', 20], ['z', 3]
])
for (let n of map1) {
    console.log(n)
}
```



### 遍历 generator

for...of 可遍历 generator ，for...in 不可以

``` js
function* foo(){
  yield 10
  yield 20
  yield 30
}
for (let o of foo()) {
  console.log(o)
}
```



### 对象的可枚举属性

for...in 遍历一个对象的可枚举属性。

使用 `Object.getOwnPropertyDescriptors(obj)` 可以获取对象的所有属性描述，看 ` enumerable: true` 来判断该属性是否可枚举。

对象，数组，字符传



### 可迭代对象

for...of 遍历一个可迭代对象。<br>
其实就是迭代器模式，通过一个 `next` 方法返回下一个元素。

该对象要实现一个 `[Symbol.iterator]` 方法，其中返回一个 `next` 函数，用于返回下一个 value（不是 key）。<br>
可以执行 `arr[Symbol.iterator]()` 看一下。

JS 中内置迭代器的类型有 `String` `Array` `arguments` `NodeList` `Map` `Set` `generator` 等。



### 答案

- for...in 遍历一个对象的可枚举属性，如对象、数组、字符串。针对属性，所以获得 key
- for...of 遍历一个可迭代对象，如数组、字符串、Map/Set 。针对一个迭代对象，所以获得 value



### 划重点

“枚举” “迭代” 都是计算机语言的一些基础术语，目前搞不懂也没关系。<br>
但请一定记住 for...of 和 for...in 的不同表现。



### 连环问：for await...of

用于遍历异步请求的可迭代对象。

``` js
// 像定义一个创建 promise 的函数
function createTimeoutPromise(val) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(val)
        }, 1000)
    })
}
```

如果你明确知道有几个 promise 对象，那直接处理即可

``` js
(async function () {
    const p1 = createTimeoutPromise(10)
    const p2 = createTimeoutPromise(20)

    const v1 = await p1
    console.log(v1)
    const v2 = await p2
    console.log(v2)
})()
```

如果你有一个对象，里面有 N 个 promise 对象，你可以这样处理

``` js
(async function () {
    const list = [
        createTimeoutPromise(10),
        createTimeoutPromise(20)
    ]

    // 第一，使用 Promise.all 执行
    Promise.all(list).then(res => console.log(res))

    // 第二，使用 for await ... of 遍历执行
    for await (let p of list) {
        console.log(p)
    }

    // 注意，如果用 for...of 只能遍历出各个 promise 对象，而不能触发 await 执行
})()
```

【注意】如果你想顺序执行，只能延迟创建 promise 对象，而不能及早创建。<br>
即，你创建了 promise 对象，它就立刻开始执行逻辑。

``` js
(async function () {
    const v1 = await createTimeoutPromise(10)
    console.log(v1)
    const v2 = await createTimeoutPromise(20)
    console.log(v2)

    for (let n of [100, 200]) {
        const v = await createTimeoutPromise(n)
        console.log('v', v)
    }
})()
```





## 作用域

为可访问变量，对象，函数的集合

**作用域链**是[[Scope]]中所存储的执行期上下文的集合

**一个执行期上下文**定义了一个函数执行的环境



## 原始值和引用值类型及区别

-   原始值（简单数据类型）：存储在**栈**中的简单数据段，也就是说，它们的值直接存储在变量访问的位置。

### 五种简单数据类型：undefined、null、boolean、number 和 string ；

可以通过typeof 运算符来判断一个值是否在某种类型的范围内，如果它是原始类型，还可以判断它表示哪种原始类型。

### 引用值（复杂数据类型）：Object、function、array等

存储在**堆**中的对象，放在变量的栈空间中的值是该对象存储在堆中的地址，也就是说，存储在变量处的值是一个指针（内存地址），指向存储对象的堆内存中。

- **Object**(包含`Array`、`Function`、`Date`、`RegExp`、`Error`)



## 如何区分 arr 和 obj

``` js
Object.prototype.toString.call(obj)==="[object Array]";

Array.isArray(obj);
obj instanceof Array
obj.constructor == Array
```

注意：instanceof在判断数组是，即会把数组当做Array类型，又会把数组当做Object类型，都会返回true




## bind、call、apply的区别

三者都是用于改变函数体内this的指向

apply和call都是为了改变某个函数运行时的上下文而存在的（就是为了改变函数内部this的指向）；apply和call的调用返回函数执行结果；

如果使用apply或call方法，那么this指向他们的第一个参数，apply的第二个参数是一个参数数组，call的第二个及其以后的参数都是数组里面的元素，就是说要全部列举出来；

bind与apply和call的最大的区别是：bind不会立即调用，而是返回一个新函数，称为绑定函数，其内的this指向为创建它时传入bind的第一个参数，而传入bind的第二个及以后的参数作为原函数的参数来调用原函数。

``` js
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

``` js
obj.myFun.call(db,'成都','上海')；　　　　 // 德玛 年龄 99  来自 成都去往上海
obj.myFun.apply(db,['成都','上海']);      // 德玛 年龄 99  来自 成都去往上海  
obj.myFun.bind(db,'成都','上海')();       // 德玛 年龄 99  来自 成都去往上海
obj.myFun.bind(db,['成都','上海'])();　　 // 德玛 年龄 99  来自 成都, 上海去往 undefined
```

Call:传入参数数列

Apply:传入参数数组

Bind:返回绑定函数，传入参数数列



## new原理

new 关键词的主要作用就是**执行一个构造函数、返回一个对象**

**返回的对象，要么是实例对象，要么是return语句指定的对象**

``` js
function Person () {
  this.name = 'Jack';
}
var p = new Person();
console.log(p)  // Person { name: 'Jack' }
console.log(p.name)  // Jack
```

从下面的代码中可以看到，我们没有使用 new 这个关键词，返回的结果就是 undefined。

> js在默认情况下 this 的指向是 window，那么 name 的输出结果就为 Jack，这是一种不存在 new 关键词的情况。

``` js
function Person(){
  this.name = 'Jack';
}
var p = Person();
console.log(p) // undefined
console.log(name) // Jack
console.log(p.name) // 'name' of undefined
```

当构造函数最后 return 出来的是一个和 this 无关的对象时，new 命令会直接返回这个新对象，而不是通过 new 执行步骤生成的 this 对象

``` js
function Person(){
   this.name = 'Jack'; 
   return {age: 18}
}
var p = new Person(); 
console.log(p)  // {age: 18}
console.log(p.name) // undefined
console.log(p.age) // 18
```

当构造函数中 return 的不是一个对象时，那么它还是会根据 new 关键词的执行逻辑，生成一个新的对象（绑定了最新 this），最后返回出来。

``` js
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

``` js
function _new(){
	let target={} // 创建一个空的简单JavaScript对象
	let[constructor,...args]=[...arguments] //通过参数绑定构造函数和参数
	target.__proto__=constructor.prototype //新对象和构造函数使用原型链连接
	constructor.apply(target,args) //执行构造函数，通过apply传入this和参数
	return target 
}
```





## 闭包

**本质**:在一个函数内部创建另一个函数

**闭包函数：**声明在一个函数中的函数，叫做[闭包](https://so.csdn.net/so/search?q=闭包&spm=1001.2101.3001.7020)函数。

**只要存在函数嵌套,并且内部函数调用了外部函数的属性,就产生了闭包.**

闭包的this指向的是window

**闭包：**内部函数总是可以访问其所在的外部函数中声明的参数和变量，即使在其外部函数被返回（寿命终结）了之后。

**作用1：隐藏变量，避免全局污染**

**作用2：可以读取函数内部的变量**

有权访问另一个函数作用域中的变量的函数；

第一，闭包是一个函数，而且存在于另一个函数当中

第二，闭包可以访问到父级函数的变量，且该变量不会销毁

### 特点

 让外部访问函数内部变量成为可能；

 可以避免使用全局变量，防止全局变量污染；

 局部变量会常驻在内存中；

 参数和变量不会被垃圾回收机制回收，会造成内存泄漏（有一块内存空间被长期占用，而不被释放）



## 原型和原型链

每当定义一个函数数据类型(普通函数、类)时候，都会天生自带一个prototype属性，这个属性指向函数的原型对象，并且这个属性是一个对象数据类型的值。

原型链 __proto__和constructor

每一个对象数据类型(普通的对象、实例、prototype......)也天生自带一个属性__proto__，属性值是当前实例所属类的原型(prototype)。实例原型中有一个属性constructor, 它指向函数对象，即构造函数。



通过prototype对象指向父类对象，直到指向Object对象为止，这样就形成了一个原型指向的链条，专业术语称之为原型链

当我们访问对象的一个属性或方法时，它会先在对象自身中寻找，如果没有则会去原型对象中寻找，直到找到Object对象的原型，Object对象的原型，如果在Object原型中依然没有找到，则返回undefined。

原型链的终点：object.prototype=null




## 继承的几种方式以及优缺点

### 原型链继承

父类新增原型方法/原型属性，子类都能访问到

属性没有私有化，原型上属性的改变会作用到所有的实例上。

### 构造函数继承：

在构造子类构造函数时内部使用call或apply来调用父类的构造函数

实现了属性的私有化，但是子类无法访问父类原型上的属性。

可以实现多继承

### 组合继承

可以继承实例属性/方法，也可以继承原型属性/方法

调用了两次父类构造函数，生成了两份实例

寄生继承：

　　核心：通过寄生方式，砍掉父类的实例属性，这样，在调用两次父类的构造的时候，就不会初始化两次实例方法/属性，避免的组合继承的缺点



## 堆？栈？区别和联系？

>堆和栈的概念存在于数据结构中和操作系统内存中。
>在数据结构中，栈中数据的存取方式为先进后出。而堆是一个优先队列，是按优先级来进行排序的，优先级可以按照大小来规定。完全
>二叉树是堆的一种实现方式。
>在操作系统中，内存被分为栈区和堆区。
>栈区内存由编译器自动分配释放，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。
>堆区内存一般由程序员分配释放，若程序员不释放，程序结束时可能由垃圾回收机制回收。


## BOM属性对象方法

###  1.window对象

### 2.location对象

它提供了与当前窗口中加载的文档有关的信息，还提供了一些导航功能

### 3.history对象

history对象是window对象的属性，它保存着用户上网的记录，从窗口被打开的那一刻算起



## ajax的请求过程

原生JS中的Ajax：

1、使用ajax发送数据的步骤

第一步：创建异步对象

var xhr = new XMLHttpRequest();

第二步：设置 请求行 open(请求方式，请求url):

// get请求如果有参数就需要在url后面拼接参数，

// post如果有参数，就在请求体中传递 xhr.open("get","validate.php?username="+name)

xhr.open("post","validate.php");

第三步：设置请求（GET方式忽略此步骤）头:setRequestHeader()

// 1.get不需要设置

// 2.post需要设置请求头：Content-Type:application/x-www-form-urlencoded

xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

第四步：设置请求体 send()

// 1.get的参数在url拼接了，所以不需要在这个函数中设置

// 2.post的参数在这个函数中设置(如果有参数)

xhr.send(null) xhr.send("username="+name);

第五步：让异步对象接收服务器的响应数据



## “==”与"==="的区别

== 表示相等 （值相等）

===表示恒等（类型和值都要相等）

js在比较的时候如果是 == 会先做类型转换，再判断值得大小，如果是===类型和值必须都相等。



## addEventListener和onclick区别

### 普通事件（onclick）

普通事件就是直接触发事件，同一时间只能指向唯一对象，所以会被覆盖掉。

``` js
var btn = document.getElementById("btn");
btn.onclick = function(){
  alert("你好111");
}
btn.onclick = function(){
  alert("你好222");
}
// 你好222
```

### 事件绑定（addEventListener）

事件绑定就是对于一个可以绑定的事件对象，进行多次绑定事件都能运行。

``` js
var btn = document.getElementById("btn");q
btn.addEventListener("click",function(){
  alert("你好111");
},false);
btn.addEventListener("click",function(){
  alert("你好222");
},false);
// 运行结果会依次弹出你好111，你好222的弹出框。
```

> onclick属性不适用以下元素：`<base>、<bdo>、<br>、<head>、<html>、<iframe>、<meta>、<param>、<script>、<style> 或 <title>`。



## target、currentTarget的区别？

currentTarget当前所绑定事件的元素

target当前被点击的元素




## 函数柯里化及其通用封装

函数柯里化，其实就是把多次调用的变量保存在闭包中，每次调用都查看一下变量数和原函数的形参数量是否相等。不相等就继续递归。直到相等为止就处理了。

**函数柯里化是指一个函数接收参数但不执行,直到所有参数都接到之后再执行**

curry 的概念很简单：**只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。**



## EventLoop事件循环机制

JavaScript的事件分两种，宏任务(macro-task)和微任务(micro-task)

宏任务：包括整体代码script，setTimeout，setInterval

微任务：Promise.then(非new Promise)，process.nextTick(node中)

``` js
setTimeout(function() {
    console.log('setTimeout');
},1000)

new Promise(function(resolve) {
    console.log('promise');
}).then(function() {
    console.log('then');
})

console.log('console');
```

首先setTimeout，放入Event Table中，1秒后将回调函数放入宏任务的Event Queue中

new Promise 同步代码，立即执行console.log('promise'),然后看到微任务then，因此将其放入微任务的Event Queue中

接下来执行同步代码console.log('console')

主线程的宏任务，已经执行完毕，接下来要执行微任务，因此会执行Promise.then，到此，第一轮事件循环执行完毕

第二轮事件循环开始，先执行宏任务，即setTimeout的回调函数，然后查找是否有微任务，没有，时间循环结束

总结：

事件循环，先执行宏任务，其中同步任务立即执行，异步任务加载到对应的的Event Queue中(setTimeout等加入宏任务的Event Queue，Promise.then加入微任务的Event Queue)，所有同步宏任务执行完毕后，如果发现微任务的Event Queue中有未执行的任务，会先执行其中的任务，这样算是完成了一次事件循环。接下来查看宏任务的Event Queue中是否有未执行的任务，有的话，就开始第二轮事件循环，依此类推。




## 前端性能优化

减少请求数：合并资源(精灵图)，减少http请求数。

加快请求速度：预解析DNS，减少域名数，CDN分支。

缓存：http请求协议缓存，离线缓存，离线数据缓存(localStorage)。

渲染：js/css优化，服务器渲染，加快顺序。



## Object.create 和new

Object.create是内部定义一个**funcition****对象****f**，并且让F.prototype对象 赋值为base，并return出一个新的对象实例。

``` js
Object.create =  function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
};
```

new做法是新建一个**obj****对象**o1，并且让o1的__proto__指向了Base.prototype对象。并且使用call 进行强转作用环境。从而实现了实例的创建。

JavaScript 实际上执行的是：

```
var o1 = new Object();
o1.[[Prototype]] = Base.prototype;
Base.call(o1);
```



## Location 对象

Location 对象包含有关当前 URL 的信息。把用户带到一个新地址

``` js
window.location="/index.html"
```



## 跨域及解决方案

跨域：在同源策略的限制下，会阻止非同源下域的内容进行交互

**同源策略**是一种约定，由Netscape公司1995年引入浏览器，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSFR等攻击。所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个ip地址，也非同源。

跨域：同协议、域名、端口

![img](https://pic3.zhimg.com/80/v2-27fc250c234aae487e1e80bf3cec7896_720w.webp)

[9种常见的前端跨域解决方案（详解） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/81809258)

### 1、JSONP跨域

**jsonp**的原理就是利用`<script>`标签没有跨域限制，通过`<script>`标签src属性，发送带有callback参数的GET请求，服务端将接口返回数据拼凑到callback函数中，返回给浏览器，浏览器解析执行，从而前端拿到callback函数返回的数据。

1）原生JS实现：

``` js
 <script>
    var script = document.createElement('script');
    script.type = 'text/javascript';

    // 传参一个回调函数名给后端，方便后端返回时执行这个在前端定义的回调函数
    script.src = 'http://www.domain2.com:8080/login?user=admin&callback=handleCallback';
    document.head.appendChild(script);

    // 回调执行函数
    function handleCallback(res) {
        alert(JSON.stringify(res));
    }
 </script>
```

服务端返回如下（返回时即执行全局函数）：

``` js
handleCallback({"success": true, "user": "admin"})
```

2）jquery Ajax实现：

``` js
$.ajax({
    url: 'http://www.domain2.com:8080/login',
    type: 'get',
    dataType: 'jsonp',  // 请求方式为jsonp
    jsonpCallback: "handleCallback",  // 自定义回调函数名
    data: {}
});
```

3）Vue axios实现：

``` js
this.$http = axios;
this.$http.jsonp('http://www.domain2.com:8080/login', {
    params: {},
    jsonp: 'handleCallback'
}).then((res) => {
    console.log(res); 
})
```

后端node.js代码：

``` js
var querystring = require('querystring');
var http = require('http');
var server = http.createServer();

server.on('request', function(req, res) {
    var params = querystring.parse(req.url.split('?')[1]);
    var fn = params.callback;

    // jsonp返回设置
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.write(fn + '(' + JSON.stringify(params) + ')');

    res.end();
});

server.listen('8080');
console.log('Server is running at port 8080...');
```

**jsonp的缺点：只能发送get一种请求**



### 2、跨域资源共享（CORS）

**CORS**是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
它允许浏览器向跨源服务器，发出XMLHttpRequest请求，从而克服了AJAX只能同源使用的限制。
CORS需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE浏览器不能低于IE10。

#### **前端设置**

原生ajax：

``` js
var xhr = new XMLHttpRequest(); // IE8/9需用window.XDomainRequest兼容

// 前端设置是否带cookie
xhr.withCredentials = true;

xhr.open('post', 'http://www.domain2.com:8080/login', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send('user=admin');

xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        alert(xhr.responseText);
    }
};
```

jquery ajax：

``` js
$.ajax({
    ...
   xhrFields: {
       withCredentials: true    // 前端设置是否带cookie
   },
   crossDomain: true,   // 会让请求头中包含跨域的额外信息，但不会含cookie
    ...
});
```

#### **服务端设置**

- nodejs代码

``` js
var http = require('http');
var server = http.createServer();
var qs = require('querystring');

server.on('request', function(req, res) {
    var postData = '';

    // 数据块接收中
    req.addListener('data', function(chunk) {
        postData += chunk;
    });

    // 数据接收完毕
    req.addListener('end', function() {
        postData = qs.parse(postData);

        // 跨域后台设置
        res.writeHead(200, {
            'Access-Control-Allow-Credentials': 'true',     // 后端允许发送Cookie
            'Access-Control-Allow-Origin': 'http://www.domain1.com',    // 允许访问的域（协议+域名+端口）
            /* 
             * 此处设置的cookie还是domain2的而非domain1，因为后端也不能跨域写cookie(nginx反向代理可以实现)，
             * 但只要domain2中写入一次cookie认证，后面的跨域接口都能从domain2中获取cookie，从而实现所有的接口都能跨域访问
             */
            'Set-Cookie': 'l=a123456;Path=/;Domain=www.domain2.com;HttpOnly'  // HttpOnly的作用是让js无法读取cookie
        });

        res.write(JSON.stringify(postData));
        res.end();
    });
});

server.listen('8080');
console.log('Server is running at port 8080...');
```

### 3、第三方服务器代理

实现原理：同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。

代理服务器，需要做以下几个步骤：

接受客户端请求 。

将请求 转发给服务器。

拿到服务器 响应 数据。

将 响应 转发给客户端。



## JS 垃圾回收机制

### 一、什么是内存泄漏？

程序的运行需要内存，当程序提出要求，操作系统就会供给内存。对于不再用到的内存，没有及时释放，就叫做内存泄漏。

对于持续运行的服务进程，必须及时释放内存，否则，内存占用越来越高，轻则影响系统性能，重则导致进程崩溃。

### 二、什么是垃圾回收机制?

JavaScript具有垃圾收集器，垃圾收集器会按照固定的时间间隔周期性的执行。

最常见的垃圾回收方式有两种：

标记清除
引用计数

#### 1.标记清除：

原理：是当变量进入环境时，将这个变量标记为“进入环境”。当变量离开环境时，则将其标记为“离开环境”。标记“离开环境”的就回收内存。

垃圾回收器，在运行的时候会给存储在内存中的所有变量都加上标记。
去掉环境中的变量以及被环境中的变量引用的变量的标记。
再被加上标记的会被视为准备删除的变量。
垃圾回收器完成内存清除工作，销毁那些带标记的值并回收他们所占用的内存空间。

#### 2.引用计数

原理：跟踪记录每个值被引用的次数。

声明了一个变量并将一个引用类型的值赋值给这个变量，这个引用类型值的引用次数就是1。
同一个值又被赋值给另一个变量，这个引用类型值的引用次数加1。
当包含这个引用类型值的变量又被赋值成另一个值了，那么这个引用类型值的引用次数减1。
当引用次数变成0时，说明没办法访问这个值了。
当垃圾收集器下一次运行时，它就会释放引用次数是0的值所占的内存。
（注意：当循环引用的时候就会释放不掉内存。）

### 三、如何观察内存泄漏？

如果连续五次垃圾回收之后，内存占用一次比一次大，就有内存泄漏。这就要求实时查看内存占用。

可以浏览器查看内存占用。
通过命令行，命令行可以使用 Node process.memoryUsage提供的方法。process.memoryUsage返回一个对象，包含了 Node 进程的内存占用信息。（判断内存泄漏，以heapUsed字段为准。）

### 四、总结

内存没有释放或释放及时会造成内存泄漏。

垃圾回收机制的常用方式是标记清除和引用计数。

查看内存泄漏可以通过浏览器和命令行的方式。



## setTimeout 倒计时误差

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

通过引入计数器，判断计时器延迟执行的时间来进行误差修正，尽量让误差缩小，不同浏览器不同时间段打开页面倒计时误差可控制在1s以内。

``` js
// 倒计时
 countTime: function () {
   var that = this;
   let countDownNum = that.getCountdownTime(); //获取倒计时初始值
   if (countDownNum <= 0) return;
   var string = that.getCountdownString(countDownNum);
   that.setData({
     countdownTime: string
   });
   var interval = 1000, start = new Date().getTime(), count = 0;
   that.data.timer = setTimeout(countDownStart, interval);
   function countDownStart() {
     var offset, nextTime; // offset是倒计时误差时间，nextTime是减去误差时间后下一次执行的时间
     count++;
     offset = new Date().getTime() - (start + count * interval);
     nextTime = interval - offset;
     if (nextTime < 0) { nextTime = 0; }
     countDownNum -= interval;
     var string = that.getCountdownString(countDownNum);
     console.log("误差: " + offset + "ms, 下一次执行: " + nextTime + "ms后，离活动开始还有: " + countDownNum + "ms");
     if (countDownNum <= 0) {
       clearTimeout(that.data.timer);
     } else {
       that.setData({
         countdownTime: string
       })
       that.data.timer = setTimeout(countDownStart, nextTime);
     }
   }
 }
```



## jQuery的选择器怎么实现的

jquery原型里面有一个init初始化的方法，将传入的值进行解析，比如传入的id还是class还是标签名。然后通过相应的方法返回数组型对象。既可以通过对象直接调用方法，也可以使用数组的length。



## 树和图





# ES6

## var、let、const

用 var 声明的变量的作用域是它当前的执行上下文，即如果是在任何函数外面，则是全局执行上下文，如果在函数里面，则是当前函数执行上下文。换句话说，var 声明的变量的作用域只能是全局或者整个函数块的。

- 作用域
  - **全局作用域**
  - **函数作用域**：`function() {}`
  - **块级作用域**：`{}`

- 作用范围
  - `var命令`在全局代码中执行
  - `const命令`和`let命令`只能在代码块中执行
- 赋值使用
  - `let命令`声明变量后可立马赋值或使用时赋值
  - `const命令`声明常量后必须立马赋值
- 声明方法：`var`、`const`、`let`、`function`、`class`、`import`

### let

> 有块级作用域：可以是全局或者整个函数块，也可以是 if、while、switch等用`{}`限定的代码块。
>
> 不存在变量提升
>
> 不存在重复定义：不允许在同一作用域中重复声明，否则将抛出异常
>
> 不可能提前使用。

### const

> 固定的，一开始就要声明好，后面不能更改
>
> const 声明的是一个只读变量，声明之后不允许改变其值
>
> 因此，const 一旦声明必须初始化，否则会报错。
>
> const 其实保证的不是变量的值不变，而是保证变量指向的内存地址所保存的数据不允许改动（即栈内存在的值和地址）。
>
>  const 只能保证指针是不可修改的，至于指针指向的数据结构是无法保证其不能被修改的（在堆中）。



## 变量提升与暂时性死区

**var 声明变量，存在变量提升**

变量提升:var命令会发生“变量提升”现象，即变量可以在声明之前使用，值为undefined。

**let 声明变量，存在暂存死区**

暂时性死区:只要块级作用域内存在let声明，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。





## export和import

模块化开发

###     1.Export

如果希望从外界获取某个文件内部的变量，必须通过export输出

###     2.Import命令

export定义了模块的对外接口后，其他JS文件就可以通过import来加载这个模块



## require、import区别

### 区别1：模块加载的时间

require：运行时加载 import：编译时加载（效率更高）【由于是编译时加载，所以import命令会提升到整个模块的头部】

### 区别2：模块的本质

require：模块就是对象，输入时必须查找对象属性 import：ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，再通过 import 命令输入（这也导致了没法引用 ES6 模块本身，因为它不是对象）。由于 ES6 模块是编译时加载，使得静态分析成为可能。有了它，就能进一步拓宽 JavaScript 的语法，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。



## Promise

异步编程的一种解决办法

它有三种状态，分别是

pending-进行中、

resolved-已完成、

rejected-已失败。

改变状态的方式只有一种，即异步的结果：

如果成功状态由padding——>fulfilled；

否则状态由padding——>rejected。

无法提供其他方式改变状态。



## Symbol

用来表示一个独一无二的值 

``` js
 let a = Symbol();
```



## 解构赋值 

- **字符串解构**：`const [a, b, c, d, e] = "hello"`
-  **数值解构**：`const { toString: s } = 123`
-  **布尔解构**：`const { toString: b } = true`
-  对象解构
  - 形式：`const { x, y } = { x: 1, y: 2 }`
  - 默认：`const { x, y = 2 } = { x: 1 }`
  - 改名：`const { x, y: z } = { x: 1, y: 2 }`
-  数组解构
  - 规则：数据结构具有`Iterator接口`可采用数组形式的解构赋值
  - 形式：`const [x, y] = [1, 2]`
  - 默认：`const [x, y = 2] = [1]`
-  函数参数解构
  - 数组解构：`function Func([x = 0, y = 1]) {}`
  - 对象解构：`function Func({ x = 0, y = 1 } = {}) {}`

> 应用场景

- 交换变量值：`[x, y] = [y, x]`
- 返回函数多个值：`const [x, y, z] = Func()`
- 定义函数参数：`Func([1, 2])`
- 提取JSON数据：`const { name, version } = packageJson`
- 定义函数参数默认值：`function Func({ x = 1, y = 2 } = {}) {}`
- 遍历Map结构：`for (let [k, v] of Map) {}`
- 输入模块指定属性和方法：`const { readFile, writeFile } = require("fs")`

> 重点难点

- 匹配模式：只要等号两边的模式相同，左边的变量就会被赋予对应的值
- 解构赋值规则：只要等号右边的值不是对象或数组，就先将其转为对象
- 解构默认值生效条件：属性值严格等于`undefined`
- 解构遵循匹配模式
- 解构不成功时变量的值等于`undefined`
- `undefined`和`null`无法转为对象，因此无法进行解构



### 字符串扩展

-  **Unicode表示法**：`大括号包含`表示Unicode字符(`\u{0xXX}`或`\u{0XXX}`)
-  **字符串遍历**：可通过`for-of`遍历字符串
-  **字符串模板**：可单行可多行可插入变量的增强版字符串
-  **标签模板**：函数参数的特殊调用
-  **String.raw()**：返回把字符串所有变量替换且对斜杠进行转义的结果
-  **String.fromCodePoint()**：返回码点对应字符
-  **codePointAt()**：返回字符对应码点(`String.fromCodePoint()`的逆操作)
-  **normalize()**：把字符的不同表示方法统一为同样形式，返回`新字符串`(Unicode正规化)
-  **repeat()**：把字符串重复n次，返回`新字符串`
-  **matchAll()**：返回正则表达式在字符串的所有匹配
-  **includes()**：是否存在指定字符串
-  **startsWith()**：是否存在字符串头部指定字符串
-  **endsWith()**：是否存在字符串尾部指定字符串



### 数值扩展

-  **二进制表示法**：`0b或0B开头`表示二进制(`0bXX`或`0BXX`)
-  **八进制表示法**：`0o或0O开头`表示二进制(`0oXX`或`0OXX`)
-  **Number.EPSILON**：数值最小精度
-  **Number.MIN_SAFE_INTEGER**：最小安全数值(`-2^53`)
-  **Number.MAX_SAFE_INTEGER**：最大安全数值(`2^53`)
-  **Number.parseInt()**：返回转换值的整数部分
-  **Number.parseFloat()**：返回转换值的浮点数部分
-  **Number.isFinite()**：是否为有限数值
-  **Number.isNaN()**：是否为NaN
-  **Number.isInteger()**：是否为整数
-  **Number.isSafeInteger()**：是否在数值安全范围内
-  **Math.trunc()**：返回数值整数部分
-  **Math.sign()**：返回数值类型(`正数1`、`负数-1`、`零0`)
-  **Math.cbrt()**：返回数值立方根
-  **Math.clz32()**：返回数值的32位无符号整数形式
-  **Math.imul()**：返回两个数值相乘
-  **Math.fround()**：返回数值的32位单精度浮点数形式
-  **Math.hypot()**：返回所有数值平方和的平方根
-  **Math.expm1()**：返回`e^n - 1`
-  **Math.log1p()**：返回`1 + n`的自然对数(`Math.log(1 + n)`)
-  **Math.log10()**：返回以10为底的n的对数
-  **Math.log2()**：返回以2为底的n的对数
-  **Math.sinh()**：返回n的双曲正弦
-  **Math.cosh()**：返回n的双曲余弦
-  **Math.tanh()**：返回n的双曲正切
-  **Math.asinh()**：返回n的反双曲正弦
-  **Math.acosh()**：返回n的反双曲余弦
-  **Math.atanh()**：返回n的反双曲正切

### 对象扩展

-  **简洁表示法**：直接写入变量和函数作为对象的属性和方法(`{ prop, method() {} }`)

-  **属性名表达式**：字面量定义对象时使用`[]`定义键(`[prop]`，不能与上同时使用)

-  

  方法的name属性

  ：返回方法函数名

  - 取值函数(getter)和存值函数(setter)：`get/set 函数名`(属性的描述对象在`get`和`set`上)
  - bind返回的函数：`bound 函数名`
  - Function构造函数返回的函数实例：`anonymous`

-  **属性的可枚举性和遍历**：描述对象的`enumerable`

-  **super关键字**：指向当前对象的原型对象(只能用在对象的简写方法中`method() {}`)

-  **Object.is()**：对比两值是否相等

-  **Object.assign()**：合并对象(浅拷贝)，返回原对象

-  **Object.getPrototypeOf()**：返回对象的原型对象

-  **Object.setPrototypeOf()**：设置对象的原型对象

-  **__proto__**：返回或设置对象的原型对象

> 属性遍历

- 描述：`自身`、`可继承`、`可枚举`、`非枚举`、`Symbol`
- 遍历
  - `for-in`：遍历对象`自身可继承可枚举`属性
  - `Object.keys()`：返回对象`自身可枚举`属性键组成的数组
  - `Object.getOwnPropertyNames()`：返回对象`自身非Symbol`属性键组成的数组
  - `Object.getOwnPropertySymbols()`：返回对象`自身Symbol`属性键组成的数组
  - `Reflect.ownKeys()`：返回对象`自身全部`属性键组成的数组
- 规则
  - 首先遍历所有数值键，按照数值升序排列
  - 其次遍历所有字符串键，按照加入时间升序排列
  - 最后遍历所有Symbol键，按照加入时间升序排列

### 数组扩展

-  **扩展运算符(...)**：转换数组为用逗号分隔的参数序列(`[...arr]`，相当于`rest/spread参数`的逆运算)
-  Array.from()：转换具有**Iterator接口**的数据结构为真正数组，返回新数组
  - 类数组对象：`包含length的对象`、`Arguments对象`、`NodeList对象`
  - 可遍历对象：`String`、`Set结构`、`Map结构`、`Generator函数`
-  **Array.of()**：转换一组值为真正数组，返回新数组
-  **copyWithin()**：把指定位置的成员复制到其他位置，返回原数组
-  **find()**：返回第一个符合条件的成员
-  **findIndex()**：返回第一个符合条件的成员索引值
-  **fill()**：根据指定值填充整个数组，返回原数组
-  **keys()**：返回以索引值为遍历器的对象
-  **values()**：返回以属性值为遍历器的对象
-  **entries()**：返回以索引值和属性值为遍历器的对象
-  **数组空位**：ES6明确将数组空位转为`undefined`(空位处理规不一，建议避免出现)





## 扩展运算符(…)

- 克隆数组：`const arr = [...arr1]`
- 合并数组：`const arr = [...arr1, ...arr2]`
- 拼接数组：`arr.push(...arr1)`
- 代替apply：`Math.max.apply(null, [x, y])` => `Math.max(...[x, y])`
- 转换字符串为数组：`[..."hello"]`
- 转换类数组对象为数组：`[...Arguments, ...NodeList]`
- 转换可遍历对象为数组：`[...String, ...Set, ...Map, ...Generator]`
- 与数组解构赋值结合：`const [x, ...rest/spread] = [1, 2, 3]`
- 计算Unicode字符长度：`Array.from("hello").length` => `[..."hello"].length`



## Object.keys()方法

获取对象的所有属性名或方法名（不包括原形的内容），返回一个数组。



## Object.assign()

assign方法将多个原对象的属性和方法都合并到了目标对象上面。可以接收多个参数，第一个参数是目标对象，后面的都是源对象。



## Set数据结构

Set数据结构，类似**数组**。所有的数据都是唯一的，没有重复的值。

``` js
const set = new Set(arr)
```

> 方法

- **add()**：添加值，返回实例
- **delete()**：删除值，返回布尔
- **has()**：检查值，返回布尔
- **clear()**：清除所有成员
- **keys()**：返回以属性值为遍历器的对象
- **values()**：返回以属性值为遍历器的对象
- **entries()**：返回以属性值和属性值为遍历器的对象
- **forEach()**：使用回调函数遍历每个成员

> 应用场景

- 去重字符串：`[...new Set(str)].join("")`
- 去重数组：`[...new Set(arr)]`或`Array.from(new Set(arr))`
- 集合数组
  - 声明：`const a = new Set(arr1)`、`const b = new Set(arr2)`
  - 并集：`new Set([...a, ...b])`
  - 交集：`new Set([...a].filter(v => b.has(v)))`
  - 差集：`new Set([...a].filter(v => !b.has(v)))`
- 映射集合
  - 声明：`let set = new Set(arr)`
  - 映射：`set = new Set([...set].map(v => v * 2))`或`set = new Set(Array.from(set, v => v * 2))`





## Map数据结构

它类似与对象，也是**键值对集合**，但是”键”的范围不限于字符串，对象也可以当作键。



## Proxy

Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

``` js
const p = new Proxy(target, handler)
```

targe：t要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。

handler：一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为



## Reflect





## 模板字符串

用一对反引号(`)标识，它可以当作普通字符串使用，也可以用来定义多行字符串，也可以在字符串中嵌入变量，js表达式或函数，变量、js表达式或函数需要写在${ }中。即完成拼接



## 箭头函数

语法比函数表达式更简洁

并且没有自己的this（this是所处上下文的this)，arguments，super或new.target。

箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数。

参数=>函数实体



## for…of 

用于对象遍历

for (variable of iterable) {

  statement

}



## for…in







## **async/await**

### async

**介绍**:async函数是使用`async`关键字声明的函数。 async函数是[`AsyncFunction`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction)构造函数的实例， 并且其中允许使用`await`关键字。`async`和`await`关键字让我们可以用一种更简洁的方式写出基于[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)的异步行为，而无需刻意地链式调用`promise`。

**特性**:async函数可能包含0个或者多个[`await`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)表达式。await表达式会暂停整个async函数的执行进程并出让其控制权，只有当其等待的基于promise的异步操作被兑现或被拒绝之后才会恢复进程。promise的解决值会被当作该await表达式的返回值。使用`async` / `await`关键字就可以在异步代码中使用普通的`try` / `catch`代码块。

`async` 函数是 `Generator` 函数的语法糖。使用 关键字 `async` 来表示，在函数内部使用 `await` 来表示异步。相较于 `Generator`，`async` 函数的改进在于下面四点：

- **内置执行器**。`Generator` 函数的执行必须依靠执行器，而 `async` 函数自带执行器，调用方式跟普通函数的调用一样
- **更好的语义**。`async` 和 `await` 相较于 `*` 和 `yield` 更加语义化
- **更广的适用性**。`co` 模块约定，`yield` 命令后面只能是 Thunk 函数或 Promise对象。而 `async` 函数的 `await` 命令后面则可以是 Promise 或者 原始类型的值（Number，string，boolean，但这时等同于同步操作）
- **返回值是 Promise**。`async` 函数返回值是 Promise 对象，比 Generator 函数返回的 Iterator 对象方便，可以直接使用 `then()` 方法进行调用

`async`是ES7新出的特性，表明当前函数是异步函数，不会阻塞线程导致后续代码停止运行。



### **async**用来声明函数是一个异步函数

### **await**表示紧跟在后面的表达式需要等待结果

``` js
async function asyncFn(){    return 'hello world';}asuncFn();
```

**async**函数返回的是一个**promise**对象,状态为**resolved**,参数是**return**的值,所以async函数可以链式调用

``` js
async function asyncFn() {    return '我后执行'}asyncFn().then(result => {    console.log(result);//我后执行})console.log('我先执行');
```

**async**函数返回的是一个promise对象，如果再执行过程中函数**内部抛出异常**或者返回**reject**，都会是的函数的promise状态变为失败**rejected**，函数抛出异常后，可以通过**catch**接收到返回的错误信息

``` js
async function asyncFn() {    return  Promise.reject('reason') // throw new Error('has error')}asyncFn().then(result => {    console.log(result);},reason => {    console.log(reason);}).catch(err => {    console.log(err);})console.log('我先执行');
```

async函数接收到的返回值,如果不是**异常**或者**reject**，则判定成功,即**resolve**

以下结果会使async函数判定**失败**:

- 内部含有直接使用并且未声明的变量或者函数。
- 内部抛出一个错误`throw new Error`或者返回`reject`状态`return Promise.reject('执行失败')`
- 函数方法执行出错（🌰：Object使用push()）等等…

async函数如果需要返回结果,都必须使用**return**来返回,不论是**reject**还是**resolve**都需要使用return，不然就会返回一个值为**undefined** 的**resolved**(成功)状态

### await

**await**的意思是**async wait**(异步等待),**await必须配合async使用**，**async函数必须等到内部所有的await命令的promise执行完,才会返回结果**

**打个比方，await是学生，async是校车，必须等人齐了再开车。**

就是说，必须等所有`await` 函数执行完毕后，才会告诉`promise`我成功了还是失败了，执行`then`或者`catch`





# VUE

##  SPA 单页面的理解，优缺点

SPA（ single-page application ）仅在 Web 页面初始化时加载相应的 HTML、JavaScript 和 CSS。一旦页面加载完成，SPA 不会因为用户的操作而进行页面的重新加载或跳转；取而代之的是利用路由机制实现 HTML 内容的变换，UI 与用户的交互，避免页面的重新加载。

### 优点：

- 用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染；
- 基于上面一点，SPA 对服务器压力小；
- 前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理；

### 缺点：

- 初次加载耗时多：为实现单页 Web 应用功能及显示效果，需要在加载页面的时候将 JavaScript、CSS 统一加载，部分页面按需加载；
- 前进后退路由管理：由于单页应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理；
- SEO 难度较大：由于所有的内容都在一个页面中动态替换显示，所以在 SEO 上其有着天然的弱势。



## v-show 与 v-if 

v-if 是真正的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建；也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 的 “display” 属性进行切换。

所以，v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景；v-show 则适用于需要非常频繁切换条件的场景。



### v-if

初始值为 **false** 组件**不会**渲染，[生命周期](https://so.csdn.net/so/search?q=生命周期&spm=1001.2101.3001.7020)钩子**不会**执行，**v-if** 的渲染是**惰性**的。
初始值为 **true** 时，组件会进行渲染，并依次执行 beforeCreate,created,beforeMount,mounted 钩子。

切换

false => true
依次执行 beforeCreate,created,beforeMount,mounted 钩子。
true => false
依次执行 beforeDestroy,destroyed 钩子。

### v-show

无论初始状态，组件都会渲染，依次执行 beforeCreate,created,beforeMount,mounted 钩子，**v-show** 的渲染是**非惰性**的。

切换 ，对生命周期钩子无影响，切换时组件始终保持在 mounted 钩子。



## **Class 与 Style 动态绑定？**

Class 可以通过对象语法和数组语法进行动态绑定：

- 对象语法：

``` html
<div v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>
```

- 数组语法：

``` html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
```

Style 也可以通过对象语法和数组语法进行动态绑定：

- 对象语法：

``` html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

- 数组语法：

``` html
<div v-bind:style="[styleColor, styleSize]"></div>
```



##  Vue 的单向数据流？**

**所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。**

这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。

额外的，每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。

子组件想修改时，只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改。

有两种常见的试图改变一个 prop 的情形 :

- 这个 prop 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用。 在这种情况下，最好定义一个本地的 data 属性并将这个 prop 用作其初始值：

``` js
props: ['initialCounter'],
```

- 这个 prop 以一种原始的值传入且需要进行转换。 在这种情况下，最好使用这个 prop 的值来定义一个计算属性

``` js
props: ['size'],
```



## computed 和 watch 的区别和运用的场景

computed： 是计算属性，依赖其它属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值；

watch： 更多的是「观察」的作用，类似于某些数据的监听回调 ，每当监听的数据变化时都会执行回调进行后续操作；

运用场景：

- 当我们需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算；
- 当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。



## **直接给一个数组项赋值，Vue 能检测到变化吗？**

由于 JavaScript 的限制，Vue 不能检测到以下数组的变动：

- 当你利用索引直接设置一个数组项时，例如：vm.items[indexOfItem] = newValue
- 当你修改数组的长度时，例如：vm.items.length = newLength

为了解决第一个问题，Vue 提供了以下操作方法：

``` js
Vue.set
```

为了解决第二个问题，Vue 提供了以下操作方法：

``` js
Array.prototype.splice
```

## 强制更新视图

页面通过v-for循环渲染了一些东西，如果其中的属性变化，vue不会更新视图，需要强制更新视图

> 修改一个数组其中的一个值，或者添加一条数据时，不管用

### 方法一：Vue.set() 方法（this.$set（））

Vue.set( target, key, value ) 中有三个参数 **target：要更改的数据源(可以是对象或者数组) key：要更改的具体数据 如果是数组 就是索引值 value ：重新赋的值**

``` js
this.$set(this.student,"age", 24)
```

### 方法二：$forceUpdate

对于深层的，最好用set方法，这样vue就可以知道发生了变化，同时vue也不建议直接修改length，可以给一个空数组来置空。用 forceUpdate 了，因为你修改了数据，但是页面层没有变动，说明数据本身是被修改了，但是vue没有监听到而已，用$forceUpdate就相当于按照最新数据给渲染一下。

``` js
change: function(index) {
    this.list[index].sex = '男';
    this.$forceUpdate();
},
clear: function() {
    this.list.length = 0;
    this.$forceUpdate();
}
```



## Vue 生命周期

### 生命周期是什么

Vue 实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模版、挂载 Dom -> 渲染、更新 -> 渲染、卸载等一系列过程，我们称这是 Vue 的生命周期。

### 各个生命周期的作用

| 生命周期      | 描述                                                                  |
| :------------ | :-------------------------------------------------------------------- |
| beforeCreate  | 组件实例被创建之初，组件的属性生效之前                                |
| created       | 组件实例已经完全创建，属性也绑定，但真实 dom 还没有生成，$el 还不可用 |
| beforeMount   | 在挂载开始之前被调用：相关的 render 函数首次被调用                    |
| mounted       | el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子             |
| beforeUpdate  | 组件数据更新之前调用，发生在虚拟 DOM 打补丁之前                       |
| update        | 组件数据更新之后                                                      |
| activited     | keep-alive 专属，组件被激活时调用                                     |
| deactivated   | keep-alive 专属，组件被销毁时调用                                     |
| beforeDestory | 组件销毁前调用                                                        |
| destoryed     | 组件销毁后调用                                                        |



## Vue 的父组件和子组件生命周期钩子函数执行顺序？

- 加载渲染过程

  父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

- 子组件更新过程

  父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

- 父组件更新过程

  父 beforeUpdate -> 父 updated

- 销毁过程

  父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed



## 在哪个生命周期内调用异步请求？

可以在钩子函数 created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。但是本人推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

- 能更快获取到服务端数据，减少页面 loading 时间；
- ssr 不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；



## 在什么阶段才能访问操作DOM？

在钩子函数 mounted 被调用前，Vue 已经将编译好的模板挂载到页面上，所以在 mounted 中可以访问操作 DOM。



## 在mounted阶段初始化echarts



## 父组件监听到子组件的生命周期







## **组件中 data 为什么是一个函数？**

> 为什么组件中的 data 必须是一个函数，然后 return 一个对象，而 new Vue 实例里，data 可以直接是一个对象？

``` js
data() {
    return {
        a:1,
        b:"2"
    }
}
```

因为组件是用来复用的，且 JS 里对象是引用关系

如果组件中 data 是一个对象，那么这样作用域没有隔离，子组件中的 data 属性值会相互影响

如果组件中 data 选项是一个函数，那么每个实例可以维护一份被返回对象的独立的拷贝，组件实例之间的 data 属性值不会互相影响；

而 new Vue 的实例，是不会被复用的，因此不存在引用对象的问题。



## v-model 的原理？



## Vue 组件间通信

**（1）props / $emit 适用 父子组件通信**

这种方法是 Vue 组件的基础，相信大部分同学耳闻能详，所以此处就不举例展开介绍。

**（2）ref 与 children 适用 父子组件通信**

- ref：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例
- children：访问父 / 子实例

**（3）EventBus （on） 适用于 父子、隔代、兄弟组件通信**

这种方法通过一个空的 Vue 实例作为中央事件总线（事件中心），用它来触发事件和监听事件，从而实现任何组件间的通信，包括父子、隔代、兄弟组件。



## Vuex 

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。

每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )。

（1）Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

（2）改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化。

主要包括以下几个模块：

- State：定义了应用状态的数据结构，可以在这里设置默认的初始状态。
- Getter：允许组件从 Store 中获取数据，mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性。
- Mutation：是唯一更改 store 中状态的方法，且必须是同步函数。
- Action：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作。
- Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。

Count.vue组件:

``` vue
<div >
    <h1>当前求和为:{{$store.state.count}}</h1>
    <select v-model.number="n">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <button @click="add">+</button>
    <button @click="reduce">-</button>
    <button @click="addOdd">当前求和为奇数再加</button>
    <button @click="addWait">等一等再加</button>
</div>
<script>
export default {
    data(){
      return{
       n:1,//选择框中选择的数字
      }
    },
    methods:{
      add(){
        this.$store.commit('Add',this.n)
      },
      reduce(){
        this.$store.commit('Reduce',this.n)
      },
      addOdd(){
        this.$store.dispatch('addOdd',this.n)
      },
      addWait(){
           this.$store.dispatch('addWait',this.n)
      }
    }
}
</script>
```

store中index.js

``` js
//该文件用于创建Vuex中最核心的store
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
Vue.use(Vuex)
//准备actions--用于响应组件中的动作
const actions = {//action中可以进行异步操作,例如从请求服务器接口
    addOdd(context,value){
        if(context.state.count % 2){
           context.commit('AddOdd',value) 
        }
    },
    addWait(context,value){
        setTimeout(()=>{
            context.commit('AddWait',value) 
        },1000)
    },
}
//准备mutations--用于操作数据(state)
const mutations = {
    Add(state,value){
        state.count += value
    },
    Reduce(state,value){
        state.count -= value
    },
    AddOdd(state,value){
        state.count += value
    },
    AddWait(state,value){
        state.count += value
    }
}
//准备state--用于存储数据
const state = {
    count:1  
}

//创建并暴露store
export default new Vuex.Store({
    actions,
    mutations,
    state
})
```



## **使用过 Vue SSR 吗？说说 SSR？**

> Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

> 即：**SSR大致的意思就是vue在客户端将标签渲染成的整个 html 片段的工作在服务端完成，服务端形成的html 片段直接返回给客户端这个过程就叫做服务端渲染。**

服务端渲染 SSR 的优缺点如下：

### （1）服务端渲染的优点：

- 更好的 SEO：因为 SPA 页面的内容是通过 Ajax 获取，而搜索引擎爬取工具并不会等待 Ajax 异步完成后再抓取页面内容，所以在 SPA 中是抓取不到页面通过 Ajax 获取到的内容；而 SSR 是直接由服务端返回已经渲染好的页面（数据已经包含在页面中），所以搜索引擎爬取工具可以抓取渲染好的页面；
- 更快的内容到达时间（首屏加载更快）：SPA 会等待所有 Vue 编译后的 js 文件都下载完成后，才开始进行页面的渲染，文件下载等需要一定的时间等，所以首屏渲染需要一定的时间；SSR 直接由服务端渲染好页面直接返回显示，无需等待下载 js 文件及再去渲染等，所以 SSR 有更快的内容到达时间；

### （2) 服务端渲染的缺点：

- 更多的开发条件限制：例如服务端渲染只支持 beforCreate 和 created 两个钩子函数，这会导致一些外部扩展库需要特殊处理，才能在服务端渲染应用程序中运行；并且与可以部署在任何静态文件服务器上的完全静态单页面应用程序 SPA 不同，服务端渲染应用程序，需要处于 Node.js server 运行环境；
- 更多的服务器负载：在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 ( high traffic ) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。



## vue-router 路由模式有几种？

vue-router 有 3 种路由模式：hash、history、abstract

- hash: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器；
- history : 依赖 HTML5 History API 和服务器配置。具体可以查看 HTML5 History 模式；
- abstract : 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式.



## hash 和 history 路由模式实现原理

**（1）hash 模式的实现原理**

早期的前端路由的实现就是基于 location.hash 来实现的。其实现原理很简单，location.hash 的值就是 URL 中 # 后面的内容。比如下面这个网站，它的 location.hash 的值为 '#search'：

``` js
https://www.word.com#search
```

hash 路由模式的实现主要是基于下面几个特性：

- URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送；
- hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制hash 的切换；
- 可以通过 a 标签，并设置 href 属性，当用户点击这个标签后，URL 的 hash 值会发生改变；或者使用 JavaScript 来对 loaction.hash 进行赋值，改变 URL 的 hash 值；
- 我们可以使用 hashchange 事件来监听 hash 值的变化，从而对页面进行跳转（渲染）。

**（2）history 模式的实现原理**

HTML5 提供了 History API 来实现 URL 的变化。其中做最主要的 API 有以下两个：history.pushState() 和 history.repalceState()。这两个 API 可以在不进行刷新的情况下，操作浏览器的历史纪录。唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录，如下所示：

``` js
window.history.pushState(null, null, path);
```

history 路由模式的实现主要基于存在下面几个特性：

- pushState 和 repalceState 两个 API 来操作实现 URL 的变化 ；
- 我们可以使用 popstate 事件来监听 url 的变化，从而对页面进行跳转（渲染）；
- history.pushState() 或 history.replaceState() 不会触发 popstate 事件，这时我们需要手动触发页面跳转（渲染）。



## 什么是 MVVM


## Vue 是如何实现数据双向绑定的

**Vue 主要通过以下 4 个步骤来实现数据双向绑定的：**

实现一个监听器 Observer：对数据对象进行遍历，包括子属性对象的属性，利用 Object.defineProperty() 对属性都加上 setter 和 getter。这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化。

实现一个解析器 Compile：解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新。

实现一个订阅者 Watcher：Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁 ，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。

实现一个订阅器 Dep：订阅器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理。



## Vue 框架怎么实现对象和数组的监听


## Proxy 与 Object.defineProperty 优劣对比

Proxy 的优势如下:

- Proxy 可以直接监听对象而非属性；
- Proxy 可以直接监听数组的变化；
- Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
- Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
- Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

Object.defineProperty 的优势如下:

- 兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平，因此 Vue 的作者才声明需要等到下个大版本( 3.0 )才能用 Proxy 重写。



## **Vue 怎么用 vm.$set() 解决对象新增属性不能响应的问题 ？**

受现代 JavaScript 的限制 ，Vue 无法检测到对象属性的添加或删除。由于 Vue 会在初始化实例时对属性执行 getter/setter 转化，所以属性必须在 data 对象上存在才能让 Vue 将它转换为响应式的。

但是 Vue 提供了 Vue.set (object, propertyName, value) / vm.$set (object, propertyName, value) 来实现为对象添加响应式属性，那框架本身是如何实现的呢？

我们查看对应的 Vue 源码：vue/src/core/instance/index.js

``` js
export function set (target: Array<any> | Object, key: any, val: any): any {
```

我们阅读以上源码可知，vm.$set 的实现原理是：

- **如果目标是数组，直接使用数组的 splice 方法触发相应式；**
- **如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 defineReactive 方法进行响应式处理（ defineReactive 方法就是 Vue 在初始化对象时，给对象属性采用 Object.defineProperty 动态添加 getter 和 setter 的功能所调用的方法）**



## **虚拟 DOM 的优缺点？**

优点：

- 保证性能下限： 框架的虚拟 DOM 需要适配任何上层 API 可能产生的操作，它的一些 DOM 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的 DOM 操作性能要好很多，因此框架的虚拟 DOM 至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，即保证性能的下限；
- 无需手动操作 DOM： 我们不再需要手动去操作 DOM，只需要写好 View-Model 的代码逻辑，框架会根据虚拟 DOM 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率；
- 跨平台： 虚拟 DOM 本质上是 JavaScript 对象,而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行更方便地跨平台操作，例如服务器渲染、weex 开发等等。

缺点:

- 无法进行极致优化： 虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化。



## **虚拟 DOM 实现原理？**

虚拟 DOM 的实现原理主要包括以下 3 部分：

- 用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象；
- diff 算法 — 比较两棵虚拟 DOM 树的差异；
- pach 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树



## **Vue 中的 key 有什么作用？**

**key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速**。

Vue 的 diff 过程可以概括为：oldCh 和 newCh 各有两个头尾的变量 oldStartIndex、oldEndIndex 和 newStartIndex、newEndIndex，它们会新节点和旧节点会进行两两对比，即一共有4种比较方式：newStartIndex 和oldStartIndex 、newEndIndex 和 oldEndIndex 、newStartIndex 和 oldEndIndex 、newEndIndex 和 oldStartIndex，如果以上 4 种比较都没匹配，如果设置了key，就会用 key 再进行比较，在比较的过程中，遍历会往中间靠，一旦 StartIdx > EndIdx 表明 oldCh 和 newCh 至少有一个已经遍历完了，就会结束比较。

所以 Vue 中 key 的作用是：key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速

更准确：因为带 key 就不是就地复用了，在 sameNode 函数 a.key === b.key 对比中可以避免就地复用的情况。所以会更加准确。

更快速：利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快



## **Vue 项目进行哪些优化？**

（1）代码层面的优化

- v-if 和 v-show 区分使用场景
- computed 和 watch 区分使用场景
- v-for 遍历必须为 item 添加 key，且避免同时使用 v-if
- 长列表性能优化
- 事件的销毁
- 图片资源懒加载
- 路由懒加载
- 第三方插件的按需引入
- 优化无限列表性能
- 服务端渲染 SSR or 预渲染

（2）Webpack 层面的优化

- Webpack 对图片进行压缩
- 减少 ES6 转为 ES5 的冗余代码
- 提取公共代码
- 模板预编译
- 提取组件的 CSS
- 优化 SourceMap
- 构建结果输出分析
- Vue 项目的编译优化

（3）基础的 Web 技术的优化

- 开启 gzip 压缩
- 减少请求数：合并资源(精灵图)，减少http请求数。
- 浏览器缓存，http请求协议缓存，离线缓存，离线数据缓存(localStorage)。
- 加快请求速度：预解析DNS，减少域名数，CDN分支。
- CDN 的使用
- 使用 Chrome Performance 查找性能瓶颈
- 渲染：js/css优化，服务器渲染，加快顺序。





# 计算机网络

## ios七层模型

| **物理层** | **数据链路层** | **网络层** | **传输层** | **会话层** | **表示层** | **应用层**      |
| ---------- | -------------- | ---------- | ---------- | ---------- | ---------- | --------------- |
| 比特       | 帧             | IP         | TCP/UDP    |            |            | http/web Socket |



## TCP 和 UDP 的区别

| **TCP**                             | **UDP**                                              |
| ----------------------------------- | ---------------------------------------------------- |
| 面向连接                            | 面向无连接                                           |
| 提供可靠的服务                      | 提供不可靠的服务                                     |
| 面向字节流                          | 面向报文(没有阻塞控制 应用场景：IP电话 实时视频会议) |
| 首部开销20字节                      | 首部开销8字节                                        |
| 点对点                              | 一对多 多对多                                        |
| TCP的逻辑信道信号是全双工的可靠通信 | UDP则是不可靠的信道                                  |



## HTTP 2.0 新增

二进制协议，多路复用(共享连接)，数据流，信息头压缩，客户端推送



## HTTP状态码

200 请求成功

301 永久重定向

302 临时重定向

304 not Modified 未修改

400 客户端错误

401 当前身份验证

403 服务器已经得到请求，但是拒绝执行

404 not found

500 客户端在执行时发生错误，无法完成请求。



## localStorage和Cookie

localStorage和Cookie都可以在同源窗口中访问

localStorage存储大小为5M，Cookie的存储大小为4k

localStorage只要存放到本地只要不删除就一直存在，Cookie有过期时间expries



## Cookie 可能存在的问题，简单介绍 XSS 和 CSRF。

### **XSS：**

指的是跨站脚本攻击，是一种代码注入攻击。攻击者通过网站中注入恶意脚本，使之在浏览器上运行，从而盗取用户的信息入Cookie等。

xss的本质是因为恶意网站没有进行过滤，与正常的代码混合在一起了，浏览器没办法辨别哪些脚本是可信的，从而导致恶意代码的执行。

存储型：指的是恶意代码提交到数据库中，当用户请求数据的时，服务器就将其拼接为HTML后返回给用户，从而导致代码的执行。

反射型：指的是攻击者先将含有攻击的代码发送给目标用户，用户打开后，会访问链接对应的服务器，服务器收到链接请求时，会将带有的XSS代码的数据再次发送给用户，此时用户浏览器就会默认执行带有XSS代码的脚本，此时会触发XSS漏洞。

DOM型：指的是xss代码并不需要服务器的参与，触发xss靠的是浏览器的DOM解析，完全是客户端的事情

防范XSS：设置set-cookie httponly禁止脚本执行cookie。也可以设置只有在https协议下可以发送cookie。



### **CSRF：**

指的是跨站请求伪造攻击，攻击者诱惑用户进入一个第三方网站，然后该网站向攻击网站发送跨站请求。如果用户在被攻击网站保留了登录状态，那么攻击者就可以利用这个登录状态，绕过后台的用户验证，冒充用户向服务器执行一些操作。

CSRF攻击的本质是利用了cookie会在同源请求中携带发送给服务器的特点，以此来实现用户的冒充。

一般的CSRF攻击类型由三种：

1.GET类型的CRSF攻击，比如一个网站中的一个img标签里面构建一个请求，当用户打开这个页面时就会自动发送提交。

2.POST类型的CRSF攻击，比如说创建一个表单，然后隐藏它，自动提交这个表单。

3.链接类型的CSRF攻击，比如说创建一个表单，然后隐藏它，自动提交这个表单。

使用双重Cookie验证的方式，服务器在用户访问页面时，向请求域名注入一个Cookie，内容为随机字符串，然后当用户向服务器发送请求的时候，cookie取出这个字符串，添加到URL参数中，然后服务器通过对cookie中的数据进行比较，来进行验证。







# 其他问题

### 一、JavaScript

\1. 原始值和引用值类型及区别
\2. 判断数据类型typeof、instanceof、Object.prototype.toString.call()、constructor
\3. 类数组与数组的区别与转换
\4. 数组的常见API
\5. bind、call、apply的区别
\6. new的原理
\7. 如何正确判断this？
\8. 闭包及其作用
\9. 原型和原型链
\10. prototype与__proto__的关系与区别
\11. 继承的实现方式及比较
\12. 深拷贝与浅拷贝
\13. 防抖和节流
\14. 作用域和作用域链、执行期上下文
\15. DOM常见的操作方式
\16. Array.sort()方法与实现机制
\17. Ajax的请求过程
\18. JS的垃圾回收机制
\19. JS中的String、Array和Math方法
\20. addEventListener和onClick()的区别
\21. new和Object.create的区别
\22. DOM的location对象
\23. 浏览器从输入URL到页面渲染的整个流程（涉及到计算机网络数据传输过程、浏览器解析渲染过程）
\24. 跨域、同源策略及跨域实现方式和原理
\25. 浏览器的回流（Reflow）和重绘（Repaints）
\26. JavaScript中的arguments
\27. EventLoop事件循环
\28. 宏任务与微任务
\29. BOM属性对象方法
\30. 函数柯里化及其通用封装

\31. JS的map()和reduce()方法
\32. “==”和“===”的区别
\33. setTimeout用作倒计时为何会产生误差？

### 二、ES6

\1. let、const和var的概念与区别
\2. 变量提升与暂时性死区
\3. 变量的结构赋值
\4. 箭头函数及其this问题
\5. Symbol概念及其作用
\6. Set和Map数据结构
\7. Proxy
\8. Reflect对象
\9. Promise（手撕Promise A+规范、Promise.all、Promise相关API和方法）
\10. Iterator和for...of（Iterator遍历器的实现）
\11. 循环语法比较及使用场景（for、forEach、for...in、for...of）
\12. Generator及其异步方面的应用
\13. async函数
\14. 几种异步方式的比较（回调、setTimeout、Promise、Generator、async）
\15. class基本语法及继承
\16. 模块加载方案比较（CommonJS和ES6的Module）
\17. ES6模块加载与CommonJS加载的原理

### 三、HTML/CSS

\1. CSS权重及其引入方式
\2. `<a></a>`标签全部作用
\3. 用CSS画三角形
\4. 未知宽高元素水平垂直居中（方案及比较）
\5. 元素种类的划分
\6. 盒子模型及其理解
\7. 定位方式及其区别（文档流）
\8. margin塌陷及合并问题
\9. 浮动模型及清除浮动的方法
\10. CSS定位属性
\11. display及相关属性
\12. IFC与BFC
\13. 圣杯布局和双飞翼布局的实现
\14. Flex布局
\15. px、em、rem的区别
\16. Less预处理语言
\17. 媒体查询
\18. vh与vw
\19. H5的语义化作用及语义化标签
\20. Web Worker和Web Socket
\21. CSS3及相关动画
\22. 如何实现响应式布局
\23. SEO的概念及实现
\24. HTML5的新特性
\25. Less和Sass使用

### 四、HTTP与计算机网络

\1. TCP/IP协议分层管理
\2. 三次握手四次挥手机制及原因
\3. HTTP方法
\4. GET和POST的区别
\5. HTTP建立持久连接的意义
\6. HTTP报文的结构
\7. HTTP状态码
\8. Web服务器及其组成
\9. HTTP报文首部
\10. HTTP通用首部字段
\11. HTTP请求首部字段、响应首部字段、实体首部字段
\12. Cookie相关首部字段
\13. HTTPS与HTTP区别及实现方式
\14. Cookie与Session
\15. 基于HTTP的功能追加协议（SPY、WebSocket、HTTP）
\16. 常见的Web攻击分类
\17. TCP与UDP区别
\18. 存储机制localStorage、sessionStorage与Cookie存储技术
\19. XSS攻击及防御
\20. CSRF攻击及防御

### 五、前端工程化

\1. 前端工程化的流程（架构选型、业务开发、测试、打包构建、部署上线、项目监控）
\2. Webpack基本概念与配置
\3. loader与plugin原理与实现
\4. Webpack的模块热替换及实现
\5. Webpack的优化问题
\6. SPA及其优缺点
\7. SSR实现及优缺点
\8. 设计模式（工厂模式、单例模式、原型模式、***模式、适配器模式、观察者模式等...）

### 六、React

\1. React自身特点及选型时考虑
\2. React与VUE的异同
\3. Virtual DOM
\4. React生命周期
\5. Diff算法
\6. 受控组件与非受控组件
\7. 高阶组件
\8. Flux架构模式（涉及MVC/MVVM、Flux）
\9. Redux设计概念、设计原则、方法、redux实现异步流的库
\10. 纯组件（Pure Component）与shouldComponentUpdate关系
\11. Redux中的`<Provider/>`组件与connect函数
\12. React Fiber架构
\13. React Hooks的作用及原理

### 七、NodeJS

\1. NodeJS基本概念与特点
\2. CommonJS规范、核心模块
\3. Node的异步I/O
\4. Node的内存控制
\5. Node构建网络服务（TCP、HTTP、Web Socket服务等）
\6. Node的进程

### 八、需要会手撕的代码部分

\1. Promise（A+规范）、then、all方法
\2. Iterator遍历器实现
\3. Thunk函数实现（结合Generator实现异步）
\4. async实现原理（spawn函数）
\5. class的继承
\6. 防抖和节流
\7. Ajax原生实现
\8. 深拷贝的几种方法与比较
\9. 继承的几种实现与比较
\10. 未知宽高的元素水平垂直居中
\11. 三栏布局的实现
\12. 两栏布局的实现
\13. React高阶组件
\14. 数组去重
\15. 几种排序算法的实现及其复杂度比较
\16. 前序后序遍历二叉树（非递归）
\17. 二叉树深度遍历（分析时间复杂度）
\18. 跨域的实现（JSONP、CORS）

### 九、数据可视化

\1. Canvas和SVG的区别
\2. 在考虑设计可视化图表时，结合Canvas和SVG特性会怎么取舍
\3. 常见的可视化组件库
\4. 可视化组件库如Echarts的设计思路
\5. 一些偏向底层的可视化组件库和前端框架结合方面需要考虑哪些问题
\6. 可视化组件如何做到数据驱动？

### 十、计算机基础

\1. 计算机系统
\2. 线程与进程
\3. 常见的git指令
\4. Linux相关指令
\5. 其他类型的编程语言（如Java）
\6. 数据库