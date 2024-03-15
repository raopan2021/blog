<template>
    <div class="parentElement">
        <div class="hide"></div>
        <div class="childElement"> </div>
    </div>
</template>

<style scoped lang="scss">
.parentElement {
    display: block;
    background-color: bisque;
    height: 100px;
    width: 100%;

    .hide {
        height: 35%; // 隐藏节点的高为 (父级高 - 去子级高)/2
    }

    .childElement {
        width: 20%;
        height: 30%;
        background-color: darkcyan;
    }
}
</style>