<script setup>
import { ref, computed } from 'vue'
import { ElSlider } from 'element-plus'

const blur = ref(0)

let filterStyle = computed(() => {
    return {
        filter: "blur(" + blur.value + "px)",
    }
})
</script>

<template>
    <div class="note">
        给图像设置高斯模糊。
        <br />
        “radius”一值设定高斯函数的标准差，或者是屏幕上以多少像素融在一起，所以值越大越模糊；
        <br />
        如果没有设定值，则默认是0；
        <br />
        这个参数可设置css长度值，但不接受百分比值。
    </div>

    <img src="/images/bg1.jpg" :style="filterStyle">

    <span>{{ filterStyle }}</span>

    <el-slider :min="0" :max="40" v-model="blur" show-input />
</template>

<style scoped lang="scss">
.note {
    line-height: 1.5;
    font-size: 14px;
    padding: 15px 0;
}

img {
    height: 250px;
    margin: 10px auto;
}
</style>