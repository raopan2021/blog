<script setup>
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance()
const _this = instance.appContext.config.globalProperties

const handle = (e) => {
    const x = e.pageX - _this.offsetLeft
    const y = e.pageY - _this.offsetTop

    _this.style.setProperty('--x', `${x}px`)
    _this.style.setProperty('--y', `${y}px`)
}
</script>

<template>
    <div class="button" @mousemove="handle">
        <span>hover me to change</span>
    </div>
</template>

<style scoped lang="scss">
.button {
    margin: 40px auto;
    width: 250px;
    height: 60px;
    padding: 0 30px;
    line-height: 60px;
    text-align: center;
    position: relative;
    appearance: none;
    background: #f72359;
    border: none;
    color: white;
    font-size: 1.2em;
    cursor: pointer;
    outline: none;
    overflow: hidden;
    border-radius: 100px;
}

.button span {
    position: relative;
}

.button::before {
    --size: 0;
    content: '';
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--size);
    height: var(--size);
    background: radial-gradient(circle closest-side, #4405f7, transparent);
    transform: translate(-50%, -50%);
    transition: width .2s ease, height .2s ease;
}

.button:hover::before {
    --size: 400px;
}
</style>