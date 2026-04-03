<script setup>
import { ref, computed } from 'vue'
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'

const checkList = ref([
    "top: 0;",
    "bottom: 0;",
    "left: 0;",
    "right: 0;",
    "margin: auto;",
])
const checkListStr = computed(() => {
    if (checkList.value.length) {
        return checkList.value.reduce(function (pre, cur) {
            return pre + cur
        })
    }
    return ""
})
</script>

<template>
    <div class="parentElement">
        <div class="childElement" :style="checkListStr"> </div>
    </div>

    <el-checkbox-group v-model="checkList">
        <el-checkbox value="top: 0;" />
        <el-checkbox value="bottom: 0;" />
        <br>
        <el-checkbox value="left: 0;" />
        <el-checkbox value="right: 0;" />
        <br>
        <el-checkbox value="margin: auto;" />
    </el-checkbox-group>
</template>

<style scoped lang="scss">
.parentElement {
    background-color: bisque;
    position: relative;
    height: 150px;

    .childElement {
        height: 100px;
        width: 150px;
        background-color: darkcyan;
        position: absolute;
    }
}
</style>