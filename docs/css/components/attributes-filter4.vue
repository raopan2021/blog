<script setup>
import { ref, computed } from 'vue'
import { ElSlider } from 'element-plus'

const hue_rotate = ref(0)
let filterStyle = computed(() => {
    return {
        filter: "hue_rotate(" + hue_rotate.value + "deg)",
    }
})
</script>

<template>
    <span class="note">
        给图像应用色相旋转。
        <br />
        “angle”一值设定图像会被调整的色环角度值。
        <br />
        值为0deg，则图像无变化。
        <br />
        若值未设置，默认值是0deg。
        <br />
        该值虽然没有最大值，超过360deg的值相当于又绕一圈。
    </span>

    <img src="/images/bg1.jpg" :style="filterStyle">

    <span>{{ filterStyle }}</span>

    <el-slider :min="0" :max="100" v-model="hue_rotate" show-input />
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