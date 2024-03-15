<script setup>
import { ref, computed } from 'vue'
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'

const checkList = ref([
    "align-items: center;",
    "justify-content: center;"
])
const checkListStr = computed(() => {
    if (checkList.value.length) {
        return checkList.value.reduce(function(pre,cur){
            return pre+cur
        })
    }
    return ""
})
</script>

<template>
    <div class="parentElement" :style="checkListStr">
        <div class="childElement"> </div>
    </div>

    <el-checkbox-group v-model="checkList">
        <el-checkbox label="align-items: center;" />
        <br>
        <el-checkbox label="justify-content: center;" />
    </el-checkbox-group>
</template>

<style scoped lang="scss">
.parentElement {
    display: flex;
    height: 150px;
    background-color: bisque;

    .childElement {
        height: 100px;
        width: 150px;
        background-color: darkcyan;
    }
}
</style>