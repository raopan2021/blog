<script setup>
import { ref } from 'vue'
import { ElLink } from 'element-plus'

const links = ref([
    {
        href: "https://zh.javascript.info/",
        label: "现代 JavaScript 教程"
    },
    {
        href: "https://github.com/timqian/chinese-independent-blogs",
        label: "中文独立博客列表"
    },
    {
        href: "https://github.com/nswbmw/N-blog",
        label: "一起学 Node.js"
    },
    {
        href: "https://github.com/FrontEndGitHub/FrontEndGitHub",
        label: "GitHub最全的前端资源汇总仓库（包括前端学习、开发资源、数据结构与算法、开发工具、求职面试等）"
    },
    {
        href: "https://juejin.cn/post/7309293844427882534",
        label: "一个前端菜狗被裁后的面试题"
    },
])
</script>

<template>
    <main>
        资源推荐
        <section v-for="item in links">
            <el-link type="primary" target="_blank" :href="item.href">{{ item.label }}</el-link>
        </section>
    </main>
</template>

<style scoped></style>
