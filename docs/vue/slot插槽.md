# Vue插槽（slot）

### 匿名插槽

```vue
// 父组件 home.vue
<template>
  <div class="home">
    <footerComponent>
    	<p>我是匿名插槽</p>
    </footerComponent>
  </div>
</template>

<script>
import footerComponent from '@/components/footerComponent.vue'
export default {
  components: {
    footerComponent,
  }
}
</script>
```

```vue
// 子组件 footerComponent.vue
<template>
  <div>
  	<h1>子组件</h1>
    <slot></slot>	//  替换为 <p>我是匿名插槽</p>
  </div>
</template>
```

#### 后备内容

有时为一个插槽设置具体的后备 (也就是默认的) 内容是很有用的，它只会在没有提供内容的时候被渲染。

```javascript
// 父组件 home.vue
<template>
  <div class="home">
    <footerComponent></footerComponent>
  </div>
</template>

<script>
import footerComponent from '@/components/footerComponent.vue'
export default {
  components: {
    footerComponent,
  }
}
</script>
```

```javascript
// 子组件 footerComponent.vue
<template>
  <div>
  	<h1>子组件</h1>
    <slot>
      <p>我是后补内容</p>
    </slot>
  </div>
</template>
```

### 具名插槽

顾名思义就是带名字的插槽，假如需要在组件内部预留多个插槽位置，就需要为插槽定义名字，指定插入的位置。
**Vue 2.6.0+ 版本，使用v-slot替代slot 和 slot-scope。
注意点:
1.具名插槽的内容必须使用模板< template ></ template >包裹;
2.不指定名字的模板插入匿名插槽中，推荐使用具名插槽，方便代码追踪且直观清楚;
3.匿名插槽具有隐藏的名字"default;"**

#### 2.1 具名插槽的缩写

**跟 v-on 和 v-bind 一样，v-slot 也有缩写，即把参数之前的所有内容 (v-slot:) 替换为字符 #。**
例如 v-slot:header 可以被重写为 #header;
然而，和其它指令一样，该缩写只在其有参数的时候才可用。这意味着以下语法是无效的：

```javascript
// 这样会触发一个警告 
<current-user #="{ user }">
  {{ user.firstName }}
</current-user>
1234
```

如果你希望使用缩写的话，你必须始终以明确插槽名取而代之：

```javascript
<current-user #default="{ user }">
  {{ user.firstName }}
</current-user>
123
```

#### 2.2 动态插槽名

动态指令参数也可以用在 v-slot 上，来定义动态的插槽名

```javascript
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
12345
```

父组件

```javascript
// 现在 <template>元素中的所有内容都将会被传入相应的插槽。
// 任何没有被包裹在带有 v-slot 的 <template> 中的内容都会被视为默认插槽的内容。
<template>
  <div class="home">
    <footerComponent>
      <template v-slot:header>
        <h2>header</h2>
      </template>
      <template v-slot:[mybody]>
        <h3>动态插槽名</h3>
      </template>
      <p>内容</p>
      <template #footer>
        <h2>footer</h2>
      </template>
    </footerComponent>
  </div>
</template>

<script>
import footerComponent from '@/components/footerComponent.vue'
export default {
  data(){
    return{
      mybody:'body',
    }
  },
  components: {
    footerComponent,
  }
}
</script>
```

子组件

```javascript
<template>
  <div class="footerComponent">
    <h1>子组件</h1>
    <slot name="header"></slot>
    <slot name="body"></slot>
    <slot><p>我是后补内容</p></slot>	 //  等价于 <slot name="default"></slot>
    <slot name="footer"></slot>
  </div>
</template>

<style scoped lang="stylus">
.footerComponent
  width 100%
  height 200px
  background-color pink
</style>
```

