<script setup>
import { ref, computed } from 'vue'
import { ElSlider } from 'element-plus'

const contrast = ref(100)
let filterStyle = computed(() => {
    return {
        filter: "contrast(" + contrast.value + "%)",
    }
})
</script>

<template>
    <div class="note">
        调整图像的对比度。
        <br />
        值是0%的话，图像会全黑。值是100%，图像不变。
        <br />
        值可以超过100%，意味着会运用更低的对比。
        <br />
        若没有设置值，默认是1。
    </div>

    <img src="/images/bg1.jpg" :style="filterStyle">

    <span>{{ filterStyle }}</span>

    <el-slider :min="0" :max="500" v-model="contrast" show-input />
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