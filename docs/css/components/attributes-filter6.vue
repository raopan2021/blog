<script setup>
import { ref, computed } from 'vue'
import { ElSlider } from 'element-plus'

const saturate = ref(100)
let filterStyle = computed(() => {
    return {
        filter: "saturate(" + saturate.value + "%)",
    }
})
</script>

<template>
    <span class="note">
        转换图像饱和度。值定义转换的比例。
        <br />
        值为0%则是完全不饱和，值为100%则图像无变化。
        <br />
        其他值，则是效果的线性乘子。
        <br />
        超过100%的值是允许的，则有更高的饱和度。若值未设置，值默认是1。
    </span>
    
    <img src="/images/bg1.jpg" :style="filterStyle">

    <span>{{ filterStyle }}</span>

    <el-slider :min="0" :max="200" v-model="saturate" show-input />
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