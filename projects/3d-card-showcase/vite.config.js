import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 不压缩太多，方便调试
    minify: 'esbuild',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // 确保只有一个 chunk
        inlineDynamicImports: true,
      },
    },
  },
})
