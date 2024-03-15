<script setup>
import { ref, computed } from 'vue'
import { ElSlider } from 'element-plus'

const opacity = ref(100)
let filterStyle = computed(() => {
    return {
        filter: "opacity(" + opacity.value + "%)",
    }
})
</script>

<template>
    <h3>opacity(%)</h3>
    <span class="note">
        转化图像的透明程度。值定义转换的比例。
        <br />
        值为0%则是完全透明，值为100%则图像无变化。
        <br />
        值在0%和100%之间，则是效果的线性乘子，也相当于图像样本乘以数量。
        <br />
        若值未设置，值默认是1。
    </span>
    <img src="/images/bg1.jpg" :style="filterStyle">

    <span>{{ filterStyle }}</span>

    <el-slider :min="0" :max="100" v-model="opacity" show-input />
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