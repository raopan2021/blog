# 01_深入JavaScript运行原理

<script setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import pathName from  '/pdf/01_深入JavaScript运行原理.pdf'
const { pdf, pages } = usePDF(pathName)
</script>

<VuePDF v-for="page in pages" :key="page" :pdf="pdf" :page="page" />
