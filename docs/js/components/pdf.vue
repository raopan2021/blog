<script setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf';
const props = defineProps({
    path: String,
})

const pathName = './PDF/' + props.path + '.pdf'
const { pdf, pages } = usePDF(pathName)
</script>

<template>
    <div v-for="page in pages" :key="page">
        <VuePDF :pdf="pdf" :page="page" />
    </div>
</template>
