# vue页面切换动画

### 页面层级

给各个页面定义层级,在切换路由时判断用户是进入哪一层页面,如果用户进入更高层级那么做前进动画,如果用户退到低层级那么做后退动画.

router/index.js

```js
import VueRouter from 'vue-router'
import Home from '../components/home/home'
import User from '../components/user/user'

var router = new VueRouter({
    routes:[{
        name:'test',
        path:'/',
        meta:{index:0},//meta对象的index用来定义当前路由的层级,由小到大,由低到高
        component:{
            template:'<div>test</div>'
        }
    },{
        name:'home',
        path:'/home',
        meta:{index:1},
        component:Home
    },{
        name:'user',
        path:'/user/:id',
        meta:{index:2},
        component:User
    }]
});
```

### 监控路由跳转

判断切换页面之间的层级关系,并以此来判断路由前进或者后退.

```vue
<template>
  <div id="app">
    <transition :name="transitionName">   
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
      return {
          transitionName:''
      }
  },
  watch: {//使用watch 监听$router的变化
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if(to.meta.index > from.meta.index){
	    //设置动画名称
        this.transitionName = 'slide-left';
      }else{
        this.transitionName = 'slide-right';
      }
    }
  }
}
</script>
```



### 动画

### app.vue

```css
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
```

