# 文字特效

<script setup>
import TextUnderline1 from './components/text-underline1.vue'
import demo1 from './components/text/demo1.vue'
import demo2 from './components/text/demo2.vue'
import demo3 from './components/text/demo3.vue'
import demo4 from './components/text/demo4.vue'
import demo5 from './components/text/demo5.vue'
import demo6 from './components/text/demo6.vue'
import demo7 from './components/text/demo7.vue'
</script>



## 下划线 <Badge type="tip" text="试一试hover后再离开" />
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



## 文字颜色渐变

<demo1 />

``` scss
.text-clip {
    display: inline-block;
    padding: 30px 0 0;
    color: transparent;
    font-size: 20px;
    font-weight: bold;
    background: linear-gradient(45deg, rgba(0, 173, 181, 1) 0%, rgba(0, 173, 181, .4) 100%);
    -webkit-background-clip: text;
}
```
::: details 全部代码
<<< ./components/text/demo1.vue
:::




## 文字不断渐变

<demo7 />

``` scss
.text-gradient {
    font-size: 24px;
    background: -webkit-linear-gradient(315deg, rgb(210, 86, 53) 10%, #647eff 50%, rgb(238, 224, 112) 90%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    background-size: 400% 400%;
    animation: gradient 10s ease infinite;
}

@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
```
::: details 全部代码
<<< ./components/text/demo7.vue
:::




## 文字闪烁

<demo6 />

``` css

.text-blink {
    color: rgba(0, 173, 181, 1);
    animation: blink 2s linear infinite;
}

@keyframes blink {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}
```
::: details 全部代码
<<< ./components/text/demo6.vue
:::


## 文字外发光

<demo2 />

``` scss
.glow-text {
    line-height: 60px;
    background: #00adb5;
    color: #fff;
    text-align: center;
    text-shadow: 0 0 0.1em, 0 0 0.3em;
}
```
::: details 全部代码
<<< ./components/text/demo2.vue
:::



## 空心文字

<demo3 />

``` scss
.hollow-text {
    text-align: center;
    line-height: 60px;
    color: #fff;
    text-shadow: 0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882);
}
```

::: details 全部代码
<<< ./components/text/demo3.vue
:::



## 文字模糊

<demo4 />

``` scss
.text-blurry {
    text-align: center;
    line-height: 60px;
    color: transparent;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
```

::: details 全部代码
<<< ./components/text/demo4.vue
:::



## 文字阴影

<demo5 />

``` scss
.text-blurry {
    text-align: center;
    line-height: 60px;
    color: transparent;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
```

::: details 全部代码
<<< ./components/text/demo5.vue
:::