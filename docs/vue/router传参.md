# 路由传值

在前端的路由里面，我们在切换路由的时候，也相当于切换了页面，页面与页面之前有时候需要做到传值 ，这个时候就需要进行路由传值，在VueRouter里面，两个路由之间做跳转的时候，如何进行传值呢？

VueRouter的路由传值有两种方式

## query传值

类似get传值

**传值的路由**

```javascript
this.$router.push({
    path: "/login?alarmDeviceID=" + this.alarmDeviceID
});
```

**传值路由第二种写法**

```javascript
let alarmDeviceID = item.DeviceID
this.$router.push({
  path: "/dataAnalysis/dataAnalysis",
  query: {
    alarmDeviceID
  }
});
```

**接收值的路由**

```js
// 同级目录下，可监听到传值变化（此步骤视情况，不一定要watch监听）
watch: {
  '$route.query': {
    handler () {
      this.alarmDeviceID = this.$route.query.alarmDeviceID; // 接收传值
    },
    // deep: true,
    immediate: true,
  }
},
```

```javascript
console.log("接收过来的值为：" + this.$route.query.alarmDeviceID); //这里是$route 没有r
```

------

## params传值 

路径变量传值

params路由传值可以把它理解成express路径变量传值 ，它也可以放在地址栏里面进行传递

**传值路由第一种写法**（还是会将参数显示在地址栏中）

```javascript
this.$router.push({
    path: "/login/" + this.userName
});
```

**传值路由的第二种写法**（不会将参数显示在地址栏中）

```javascript
this.$router.push({
    name: "login",
    params: {
        uname: this.userName
    }
});
```

**接收值的路由**

```javascript
console.log("接收过来的值为：" + this.$route.params.uname);
```

**注意**：在使用params传递参数的时候，我们需要在router的对象里面，找到当前的这个路由，然后去更改它的`path`

```javascript
 {
     path: "/login/:uname", //代表当前url跳转的路径
     component: login, //代表在当前这个路径下面，我们如何显示组件（显示那一个组件）
     name: "login" //给当前路由取一个别名
 }
```

> 上面的path后面是`/login/:uname`,这一个是我们的一个路径变量，前面的login代表路由，而后面`:uname`代表的是变量

------

通过第二种方式的params传值 ，引伸出post原理传值

params本身确实是会把参数添加到url地址栏，但是，我们可以让它不显示出来，使用下面的方法，我们就可以把它去掉，不显示，从而内容不经过浏览器地址栏处理，直接做到传值。

它只是把路由对象里面的路径变量给去掉了，直接使用的params传值

**注意事项**：因为它把path里面的路径变量去掉了，所以不能使用path去传递值了

```javascript
this.$router.push({
    path: "/login/" + this.userName
});
//现在上面的方法就不可用了，而必须使用下面的方法 
```

```javascript
this.$router.push({
    name: "login",
    params: {
        uname: this.userName
    }
});
```

> 下面的这种写法，变量没有显示在路径里面，只是通过params存储，params传递，不再经过url了，这个时候，我们就可以传递数据，同时，也可以保证数据安全
>
> 这一个就是vue当中变相去处理post传值