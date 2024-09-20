# 22_await-async-事件循环

<script setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import pathName from  '/pdf/22_await-async-事件循环.pdf'
const { pdf, pages } = usePDF(pathName)
</script>

<VuePDF v-for="page in pages" :key="page" :pdf="pdf" :page="page" />
