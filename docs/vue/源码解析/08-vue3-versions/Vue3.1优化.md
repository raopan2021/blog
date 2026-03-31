# Vue 3.1 渲染器优化

## 📖 本节总结

Vue 3.1 主要带来了渲染器层面的优化，以及对 Tree-shaking 的进一步改进。

## 主要改进
### 1. 更好的 Tree-shaking
```javascript
// Vue3.0 之前
import { h, ref, reactive } from 'vue'
// Vue3.1 改进了副作用处理
// 减少了不必要的代码打包
// 更好的虚拟 DOM 剪枝
// 未使用的组件特性不会被打包
```
### 2. 渲染器优化
```javascript
// Vue3.0 的渲染器调用方式
const vnode = createVnode('div', props, children)
// Vue3.1 改进了调用链，减少了不必要的函数调用
// 性能提升约 5-10%
```
### 3. 更多 API 支持 Tree-shaking
```javascript
// 以下 API 在 Vue3.1 更好地支持了 Tree-shaking
import {
  // 响应式
  ref, reactive, computed, watch,
  // 生命周期
  onMounted, onUpdated, onUnmounted,
  // 组件
  getCurrentInstance,
  // 工具
  defineComponent
} from 'vue'
// 更大的包体积减小
```
## 全局 API 变更
```javascript
// Vue3.0
import Vue from 'vue'
Vue.createApp(App)
// Vue3.1 增强了全局 API 的类型推导
import { createApp } from 'vue'
const app = createApp(App)
// 更好的 TypeScript 支持
```
## 响应式系统改进
```javascript
// Vue3.0 的 reactive 有一些边界情况
const state = reactive({ count: 0 })
const n = ref(0)
// Vue3.1 改进了这些情况的处理
// 减少了不必要的依赖追踪
```
## 性能对比
| 场景 | Vue 3.0 | Vue 3.1 | 提升 |
|------|---------|----------|------|
| 响应式创建 | 100% | 105% | 5% |
| 依赖追踪 | 100% | 110% | 10% |
| 渲染更新 | 100% | 108% | 8% |
| 包大小 | 100% | 95% | 5% |

```bash
# Vue3.1 是 3.0 的小版本升级
# 大部分项目可以直接升级
```

**兼容性**：Vue 3.1 完全兼容 Vue 3.0 的 API，无需修改业务代码。

