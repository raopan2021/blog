# 17_Proxy-Reflect-响应式

<script setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import pathName from  '/pdf/17_Proxy-Reflect-响应式.pdf'
const { pdf, pages } = usePDF(pathName)
</script>

<VuePDF v-for="page in pages" :key="page" :pdf="pdf" :page="page" />
