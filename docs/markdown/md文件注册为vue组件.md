# markdown文件注册为vue组件

<a href="https://blog.csdn.net/weixin_41192489/article/details/113324104" target="_blank">vue 加载展示md文件-原网址</a>

### 安装依赖包

```
npm i vue-markdown-loader -D
npm i  vue-loader vue-template-compiler -D
npm i github-markdown-css -D
npm i highlight.js -D
```

 若报错 Vue packages [version](https://so.csdn.net/so/search?q=version&spm=1001.2101.3001.7020) mismatch，则安装与 vue-template-compiler 版本一致的vue即可

```
npm install vue@2.6.12 --save
```

### 在vue.config.js中添加配置

```js
module.exports = {
  chainWebpack: config => {
    config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true
      })
  }
}
```

### 导入样式

在 .vue 文件中局部导入，或在 main.js 中全局导入。

```js
import 'github-markdown-css'
import 'highlight.js/styles/github.css'
```

如果上面的不行，那就是下面这个（测试这个打开了太多网页csdn，导入的太多了），我是在main.js里面导入的下面这个。

```js
import 'github-markdown-css/github-markdown.css'
import hljs from 'highlight.js'
// 如果开启了typescript 需要额外安装 npm install @types/highlight.js
// 通过 import * as hljs from 'highlight.js' 引入
Vue.directive('highlight', function (el) {
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach(block => {
    hljs.highlightBlock(block)
  })
})
```

### 在vue文件中使用

```js
import ReadmeView from '@/../README.md';
```

```vue
components: {
    ReadmeView
},
```

```vue
<div class="markdown-body">
  <!-- 文章详情页面 -->
  <div class="details">
    <readme-view class="markdown-body"></readme-view>
  </div>
</div>
```
