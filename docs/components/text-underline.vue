<script setup>
// 从 vue 中引入defineProps
import { defineProps } from 'vue'

// 接收父组件传递过来的值
const props = defineProps(['value'])
</script>

<template>
    <!-- 使用父组件传递过来的值 -->
    <span>{{ props.value }}</span>
</template>

<style scoped lang="scss">
span {
    display: block;
    height: 100%;
    line-height: 100%;
    color: #c054c95b;
    background: linear-gradient(to right, rgb(16, 180, 188) 0%, rgba(0, 173, 181, .4) 100%);
    background-repeat: no-repeat;
    background-position: right bottom;
    background-size: 0 2px;
    text-shadow: 0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882),
        0 0 2px rgba(0, 173, 181, .2882);
    transition: background-size 1s;
    animation: blink 2s linear infinite;
}

span:hover {
    background-position: left bottom;
    background-size: 100% 2px;
}

@keyframes blink {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

.dark {
    span {
        color: #fff;
    }
}
</style>