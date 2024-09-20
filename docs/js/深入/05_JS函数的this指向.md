# 05_JS函数的this指向

<script setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import pathName from  '/pdf/05_JS函数的this指向.pdf'
const { pdf, pages } = usePDF(pathName)
</script>

<VuePDF v-for="page in pages" :key="page" :pdf="pdf" :page="page" />
