# 下划线

<script setup>
import TextUnderline1 from './components/text-underline1.vue'
</script>


## 下划线-特效1 <Badge type="tip" text="试一试hover后再离开" />
<TextUnderline1 />

::: tip 注意
通过给文字添加`background 属性` 和 `transition 动画`，实现下划线特效。<br />
`hover`前后的`background-position`属性不同，下划线的动画也不同。
:::

``` scss
div {
    span {
        font-size: 16px;
        line-height: 30px;
        background: linear-gradient(to right, #ff6b6b, #77e877);
        background-repeat: no-repeat;
        background-position: right bottom;
        background-size: 0 2px;
        transition: background-size 1s;
    }

    span:last-child {
        background-position: left bottom;
    }
}


div:hover>span {
    background-position: left bottom;
    background-size: 100% 2px;
}
```

::: details 全部代码
<<< ./components/text-underline1.vue
:::