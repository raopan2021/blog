# BFC规范理解

## 什么是BFC？ 　　

BFC全称：块级格式化上下文（block formatting context）

简单来说它就是一种属性，这种属性会影响元素与元素之间的位置、间距 

具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性。

## BFC 特性及应用

## 同一个 BFC 下外边距会发生折叠

``` html
<head>
    <body>
        <div></div>
        <div></div>
    </body>
</head>
<style>
    div{
        width: 100px;
        height: 100px;
        margin: 100px;
        background: lightblue;
    }
</style>
```

![img](https://pic4.zhimg.com/80/v2-0a9ca8952c83141250a2d9002e6d2047_720w.webp)

从效果上看，因为两个 div 元素都处于同一个 BFC 容器下 (这里指 body 元素) 

所以第一个 div 的下边距和第二个 div 的上边距发生了重叠，所以两个盒子之间距离只有 100px，而不是 200px

首先这不是 CSS 的 bug，我们可以理解为一种规范，如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中。

``` vue
<div class="container">
    <p></p>
</div>
<div class="container">
    <p></p>
</div>

<style>
.container {
    overflow: hidden;
}
p {
    width: 100px;
    height: 100px;
    margin: 100px;
    background: lightblue;
}
</style>
```

这时候，两个盒子边距就变成了 200px

![img](https://pic2.zhimg.com/80/v2-5b8d6e8b2b507352900c1ece00018855_720w.webp)

## BFC 可以包含浮动的元素（清除浮动）

我们都知道，浮动的元素会脱离普通文档流，来看下下面一个例子

```html
<div style="border: 1px solid #000;">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

![img](https://pic4.zhimg.com/80/v2-371eb702274af831df909b2c55d6a14b_720w.webp)

由于容器内元素浮动，脱离了文档流，所以容器只剩下 2px 的边距高度。如果使触发容器的 BFC，那么容器将会包裹着浮动元素。

```html
<div style="border: 1px solid #000;overflow: hidden">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

![img](https://pic4.zhimg.com/80/v2-cc8365db5c9cc5ca003ce9afe88592e7_720w.webp)



## BFC 可以阻止元素被浮动元素覆盖

先来看一个文字环绕效果：

```html
<div style="height: 100px;width: 100px;float: left;background: lightblue">
    我是一个左浮动的元素
</div>
<div style="width: 200px; height: 200px;background: #eee">
    我是一个没有设置浮动, 也没有触发 BFC 元素, width: 200px; height:200px; background: #eee;
</div>
```

![img](https://pic4.zhimg.com/80/v2-dd3e636d73682140bf4a781bcd6f576b_720w.webp)

这时候其实第二个元素有部分被浮动元素所覆盖，(但是文本信息不会被浮动元素所覆盖) 如果想避免元素被覆盖，可触第二个元素的 BFC 特性，在第二个元素中加入 overflow: hidden，就会变成：

![img](https://pic3.zhimg.com/80/v2-5ebd48f09fac875f0bd25823c76ba7fa_720w.webp)

这个方法可以用来实现两列自适应布局，效果不错

这时候左边的宽度固定，右边的内容自适应宽度(去掉上面右边内容的宽度)

## 形成BFC的条件 　　

1、float：给元素添加浮动（属性值为left、right，但none除外） 　　

2、position：给元素添加定位（属性值为absolute或fixed） 　　

3、display：给元素添加display属性（属性值为 inline-block、table-cell或table-caption） 　　

4、overflow：给元素添加overflow 属性（属性值为hidden、auto或scroll，但visible除外） 

5、html 根元素

## BFC形成后出现的常见问题 　　

1、margin重叠问题 　　

2、浮动相关问题
