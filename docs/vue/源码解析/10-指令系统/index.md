# 模块十：指令系统

> 深入理解 Vue 指令的原理：v-bind、v-on、v-model、自定义指令

## 📖 本模块总结

Vue 指令是对 DOM 操作的抽象，编译时转换为 DOM 操作或属性设置。

| 指令 | 说明 | 编译结果 |
|------|------|----------|
| v-bind | 绑定属性 | setAttribute / prop |
| v-on | 绑定事件 | addEventListener |
| v-model | 双向绑定 | v-bind + v-on |
| v-show | 显示/隐藏 | display 样式 |
| v-if/v-for | 条件/循环 | 条件渲染/列表渲染 |
| 自定义指令 | 用户定义 | inserted / updated 等钩子 |

## 本模块内容
1. [指令编译原理](./指令编译原理)
2. [v-model 实现原理](./v-model实现原理)
3. [自定义指令](./自定义指令)
