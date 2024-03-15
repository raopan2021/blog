<template>
    <div class="text-blink">一闪一闪亮晶晶</div>
</template>

<style scoped lang="scss">
.text-blink {
    text-align: center;
    font-size: 20px;
    color: rgba(0, 173, 181, 1);
    animation: blink 2s linear infinite;
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
</style>
