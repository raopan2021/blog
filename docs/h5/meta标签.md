# meta标签

meta 元素被用于规定页面的描述、关键词、文档的作者、最后修改时间以及其他元数据。标签始终位于 head 元素中。

meta属性包括：必选属性content—进行描述说明的，相当于键值；可选属性http-equiv、name和scheme，http-equiv—添加http头部内容，name—浏览器解析

包括：

①charset 

定义使用的字符编码

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

