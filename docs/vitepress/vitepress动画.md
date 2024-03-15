# vitepress动画

::: details Layout.vue源码
<<< @/.vitepress/theme/Layout.vue
:::

## 源码分析
``` js
const enableTransitions = () => 
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
```
### startViewTransition

``` js
// 浏览器是否支持 View Transitions这个 api
console.log('startViewTransition' in document) // true
// 等同于
console.log(!!document.startViewTransition) // true
```

###  window.matchMedia

matchMedia() 返回一个新的 MediaQueryList 对象，表示指定的媒体查询字符串解析后的结果。

::: details 示例
``` js
// 判断屏幕（screen/viewport）窗口大小，在小于等于 700 像素时修改背景颜色为黄色，大于 700 像素时修改背景颜色为粉红色：
var x = window.matchMedia("(max-width: 700px)")
console.log(x)
// {
//     media: '(max-width: 700px)', 
//     matches: false,
//     onchange: null
// }

console.log(x.matches)
// false

if (x.matches) { // 媒体查询
    document.body.style.backgroundColor = "yellow";
} else {
    document.body.style.backgroundColor = "pink";
}
```
:::


### if (!enableTransitions())
如果浏览器关闭了特效，那就直接切换主题（无动画）
``` js
if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
}
```



### circle(0px at 1345px 33px)

::: details 示例
<style scoped lang="scss">
.box {
    display: inline-block;
    height: 100px;
    width: 100px;
    margin: 20px;
    background: pink;

    div {
        width: 50px;
        height: 50px;
        background: #369;
        clip-path: circle(50%);
    }
}

.box2>div {
    clip-path: circle(50% at right center);
}

.box3>div {
    clip-path: circle(50% at 30px 30px);
}
</style>
<div class="box">
    <div></div>
</div>
<div class="box box2">
    <div></div>
</div>
<div class="box box3">
    <div></div>
</div>
:::

::: details 示例代码
``` vue
<style scoped lang="scss">
.box {
    display: inline-block;
    height: 100px;
    width: 100px;
    margin: 20px;
    background: pink;

    div {
        width: 50px;
        height: 50px;
        background: #369;
        clip-path: circle(50%);
    }
}
.box2>div {
    clip-path: circle(50% at right center);
}
.box3>div {
    clip-path: circle(50% at 30px 30px);
}
</style>

<div class="box">
    <div></div>
</div>
<div class="box box2">
    <div></div>
</div>
<div class="box box3">
    <div></div>
</div>
```
:::


``` js
const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(
        ${Math.hypot(
            Math.max(x, innerWidth - x), 
            Math.max(y, innerHeight - y)
        )}px
        at ${x}px ${y}px)`
]
console.log(clipPath)
// [
//     "circle(0px at 1345px 33px)",
//     "circle(1508.4806926175754px at 1345px 33px)"
// ]
```



### Math.hypot() 

函数返回所有参数的平方和的平方根，即：

``` js
console.log(Math.hypot(3, 4));
// Expected output: 5
console.log(Math.hypot(5, 12));
// Expected output: 13
console.log(Math.hypot(3, 4, 5));
// Expected output: 7.0710678118654755
console.log(Math.hypot(-5));
// Expected output: 5
```



### ViewTransition.ready 实验性

一个在伪元素树创建且过渡动画即将开始时兑现的 Promise。



### document.documentElement.animate()

``` js
// 新视图的根元素动画
document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
        duration: 1000,
        easing: 'ease',
        // 指定要附加动画的伪元素
        pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
    },
)
```