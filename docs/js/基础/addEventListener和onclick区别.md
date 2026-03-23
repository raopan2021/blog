# addEventListener和onclick区别

### 普通事件（onclick）

普通事件就是直接触发事件，同一时间只能指向唯一对象，所以会被覆盖掉。

```js
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

```js
var btn = document.getElementById("btn");q
btn.addEventListener("click",function(){
  alert("你好111");
},false);
btn.addEventListener("click",function(){
  alert("你好222");
},false);
// 运行结果会依次弹出你好111，你好222的弹出框。
```

```js
// onclick属性不适用以下元素：<base>、<bdo>、<br>、<head>、<html>、<iframe>、<meta>、<param>、<script>、<style> 或 <title>。
```

