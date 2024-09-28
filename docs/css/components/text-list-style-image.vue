<script setup>
import { ElRadio, ElRadioGroup, ElText } from 'element-plus';
import { computed, ref } from 'vue';

const radioSelect = ref("/gitee.svg")

const listStyleImage = computed(() => {
    return {
        "list-style-image": "url(" + radioSelect.value + ")"
    }
})
</script>

<template>
    <ul :style="listStyleImage">
        <li>楼阴缺，栏杆影卧东厢月 </li>
        <li> 东厢月，一天风霜，杏花如雪 </li>
    </ul>

    <el-text type="text" size="large">list-style-image: {{ radioSelect }}</el-text>
    <br>
    <br>

    <el-radio-group v-model="radioSelect">
        <el-radio label="/gitee.svg">
            /gitee.svg
            <img src="/gitee.svg" style="height: 20px;width: 20px;">
        </el-radio>
        <el-radio label="/mainView/logo.svg">
            /mainView/logo.svg
            <img src="/mainView/logo.svg" style="height: 20px;width: 20px;">
        </el-radio>
    </el-radio-group>
</template>

<style lang="scss" scoped>
li::marker {
    width: 20px !important;
    height: 20px !important;
}
</style>