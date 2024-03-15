<style scoped lang="scss">
.box {
    display: inline-block;
    height: 100px;
    width: 100px;
    margin: 20px;
    background: pink;

    div {
        width: 50px;
        height: 50px;
        background: #369;
        clip-path: circle(50%);
    }
}

.box2>div {
    clip-path: circle(50% at right center);
}

.box3>div {
    clip-path: circle(50% at 30px 30px);
}
</style>
<template>
    <div class="box">
        <div></div>
    </div>
    <div class="box box2">
        <div></div>
    </div>
    <div class="box box3">
        <div></div>
    </div>
</template>
