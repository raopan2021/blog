# 在Vue中使用NProgress查看进度

<a href="https://blog.csdn.net/qq_22241923/article/details/101211144" target="_blank">原网址</a>

NProgress的2种用法：

1、加载进度条

2、滚动进度条

### 安装

```js
npm install --save nprogress
或
yarn add nprogress
```

### 作为加载进度条

在Vue入口文件 main.js 中引入 nprogress

```js
import Vue from 'vue'

import NProgress from 'nprogress' //引入 nprogress 插件
import 'nprogress/nprogress.css' // 引入基础样式
```

切换路由时进行加载（也是在main.js中）

```js
//当路由进入前
router.beforeEach((to, from, next) => {
  // 每次切换页面时，调用进度条
  NProgress.start();
  // 这个一定要加，没有next()页面不会跳转的。这部分还不清楚的去翻一下官网就明白了
  next();
});
//当路由进入后：关闭进度条
router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done()
})
```



### 作为页面滚动进度条

在 App.vue 中

```js
<script>
import NProgress from "nprogress"; // 导入nprogress
// 因为在main.js 中已经导入样式，这里不需要再次导入样式
// 但是NProgress还是需要导入！
export default {
  name: "App",
  mounted() {
    window.addEventListener("scroll", this.handleScroll); // 监听滚动条事件
  },
  methods: {
    handleScroll() {
      // 屏幕剩余的高度
      let surplus =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      // 当前滑动高度
      let scrollY = document.documentElement.scrollTop;
      // 当前位置百分比小数
      let coorY = scrollY / surplus;
      // 设置导航栏，这里使用NProgress.set() 动态更改进度条
     NProgress.set(coorY);
    }
  }
};
</script>

```



### 更改默认颜色样式

在 App.vue 中

```scss
<style>
#nprogress .bar{ //自定义进度条颜色
  background: orange !important; 
}
#nprogress .peg { // 自定义辅助阴影颜色，这里默认为透明
  box-shadow: 0 0 10px #00000000, 0 0 5px #00000000 !important; 
}
</style>
```



### 进度环显示隐藏

在main.js中

```js
NProgress.configure({showSpinner: false});
```



### 动画

ease：调整动画设置，ease可传递CSS3缓冲动画字符串（如ease、linear、ease-in、ease-out、ease-in-out、cubic-bezier）。speed为动画速度（单位ms）

```js
NProgress.configure({ease:'ease',speed:1000});
```



### 进度条最低百分比

```js
NProgress.configure({minimum:0.0});
```



### 百分比

通过设置progress的百分比，调用 .set(n)来控制进度，其中n的取值范围为0-1

```js
NProgress.set(0.4);
```