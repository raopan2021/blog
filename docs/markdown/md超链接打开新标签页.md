# md超链接打开新标签页

 <a href="https://www.xinac.com/article/439.html" target="_blank">Markdown如何指定新窗口打开链接</a>


```
[https://bing.xinac.net](https://bing.xinac.net)
```

在md文件中，像上面这样写，渲染为vue组件后，点击时不会打开新标签页！

### 1、直接写html代码 `<a>`

```html
 <a href="https://cn.bing.com/" target="_blank">Bing</a>
```

### 2、加{target="_blank"}

渲染为vue组件，不起作用，`{target="_blank"}`代码需要 `Markdown`解析器支持！

有的代码是 `{:target="_blank"}`，如果上边的代码不好用，可以试试这种格式

```
[Bing](https://cn.bing.com/){target="_blank"}
```
