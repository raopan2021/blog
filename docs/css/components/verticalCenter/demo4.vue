<template>
    <div class="parentElement">
        <div class="childElement"> </div>
    </div>
</template>

<style scoped lang="scss">
.parentElement {
    display: block;
    background-color: bisque;
    height: 150px;

    &:before {
        content: " ";
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        height: 100%;
    }

    .childElement {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        height: 100px;
        width: 150px;
        background-color: darkcyan;
    } 
}
</style>