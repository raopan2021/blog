# Monorepo 实战：用 pnpm workspace 搭建 Vue 源码学习项目

> 为什么 Vue3 源码采用 Monorepo 架构？亲手搭建一个你就懂了

## 什么是 Monorepo？

**Monorepo** = Mono（单一）+ Repository（仓库）

简单说就是：**一个仓库管理多个独立的包（package）**

### 对比传统 Multi-repo

```
Multi-repo（不推荐 ❌）
├── vue-core/        # 单独的仓库
├── vue-router/       # 单独的仓库
└── vuex/             # 单独的仓库

Monorepo（推荐 ✅）
└── vue-learn/        # 一个仓库
    ├── packages/
    │   ├── reactivity/   # 响应式模块
    │   ├── runtime-core/ # 运行时核心
    │   └── runtime-dom/  # DOM 特定实现
    └── pnpm-workspace.yaml
```

## 为什么 Vue3 选择 Monorepo？

1. **代码共享** — 多个包之间可以方便地相互引用
2. **统一版本** — 所有包保持一致的版本号
3. **批量操作** — 一个命令构建/测试所有包
4. **依赖管理** — 公共依赖提升到根目录，节省空间

## 开始搭建

### 1. 初始化项目结构

```bash
# 创建项目目录
mkdir vue-learn && cd vue-learn

# 初始化 pnpm workspace 配置文件
# 这告诉 pnpm："这是一个工作空间，有多个包"
touch pnpm-workspace.yaml
```

### 2. 配置 pnpm-workspace.yaml

```yaml
# pnpm-workspace.yaml
# 使用通配符指定包的位置，所有包都在 packages 目录下
packages:
  - 'packages/*'
```

### 3. 创建第一个包：响应式模块

```bash
# 创建包目录结构
mkdir -p packages/reactivity
cd packages/reactivity

# 初始化包
pnpm init
```

### 4. 配置包信息

编辑 `packages/reactivity/package.json`：

```json
{
  "name": "@vue-learn/reactivity",    // 作用域包名，符合 npm 规范
  "version": "1.0.0",
  "type": "module",                    // ESM 模块
  "main": "./index.js",               // 入口文件
  "exports": {
    ".": "./index.js",
    "./package.json": "./package.json"
  }
}
```

### 5. 编写响应式模块代码

创建 `packages/reactivity/index.js`：

```javascript
/**
 * 简化版响应式系统
 * 这是我们学习 Vue 响应式原理的起点
 */

// 用于存储依赖与回调的映射
const targetMap = new WeakMap()

/**
 * 收集依赖
 * 当访问一个对象的属性时，收集"谁在用这个属性"
 * @param {Object} target - 目标对象
 * @param {string} key - 属性名
 */
export function track(target, key) {
  // 暂时跳过，详细原理在模块二讲解
  console.log(`📡 收集依赖：${target.constructor.name}.${key}`)
}

/**
 * 触发更新
 * 当修改一个属性时，通知"谁在用这个属性"
 * @param {Object} target - 目标对象
 * @param {string} key - 属性名
 */
export function trigger(target, key) {
  console.log(`🚀 触发更新：${target.constructor.name}.${key}`)
}

/**
 * 响应式核心函数
 * 使用 Proxy 包装对象，实现数据的"响应式化"
 * @param {Object} obj - 需要响应式的对象
 */
export function reactive(obj) {
  return new Proxy(obj, {
    // 读取属性时触发
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    // 修改属性时触发
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return result
    }
  })
}

/**
 * 测试一下
 */
const state = reactive({
  count: 0,
  name: 'Vue'
})

// 读取属性 - 会触发 track
console.log(state.count)  // 📡 收集依赖：Object.count

// 修改属性 - 会触发 trigger
state.count++             // 🚀 触发更新：Object.count
```

### 6. 创建运行时核心包

```bash
cd ../
mkdir -p packages/runtime-core
cd packages/runtime-core
pnpm init
```

编辑 `packages/runtime-core/package.json`：

```json
{
  "name": "@vue-learn/runtime-core",
  "version": "1.0.0",
  "type": "module",
  "main": "./index.js"
}
```

创建 `packages/runtime-core/index.js`：

```javascript
/**
 * 运行时核心模块
 * 负责组件的创建、渲染、更新等核心逻辑
 */

/**
 * 组件配置项
 * @typedef {Object} ComponentOptions
 * @property {Function} data - 组件数据
 * @property {Function} render - 渲染函数
 * @property {Function[]} methods - 组件方法
 */

/**
 * 创建组件实例
 * 这是 Vue 组件化的起点
 * @param {ComponentOptions} options - 组件配置
 */
export function createComponentInstance(options) {
  const instance = {
    // 组件配置
    vnode: null,       // 虚拟节点
    props: {},         // 接收的 props
    setupState: {},    // setup() 返回的状态
    data: null,        // data() 返回的数据
    methods: {},       // 方法
    // 生命周期
    beforeMount: null,
    mounted: null,
    beforeUpdate: null,
    updated: null,
    // 内部状态
    isMounted: false,
    render: null
  }

  return instance
}

/**
 * 渲染组件
 * @param {Object} instance - 组件实例
 */
export function renderComponent(instance) {
  // 调用 render 函数获取虚拟 DOM
  const vnode = instance.render?.()
  console.log('🎨 渲染组件:', vnode)

  return vnode
}
```

### 7. 在根目录创建测试文件

回到项目根目录，创建 `test.js`：

```javascript
/**
 * 测试我们的简化版 Vue
 * 验证响应式系统和组件系统是否正常工作
 */

import { reactive } from '@vue-learn/reactivity'
import { createComponentInstance, renderComponent } from '@vue-learn/runtime-core'

// ============ 测试响应式系统 ============
console.log('='.repeat(50))
console.log('📦 测试响应式系统')
console.log('='.repeat(50))

const state = reactive({
  count: 0,
  user: {
    name: '张三',
    age: 25
  }
})

// 触发依赖收集
state.count
state.user.name

// 触发更新
state.count = 10
state.user.age = 30

// ============ 测试组件系统 ============
console.log('\n' + '='.repeat(50))
console.log('🧩 测试组件系统')
console.log('='.repeat(50))

// 创建一个简单的计数器组件
const Counter = createComponentInstance({
  data() {
    return {
      count: 0
    }
  },
  render() {
    // 这里的 h 函数后面会实现
    return { type: 'div', children: `计数: ${this.count}` }
  }
})

// 渲染组件
renderComponent(Counter)
```

## 常见问题

### Q: 为什么用 `WeakMap` 而不是 `Map`？

```javascript
// WeakMap 的键是弱引用，不会阻止垃圾回收
// 当对象不再被引用时，可以被自动回收，节省内存
const targetMap = new WeakMap()
// const targetMap = new Map()  // ❌ 普通 Map 会导致内存泄漏
```

### Q: `Reflect.get` 和直接 `target[key]` 有什么区别？

```javascript
// Reflect 提供了统一的原型操作 API
// 并且可以正确处理 receiver（this 绑定问题）
const obj = { name: 'test' }
const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    // 推荐使用 Reflect，它能正确处理继承场景
    return Reflect.get(target, key, receiver)
  }
})
```

## 总结

| 概念 | 说明 |
|------|------|
| Monorepo | 单一仓库管理多包 |
| pnpm workspace | 高效的包管理工具 |
| `pnpm-workspace.yaml` | 声明包的目录位置 |
| 作用域包名 | `@vue-learn/xxx` 格式 |
