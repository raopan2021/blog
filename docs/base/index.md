# 前端百宝箱


## 资讯

<a :href="dailyNewsUrl" target="_blank"> 前端每日新闻 </a>

[前端周刊](https://frontend-weekly.com/)


## 资源推荐
<a v-for="item in links" target="_blank" :href="item.href">{{ item.label }}</a>

- [免费 ChatGPT 合集](https://chat-shared.zhile.io/shared.html)

- [lp-logger 库](https://github.com/lecepin/lp-logger)


<script setup>
const links = [
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
]

let date = new Date();
date.setTime(date.getTime() - 24 * 60 * 60 * 1000); // 1天前
let year = date.getFullYear(); //获取完整的年份(4位)
let month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
let day = date.getDate(); // 获取当前日(1-31)
if (month < 10) month = `0${month}`; // 如果月份是个位数，在前面补0
if (day < 10) day = `0${day}`; // 如果日是个位数，在前面补0

const dailyNewsUrl = `https://github.com/kujian/frontendDaily/blob/master/${year}/${month}/${day}.md`;
</script>

<style scoped>
a{
    display:block;
    width:auto;
    height:auto;
    line-height:2;
    text-decoration: none !important;
}

p:has(a) {
	margin: 0!important;
}
</style>