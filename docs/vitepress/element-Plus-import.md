# 引入Element-Plus


## 按需引入

按照官网的按需引入，打包时会报错。

https://element-plus.org/zh-CN/guide/quickstart.html#%E6%8C%89%E9%9C%80%E5%AF%BC%E5%85%A5

在theme/index全局引入不报错

但是会影响 `Badge` 徽标！原因应该是vitepress自带的 `Badge` 和ElementPlus的 `Badge` 冲突。

::: tip .vitepress/theme/index.js

``` js 
import DefaultTheme from "vitepress/theme";
import "element-plus/dist/index.css";
import elementplus from "element-plus"
export default {
  ...DefaultTheme,
  enhanceApp: async ({ app, router, siteData }) => {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
      app.use(elementplus);
    
  },
};

```
:::


::: tip 参考

作者：东方小月

链接：https://juejin.cn/post/7129201521295622152

来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
:::



## 全局导入

打包报错。。。



## 最后只能单独引入，在 `docs\.vitepress\theme\index.js` 引入样式

- import 'element-plus/dist/index.css'
  
- import { ElLink } from 'element-plus'
