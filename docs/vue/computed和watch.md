# 计算属性computed & 监听属性watch

## computed 

​    我们希望一个变量是经过某种计算然后输出，而不是直接输出的时候，可以使用到计算属性

```vue
 <div>{{ total }}</div>
 
computed: {
  total() {
    return this.a + this.b
  }
} 
```



# watch

watch可以监听对象，也可以监听对象中的某个属性

当需要在数据变化时执行异步或开销较大的操作时，使用监听器是最有用的

```js
watch: {
  a(newVal, oldVal) {
    this.total = this.a + this.b
  },
  b(newVal, oldVal) {
    this.total = this.a + this.b
  },
  // obj() {
  //   // 普通监听形式，只能监听到引用数据类型引用地址的改变
  //   console.log('watch', this.obj);
  // },
  obj: {
    handler(newVal, oldVal) {
      console.log(newVal);
      console.log(oldVal);
    },
    deep: true
  }
}
```



## watch 和 computed 的区别

1. `computed`的`get`必须有返回值（`return`），而`watch` `return`可有可无
2. `computed`支持`缓存`，只有依赖的数据发生改变，才会重新进行计算，而`watch`不支持缓存，数据发生改变，会直接触发相应的操作
3. `computed`可以`自定义名称`，而`watch`只能`监听` `props`和`data`里面名称相同的属性
4. `computed`适用于复杂的运算，而`watch`适合一些消耗性功能，比如`Ajax`
5. `computed`不支持`异步`，当`computed`内有异步操作是无效，无法监听数据的变化，而`watch`支持`异步`
6. `computed`属性值会默认走`缓存`，计算属性是基于它们的响应式依赖进行`缓存`的，也就是基于`data`中声明过或者父组件传递的`props中`的数据通过计算得到的值，而`watch`监听的函数接受两个参数，第一个是`最新的值`，第二个是输入`之前的值`
7. 如果一个属性是由其他属性计算而来的，这个属性`依赖其他属性`，`多对一`或者`一对一`，一般用`computed`；当一个属性发生变化时，需要执行对应的操作，`一对多`，一般用`watch`