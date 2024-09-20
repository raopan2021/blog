# VuePDF

在vue项目中预览pdf文件

::: tip
注意打包能否成功，部署看pdf能否正常预览pdf

打包失败，将node升级到v22；不要使用pnpm，改成npm
:::

[源码](https://github.com/TaTo30/vue-pdf)

[文档](https://tato30.github.io/vue-pdf/guide/introduction.html)

## 安装

```bash
npm install vue-pdf
```

## 使用

### 引入pdf文件目录

``` vue {4}
<script setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf'

const { pdf } = usePDF('./pdf/sample.pdf')
</script>

<template>
  <VuePDF :pdf="pdf" />
</template>
```

### 引入网络pdf文件

``` vue {4}
<script setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf'

const { pdf } = usePDF('https://example.com/sample.pdf')
</script>

<template>
  <VuePDF :pdf="pdf" />
</template>
```

### import导入

::: tip
将 pdf 文件放入 public 文件夹中，通过 import 导入

如果是 `vitepress` 项目的`md文件`内使用 `vue-pdf` 组件，将 `pdf 文件` 放入 `项目根目录/docs/public` 文件夹中，通过 `import` 导入
:::

``` md {5}
# 01_深入JavaScript运行原理

<script setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import pathName from  '/pdf/01_深入JavaScript运行原理.pdf'
const { pdf, pages } = usePDF(pathName)
</script>

<VuePDF v-for="page in pages" :key="page" :pdf="pdf" :page="page" />
```

### 使用props

在vue组件中使用props传入pdf文件路径

``` vue {4-7}
<script setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf';

const props = defineProps({
    path: String,
})
const pathName = './PDF/' + props.path + '.pdf'

const { pdf } = usePDF(pathName)
</script>

<template>
    <VuePDF :pdf="pdf" />
</template>

```

## 显示所有页面

``` vue {4,8}
<script setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf'

const { pdf, pages } = usePDF('./pdf/sample.pdf')
</script>

<template>
  <VuePDF v-for="page in pages" :key="page" :pdf="pdf" :page="page" />
</template>
```
