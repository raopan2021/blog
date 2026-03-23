# label

label标签主要是方便鼠标点击使用，扩大可点击的范围，增强用户操作体验



## label标签和特定表单元素关联方式

label标签的关联方式主要有两种，**显示关联**和**隐式关联**：

### 方式1：显式关联

显式关联是通过label标签的**for**属性，显式与另一个表单控件关联。需要注意的是，for属性的值必须是与label标签在同一文档中的可标记表单元素的**id**，注意是id而不是name。如：

```html
爱好：
<input type='checkbox' name='basket' id='basketball'>   
<label for="basketball">篮球</label>
<input type='checkbox' name='football' id='football'>   
<label for="football">足球</label>12345
```

效果图：
![这里写图片描述](https://img-blog.csdn.net/20170603143008050?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZ25haWxfb3Vn/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

### 方式2：隐式关联

隐式关联是直接将表单控件放到label标签内，这种情况下，label标签只能包含一个表单元素，包含多个只对第一个有效。如下：

```html
<label>点击我可以使文本框获得焦点
    <input type='text' name='theinput' id='theinput'>
</label>123
```

效果图如下，点击文字便能是文本框获得焦点：
![这里写图片描述](https://img-blog.csdn.net/20170603150203863?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZ25haWxfb3Vn/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)