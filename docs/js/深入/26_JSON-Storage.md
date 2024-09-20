# 26_JSON-Storage

<script setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import pathName from  '/pdf/26_JSON-Storage.pdf'
const { pdf, pages } = usePDF(pathName)
</script>

<VuePDF v-for="page in pages" :key="page" :pdf="pdf" :page="page" />
