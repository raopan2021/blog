<script setup>
</script>

<template>
    <div>
        <span>
            醉里挑灯看剑，梦回吹角连营。八百里分麾下炙，五十弦翻塞外声，沙场秋点兵。
        </span>
        <br>
        <span>
            马作的卢飞快，弓如霹雳弦惊。了却君王天下事，赢得生前身后名，可怜白发生！
        </span>
    </div>
</template>

<style scoped lang="scss">
div {
    span {
        font-size: 16px;
        line-height: 30px;
        background: linear-gradient(to right, #ff6b6b, #77e877);
        background-repeat: no-repeat;
        background-position: right bottom;
        background-size: 0 2px;
        transition: background-size 1s;
    }

    span:last-child {
        background-position: left bottom;
    }
}


div:hover>span {
    background-position: left bottom;
    background-size: 100% 2px;
}
</style>