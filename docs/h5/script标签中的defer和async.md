# script标签中的的defer和async

`script`标签用于加载脚本与执行脚本，在前端开发中可以说是非常重要的标签了。
直接使用`script`脚本的话，`html`会按照顺序来加载并执行脚本，在脚本加载&执行的过程中，会阻塞后续的`DOM`渲染。

如果script发生延迟，就会阻碍后续的渲染，使得页面白屏。

参考：[浅谈script标签中的async和defer - 贾顺名 - 博客园](https://www.cnblogs.com/jiasm/p/7683930.html)

好在`script`提供了两种方式来解决上述问题，`async`和`defer`，这两个属性使得`script`都不会阻塞`DOM`的渲染。
但既然会存在两个属性，那么就说明，这两个属性之间肯定是有差异的。

### 普通script

文档解析的过程中，如果遇到`script`脚本，就会停止页面的解析进行下载（但是Chrome会做一个优化，如果遇到`script`脚本，会快速的查看后边有没有需要下载其他资源的，如果有的话，会先下载那些资源，然后再进行下载`script`所对应的资源，这样能够节省一部分下载的时间 `@Update: 2018-08-17`）。
资源的下载是在解析过程中进行的，虽说`script1`脚本会很快的加载完毕，但是他前边的`script2`并没有加载&执行，所以他只能处于一个挂起的状态，等待`script2`执行完毕后再执行。
当这两个脚本都执行完毕后，才会继续解析页面。
![image](https://user-images.githubusercontent.com/9568094/31621391-39849b1a-b25f-11e7-9301-641b1bc07155.png)

### defer

文档解析时，遇到设置了`defer`的脚本，就会在后台进行下载，但是并不会阻止文档的渲染，当页面解析&渲染完毕后。
会等到所有的`defer`脚本加载完毕并按照顺序执行，执行完毕后会触发`DOMContentLoaded`事件。
![image](https://user-images.githubusercontent.com/9568094/31621324-046d4a44-b25f-11e7-9d15-fe4d6a5726ae.png)

### async

`async`脚本会在加载完毕后执行。
`async`脚本的加载不计入`DOMContentLoaded`事件统计，也就是说下图两种情况都是有可能发生的

![image](https://user-images.githubusercontent.com/9568094/31621170-b4cc0ef8-b25e-11e7-9980-99feeb9f5042.png)
![image](https://user-images.githubusercontent.com/9568094/31622216-6c37db9c-b261-11e7-8bd3-79e5d4ddd4d0.png)



## 推荐的应用场景

### defer

如果你的脚本代码依赖于页面中的`DOM`元素（文档是否解析完毕），或者被其他脚本文件依赖。
**例：**

1. 评论框
2. 代码语法高亮
3. `polyfill.js`

### async

如果你的脚本并不关心页面中的`DOM`元素（文档是否解析完毕），并且也不会产生其他脚本需要的数据。
**例：**

1. 百度统计

如果不太能确定的话，用`defer`总是会比`async`稳定。。。