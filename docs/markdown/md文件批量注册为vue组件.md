# 批量导入md文件并注册为vue组件

 <a href="https://www.cnblogs.com/ainyi/p/14722182.html" target="_blank">批量导入md文件，注册为组件</a>

### 注册

先扫描读取目录下每个文件，如有需要过滤的组件标出，再批量注册

```js
<script>
// 导入根目录/docs，这个文件夹下面的所有md文件
const mdComponent = require.context('@/docs',true,/\.(md)$/)

const components = {}; // md组件集合
const filterCmps = [];
// 如有需要过滤的组件标出，排除
// const filterCmps = ['./aMdFileDontNeed.md']

mdComponent.keys().forEach((fileName,index) => {
  let component = mdComponent(fileName).default
  !filterCmps.includes(fileName) && (components["mdComponent" + index] = component)
})
export default {
  data () {
    return {
      // 这里做排序处理，按原型图可拆分的模块顺序，将每个组件的 name 命名为 xxx_${index}
      // 为什么做排序？为了循环依次应用子组件
      componentList: Object.keys(components).sort(
        (a,b) => a.split('_')[1] - b.split('_')[1]
      )
    }
  },
  components: {
    ...components
  },
}
</script>
```

### 应用

```vue
<div class="markdown-body">
  <!-- 文章详情页面 -->
  <div class="details">
    <component :is="componentList[activeComponent]" class="markdown-body"></component>
  </div>
</div>
```
