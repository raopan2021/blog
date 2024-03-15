<template>
    <main>
        <div class="glass">
            GlassMorphism
        </div>

        <div class="card">
            <div class="bank">ICBC bank</div>
            <div class="num">1000 0000 0000 0000 0001</div>
            <div class="name">Pan Rao</div>
            <div class="date">09/15</div>

            <div class="circle"></div>
            <div class="circle"></div>
        </div>
    </main>
</template>

<style scoped lang="scss">
main {
    width: 100%;
    height: 400px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to right, #8f9aff, #ffcc70, #c850c0);
}

.glass {
    font-size: 80px;
    line-height: 100%;
    font-weight: bold;
    background: linear-gradient(to right, #ffcc70, #4150d0, #c850c0);
    -webkit-background-clip: text;
    color: transparent;
}

.card {
    position: absolute;
    width: 70%;
    height: 300px;
    color: #fff;
    font-size: 30px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.15);

    div {
        position: absolute;
    }

    .bank {
        left: 20px;
        top: 20px;
    }

    .num {
        left: 20px;
        bottom: 60px;
    }

    .name {
        left: 20px;
        bottom: 30px;
        font-size: 16px;
    }

    .date {
        left: 20px;
        bottom: 12px;
        font-size: 16px;
    }

    .circle {
        right: 20px;
        top: 20px;
        width: 50px;
        height: 50px;
        background: transparent;
        border: 1.5px solid #fff;
        border-radius: 100%;
    }

    .circle:last-child {
        right: 50px;
    }

}
</style>