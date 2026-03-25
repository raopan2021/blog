# VuePDF

在vue项目中预览pdf文件

::: tip
注意打包能否成功，部署看pdf能否正常预览pdf

打包失败，将node升级到v22；不要使用pnpm，改成npm
:::

[源码](https://github.com/hrynko/vue-pdf-embed)

## 安装

```bash
npm install vue-pdf-embed
```

## 使用

### import导入

::: tip
将 pdf 文件放入 public 文件夹中，通过 import 导入

如果是 `vitepress` 项目的`md文件`内使用 `vue-pdf` 组件，将 `pdf 文件` 放入 `项目根目录/docs/public` 文件夹中，通过 `import` 导入
:::

``` md {5}
<script setup>
import VuePdfEmbed from 'vue-pdf-embed'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import pdfSource from '/pdf/01_深入JavaScript运行原理.pdf'
</script>

<template>
	<VuePdfEmbed annotation-layer text-layer :source="pdfSource" />
</template>
```
