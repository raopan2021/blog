<script setup>
import { ref,computed } from 'vue'
import { ElSlider } from 'element-plus'

const brightness = ref(100)
let filterStyle = computed(() => {
    return {
        filter: "brightness(" + brightness.value + "%)",
    }
})
</script>

<template>
    <span class="note">
        给图片应用一种线性乘法，使其看起来更亮或更暗。
        <br />
        如果值是0%，图像会全黑。值是100%，则图像无变化。
        <br />
        其他的值对应线性乘数效果。
        <br />
        值超过100%也是可以的，图像会比原来更亮。如果没有设定值，默认是1。
    </span>

    <img src="/images/bg1.jpg" :style="filterStyle">

    <span>{{ filterStyle }}</span>

    <el-slider :min="0" :max="400" v-model="brightness" show-input />
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