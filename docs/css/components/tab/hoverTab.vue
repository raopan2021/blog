<template>
    <div class="tab-container">
        <ul class="tabs">
            <li class="tab-item" v-for="n in 5">tab{{ n }}</li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
ul,
li {
    margin: 0;
    padding: 0;
    list-style: none;
}

.tab-container {
    border: 1px solid #eee;
    margin: 0 auto;

    .tabs {
        display: flex;
        justify-content: center;
        align-items: center;

        .tab-item {
            position: relative;
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
            font-size: 18px;
            color: #909399;
            background-color: #fff;
            margin-top: 8px;
            cursor: pointer;

            &::after {
                content: "";
                width: 0;
                height: 2px;
                background-color: #00adb5;
                position: absolute;
                left: 100%;
                bottom: 0;
                transition: all .4s;
            }

            &:hover {
                color: #00adb5;

                &::after {
                    width: 100%;
                    left: 0;
                    transition-delay: 0.1s;
                }

                &~li::after {
                    left: 0;
                }
            }
        }
    }
}
</style>