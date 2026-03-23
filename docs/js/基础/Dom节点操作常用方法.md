## Dom节点操作常用方法

### 1.访问/获取节点

```js
// 注意拼写:Element
// 第一个对象
document.getElementById(id); //返回对拥有指定id的第一个对象进行访问

// 注意拼写:Elements
// 对象集合 
document.getElementsByName(name); //返回带有指定名称的节点集合　　 
document.getElementsByTagName(tagname); 　　//返回带有指定标签名的对象集合 
document.getElementsByClassName(classname);  //返回带有指定class名称的对象集合
```



### 2.创建节点/属性

```js
document.createElement(eName); //创建一个节点
document.createAttribute(attrName); //对某个节点创建属性
document.createTextNode(text); //创建文本节点
```



### 3.添加节点

```js
parentNode.appendChild(newNode); //给某个节点添加子节点
document.insertBefore(newNode,referenceNode); //在某个节点前插入节点
```



### 4.复制节点

```js
cloneNode(true | false); //复制某个节点  参数：是否复制原节点的所有属性
```



### 5.删除节点

```js
parentNode.removeChild(node);
```

