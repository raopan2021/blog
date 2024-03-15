<script setup>
import { ref } from 'vue'
import { ElRadioGroup, ElRadio } from 'element-plus'

const select = ref("auto");
const options = ref([
    "auto",
    "baseline",
    "bottom",
    "middle",
    "sub",
    "super",
    "text-bottom",
    "text-top",
    "top"
])
</script>

<template>
    <div class="container">
        <img src="/images/favicon.png" class="img" :style="{ 'verticalAlign': select }" />
        <span>安能摧眉折腰事权贵，使我不得开心颜</span>
    </div>

    <br>
    <el-radio-group v-model="select">
        <el-radio v-for="item in options" :key="item" :label="item">
            {{ item }}
        </el-radio>
    </el-radio-group>
</template>

<style scoped lang="scss">
.container {
    width: 100%;
    margin-top: 20px;

    .img {
        display: inline;
    }
}

label {
    width: 100%;
}
</style>