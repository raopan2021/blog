<script setup>
import { ref } from 'vue'

const isActive = ref(1)
const setActive = (index) => {
    isActive.value = index
}
</script>

<template>
    <div class="tab-container3">
        <ul class="tabs">
            <li class="tab-item" v-for="n in 5" :class="{ active: isActive == n }" @click="setActive(n)">
                tab{{ n }}
            </li>
        </ul>
    </div>
</template>


<style scoped lang="scss">
ul,
li {
    margin: 0;
    padding: 0;
    list-style: none;
}

.tab-container3 {
    border: 1px solid #eee;
    margin: 0 auto;

    .tabs {
        display: flex;
        justify-content: center;
        align-items: center;

        li {
            height: 40px;
            line-height: 40px;
            padding: 0 15px;
            margin-top: 8px;
            cursor: pointer;
            position: relative;
            font-size: 18px;
            color: #909399;
            background-color: #fff;

            &::after {
                content: "";
                width: 0;
                height: 2px;
                background-color: #00adb5;
                position: absolute;
                left: 0;
                right: 0;
                margin: auto;
                bottom: 0;
                transition: width .4s;
            }
        }

        li.active {
            &::after {
                width: 100%;
            }
        }
    }
}
</style>