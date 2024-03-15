<template>
    <div class="parentElement">
        <div class="childElement"> </div>
    </div>
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
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>