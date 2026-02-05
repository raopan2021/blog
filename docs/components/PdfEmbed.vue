<script setup>
import { shallowRef, onMounted} from "vue";
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

defineProps({
	pdfSource: {
		type: String,
		default: '',
	},
})

const compo = shallowRef(null)
onMounted(() => {
	// 动态加载vue-pdf-embed
	import('vue-pdf-embed').then((module) => {
		compo.value = module.default
	})
})
</script>

<template>
	<component v-if="compo" :is="compo" :source="pdfSource" />
</template>

<style scoped>
.vue-pdf-embed {
	width: 100%;
	min-width: 900px;
	height: 100%;
	margin-top: 20px;
}
</style>
