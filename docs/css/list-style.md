# list-style

我们最常用的是消除 `ul` `li` 的样式

在 reset.css 里面使用 `list-style: none` 的童鞋请举爪~

但是 `list-style` 不止有 `none`。

`list-style` 是由以下三个属性组合的简写属性。

- `list-style-type`
- `list-style-image` 
- `list-style-position` 


每个属性都可单独设置，也可以直接设置在 `list-style` 上。下面分别介绍这三个属性。

<script setup>
import CompView1 from './components/text-list-style-type.vue'
import CompView2 from './components/text-list-style-position.vue'
import CompView3 from './components/text-list-style-image.vue'
</script>


## listStyleType  <Badge type="tip" text="list-style-type" />
<CompView1 />
::: details 详细代码
<<< ./components/text-list-style-type.vue
:::


## listStylePosition  <Badge type="tip" text="list-style-position" />
<CompView2 />
::: details 详细代码
<<< ./components/text-list-style-position.vue
:::


## listStyleImage  <Badge type="tip" text="list-style-image" />

::: tip 注意
`list-style-image` 没有设置图片大小的属性。
:::

<CompView3 />
::: details 详细代码
<<< ./components/text-list-style-image.vue
:::

::: danger demo不太好搞
:::