<template>
    <svg width="400" height="400">
        <circle cx="200" cy="200" r="190" fill="none" stroke="#68e534" stroke-width="20" stroke-linecap="round"
            class="circle" transform="rotate(-90,200,200)" />
        <polyline fill="none" stroke="#68e534" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"
            points="88,214 173,284 304,138" class="check" />
    </svg>
</template>

<style scoped lang="scss">
.circle {
    stroke-dasharray: 1194;
    stroke-dashoffset: 1194;
    transition: all 1s linear;
}

.check {
    stroke-dasharray: 350;
    stroke-dashoffset: 350;
    transition: all 1s linear;
}

svg:hover {
    .circle {
        stroke-dashoffset: 2388;
        transition-delay: 0;
    }

    .check {
        stroke-dashoffset: 0;
        transition-delay: 1s;
    }
}
</style>