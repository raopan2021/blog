<script setup>
import { ref, computed } from 'vue'
import { ElSlider } from 'element-plus'

const grayscale = ref(0)
let filterStyle = computed(() => {
    return {
        filter: "grayscale(" + grayscale.value + "%)",
    }
})
</script>

<template>
    <span class="note">
        将图像转换为灰度图像。
        <br />
        值定义转换的比例。
        <br />
        值为100%则完全转为灰度图像，值为0%图像无变化。
        <br />
        值在0%到100%之间，则是效果的线性乘子。若未设置，值默认是0。
    </span>
    <img src="/images/bg1.jpg" :style="filterStyle">

    <span>{{ filterStyle }}</span>

    <el-slider :min="0" :max="100" v-model="grayscale" show-input />
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