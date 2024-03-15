# vue.nextTick()方法的使用详解

简单的理解是：当数据更新了，在dom中渲染后，自动执行该函数，

Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。

$nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM，



## 什么时候需要用Vue.nextTick()？

### created()钩子函数内的DOM操作

> Vue生命周期的created()钩子函数进行的DOM操作一定要放在Vue.nextTick()的回调函数中，原因是在created()钩子函数执行的时候DOM 其实并未进行任何渲染
>
> 此时进行DOM操作无异于徒劳，所以此处一定要将DOM操作的js代码放进Vue.nextTick()的回调函数中。
>
> 与之对应的就是mounted钩子函数，因为该钩子函数执行时所有的DOM挂载已完成。

```js
created(){
  let that=this;
  that.$nextTick(function(){  //不使用this.$nextTick()方法会报错
      that.$refs.aa.innerHTML="created中更改了按钮内容";  //写入到DOM元素
  });
},
```



### 更改数据后，使用js操作新的视图的时候需要使用它



```js
changeTxt:function(){
  let that=this;
  that.testMsg="修改后的文本值";  //修改dom结构
   
  that.$nextTick(function(){  //使用vue.$nextTick()方法可以dom数据更新后延迟执行
    let domTxt=document.getElementById('h').innerText; 
    console.log(domTxt);  //输出可以看到vue数据修改后并没有DOM没有立即更新，
    if(domTxt==="原始值"){
      console.log("文本data被修改后dom内容没立即更新");
    }else {
      console.log("文本data被修改后dom内容被马上更新了");
    }
  });
},
```



### 在使用某个第三方插件时 ，希望在vue生成的某些dom动态发生变化时重新应用该插件

也会用到该方法，这时候就需要在 $nextTick 的回调函数中执行重新应用插件的方法。





## Vue.nextTick(callback) 使用原理：

原因是，Vue是异步执行dom更新的，一旦观察到数据变化，Vue就会开启一个队列，然后把在同一个事件循环 (event loop) 当中观察到数据变化的 watcher 推送进这个队列。如果这个watcher被触发多次，只会被推送到队列一次。这种缓冲行为可以有效的去掉重复数据造成的不必要的计算和DOm操作。而在下一个事件循环时，Vue会清空队列，并进行必要的DOM更新。
当你设置 vm.someData = 'new value'，DOM 并不会马上更新，而是在异步队列被清除，也就是下一个事件循环开始时执行更新时才会进行必要的DOM更新。如果此时你想要根据更新的 DOM 状态去做某些事情，就会出现问题。。为了在数据变化之后等待 Vue 完成更新 DOM ，可以在数据变化之后立即使用 Vue.nextTick(callback) 。这样回调函数在 DOM 更新完成后就会调用。