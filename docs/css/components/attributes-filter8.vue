<script setup>
import { ref, computed } from 'vue'
import { ElSlider } from 'element-plus'

const invert = ref(0)
let filterStyle = computed(() => {
    return {
        filter: "invert(" + invert.value + "%)",
    }
})
</script>

<template>
    <span class="note"> 反转输入图像。值定义转换的比例。
        <br />
        100%的价值是完全反转。值为0%则图像无变化。
        <br />
        值在0%和100%之间，则是效果的线性乘子。 若值未设置，值默认是0。
    </span>
    <img src="/images/bg1.jpg" :style="filterStyle">

    <span>{{ filterStyle }}</span>

    <el-slider :min="0" :max="100" v-model="invert" show-input />
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