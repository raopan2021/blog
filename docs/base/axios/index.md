# axios

## 简单封装

https://juejin.cn/post/7094165971874611230

不考虑取消重复请求、重复发送请求、请求缓存等情况！

这里主要实现以下目的：

1、实现请求拦截

2、实现响应拦截

3、常见错误信息处理

4、请求头设置

5、api 集中式管理

::: code-group

<<< easy/index.js

<<< easy/user.js

<<< easy/user.vue
:::

## 完整封装

https://juejin.cn/post/7094165971874611230#heading-0

🎯 渐进式增强 - 可以像原生 Axios 一样简单使用，也可以启用高级功能

🔒 类型安全 - 完整的 TypeScript 支持，编译时发现问题

🧩 灵活扩展 - 支持多实例、自定义拦截器、业务定制

⚡ 性能优先 - 自动去重、智能重试、内存管理

::: code-group
<<< complete/index.ts
:::
