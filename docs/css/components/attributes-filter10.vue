<script setup>
import { ElSlider } from 'element-plus'

</script>

<template>
    <span class="note">
        给图像设置一个阴影效果。
        <br />
        效果见
        <a href="/css_tricks/shadow/#不规则图形投影">不规则图形投影</a>
    </span>
    <img src="/images/bg1.jpg">

    <el-slider :min="0" :max="100" show-input />
</template>

<style scoped lang="scss">
.note {
    line-height: 1.5;
    font-size: 14px;
    margin-bottom: 15px;
}

img {
    height: 250px;
    margin: 10px auto;
}
</style>