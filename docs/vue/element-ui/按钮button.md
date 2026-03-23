# 按钮button

### button点击不自动失焦

> button点下去之后会一直保持被点击的状态直到鼠标在别的地方点一下才恢复。也就是说button被点击之后一直没有失焦，直到点击别的地方，将焦点切换走。

给button加一个唯一ID，然后@click的回调函数里，加上下面的失焦代码即可。

```html
<el-button id="clearButton" @click="clearAlarm">清除报警</el-button>
```

```js
clearAlarm(){
	document.getElementById("clearButton").blur(); // 强制给button失焦
}
```

