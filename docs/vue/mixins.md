# Mixins

## 一、什么是Mixins？

mixins（混入），[官方](https://cn.vuejs.org/v2/guide/mixins.html?login=from_csdn)的描述是一种分发 Vue 组件中可复用功能的非常灵活的方式，mixins是一个js对象，它可以包含我们组件中script项中的任意功能选项，如data、components、methods 、created、computed等等。我们只要将共用的功能以对象的方式传入 mixins选项中，当组件使用 mixins对象时所有mixins对象的选项都将被混入该组件本身的选项中来，这样就可以提高代码的重用性，使你的代码保持干净和易于维护。

 

## 二、什么时候使用Mixins？

当我们存在多个组件中的数据或者功能很相近时，我们就可以利用mixins将公共部分提取出来，通过 mixins封装的函数，组件调用他们是不会改变函数作用域外部的。

 

## 三、如何创建Mixins？

在src目录下创建一个mixins文件夹，文件夹下新建一个myMixins.js文件。前面我们说了mixins是一个js对象，所以应该以对象的形式来定义myMixins，在对象中我们可以和vue组件一样来定义我们的data、components、methods 、created、computed等属性，并通过export导出该对象

![img](https://img-blog.csdnimg.cn/20200805173501551.png)

##  

## 四、如何使用Mixins？

在需要调用的组件中引入myMixins.js文件，然后在export default 中引入你需要的对象即可

## ![img](https://img-blog.csdnimg.cn/20200805173523981.png)

 

## 五、Mixins的特点

**【5.1】方法和参数在各组件中不共享，虽然组件调用了mixins并将其属性合并到自身组件中来了，但是其属性只会被当前组件所识别并不会被共享，也就是其他组件无法从当前组件中获取到mixins中的数据和方法。**

①首先我们在混合对象myMixins.js中定义一个age字段和getAge方法

```javascript
export const myMixins = {
  components:{},
  data() {
    return {
      age: 18,
    }
  },
  mounted() {
    this.getAge()
  },
  methods: {
    getAge() {
      console.log(this.age)
    }
  }
}
```

② 组件1中对num进行+1操作

```javascript
import { myMixins } from "@/mixins/myMixins.js";
export default {
  mixins: [myMixins],
  data() {
    return {}
  },
  created() {
    this.age++
  },
}
```

③组件2不进行操作

```haskell
export default {
  mixins: [myMixins],
  data() {
    return {}
  },
}
```

④我们分别切换到两个页面，查看控制台输出。会发现组件1改变了age里面的值，组件2中age值还是混合对象的初始值，并没有随着组件1的增加而改变

![img](https://img-blog.csdnimg.cn/2020080716320059.png)

**【5.2】引入mixins后组件会对其进行合并，将mixins中的数据和方法拓展到当前组件中来，在合并的过程中会出现冲突，接下来我们详细了解Mixins合并冲突**

 

## 六、Mixins合并冲突

**【6.1】值为对象(components、methods 、computed、data)的选项，混入组件时选项会被合并，键冲突时优先组件，组件中的键会覆盖混入对象的**

①我们在混入对象增加age属性、getAge1方法和getAge2方法

```javascript
// myMixins.js
export const myMixins = {
  components:{},
  data() {
    return {
      age: 18,
    }
  },
  methods: {
    getAge1() {
      console.log("age1 from mixins =", this.age )
    },
    getAge2() {
      console.log("age2 from mixins =", this.age )
    },
  }
}
```

 ②我们在引入了myMixins文件的组件中，增加age属性、getAge1方法和getAge3方法

```javascript
// template.vue
import { myMixins } from "@/mixins/myMixins.js";
export default {
  mixins: [myMixins],
  data() {
    return {
      age: 20,
    }
  },
  mounted() {
    this.getAge1();
    this.getAge2();
    this.getAge3();
  },
  methods: {
    getAge1() {
      console.log('age1 from template =', this.age)
    },
    getAge3() {
      console.log('age3 from template =', this.age)
    },
  }
}
```

③我们会发现，组件中的age覆盖了混合对象的age，组件的getAge1方法覆盖了混合对象的getAge1方法

![img](https://img-blog.csdnimg.cn/20200807172123925.png)

**【6.2】值为函数(created、mounted)的选项，混入组件时选项会被合并调用，混合对象里的钩子函数在组件里的钩子函数之前调用**

```javascript
// myMixins.js
export const myMixins = {
  components:{},
  data() {
    return {}
  },
  created() {
    console.log('xxx from mixins')
  }
}
import { myMixins } from "@/mixins/myMixins.js";
export default {
  mixins: [myMixins],
  data() {
    return {}
  },
  created() {
    console.log('xxx from template')
  }
}
```

![img](https://img-blog.csdnimg.cn/20200807173312845.png)

## 七、与vuex的区别

> **vuex：**用来做状态管理的，里面定义的变量在每个组件中均可以使用和修改，在任一组件中修改此变量的值之后，其他组件中此变量的值也会随之修改。
>
> **Mixins：**可以定义共用的变量，在每个组件中使用，引入组件中之后，各个变量是相互独立的，值的修改在组件中不会相互影响。

## 八、与公共组件的区别

> **组件**：在父组件中引入组件，相当于在父组件中给出一片独立的空间供子组件使用，然后根据props来传值，但本质上两者是相对独立的。
>
> **Mixins：**则是在引入组件之后与组件中的对象和方法进行合并，相当于扩展了父组件的对象与方法，可以理解为形成了一个新的组件。