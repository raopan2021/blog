<script lang="ts" setup>
import { ref } from 'vue'
import { ElTree, ElLink } from 'element-plus'

// 读取本地存储中的json数据
import jsonData from './bookmarks.json'

const data = ref(jsonData)

// 默认展开目标文件夹
function findIdByLabel(bookmarks, targetLabel) {
	if (!Array.isArray(bookmarks)) return null

	for (const bookmark of bookmarks) {
		// 检查当前书签是否匹配
		if (bookmark.label === targetLabel) {
			return bookmark.id || null
		}

		// 如果有children且是文件夹，递归查找
		if (bookmark.children && bookmark.type === 'folder') {
			const foundId = findIdByLabel(bookmark.children, targetLabel)
			if (foundId) return foundId
		}
	}

	return null
}
const targetId = findIdByLabel(jsonData, '前端文档')
</script>

<template>
	<el-tree :data="data[0].children" :default-expanded-keys="[targetId]" node-key="id" accordion style="margin-top: 100px">
		<template #default="{ data }">
			<span v-if="data.type === 'folder'">{{ data.label }}</span>
			<template v-else>
				<img :src="data.icon" style="margin-right: 10px" />
				<el-link :href="data.url" target="_blank" type="primary" :underline="false">{{ data.label }}</el-link>
			</template>
		</template>
	</el-tree>
</template>
