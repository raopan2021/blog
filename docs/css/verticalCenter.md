# verticalCenter 垂直居中

<script setup>
import demo1 from './components/verticalCenter/demo1.vue'
import demo2 from './components/verticalCenter/demo2.vue'
import demo3 from './components/verticalCenter/demo3.vue'
import demo4 from './components/verticalCenter/demo4.vue'
import demo5 from './components/verticalCenter/demo5.vue'
import demo6 from './components/verticalCenter/demo6.vue'
</script>


## 方法1 top: 50%; left: 50%; transform: translate(-50%, -50%);

<demo1 />
::: details 详细代码
<<< ./components/verticalCenter/demo1.vue
:::


## 方法2 top: 0;bottom: 0;left: 0;right: 0;margin: auto;

<demo2 />
::: details 详细代码
<<< ./components/verticalCenter/demo2.vue
:::


## 方法3 
### align-items: center; // 垂直
### justify-content: center; // 横向

<demo3 />
::: details 详细代码
<<< ./components/verticalCenter/demo3.vue
:::


## 方法4

<demo4 />

``` scss
.parentElement {
  display: block;
  &:before {
    content: " ";
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }
  .childElement {
    display: inline-block;
    vertical-align: middle;
  }
}
```

::: danger warning
横向居中不会
:::

::: details 详细代码
<<< ./components/verticalCenter/demo4.vue
:::



## 方法5 建立1个隐藏节点的高为 (父级高 - 去子级高)/2
<demo5 />

``` scss
.parentElement {
    display: block;
    background-color: bisque;
    height: 100px;
    width: 100%;

    .hide {
        height: 35%; // 隐藏节点的高为 (父级高 - 去子级高)/2
    }

    .childElement {
        width: 20%;
        height: 30%;
        background-color: darkcyan;
    }
}
```
::: details 详细代码
<<< ./components/verticalCenter/demo5.vue
:::


## 方法5 建立1个隐藏节点的高为 (父级高 - 去子级高)/2
<demo5 />

``` scss
.parentElement {
    display: block;
    background-color: bisque;
    height: 100px;
    width: 100%;

    .hide {
        height: 35%; // 隐藏节点的高为 (父级高 - 去子级高)/2
    }

    .childElement {
        width: 20%;
        height: 30%;
        background-color: darkcyan;
    }
}
```
::: details 详细代码
<<< ./components/verticalCenter/demo5.vue
:::


## 方法6 display:table-cell

<demo6 />

``` scss
.parentElement {
    display: table;
    height: 150px;
    width: 300px;
    background-color: #f00;

    .childElement {
        display: table-cell;
        vertical-align: middle;
        height: 30%;
        background-color: darkcyan;
    }

    .childElement:last-child {
        background-color: aliceblue;
    }
}
```

::: tip 不太好用的亚子
:::

::: details 详细代码
<<< ./components/verticalCenter/demo6.vue
:::