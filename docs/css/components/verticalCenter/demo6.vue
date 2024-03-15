<template>
    <div class="parentElement">
        <div class="childElement"> </div>
        <div class="childElement"> </div>
    </div>
</template>

<style scoped lang="scss">
.parentElement {
    display: table;
    height: 150px;
    width: 300px;
    background-color: #f00;

    .childElement {
        display: table-cell;
        vertical-align: middle;
        height: 30%;
        background-color: darkcyan;
    }

    .childElement:last-child {
        background-color: aliceblue;
    }
}
</style>