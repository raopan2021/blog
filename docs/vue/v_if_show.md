# v-show 与 v-if 

v-if 是真正的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建；

如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 的 “display” 属性进行切换。

所以，v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景；v-show 则适用于需要非常频繁切换条件的场景。

## v-if

初始值为 **false** 组件**不会**渲染，[生命周期](https://so.csdn.net/so/search?q=生命周期&spm=1001.2101.3001.7020)钩子**不会**执行，**v-if** 的渲染是**惰性**的。
初始值为 **true** 时，组件会进行渲染，并依次执行 beforeCreate,created,beforeMount,mounted 钩子。

### **v-if** 切换

false => true
依次执行 beforeCreate,created,beforeMount,mounted 钩子。
true => false
依次执行 beforeDestroy,destroyed 钩子。

## v-show

无论初始状态，组件都会渲染，依次执行 beforeCreate,created,beforeMount,mounted 钩子，**v-show** 的渲染是**非惰性**的。

切换 ，对生命周期钩子无影响，切换时组件始终保持在 mounted 钩子。