# 字体

::: tip 摘自
[Web 字体 font-family 浅谈](https://juejin.cn/post/6899271427980001294)

[Web 安全字体和网络字体 (Web Fonts)](https://juejin.cn/post/7223962299308130365)
:::

# 引入

在项目中使用特定字体:

### 1、网络引入

- 优点是节省项目空间
- 缺点是字体加载需要更多时间，页面字体会不断由默认字体，转成指定字体

``` css
@import url('https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.6.0/style.min.css');

:root {
	--vp-font-family-base: 'myFont', system-ui;
	--vp-font-family-mono: 'myFont',  system-ui;
}
```


### 2、本地引入

将 `ttf格式的字体` 放进项目文件中，再全局引入
``` css
@font-face {
	font-family: 'myFont';
	src: url('./LXGWWenKaiGBScreenR.ttf');
}

:root {
	--vp-font-family-base: 'myFont', system-ui;
	--vp-font-family-mono: 'myFont',  system-ui;
}
```


## 字体优先级

1. 元素指定 `font-family`
2. 全局(body)的（或上级元素）`font-family`
3. 浏览器默认字体。【设置的font-family无效时（或这个字不存在），会fallback到浏览器默认字体。】
4. 系统默认字体（windows/MacOS/linux/android）


## `system-ui`

`system-ui`是一种通用字体系列，它选择当前操作系统下的默认系统字体

它的优势在于和当前系统使用的字体相匹配，可以让Web页面和App风格看起来更统一。

::: tip 使用方式
``` css
font-family: system-ui;
```
:::

### `-apple-system`
`-apple-system`是`system-ui`的兼容写法，只在ios和macOS上的safari、Firefox、webview等环境下支持。

### `BlinkMacSystemFont`
也是system-ui的兼容写法，只在macOS chrome下支持，主要针对chrome 53-55版本

### 效果
在ios和macOS上，`system-ui`指向的中文字体为`苹方`，西文字体为`San Francisco`。

android系统下中文通常为`Noto Sans` (思源黑体)，西文字体为`Roboto`。

windows系统上一般为`微软雅黑`，但是在部分windows系统上的字体会出现问题，所以windows上不建议使用system-ui。


## 书写字体规则

1、不同平台，预置的字体并不相同。比如Helvetica和苹方也只有苹果系统内置，微软雅黑只有windows系统内置(由于很多人安装Office的缘故，Mac电脑中也会出现微软雅黑字体)，android 和 iOS 系统内置的字体各不相同。

2、字体是有版权的，但是如果没有引用外部字体文件（如 Web font 或者内嵌到 App 中），而仅仅是在 CSS 中指定字体名称，不需要购买授权，因为其只是一段声明，表示期望浏览器优先使用某种字体渲染文本。

3、中文网站涉及两种文字类型：西文字体和中文字体，西文字体包括英文数字等，不包括中文，但是中文字体一般包括英文和数字，我们一般先设置西文字体，后设置中文。

4、如果字体包含空格或者是中文，需要添加引号。

5、大部分字体全名中会包含字体粗细、斜体（italic）、长体（condensed）等具体属性，但一般不建议直接使用，字体的风格应该在 CSS 中通过 font-weight、font-style、font-stretch等属性指定，由浏览器决定实际渲染的字体。

6、font-family属于可继承属性，全局的font-family一般设置在body元素上。



## 规则总结

### 1、西文在前，中文在后
中文字体大多都包含西文，但西文的部分又不好看，而西文不包含中文，通常先定义西文，后定义中文以达到更优的显示效果。

### 2、优先使用`system-ui`

`system-ui`使用当前系统的默认字体，让web页面和操作系统的风格统一，体验更好。

### 3、兼顾不同的操作系统

选择字体的时候要考虑不同的操作系统，还需要考虑旧版本操作系统的用户。

即便是同一个字体在不同的操作下也会有细微的差别，我们要尽量做到相同系统使用同一种字体，保证同一个系统下的字体一致性。对于不同系统尽量保证字体风格接近，比如都使用无衬线字体。

为了保证苹果系统中使用更优雅的中文字体，优先声明`苹方`字体, 对于不支持`苹方`的低版本macOS，使用`Hiragino Sans GB`(冬青黑体)字体做兜底。

如果需要兼容Linux系统，还需要添加`WenQuanYi Micro Hei`(文泉驿微米黑)字体。

如果需要兼容不同平台的表情符号，一般在sans-serif后添加`Apple Color Emoji`, `Segoe UI Emoji`, `Segoe UI Symbol`, `Noto Color Emoji`等字体。

### 4、以`serif`或`sans-serif`字体族结尾

为了保证在各种不同环境或条件下显示正常，我们一般将`sans-serif`放在字体的后面，非衬线字体在显示器中的显示效果更好。

### 5、简洁实用

字体设置并不是越多越好，在能满足设计需求的情况下尽量简洁。相同系统下中西文字体各有一个fallback即可，不需要太多。



## 推荐写法

### 移动端
兼容版本：ios9+、android4+
推荐写法：
```css
font-family: system-ui, -apple-system, Arial, sans-serif;
```
解读：优先使用system-ui，使用Arial做西文字体的fallback是因为它和Helvetica字体相似，并且在ios和android支持性很好。


### PC端

#### 推荐写法1：
`macOS`系统优先使用系统字体
```css
font-family: -apple-system, BlinkMacSystemFont, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
```

#### 推荐写法2：

指定字体
```css
font-family: Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
```

windows系统电脑屏幕分辨率普遍不高，`Tahoma`字体在小字号下结构清晰端整、阅读辨识容易，在不同操作系统支持性好，所以作为首选字体，如果系统没有预装`Tahoma`，则使用`Arial`作为替代。但两者差别不大，`Arial`优先级提前也行。

需要兼容Linux系统和表情符号，可以添加`WenQuanYi Micro Hei`和`Emoji`字体，如：
```css
font-family: -apple-system, BlinkMacSystemFont, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
```
如想突出macOS和windows的字体特色，可以在`Tahoma`前面设置`Helvetica`或`Segoe UI`为首选字体，如：
```css
font-family: "Helvetica Neue", "Segoe UI", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
```

::: tip 注意：

- 1、字体的设置没有固定标准，需要根据业务情况进行定夺，以上只是推荐写法，如果设计师有要求可以在此基础上进行改动。

- 2、css的`font-family`权重是高于浏览器默认字体的，有一些网站选择不设置`font-family`，使用浏览器的默认字体，倾向于用户的选择，这就是仁者见仁了。

- 3、当给某个元素设置了`font-faimily`后，全局默认字体则对这个元素无效，这时也要考虑字体兼容问题，最好指定一个fallback字体，并以`sans-serif`结尾。
```css
div {
    font-faimiy: "PingFang SC", sans-serif;
}
```
:::


## 网络安全字体、网络字体

### 网络安全字体
网络安全字体是由许多操作系统预先安装的字体。

虽然不是所有的系统都安装了相同的字体，但你可以使用网络安全字体堆栈来选择几种看起来类似的字体，并且安装在你想支持的各种系统上。

### 没有网络安全中文字体

相比通常只有几十 KB 的英文字体，网页加载一个 GB2312 的中文字体至少要增加 2 MB 以上加载量，而大部分中文字体都在 5 MB 以上。

所以网络字体在国内没有流行起来，还是要像英文网页好多年前一样，用网页安全字体。

下表可以看到各系统预置的中文字体——各系统根本没有相同的字体，即没有网页安全中文字体！

| 系统 | 预置中文字体| 
| :--- | :--: |  
| Mac OS X | 华康苹方 Pingfang（10.11 开始） 冬青黑体: Hiragino Sans GB （10.6 开始） 华文细黑：STHeiti Light （又名STXihei） 华文黑体：STHeiti 华文楷体：STKaiti 华文宋体：STSong 华文仿宋：STFangsong| 
| Windows| 微软雅黑: Microsoft YaHei（Windows 7开始） 黑体: SimHei 宋体: SimSun 新宋体: NSimSun 仿宋: FangSong 楷体: KaiTi 仿宋GB2312: FangSong_GB2312 楷体GB2312: KaiTi_GB2312| 
| Android| Droid Sans Fallback| 
| iOS| 苹方（iOS 9开始） 黑体：Heiti SC (iOS 8) 华文黑体：STHeiti（iOS 7.0 及以下）| 


### 网络字体

与网络安全字体不同，网络字体没有预先安装在用户的系统中。

这些字体是由用户的浏览器在渲染网页时下载的，然后应用于你的文本。

使用网络字体的主要缺点是它会减慢你网站的加载时间。

在旧的浏览器中，对CSS3的支持也很有限，而使用网络字体是需要CSS3的。

后面的限制可以通过使用字体堆栈来弥补，类似于网络安全字体堆栈，但包括一个网络字体作为堆栈的第一个字体。

如果浏览器无法使用网络字体，它就会退回到堆栈中的网络安全字体。
