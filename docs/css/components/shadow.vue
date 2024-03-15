<template>
    <div class="shadow-container">
        <div class="panel">
            <p>"无偏移投影"</p>
            <div class="box shadow1"></div>
            <code> box-shadow: 0 0 12px rgba(0, 173, 181, 0.8);</code>
        </div>

        <div class="panel">
            <p>"下侧投影"</p>
            <div class="box shadow2"></div>
            <code>box-shadow: 0px 6px 12px -4px rgba(0, 173, 181, 0.8);</code>
        </div>

        <div class="panel">
            <p>"右侧投影"</p>
            <div class="box shadow3"></div>
            <code>box-shadow: 6px 6px 12px -5px rgba(0, 173, 181, 0.8);</code>
        </div>

        <div class="panel">
            <p>"双侧投影"</p>
            <div class="box shadow4"></div>
            <code> box-shadow: 6px 0 12px -5px rgba(0, 173, 181, 0.8), -6px 0 12px -5px rgba(0, 173, 181, 0.8);</code>
        </div>
        <div class="panel">
            <p>"菜单投影"</p>
            <div class="box shadow5"></div>
            <code>box-shadow: 0 3px 12px rgba(0, 173, 181, 0.8);</code>
        </div>

        <div class="panel">
            <p>"投影边框"</p>
            <div class="box shadow6" style="background-color:#fff;"></div>
            <code> box-shadow: 0 0 0 1px rgba(0, 173, 181, 0.8);</code>
        </div>
    </div>
</template>

<style scoped lang="scss">
.shadow-container {
    display: flex;
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;

    .panel {
        box-sizing: border-box;
        width: 49%;
        height: 180px;

        p {
            text-align: center;
        }
    }

    .box {
        width: 150px;
        height: 80px;
        background-color: #00adb5;
        margin: 0 auto 5px;
    }

    .shadow1 {
        box-shadow: 0 0 12px rgba(0, 173, 181, 0.8);
    }

    .shadow2 {
        box-shadow: 0px 6px 12px -4px rgba(0, 173, 181, 0.8);
    }

    .shadow3 {
        box-shadow: 6px 6px 12px -5px rgba(0, 173, 181, 0.8);
    }

    .shadow4 {
        box-shadow: 6px 0 12px -5px rgba(0, 173, 181, 0.8), -6px 0 12px -5px rgba(0, 173, 181, 0.8);
    }

    .shadow5 {
        box-shadow: 0 3px 12px rgba(0, 173, 181, 0.8);
    }

    .shadow6 {
        box-shadow: 0 0 0 1px rgba(0, 173, 181, 0.8);
    }
}
</style>