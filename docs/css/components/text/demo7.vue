<template>
    <div class="text-gradient">
        <pre>
《青玉案·元夕》

                --辛弃疾

东风夜放花千树，更吹落、星如雨。

宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。

蛾儿雪柳黄金缕，笑语盈盈暗香去。

众里寻他千百度，蓦然回首，那人却在，灯火阑珊处。
        </pre>
    </div>
</template>

<style scoped lang="scss">
.text-gradient {
    font-size: 24px;
    background: -webkit-linear-gradient(315deg, rgb(210, 86, 53) 10%, #647eff 50%, rgb(238, 224, 112) 90%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    background-size: 400% 400%;
    animation: gradient 10s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>
