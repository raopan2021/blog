<script lang="ts" setup>
import { ref } from 'vue'
const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

const scrollWrapper = ref(null)
const handleWheelScroll = (e) => {
	if (scrollWrapper.value) {
		// 调整滚动速度和方向
		scrollWrapper.value.scrollLeft += e.deltaY * 0.5
	}
}
</script>

<template>
	<!-- 推荐 / 沙发 / 茶几 -->
	<div class="items-scroll-wrapper" ref="scrollWrapper" @wheel.prevent="handleWheelScroll">
		<div class="items-container">
			<span v-for="(item, index) in list" :key="item" class="item">
				{{ item }}
			</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.items-scroll-wrapper {
	width: 100%;
	padding: 50px 0;
	overflow-x: auto;
	overflow-y: hidden;
	scrollbar-width: none;
	-ms-overflow-style: none;

	.item {
		height: 40px;
		line-height: 20px;
		padding: 10px 30px;
		margin: 0 5px;
		border-radius: 20px;
		font-size: 16px;
		background-color: #d8d0c8;
		user-select: none;
	}
}
</style>
