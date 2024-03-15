<template>
    <div class="paper-container">
        <div class="paper">
            <div class="poem">
                <p>临江仙·滚滚长江东逝水 </p>
                <p>杨慎杨慎〔明代〕 </p>
                <p>滚滚长江东逝水，浪花淘尽英雄。 </p>
                <p>是非成败转头空。青山依旧在，几度夕阳红。</p>
                <p>白发渔樵江渚上，惯看秋月春风。 </p>
                <p>一壶浊酒喜相逢。古今多少事，都付笑谈中。</p>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.paper-container {
    position: relative;
    z-index: 1;
    overflow: hidden;
    list-style: none;
    margin: 0;
    padding: 0;

    .paper {
        width: 500px;
        position: relative;
        margin: 30px auto;
        padding: 30px 0;
        border: 1px solid #efefef;
        background-color: #FFFFFD;
        background-image: url(/paper.png);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.06) inset;

        display: flex;
        justify-content: center;
        align-items: flex-start;

        &::before,
        &::after {
            content: '';
            z-index: -1;
            position: absolute;
            left: 10px;
            bottom: 10px;
            width: 45%;
            height: 55%;
            max-height: 100px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            transform: skew(-15deg) rotate(-4deg);
        }

        &::after {
            left: auto;
            right: 10px;
            transform: skew(15deg) rotate(4deg);
        }
    }

    .poem {
        p {
            margin: 0;
            line-height: 1.5;
        }
    }
}
</style>