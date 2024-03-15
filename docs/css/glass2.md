# 玻璃拟态


::: danger 实现原理（跟我想象的不一样，失败了）
- 渐变背景

    background: linear-gradient(to right, #8f9aff, #ffcc70, #c850c0);

- 模糊

    backdrop-filter: blur(10px);

- 阴影

    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.15);

- 渐变的细边框

:::


<script setup>
import glass2 from './components/glass/glass2.vue'
</script>


<glass2 />

::: details 详细代码
<<< ./components/glass/glass2.vue
:::