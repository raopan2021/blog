import { defineConfig } from 'vite'

// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
	plugins: [
		// 	AutoImport({
		// 		resolvers: [ElementPlusResolver()],
		// 	}),
		// 	Components({
		// 		resolvers: [ElementPlusResolver()],
		// 	}),
	],
	server: {
		host: '0.0.0.0',
	},
	optimizeDeps: {
		include: ['pdf'], // 将pdf文件添加到include数组中
		exclude: [], // 排除其他不需要优化的文件类型
	},
})
