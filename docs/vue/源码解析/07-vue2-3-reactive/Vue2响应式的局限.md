# Vue2 响应式的局限

## 📖 本节总结

Vue2 的响应式系统有几个经典问题，都是由 `Object.defineProperty` 的局限性导致的。

## 问题一：新增属性不是响应式的
### 问题代码
```javascript
const vm = new Vue({
  data: {
    user: {
      name: '张三'
    }
  }
})
// ❌ 不会触发视图更新
vm.user.age = 25
// ✅ 需要使用 Vue.set
Vue.set(vm.user, 'age', 25)
// 或
vm.$set(vm.user, 'age', 25)
```
### 原因分析
```javascript
// Vue2 在初始化时只对已有属性调用 defineReactive
function Vue(options) {
  this._data = options.data
  // 遍历 data 中的所有属性，让它们响应式
  for (const key in this._data) {
    defineReactive(this._data, key, this._data[key])
  }
}
// 新增的属性 age 从未调用过 defineReactive
// 所以它不是响应式的
```
### 解决方案
```javascript
// 方案1：使用 Vue.set
Vue.set(vm.user, 'age', 25)
// 方案2：替换整个对象
vm.user = { ...vm.user, age: 25 }
// 方案3：使用 $set
vm.$set(vm.user, 'age', 25)
// 方案4：预先声明所有属性（最佳实践）
const vm = new Vue({
  data: {
    user: {
      name: '张三',
      age: 0  // 预先声明
    }
  }
})
vm.user.age = 25  // ✅ 响应式
```
## 问题二：删除属性不是响应式的
### 问题代码
```javascript
const vm = new Vue({
  data: {
    user: {
      name: '张三',
      age: 25
    }
  }
})
// ❌ 不会触发视图更新
delete vm.user.age
// ✅ 需要使用 Vue.delete
Vue.delete(vm.user, 'age')
// 或
vm.$delete(vm.user, 'age')
```
### 原因分析
```javascript
// delete 操作不会触发 Object.defineProperty 的 set
// Vue 无法感知属性被删除
// Vue.delete 的实现
Vue.delete = function(target, key) {
  // 先获取属性描述符
  const descriptor = Object.getOwnPropertyDescriptor(target, key)
  if (!descriptor) return
  // 删除属性
  delete target[key]
  // 然后手动触发更新（通过依赖追踪系统）
  // 这就是为什么需要 Vue.delete 而不是直接 delete
}
```
## 问题三：数组索引变化不是响应式的
### 问题代码
```javascript
const vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
// ❌ 不会触发视图更新
vm.items[0] = 'x'
// ✅ 需要使用 Vue.set
Vue.set(vm.items, 0, 'x')
// 或
vm.$set(vm.items, 0, 'x')
// ❌ 不会触发视图更新（Vue 2.x 的局限）
vm.items.splice(0, 1, 'x')  // 某些情况下可以，但不稳定
```
### 原因分析
```javascript
// Vue2 拦截了数组的 7 个方法：
// push, pop, shift, unshift, splice, sort, reverse
// 但直接通过索引修改数组没有经过这些方法
vm.items[0] = 'x'  // 直接修改，没有触发拦截
// Vue3 通过 Proxy 可以拦截所有操作，包括索引修改
```
### Vue2 中数组的安全操作方式
```javascript
// ✅ 这些方法会被 Vue2 拦截，可以触发更新
vm.items.push('d')
vm.items.pop()
vm.items.shift()
vm.items.unshift('d')
vm.items.splice(1, 1, 'x')  // 替换
vm.items.sort()
vm.items.reverse()
// ❌ 这些直接通过索引修改，无法触发更新
vm.items[0] = 'x'
vm.items.length = 0  // 直接清空数组
// ✅ 清空数组的正确方式
vm.items.splice(0)  // 或
vm.items.splice(0, vm.items.length)
```
## 问题四：响应式属性需要预先声明
### 问题代码
```javascript
const vm = new Vue({
  data: {
    // user 下的所有属性需要预先声明
    user: {
      name: '张三'
      // 如果不声明 age，后续添加的 age 不会是响应式的
    }
  }
})
// 深层属性的新增也存在问题
vm.user.profile = {}           // ❌ 不是响应式的
vm.user.profile.age = 25        // ❌ 报错
```
### 最佳实践
```javascript
// 方法1：预先声明所有可能的属性
const vm = new Vue({
  data: {
    user: {
      name: '张三',
      age: 0,
      profile: {
        age: 0,
        city: ''
      }
    }
  }
})
// 方法2：使用 Vue.set 创建深层响应式
Vue.set(vm.user, 'profile', { age: 25, city: '北京' })
// 方法3：整体替换（触发响应式更新）
vm.user = {
  ...vm.user,
  profile: { age: 25, city: '北京' }
}
```
## 问题五：Map、Set、Class 实例不是响应式的
### 问题代码
```javascript
const vm = new Vue({
  data: {
    // ❌ Map 不是响应式的
    map: new Map(),
    // ❌ Set 不是响应式的
    set: new Set(),
    // ❌ 类实例不是响应式的
    date: new Date()
  }
})
vm.map.set('key', 'value')    // ❌ 不会触发更新
vm.set.add(1)                  // ❌ 不会触发更新
vm.date.setDate(10)           // ❌ 不会触发更新
```
### 解决方案
```javascript
// 方法1：包装成普通对象
const vm = new Vue({
  data: {
    mapData: {},  // 用普通对象代替 Map
    setData: []   // 用数组代替 Set
  }
})
// 方法2：使用 computed 手动追踪
const vm = new Vue({
  data: {
    date: new Date()
  },
  computed: {
    formattedDate() {
      return this.date.toLocaleDateString()
    }
  }
})
```
## Vue2 响应式原理全景图
```
┌─────────────────────────────────────────────────────────┐
│                    Vue2 响应式初始化                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  new Vue({ data: { user: { name: '张三', age: 25 } } }) │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │            observe(data)                         │    │
│  │  遍历 data 对象，调用 defineReactive              │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │  defineReactive(obj, 'user', { name, age })      │    │
│  │                                                   │    │
│  │  创建 Dep 实例                                    │    │
│  │  Object.defineProperty(obj, 'user', {            │    │
│  │    get() { track(); return val },                │    │
│  │    set(newVal) { trigger(); val = newVal }       │    │
│  │  })                                               │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │  observe(user)  ← 递归处理嵌套对象                 │    │
│  │                                                   │    │
│  │  defineReactive(user, 'name', '张三')            │    │
│  │  defineReactive(user, 'age', 25)                 │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ⚠️ 问题：                                              │
│  ❌ user.gender = '男'  → 不会响应                    │
│  ❌ delete user.age → 不会响应                        │
│  ❌ user.profile.newKey = 'xx' → 不会响应             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
## Vue3 解决这些问题了吗？
```javascript
// Vue3 使用 Proxy，所有问题都解决了
const state = reactive({
  user: {
    name: '张三'
  }
})
state.user.age = 25             // ✅ 新增属性，响应式
delete state.user.name          // ✅ 删除属性，响应式
state.user.profile.city = '北京' // ✅ 深层新增，响应式
const list = reactive([1, 2, 3])
list[0] = 100                  // ✅ 数组索引，响应式
list.push(4)                    // ✅ 数组方法，响应式
```
## 总结
| 问题 | Vue2 解决方案 | Vue3 |
|------|--------------|------|
| 新增属性 | Vue.set / 预先声明 | Proxy 自动处理 |
| 删除属性 | Vue.delete | Proxy 自动处理 |
| 数组索引 | Vue.set / splice | Proxy 自动处理 |
| 深层嵌套 | 递归 defineReactive | Proxy 惰性递归 |
| Map/Set | 包装成对象 | reactive 也支持 |
**Vue2 的核心问题是 `Object.defineProperty` 无法拦截动态新增/删除的属性，而 Vue3 的 `Proxy` 完美解决了这个问题。**
