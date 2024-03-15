<script setup>
import { onMounted } from 'vue'
import Source from './source.vue'
import DailyNews from './dailynews.vue'

onMounted(() => {
    const el = document.getElementsByClassName('container')
    const homeView = document.getElementById('homeView');
    homeView.style.width = el[2]?.clientWidth + "px";
})
</script>

<template>
    <main id="homeView">
        <DailyNews />
        <Source />
    </main>
</template>

<style scoped>
main {
    margin: 30px auto;
}
</style>
